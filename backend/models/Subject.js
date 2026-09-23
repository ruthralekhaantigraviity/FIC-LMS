const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A subject must have a title'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'A subject must have content']
  },
  module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  videoUrl: String,
  pdfUrl: String, // Explicit PDF URL
  duration: String, // e.g. "15 mins"
  resources: [{
    name: String,
    url: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;
