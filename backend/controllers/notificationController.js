const Notification = require('../models/Notification');
const mongoose = require('mongoose');

exports.getNotifications = async (req, res) => {
  try {
    const userRole = req.user?.role || 'student';
    const userId = req.user?._id || req.user?.id;
    const isValidId = userId && mongoose.Types.ObjectId.isValid(userId);

    const query = {
      roles: userRole
    };
    if (isValidId) {
      query.readBy = { $ne: userId };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);

    return res.status(200).json({
      success: true,
      data: notifications || []
    });
  } catch (err) {
    console.error('[GET NOTIFICATIONS ERROR]', err);
    return res.status(200).json({ success: true, data: [] });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (userId && mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(req.params.id)) {
      await Notification.findByIdAndUpdate(req.params.id, {
        $addToSet: { readBy: userId }
      });
    }
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: true });
  }
};

exports.clearAll = async (req, res) => {
  try {
    const userRole = req.user?.role || 'student';
    const userId = req.user?._id || req.user?.id;
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const notifications = await Notification.find({ roles: userRole });
      const ids = notifications.map(n => n._id);
      
      await Notification.updateMany(
        { _id: { $in: ids } },
        { $addToSet: { readBy: userId } }
      );
    }
    
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(200).json({ success: true });
  }
};
