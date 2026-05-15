const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  message: String,
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'dropped'],
    default: 'new'
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [String],
}, { timestamps: true });

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
