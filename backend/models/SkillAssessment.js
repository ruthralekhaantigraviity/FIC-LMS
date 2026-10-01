const mongoose = require('mongoose');

const skillAssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  skillName: {
    type: String,
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillQuestion'
    },
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    isCorrect: Boolean
  }],
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 10
  },
  percentage: {
    type: Number,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Not Verified'],
    default: 'Not Verified'
  },
  status: {
    type: String,
    enum: ['passed', 'failed'],
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  attemptNumber: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

skillAssessmentSchema.index({ user: 1, skill: 1 });
skillAssessmentSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('SkillAssessment', skillAssessmentSchema);
