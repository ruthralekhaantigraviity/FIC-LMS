const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');

async function ensureAllCatalogSkillsExist() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const requiredSkills = [
    { name: 'Java', category: 'Development', description: 'Core Java, OOP, Collections, JVM, and Multithreading' },
    { name: 'C++', category: 'Development', description: 'C++ language basics, pointers, STL, memory management, and OOP' },
    { name: 'HTML & CSS', category: 'Development', description: 'Semantic HTML5, CSS3 flexbox/grid, layout design, and responsiveness' },
    { name: 'SQL & Databases', category: 'Development', description: 'Relational database design, SQL queries, joins, indexing, and normalization' }
  ];

  for (const sk of requiredSkills) {
    let item = await Skill.findOne({ name: sk.name });
    if (!item) {
      item = await Skill.create(sk);
      console.log(`+ Created Skill in catalog: ${item.name} (ID: ${item._id})`);
    } else {
      console.log(`✔ Skill already exists: ${item.name} (ID: ${item._id})`);
    }
  }

  await mongoose.disconnect();
}

ensureAllCatalogSkillsExist().catch(err => {
  console.error(err);
  mongoose.disconnect();
});
