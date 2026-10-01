const mongoose = require('mongoose');

const skillQuestionSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: [true, 'Master skill reference is required']
  },
  skillName: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    trim: true
  },
  explanation: {
    type: String,
    default: '',
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Basic', 'Intermediate', 'Advanced'],
    default: 'Basic'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

skillQuestionSchema.index({ skill: 1, isActive: 1 });
skillQuestionSchema.index({ skill: 1, difficulty: 1 });

module.exports = mongoose.model('SkillQuestion', skillQuestionSchema);
