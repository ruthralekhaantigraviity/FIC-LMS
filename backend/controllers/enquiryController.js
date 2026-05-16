const Enquiry = require('../models/Enquiry');
const Course = require('../models/Course');

// POST /api/enquiries - Public: Submit a new enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, courseId, message } = req.body;

    if (!fullName || !email || !phoneNumber) {
      return res.status(400).json({ success: false, message: 'Full name, email, and phone number are required.' });
    }

    const enquiry = await Enquiry.create({
      fullName,
      email,
      phoneNumber,
      course: courseId || undefined,
      message,
    });

    res.status(201).json({ success: true, message: 'Enquiry submitted successfully!', data: enquiry });
  } catch (err) {
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
