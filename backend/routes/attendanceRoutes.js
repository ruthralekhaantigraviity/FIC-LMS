const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/mark', restrictTo('trainer', 'admin'), attendanceController.markAttendance);
router.get('/course-report', restrictTo('trainer', 'admin', 'hr'), attendanceController.getCourseAttendance);
router.get('/stats/:courseId', attendanceController.getStudentAttendanceStats);

module.exports = router;
