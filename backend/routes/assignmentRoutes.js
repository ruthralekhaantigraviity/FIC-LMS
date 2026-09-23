const express = require('express');
const assignmentController = require('../controllers/assignmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', assignmentController.getAllAssignments);
router.get('/course/:courseId', assignmentController.getCourseAssignments);
router.post('/', restrictTo('admin', 'trainer'), assignmentController.createAssignment);
router.post('/:id/submit', restrictTo('student'), assignmentController.submitAssignment);

module.exports = router;
