const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const User = require('./models/User');
const UserSkill = require('./models/UserSkill');
const SkillAssessment = require('./models/SkillAssessment');

async function seedPerfectMatchDemoData() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('--- SEEDING PERFECT MATCH DEMO DATA WITH VERIFIED TEACHING SKILLS ---');

  // 1. Fetch or create Student A & Student B
  let studentA = await User.findOne({ email: 'studentA@lms.com' });
  if (!studentA) {
    studentA = await User.create({
      name: 'Alex Rivera',
      email: 'studentA@lms.com',
      password: 'password123',
      role: 'student',
      isApproved: true
    });
  }

  let studentB = await User.findOne({ email: 'studentB@lms.com' });
  if (!studentB) {
    studentB = await User.create({
      name: 'Sophia Chen',
      email: 'studentB@lms.com',
      password: 'password123',
      role: 'student',
      isApproved: true
    });
  }

  // Clear existing skills for clean demo setup
  await UserSkill.deleteMany({ user: { $in: [studentA._id, studentB._id] } });

  // Student A: Teaches Python (VERIFIED), Wants to Learn React
  await UserSkill.create({
    user: studentA._id,
    type: 'teach',
    skillName: 'Python',
    category: 'Data & AI',
    level: 'Advanced',
    verified: true,
    verificationStatus: 'verified',
    assessmentScore: 9
  });

  await UserSkill.create({
    user: studentA._id,
    type: 'learn',
    skillName: 'React',
    category: 'Development',
    level: 'Beginner'
  });

  // Student B: Teaches React (VERIFIED), Wants to Learn Python
  await UserSkill.create({
    user: studentB._id,
    type: 'teach',
    skillName: 'React',
    category: 'Development',
    level: 'Advanced',
    verified: true,
    verificationStatus: 'verified',
    assessmentScore: 10
  });

  await UserSkill.create({
    user: studentB._id,
    type: 'learn',
    skillName: 'Python',
    category: 'Data & AI',
    level: 'Beginner'
  });

  console.log('✔ Created Student A (Alex Rivera): Teaches Python (Verified) ↔ Wants React');
  console.log('✔ Created Student B (Sophia Chen): Teaches React (Verified) ↔ Wants Python');
  console.log('✔ Perfect Reciprocal Match successfully seeded!');

  await mongoose.disconnect();
}

seedPerfectMatchDemoData().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
