const express = require('express');
const router = express.Router();
const {
  getQuizQuestions,
  submitAssessment,
  getUserAssessmentHistory,
  getAdminQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getAssessmentStats,
  getQuestionBankSummary
} = require('../controllers/skillAssessmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// Student Assessment Routes
router.get('/:skillId/questions', getQuizQuestions);
router.post('/:skillId/submit', submitAssessment);
router.get('/history', getUserAssessmentHistory);

// Admin Question Bank & Stats Management
router.get('/admin/questions', restrictTo('admin'), getAdminQuestions);
router.get('/admin/question-bank-summary', restrictTo('admin'), getQuestionBankSummary);
router.post('/admin/questions', restrictTo('admin'), addQuestion);
router.put('/admin/questions/:id', restrictTo('admin'), updateQuestion);
router.delete('/admin/questions/:id', restrictTo('admin'), deleteQuestion);
router.get('/admin/stats', restrictTo('admin'), getAssessmentStats);

module.exports = router;

