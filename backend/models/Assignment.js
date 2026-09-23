const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment must have a title']
  },
  description: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Assignment must belong to a course']
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assignment must be created by a trainer']
  },
  dueDate: {
    type: Date,
    required: [true, 'Assignment must have a due date']
  },
  attachments: [String], // URLs to files
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    fileUrl: String,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    grade: Number,
    feedback: String,
    status: {
      type: String,
      enum: ['pending', 'graded'],
      default: 'pending'
    }
  }]
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
