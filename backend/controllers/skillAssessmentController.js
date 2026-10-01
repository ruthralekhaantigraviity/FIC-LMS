const Skill = require('../models/Skill');
const SkillQuestion = require('../models/SkillQuestion');
const SkillAssessment = require('../models/SkillAssessment');
const UserSkill = require('../models/UserSkill');
const mongoose = require('mongoose');

// Helper to calculate level based on score (0-10)
const calculateLevelAndStatus = (score) => {
  if (score >= 9) return { level: 'Advanced', verified: true, status: 'passed' };
  if (score >= 7) return { level: 'Intermediate', verified: true, status: 'passed' };
  if (score >= 5) return { level: 'Beginner', verified: true, status: 'passed' };
  return { level: 'Not Verified', verified: false, status: 'failed' };
};

// 1. GET 10 RANDOM ACTIVE QUESTIONS FOR A SKILL (WITHOUT CORRECT ANSWERS)
exports.getQuizQuestions = async (req, res) => {
  try {
    const { skillId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID format.' });
    }

    const masterSkill = await Skill.findById(skillId);
    if (!masterSkill) {
      return res.status(404).json({ success: false, message: 'Skill not found in catalog.' });
    }

    // Find active questions for this skill
    const questions = await SkillQuestion.aggregate([
      { $match: { skill: masterSkill._id, isActive: true } },
      { $sample: { size: 10 } }
    ]);

    if (questions.length < 10) {
      return res.status(400).json({
        success: false,
        message: `Skill assessment is currently unavailable for ${masterSkill.name} because there are not enough active questions (${questions.length}/10 available).`
      });
    }

    // Strip out correctAnswer for security
    const sanitizedQuestions = questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));

    res.status(200).json({
      success: true,
      skill: {
        _id: masterSkill._id,
        name: masterSkill.name,
        category: masterSkill.category
      },
      totalQuestions: sanitizedQuestions.length,
      questions: sanitizedQuestions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. SUBMIT ASSESSMENT & CALCULATE SCORE ON BACKEND
exports.submitAssessment = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { answers } = req.body; // Array of { questionId, answer }

    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID format.' });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide submitted answers.' });
    }

    const masterSkill = await Skill.findById(skillId);
    if (!masterSkill) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    const questionIds = answers.map(a => a.questionId).filter(id => mongoose.Types.ObjectId.isValid(id));
    const dbQuestions = await SkillQuestion.find({ _id: { $in: questionIds }, skill: masterSkill._id });

    if (dbQuestions.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid questions found for this skill.' });
    }

    let score = 0;
    const gradedQuestions = [];

    for (const item of answers) {
      const dbQ = dbQuestions.find(q => q._id.toString() === item.questionId);
      if (!dbQ) continue;

      const isCorrect = (item.answer || '').trim().toLowerCase() === (dbQ.correctAnswer || '').trim().toLowerCase();
      if (isCorrect) score += 1;

      gradedQuestions.push({
        questionId: dbQ._id,
        question: dbQ.question,
        options: dbQ.options,
        correctAnswer: dbQ.correctAnswer,
        userAnswer: item.answer || '',
        isCorrect
      });
    }

    const totalQuestions = gradedQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const result = calculateLevelAndStatus(score);

    // Get attempt count
    const previousAttempts = await SkillAssessment.countDocuments({ user: req.user.id, skill: masterSkill._id });
    const attemptNumber = previousAttempts + 1;

    // Save assessment record
    const assessment = await SkillAssessment.create({
      user: req.user.id,
      skill: masterSkill._id,
      skillName: masterSkill.name,
      questions: gradedQuestions,
      score,
      totalQuestions,
      percentage,
      level: result.level,
      status: result.status,
      verified: result.verified,
      attemptNumber
    });

    // If passed (5/10 or higher), automatically update/create verified UserSkill for teach
    if (result.verified) {
      let userSkill = await UserSkill.findOne({ user: req.user.id, type: 'teach', skillName: masterSkill.name });
      if (userSkill) {
        userSkill.verified = true;
        userSkill.verificationStatus = 'verified';
        userSkill.level = result.level;
        userSkill.assessment = assessment._id;
        userSkill.assessmentScore = score;
        userSkill.skillRef = masterSkill._id;
        await userSkill.save();
      } else {
        await UserSkill.create({
          user: req.user.id,
          type: 'teach',
          skillName: masterSkill.name,
          category: masterSkill.category || 'Development',
          level: result.level,
          description: `Verified via ${score}/10 assessment score`,
          verified: true,
          verificationStatus: 'verified',
          assessment: assessment._id,
          assessmentScore: score,
          skillRef: masterSkill._id
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        _id: assessment._id,
        skillName: masterSkill.name,
        score,
        totalQuestions,
        percentage,
        level: result.level,
        status: result.status,
        verified: result.verified,
        attemptNumber
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. GET USER ASSESSMENT HISTORY
exports.getUserAssessmentHistory = async (req, res) => {
  try {
    const history = await SkillAssessment.find({ user: req.user.id })
      .populate('skill', 'name category')
      .sort({ completedAt: -1 });
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ADMIN QUESTION BANK MANAGEMENT ---

// 4. GET QUESTIONS (Filtered by skill or difficulty)
exports.getAdminQuestions = async (req, res) => {
  try {
    const { skillId, difficulty, search } = req.query;
    const query = {};

    if (skillId && skillId !== 'All') {
      if (mongoose.Types.ObjectId.isValid(skillId)) {
        query.skill = skillId;
      }
    }
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }

    const questions = await SkillQuestion.find(query).populate('skill', 'name category').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. ADD NEW QUESTION
exports.addQuestion = async (req, res) => {
  try {
    const { skillId, question, options, correctAnswer, explanation, difficulty } = req.body;

    if (!skillId || !question || !options || !correctAnswer) {
      return res.status(400).json({ success: false, message: 'Skill ID, question, options, and correct answer are required.' });
    }

    const masterSkill = await Skill.findById(skillId);
    if (!masterSkill) {
      return res.status(404).json({ success: false, message: 'Associated master skill not found.' });
    }

    const q = await SkillQuestion.create({
      skill: masterSkill._id,
      skillName: masterSkill.name,
      question: question.trim(),
      options: options.map(o => o.trim()),
      correctAnswer: correctAnswer.trim(),
      explanation: (explanation || '').trim(),
      difficulty: difficulty || 'Basic',
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: q });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 6. UPDATE QUESTION
exports.updateQuestion = async (req, res) => {
  try {
    const q = await SkillQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!q) return res.status(404).json({ success: false, message: 'Question not found' });
    res.status(200).json({ success: true, data: q });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 7. DELETE QUESTION
exports.deleteQuestion = async (req, res) => {
  try {
    await SkillQuestion.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Question deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 8. ADMIN ASSESSMENT STATS
exports.getAssessmentStats = async (req, res) => {
  try {
    const totalAssessments = await SkillAssessment.countDocuments();
    const verifiedSkills = await SkillAssessment.countDocuments({ verified: true });
    const failedAssessments = await SkillAssessment.countDocuments({ verified: false });

    const avgScoreAgg = await SkillAssessment.aggregate([
      { $group: { _id: null, avg: { $avg: '$score' } } }
    ]);
    const averageScore = avgScoreAgg.length > 0 ? parseFloat(avgScoreAgg[0].avg.toFixed(1)) : 0;

    const mostAssessed = await SkillAssessment.aggregate([
      { $group: { _id: '$skillName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const totalQuestions = await SkillQuestion.countDocuments();
    const activeQuestions = await SkillQuestion.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      stats: {
        totalAssessments,
        verifiedSkills,
        failedAssessments,
        averageScore,
        totalQuestions,
        activeQuestions
      },
      mostAssessed
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 9. GET QUESTION BANK SUMMARY FOR ALL SKILLS (ADMIN)
exports.getQuestionBankSummary = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ name: 1 });
    const summary = await Promise.all(skills.map(async (skill) => {
      const activeCount = await SkillQuestion.countDocuments({ skill: skill._id, isActive: true });
      const inactiveCount = await SkillQuestion.countDocuments({ skill: skill._id, isActive: false });
      return {
        _id: skill._id,
        name: skill.name,
        category: skill.category,
        activeQuestions: activeCount,
        inactiveQuestions: inactiveCount,
        totalQuestions: activeCount + inactiveCount,
        status: activeCount >= 10 ? 'Ready' : 'Needs Questions'
      };
    }));

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

