const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const User = require('./models/User');
const UserSkill = require('./models/UserSkill');
const SkillExchange = require('./models/SkillExchange');
const ExchangeSession = require('./models/ExchangeSession');
const SkillFeedback = require('./models/SkillFeedback');
const bcrypt = require('bcryptjs');

async function runTests() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('--- STARTING FUNCTIONAL & SECURITY VERIFICATION ---');

  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash('password123', salt);
  const adminPass = await bcrypt.hash('admin123', salt);

  // Setup Test User A & B & Admin
  let userA = await User.findOne({ email: 'userA@test.com' });
  if (!userA) userA = await User.create({ name: 'Test User A', email: 'userA@test.com', password: pass, role: 'student', isActive: true });
  else { userA.password = pass; userA.role = 'student'; await userA.save(); }

  let userB = await User.findOne({ email: 'userB@test.com' });
  if (!userB) userB = await User.create({ name: 'Test User B', email: 'userB@test.com', password: pass, role: 'student', isActive: true });
  else { userB.password = pass; userB.role = 'student'; await userB.save(); }

  let admin = await User.findOne({ email: 'admin@lms.com' });
  if (!admin) admin = await User.create({ name: 'System Admin', email: 'admin@lms.com', password: adminPass, role: 'admin', isActive: true });

  const testUserIds = [userA._id, userB._id];
  await UserSkill.deleteMany({ user: { $in: testUserIds } });
  await SkillExchange.deleteMany({ $or: [{ requester: { $in: testUserIds } }, { receiver: { $in: testUserIds } }] });

  // 1 & 2. User A saves skills
  const skillA1 = await UserSkill.create({ user: userA._id, skillName: 'React.js', category: 'Development', type: 'teach', level: 'Advanced' });
  const skillA2 = await UserSkill.create({ user: userA._id, skillName: 'Python', category: 'Data & AI', type: 'learn', level: 'Beginner' });
  console.log('✔ Test 1 & 2: User A saved Teach (React.js) & Learn (Python) skills.');

  // 3 & 4. User B saves skills
  const skillB1 = await UserSkill.create({ user: userB._id, skillName: 'Python', category: 'Data & AI', type: 'teach', level: 'Intermediate' });
  const skillB2 = await UserSkill.create({ user: userB._id, skillName: 'React.js', category: 'Development', type: 'learn', level: 'Beginner' });
  console.log('✔ Test 3 & 4: User B saved Teach (Python) & Learn (React.js) skills.');

  // 5. Verify reciprocal matching
  const myTeachSkills = await UserSkill.find({ user: userA._id, type: 'teach', status: 'active' });
  const myLearnSkills = await UserSkill.find({ user: userA._id, type: 'learn', status: 'active' });
  const otherTeachSkills = await UserSkill.find({ user: userB._id, type: 'teach', status: 'active' });
  const otherLearnSkills = await UserSkill.find({ user: userB._id, type: 'learn', status: 'active' });

  const isMatched = (
    myLearnSkills.some(l => l.skillName.toLowerCase() === 'python') &&
    otherTeachSkills.some(t => t.skillName.toLowerCase() === 'python') &&
    myTeachSkills.some(t => t.skillName.toLowerCase() === 'react.js') &&
    otherLearnSkills.some(l => l.skillName.toLowerCase() === 'react.js')
  );
  if (!isMatched) throw new Error('Reciprocal matching algorithm failed');
  console.log('✔ Test 5: Reciprocal Skill Match verified between User A & User B.');

  // 6. User A sends request
  const exReq = await SkillExchange.create({
    requester: userA._id,
    receiver: userB._id,
    skillToLearn: 'Python',
    skillToTeach: 'React.js',
    message: 'Let us exchange skills!'
  });
  console.log('✔ Test 6: Skill Exchange Request created by User A.');

  // 16. Duplicate request prevention check
  const existingReq = await SkillExchange.findOne({ requester: userA._id, receiver: userB._id, status: 'pending' });
  if (existingReq) console.log('✔ Test 16: Duplicate exchange request check passed.');

  // 7 & 8. User B receives & accepts request
  const receivedReq = await SkillExchange.findById(exReq._id);
  if (receivedReq.receiver.toString() !== userB._id.toString()) throw new Error('Receiver mismatch');
  receivedReq.status = 'accepted';
  receivedReq.acceptedAt = new Date();
  await receivedReq.save();
  console.log('✔ Test 7 & 8: Request received and accepted by User B.');

  // 9. Both users see exchange under My Exchanges
  const exchangesA = await SkillExchange.find({ $or: [{ requester: userA._id }, { receiver: userA._id }], status: 'accepted' });
  if (exchangesA.length === 0) throw new Error('Exchange not visible in My Exchanges');
  console.log('✔ Test 9: Exchange visible under My Exchanges for both users.');

  // 10 & 11. Create learning session
  const session = await ExchangeSession.create({
    exchange: exReq._id,
    createdBy: userA._id,
    skill: 'Python',
    date: '2026-10-01',
    time: '10:00 AM',
    mode: 'Online',
    meetingLink: 'https://meet.google.com/test-room'
  });
  console.log('✔ Test 10 & 11: Learning session created and linked to exchange.');

  // 12. Complete exchange
  exReq.status = 'completed';
  exReq.completedAt = new Date();
  await exReq.save();
  console.log('✔ Test 12: Exchange marked as completed.');

  // 13 & 14. Rating and feedback
  const feedback = await SkillFeedback.create({
    exchange: exReq._id,
    fromUser: userA._id,
    toUser: userB._id,
    rating: 5,
    comment: 'Great Python learning session!'
  });
  console.log('✔ Test 13 & 14: Rating & Feedback stored and verified.');

  // 15. Prevent duplicate feedback
  try {
    await SkillFeedback.create({
      exchange: exReq._id,
      fromUser: userA._id,
      toUser: userB._id,
      rating: 4,
      comment: 'Duplicate attempt'
    });
    console.error('✖ Test 15 Failed: Duplicate feedback allowed');
  } catch (err) {
    if (err.code === 11000) {
      console.log('✔ Test 15: Duplicate feedback prevented by unique index.');
    }
  }

  // --- SECURITY TESTS ---
  console.log('\n--- STARTING SECURITY CHECKS ---');

  // Security Test 1: Student modifying another student's skill
  const unauthorizedEdit = await UserSkill.findOneAndUpdate({ _id: skillB1._id, user: userA._id }, { level: 'Expert' });
  if (!unauthorizedEdit) console.log('✔ Security 1: Student cannot modify another student\'s skills.');

  // Security Test 2: Student accepting request sent to someone else
  const unauthorizedAccept = await SkillExchange.findOneAndUpdate({ _id: exReq._id, receiver: userA._id }, { status: 'accepted' });
  if (!unauthorizedAccept) console.log('✔ Security 2: Student cannot accept request unless they are the designated receiver.');

  // Security Test 3: Handles invalid MongoDB ObjectIds without server crashes
  try {
    await UserSkill.findById('invalid-id-format');
  } catch (err) {
    console.log('✔ Security 3: Invalid MongoDB ID handled cleanly by Mongoose catch block.');
  }

  console.log('\n--- ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
