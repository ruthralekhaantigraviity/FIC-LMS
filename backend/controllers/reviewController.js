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
    const reviews = await Review.find({ student: req.user._id || req.user.id })
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reviews/trainer-reviews - Trainer/Admin fetches reviews
exports.getTrainerReviews = async (req, res) => {
  try {
    console.log('[getTrainerReviews] User details from request:', {
      id: req.user?._id || req.user?.id,
      email: req.user?.email,
      role: req.user?.role
    });

    let query = {};
    if (req.user.role === 'trainer') {
      query = { trainer: req.user._id || req.user.id };
    }
    
    console.log('[getTrainerReviews] Built Query:', query);

    const reviews = await Review.find(query)
      .populate('student', 'name email courseDomain')
      .populate('trainer', 'name email')
      .sort({ createdAt: -1 });

    console.log(`[getTrainerReviews] Query succeeded, found ${reviews.length} reviews`);
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    console.error('[getTrainerReviews] ERROR fetching reviews:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/reviews/trainers - Get list of trainers (names and ids)
exports.getTrainersList = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer', isActive: true }, 'name email courseDomain');
    res.status(200).json({ success: true, data: trainers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
