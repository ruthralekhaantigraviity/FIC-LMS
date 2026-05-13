const express = require('express');
const subjectController = require('../controllers/subjectController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - all users can view subjects
router.use(protect);

// Get subjects for a specific course (students + trainers can view)
router.get('/course/:courseId', subjectController.getSubjectsByCourse);

// Get trainer's own courses with subjects
router.get('/my-courses', restrictTo('trainer'), subjectController.getTrainerCourses);

// Admin/Trainer only - manage subjects
router.post('/', restrictTo('admin', 'trainer'), subjectController.createSubject);
router.patch('/:id', restrictTo('admin', 'trainer'), subjectController.updateSubject);
router.delete('/:id', restrictTo('admin', 'trainer'), subjectController.deleteSubject);

module.exports = router;
