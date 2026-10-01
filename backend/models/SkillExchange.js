const mongoose = require('mongoose');

const skillExchangeSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skillToLearn: {
    type: String,
    required: true,
    trim: true
  },
  skillToTeach: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  acceptedAt: Date,
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('SkillExchange', skillExchangeSchema);
