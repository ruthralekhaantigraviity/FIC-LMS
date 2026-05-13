const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: String,
  dateOfBirth: Date,
  address: String,
  previousEducation: String,
  targetDomain: String,
  documents: [{
    name: String,
    url: String
  }],
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: String,
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Admission = mongoose.model('Admission', admissionSchema);
module.exports = Admission;
