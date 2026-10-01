const mongoose = require('mongoose');

const skillFeedbackSchema = new mongoose.Schema({
  exchange: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SkillExchange',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  teachingRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  communicationRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

// Prevent multiple feedback for same exchange by same user
skillFeedbackSchema.index({ exchange: 1, fromUser: 1 }, { unique: true });

module.exports = mongoose.model('SkillFeedback', skillFeedbackSchema);
