const Ticket = require('../models/Ticket');
const Notification = require('../models/Notification');

// Create a new support ticket (Student)
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required.' });
    }

    const ticket = await Ticket.create({
      student: req.user._id,
      subject,
      message
    });

    // Create Notification for trainer and admin
    await Notification.create({
      title: 'New Support Ticket',
      message: `New support ticket raised by ${req.user.name}: "${subject}"`,
      type: 'enquiry', // Using existing notification types or default
      roles: ['trainer', 'admin', 'hr'],
      targetId: ticket._id,
      onModel: 'Ticket'
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get tickets for current student
exports.getStudentTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ student: req.user._id })
      .populate('replies.sender', 'name role')
      .sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all tickets (Trainer/HR/Admin)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('student', 'name email studentId courseDomain')
      .populate('replies.sender', 'name role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add reply to a ticket (Student/Trainer/HR/Admin)
exports.addReply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Reply message is required.' });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    ticket.replies.push({
      sender: req.user._id,
      message
    });

    // Keep ticket Open on reply, or update status if needed
    await ticket.save();

    // Fetch the updated ticket with populated sender info
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('student', 'name email studentId courseDomain')
      .populate('replies.sender', 'name role');

    res.status(200).json({ success: true, data: updatedTicket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Close/Resolve a ticket
exports.resolveTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: 'Closed' },
      { new: true }
    ).populate('student', 'name email')
     .populate('replies.sender', 'name role');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
