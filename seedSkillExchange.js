const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const User = require('./backend/models/User');
const Skill = require('./backend/models/Skill');
const UserSkill = require('./backend/models/UserSkill');
const SkillExchange = require('./backend/models/SkillExchange');
const ExchangeSession = require('./backend/models/ExchangeSession');
const SkillFeedback = require('./backend/models/SkillFeedback');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('student123', salt);

  const studentData = [
    { name: 'Alex Johnson', email: 'alex@lms.com', password: hashedPassword, role: 'student', isApproved: true },
    { name: 'Sarah Miller', email: 'sarah@lms.com', password: hashedPassword, role: 'student', isApproved: true },
    { name: 'David Chen', email: 'david@lms.com', password: hashedPassword, role: 'student', isApproved: true },
    { name: 'Emma Watson', email: 'emma@lms.com', password: hashedPassword, role: 'student', isApproved: true }
  ];

  const students = [];
  for (const s of studentData) {
    let u = await User.findOne({ email: s.email });
    if (!u) {
      u = await User.create(s);
      console.log('Created user:', u.name);
    }
    students.push(u);
  }

  const skillsData = [
    { name: 'JavaScript & React', category: 'Programming', description: 'Modern web development with JavaScript and React framework.' },
    { name: 'Python for Data Science', category: 'Data Science', description: 'Data analysis, pandas, numpy, and machine learning basics.' },
    { name: 'UI/UX Design in Figma', category: 'Design', description: 'User interface design, prototyping, and design systems.' },
    { name: 'Public Speaking & Presentation', category: 'Soft Skills', description: 'Communication, speech structuring, and confidence.' },
    { name: 'Digital Marketing & SEO', category: 'Marketing', description: 'Search engine optimization, social media strategy, and ads.' }
  ];

  const masterSkills = [];
  for (const sk of skillsData) {
    let item = await Skill.findOne({ name: sk.name });
    if (!item) {
      item = await Skill.create(sk);
    }
    masterSkills.push(item);
  }

  const studentIds = students.map(s => s._id);
  await UserSkill.deleteMany({ user: { $in: studentIds } });

  const userSkillsData = [
    { user: students[0]._id, skill: masterSkills[0]._id, type: 'teach', level: 'Advanced', description: 'Building fullstack apps with React & Node' },
    { user: students[0]._id, skill: masterSkills[1]._id, type: 'learn', level: 'Beginner', description: 'Want to learn Python basics' },
    
    { user: students[1]._id, skill: masterSkills[1]._id, type: 'teach', level: 'Intermediate', description: 'Data science & automation with Python' },
    { user: students[1]._id, skill: masterSkills[0]._id, type: 'learn', level: 'Beginner', description: 'Looking to learn React frontend' },

    { user: students[2]._id, skill: masterSkills[2]._id, type: 'teach', level: 'Expert', description: 'Figma UI design, auto layout, and wireframing' },
    { user: students[2]._id, skill: masterSkills[3]._id, type: 'learn', level: 'Intermediate', description: 'Improve public speaking for client pitches' },

    { user: students[3]._id, skill: masterSkills[3]._id, type: 'teach', level: 'Advanced', description: 'Stage presence, speech writing, and vocal clarity' },
    { user: students[3]._id, skill: masterSkills[2]._id, type: 'learn', level: 'Beginner', description: 'Want to learn design principles in Figma' }
  ];

  const userSkills = await UserSkill.insertMany(userSkillsData);
  console.log('Inserted UserSkills:', userSkills.length);

  await SkillExchange.deleteMany({ $or: [{ requester: { $in: studentIds } }, { provider: { $in: studentIds } }] });

  const ex1 = await SkillExchange.create({
    requester: students[0]._id,
    provider: students[1]._id,
    offeredSkill: userSkills[0]._id,
    requestedSkill: userSkills[2]._id,
    status: 'accepted',
    message: 'Hey Sarah! I can teach you React if you help me learn Python.'
  });

  const ex2 = await SkillExchange.create({
    requester: students[2]._id,
    provider: students[3]._id,
    offeredSkill: userSkills[4]._id,
    requestedSkill: userSkills[6]._id,
    status: 'completed',
    message: 'Hi Emma! Lets exchange Figma design for Public speaking lessons.'
  });

  const ex3 = await SkillExchange.create({
    requester: students[1]._id,
    provider: students[2]._id,
    offeredSkill: userSkills[2]._id,
    requestedSkill: userSkills[4]._id,
    status: 'pending',
    message: 'Hi David! Would love to learn Figma prototyping.'
  });

  await ExchangeSession.create({
    exchange: ex2._id,
    date: new Date(Date.now() + 86400000),
    time: '04:00 PM',
    mode: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Covering Figma components and public speaking body language.',
    status: 'completed'
  });

  await SkillFeedback.create({
    exchange: ex2._id,
    reviewer: students[2]._id,
    reviewee: students[3]._id,
    rating: 5,
    comment: 'Emma is an incredible coach! She gave super clear structure for my upcoming presentation.'
  });

  await SkillFeedback.create({
    exchange: ex2._id,
    reviewer: students[3]._id,
    reviewee: students[2]._id,
    rating: 5,
    comment: 'David taught me Figma components and auto-layout so patiently. Highly recommend!'
  });

  console.log('Dummy seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
