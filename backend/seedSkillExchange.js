const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const User = require('./models/User');
const Skill = require('./models/Skill');
const UserSkill = require('./models/UserSkill');
const SkillExchange = require('./models/SkillExchange');
const ExchangeSession = require('./models/ExchangeSession');
const SkillFeedback = require('./models/SkillFeedback');
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
    { name: 'JavaScript & React', category: 'Development', description: 'Modern web development with JavaScript and React framework.' },
    { name: 'Python for Data Science', category: 'Data & AI', description: 'Data analysis, pandas, numpy, and machine learning basics.' },
    { name: 'UI/UX Design in Figma', category: 'Design', description: 'User interface design, prototyping, and design systems.' },
    { name: 'Public Speaking & Presentation', category: 'Other', description: 'Communication, speech structuring, and confidence.' },
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
    { user: students[0]._id, skillName: 'JavaScript & React', category: 'Development', type: 'teach', level: 'Advanced', description: 'Building fullstack apps with React & Node' },
    { user: students[0]._id, skillName: 'Python for Data Science', category: 'Data & AI', type: 'learn', level: 'Beginner', description: 'Want to learn Python basics' },
    
    { user: students[1]._id, skillName: 'Python for Data Science', category: 'Data & AI', type: 'teach', level: 'Intermediate', description: 'Data science & automation with Python' },
    { user: students[1]._id, skillName: 'JavaScript & React', category: 'Development', type: 'learn', level: 'Beginner', description: 'Looking to learn React frontend' },

    { user: students[2]._id, skillName: 'UI/UX Design in Figma', category: 'Design', type: 'teach', level: 'Advanced', description: 'Figma UI design, auto layout, and wireframing' },
    { user: students[2]._id, skillName: 'Public Speaking & Presentation', category: 'Other', type: 'learn', level: 'Intermediate', description: 'Improve public speaking for client pitches' },

    { user: students[3]._id, skillName: 'Public Speaking & Presentation', category: 'Other', type: 'teach', level: 'Advanced', description: 'Stage presence, speech writing, and vocal clarity' },
    { user: students[3]._id, skillName: 'UI/UX Design in Figma', category: 'Design', type: 'learn', level: 'Beginner', description: 'Want to learn design principles in Figma' }
  ];

  const userSkills = await UserSkill.insertMany(userSkillsData);
  console.log('Inserted UserSkills:', userSkills.length);

  await SkillExchange.deleteMany({ $or: [{ requester: { $in: studentIds } }, { receiver: { $in: studentIds } }] });

  const ex1 = await SkillExchange.create({
    requester: students[0]._id,
    receiver: students[1]._id,
    skillToLearn: 'Python for Data Science',
    skillToTeach: 'JavaScript & React',
    status: 'accepted',
    message: 'Hey Sarah! I can teach you React if you help me learn Python.'
  });

  const ex2 = await SkillExchange.create({
    requester: students[2]._id,
    receiver: students[3]._id,
    skillToLearn: 'Public Speaking & Presentation',
    skillToTeach: 'UI/UX Design in Figma',
    status: 'completed',
    message: 'Hi Emma! Lets exchange Figma design for Public speaking lessons.'
  });

  const ex3 = await SkillExchange.create({
    requester: students[1]._id,
    receiver: students[2]._id,
    skillToLearn: 'UI/UX Design in Figma',
    skillToTeach: 'Python for Data Science',
    status: 'pending',
    message: 'Hi David! Would love to learn Figma prototyping.'
  });

  await ExchangeSession.deleteMany({ exchange: { $in: [ex1._id, ex2._id, ex3._id] } });

  await ExchangeSession.create({
    exchange: ex2._id,
    createdBy: students[2]._id,
    skill: 'UI/UX Design in Figma',
    date: '2026-09-30',
    time: '04:00 PM',
    mode: 'Online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Covering Figma components and public speaking body language.',
    status: 'completed'
  });

  await SkillFeedback.deleteMany({ exchange: { $in: [ex1._id, ex2._id, ex3._id] } });

  await SkillFeedback.create({
    exchange: ex2._id,
    fromUser: students[2]._id,
    toUser: students[3]._id,
    rating: 5,
    teachingRating: 5,
    communicationRating: 5,
    comment: 'Emma is an incredible coach! She gave super clear structure for my upcoming presentation.'
  });

  await SkillFeedback.create({
    exchange: ex2._id,
    fromUser: students[3]._id,
    toUser: students[2]._id,
    rating: 5,
    teachingRating: 5,
    communicationRating: 5,
    comment: 'David taught me Figma components and auto-layout so patiently. Highly recommend!'
  });

  console.log('Dummy seed completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
