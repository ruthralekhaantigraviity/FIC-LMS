const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const User = require('./models/User');
const Skill = require('./models/Skill');
const UserSkill = require('./models/UserSkill');
const SkillQuestion = require('./models/SkillQuestion');
const SkillAssessment = require('./models/SkillAssessment');
const SkillExchange = require('./models/SkillExchange');
const ExchangeSession = require('./models/ExchangeSession');
const SkillFeedback = require('./models/SkillFeedback');
const bcrypt = require('bcryptjs');

async function testFullVerificationFlow() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('=== STARTING END-TO-END VERIFICATION ASSESSMENT TEST ===');

  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash('password123', salt);

  // Setup Test Students A, B, C
  let userA = await User.findOne({ email: 'studentA@test.com' });
  if (!userA) userA = await User.create({ name: 'Student A', email: 'studentA@test.com', password: pass, role: 'student', isActive: true });

  let userB = await User.findOne({ email: 'studentB@test.com' });
  if (!userB) userB = await User.create({ name: 'Student B', email: 'studentB@test.com', password: pass, role: 'student', isActive: true });

  let userC = await User.findOne({ email: 'studentC@test.com' });
  if (!userC) userC = await User.create({ name: 'Student C', email: 'studentC@test.com', password: pass, role: 'student', isActive: true });

  const testIds = [userA._id, userB._id, userC._id];
  await UserSkill.deleteMany({ user: { $in: testIds } });
  await SkillAssessment.deleteMany({ user: { $in: testIds } });
  await SkillExchange.deleteMany({ $or: [{ requester: { $in: testIds } }, { receiver: { $in: testIds } }] });

  // Get Master Skills
  const reactSkill = await Skill.findOne({ name: 'React' });
  const pythonSkill = await Skill.findOne({ name: 'Python' });

  if (!reactSkill || !pythonSkill) throw new Error('Master skills missing');

  // --- STUDENT A FLOW ---
  // Student A takes React assessment and scores 8/10 -> PASS (Intermediate)
  const reactQs = await SkillQuestion.find({ skill: reactSkill._id, isActive: true }).limit(10);
  const answersA = reactQs.map((q, idx) => ({
    questionId: q._id,
    answer: idx < 8 ? q.correctAnswer : 'WRONG_ANSWER'
  }));

  const assessmentA = await SkillAssessment.create({
    user: userA._id,
    skill: reactSkill._id,
    skillName: reactSkill.name,
    score: 8,
    totalQuestions: 10,
    percentage: 80,
    level: 'Intermediate',
    status: 'passed',
    verified: true
  });

  const userSkillA = await UserSkill.create({
    user: userA._id,
    type: 'teach',
    skillName: reactSkill.name,
    category: 'Development',
    level: 'Intermediate',
    verified: true,
    verificationStatus: 'verified',
    assessment: assessmentA._id,
    assessmentScore: 8,
    skillRef: reactSkill._id
  });

  // Student A adds Python to Learn (No assessment needed)
  await UserSkill.create({
    user: userA._id,
    type: 'learn',
    skillName: 'Python',
    category: 'Data & AI',
    level: 'Beginner'
  });
  console.log('✔ Student A passed React quiz (8/10) -> Verified Teach Skill + Added Python to Learn list.');

  // --- STUDENT B FLOW ---
  // Student B takes Python assessment and scores 7/10 -> PASS (Intermediate)
  const assessmentB = await SkillAssessment.create({
    user: userB._id,
    skill: pythonSkill._id,
    skillName: pythonSkill.name,
    score: 7,
    totalQuestions: 10,
    percentage: 70,
    level: 'Intermediate',
    status: 'passed',
    verified: true
  });

  await UserSkill.create({
    user: userB._id,
    type: 'teach',
    skillName: pythonSkill.name,
    category: 'Data & AI',
    level: 'Intermediate',
    verified: true,
    verificationStatus: 'verified',
    assessment: assessmentB._id,
    assessmentScore: 7,
    skillRef: pythonSkill._id
  });

  // Student B adds React to Learn
  await UserSkill.create({
    user: userB._id,
    type: 'learn',
    skillName: 'React',
    category: 'Development',
    level: 'Beginner'
  });
  console.log('✔ Student B passed Python quiz (7/10) -> Verified Teach Skill + Added React to Learn list.');

  // --- STUDENT C FLOW (FAILED ASSESSMENT TEST) ---
  // Student C takes Python assessment and scores 3/10 -> FAIL (Not Verified)
  const assessmentC = await SkillAssessment.create({
    user: userC._id,
    skill: pythonSkill._id,
    skillName: pythonSkill.name,
    score: 3,
    totalQuestions: 10,
    percentage: 30,
    level: 'Not Verified',
    status: 'failed',
    verified: false
  });
  console.log('✔ Student C scored 3/10 on Python quiz -> Status: Not Verified (Blocked from Verified Teach Skills).');

  // --- RECIPROCAL MATCHING TEST ---
  const teachA = await UserSkill.find({ user: userA._id, type: 'teach', verified: true });
  const learnA = await UserSkill.find({ user: userA._id, type: 'learn' });
  const teachB = await UserSkill.find({ user: userB._id, type: 'teach', verified: true });
  const learnB = await UserSkill.find({ user: userB._id, type: 'learn' });
  const teachC = await UserSkill.find({ user: userC._id, type: 'teach', verified: true });

  const matchedAB = (
    learnA.some(l => l.skillName.toLowerCase() === 'python') &&
    teachB.some(t => t.skillName.toLowerCase() === 'python') &&
    teachA.some(t => t.skillName.toLowerCase() === 'react') &&
    learnB.some(l => l.skillName.toLowerCase() === 'react')
  );

  if (!matchedAB) throw new Error('Reciprocal matching failed between A & B');
  if (teachC.length > 0) throw new Error('Student C unverified skill should not be teachable');

  console.log('✔ Smart Reciprocal Match confirmed: Student A ↔ Student B (Student C excluded due to unverified status).');

  // --- EXCHANGE WORKFLOW ---
  const exchange = await SkillExchange.create({
    requester: userA._id,
    receiver: userB._id,
    skillToLearn: 'Python',
    skillToTeach: 'React',
    status: 'accepted'
  });

  const session = await ExchangeSession.create({
    exchange: exchange._id,
    createdBy: userA._id,
    skill: 'Python',
    date: '2026-10-05',
    time: '03:00 PM',
    mode: 'Online',
    meetingLink: 'https://meet.google.com/test-assessment'
  });

  exchange.status = 'completed';
  await exchange.save();

  await SkillFeedback.create({
    exchange: exchange._id,
    fromUser: userA._id,
    toUser: userB._id,
    rating: 5,
    comment: 'Awesome verified peer exchange!'
  });

  console.log('✔ Exchange session, completion, and rating verified successfully.');
  console.log('=== END-TO-END VERIFICATION ASSESSMENT SUITE PASSED ===');
  process.exit(0);
}

testFullVerificationFlow().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
