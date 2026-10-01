const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['teach', 'learn'],
    required: true
  },
  skillName: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Development', 'Data & AI', 'Design', 'Marketing', 'Cybersecurity', 'Cloud & DevOps', 'Business & Management', 'Other'],
    default: 'Development'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'hidden'],
    default: 'active'
  },
  skillRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'unverified', 'pending_assessment'],
    default: 'unverified'
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillAssessment'
  },
  assessmentScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Prevent exact duplicate skill entries for same user & type
userSkillSchema.index({ user: 1, type: 1, skillName: 1 }, { unique: true });

module.exports = mongoose.model('UserSkill', userSkillSchema);
