const express = require('express');
const {
  createReview,
  getStudentReviews,
  getTrainerReviews,
  getTrainersList
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Student reviews management
router.post('/', restrictTo('student'), createReview);
router.get('/my-reviews', restrictTo('student'), getStudentReviews);
router.get('/trainers', getTrainersList);

// Trainer/Admin reviews management
router.get('/trainer-reviews', restrictTo('trainer', 'admin', 'hr'), getTrainerReviews);

module.exports = router;
