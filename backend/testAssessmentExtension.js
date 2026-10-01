const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const Skill = require('./models/Skill');
const SkillQuestion = require('./models/SkillQuestion');
const SkillAssessment = require('./models/SkillAssessment');

async function testAssessmentSystem() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const skillsToTest = ['Python', 'JavaScript', 'Java', 'C++', 'JavaScript & React'];
  
  console.log('\n========================================');
  console.log('1. VERIFYING QUESTION ISOLATION & COUNTS');
  console.log('========================================');

  for (const skillName of skillsToTest) {
    const skill = await Skill.findOne({ name: skillName });
    if (!skill) {
      console.log(`❌ Skill "${skillName}" not found in database!`);
      continue;
    }

    const activeQuestions = await SkillQuestion.find({ skill: skill._id, isActive: true });
    const invalidCrossQuestions = activeQuestions.filter(q => q.skillName !== skill.name);

    console.log(`✔ Skill: ${skill.name} (ID: ${skill._id})`);
    console.log(`  - Active Questions Count: ${activeQuestions.length}`);
    console.log(`  - Cross-contaminated Questions: ${invalidCrossQuestions.length}`);

    if (activeQuestions.length < 10) {
      console.log(`  ❌ ERROR: Fewer than 10 active questions! (${activeQuestions.length}/10)`);
    } else {
      console.log(`  ✔ Passed: Has sufficient questions for random selection.`);
    }
  }

  console.log('\n========================================');
  console.log('2. TESTING SIMULATED QUIZ GENERATION');
  console.log('========================================');

  for (const skillName of skillsToTest) {
    const skill = await Skill.findOne({ name: skillName });
    if (!skill) continue;

    const quiz = await SkillQuestion.aggregate([
      { $match: { skill: skill._id, isActive: true } },
      { $sample: { size: 10 } }
    ]);

    const sanitize = quiz.map(q => ({
      id: q._id,
      question: q.question,
      options: q.options,
      hasCorrectAnswerInClientPayload: 'correctAnswer' in q
    }));

    const leakedAnswers = sanitize.filter(q => q.hasCorrectAnswerInClientPayload);

    console.log(`✔ ${skill.name} Quiz Generation:`);
    console.log(`  - Selected Questions: ${quiz.length}`);
    console.log(`  - Leaked correctAnswer fields: ${leakedAnswers.length}`);
    
    // Check keyword relevance
    const sampleQ = quiz[0]?.question || '';
    console.log(`  - Sample Q: "${sampleQ.substring(0, 60)}..."`);
  }

  console.log('\n========================================');
  console.log('3. ALL VERIFICATION CHECKS COMPLETE');
  console.log('========================================\n');

  await mongoose.disconnect();
}

testAssessmentSystem().catch(err => {
  console.error('Test error:', err);
  mongoose.disconnect();
});
