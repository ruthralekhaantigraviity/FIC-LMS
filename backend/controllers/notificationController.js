const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      roles: req.user.role,
      readBy: { $ne: req.user.id }
    }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, {
      $addToSet: { readBy: req.user.id }
    });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ roles: req.user.role });
    const ids = notifications.map(n => n._id);
    
    await Notification.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { readBy: req.user.id } }
    );
    
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
