const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['Development', 'Data & AI', 'Design', 'Marketing', 'Cybersecurity', 'Cloud & DevOps', 'Business & Management', 'Other'],
    default: 'Development'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'flagged', 'hidden'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
