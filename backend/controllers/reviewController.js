const Review = require('../models/Review');
const User = require('../models/User');

// POST /api/reviews - Student raises a review for a trainer
exports.createReview = async (req, res) => {
  try {
    const { trainerId, stars, comment, course } = req.body;
    if (!trainerId || !stars || !comment || !course) {
      return res.status(400).json({ success: false, message: 'Trainer, stars rating, comment, and course domain are required.' });
    }

    // Verify trainer exists and is actually a trainer
    const trainerExists = await User.findOne({ _id: trainerId, role: 'trainer' });
    if (!trainerExists) {
      return res.status(404).json({ success: false, message: 'Trainer not found.' });
    }

    const review = await Review.create({
      student: req.user._id || req.user.id,
      trainer: trainerId,
      stars,
      comment,
      course
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reviews/my-reviews - Student fetches reviews they gave
exports.getStudentReviews = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = req.user?._id || req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const reviews = await Review.find({ student: userId })
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews || [] });
  } catch (err) {
    res.status(200).json({ success: true, data: [] });
  }
};

// GET /api/reviews/trainer-reviews - Trainer/Admin fetches reviews
exports.getTrainerReviews = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const userId = req.user?._id || req.user?.id;
    let query = {};
    if (req.user?.role === 'trainer' && userId && mongoose.Types.ObjectId.isValid(userId)) {
      query = { trainer: userId };
    }

    const reviews = await Review.find(query)
      .populate('student', 'name email courseDomain')
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews || [] });
  } catch (err) {
    console.error('[getTrainerReviews] ERROR fetching reviews:', err);
    res.status(200).json({ success: true, data: [] });
  }
};

// GET /api/reviews/trainers - Get list of trainers (names and ids)
exports.getTrainersList = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, data: [] });
    }
    const trainers = await User.find({ role: 'trainer' }, 'name email courseDomain');
    res.status(200).json({ success: true, data: trainers || [] });
  } catch (err) {
    res.status(200).json({ success: true, data: [] });
  }
};
