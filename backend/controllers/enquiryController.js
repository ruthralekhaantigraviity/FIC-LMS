const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// POST /api/enquiries - Public: Submit a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, courseId, courseInterest, message } = req.body;

    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Full name, email, and phone number are required.' });
    }

    // Determine course ObjectId vs text note
    let validCourseId = undefined;
    let finalMessage = message || '';
    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      validCourseId = courseId;
    } else if (courseInterest) {
      finalMessage = finalMessage ? `[Interest: ${courseInterest}] ${finalMessage}` : `[Interest: ${courseInterest}]`;
    }

    const enquiry = await Enquiry.create({
      fullName,
      email,
      phoneNumber,
      course: validCourseId,
      message: finalMessage,
    });

    // Create Notification for admin and hr safely
    try {
      await Notification.create({
        title: 'New Enquiry Received',
        message: `A new enquiry has been submitted by ${fullName}.`,
        type: 'enquiry',
        roles: ['admin', 'hr'],
        targetId: enquiry._id,
        onModel: 'Enquiry'
      });
    } catch (notifErr) {
      console.warn('[ENQUIRY NOTIFICATION WARNING]', notifErr.message);
    }

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: enquiry });
  } catch (err) {
    console.error('[ENQUIRY CREATE ERROR]', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/enquiries - Admin/HR only: Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('course', 'title')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/enquiries/:id/status - Admin/HR only: Update status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.$push = { notes };

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ success: true, data: enquiry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/enquiries/:id - Admin only
exports.deleteEnquiry = async (req, res) => {
  try {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.status(204).json({ success: true, data: null });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
