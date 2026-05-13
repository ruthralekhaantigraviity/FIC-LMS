const express = require('express');
const courseController = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourse);

// Protected routes
router.use(protect);

router.post('/', restrictTo('admin', 'trainer'), courseController.createCourse);
router.patch('/:id', restrictTo('admin', 'trainer'), courseController.updateCourse);
router.delete('/:id', restrictTo('admin', 'trainer'), courseController.deleteCourse);

module.exports = router;
