const express = require('express');
const admissionController = require('../controllers/admissionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/public-enroll', admissionController.publicEnroll);

router.use(protect);

router.post('/apply', admissionController.submitAdmission);
router.get('/my-applications', admissionController.getMyAdmissions);
router.get('/my-courses', admissionController.getMyEnrolledCourses);

// HR/Admin only routes
router.get('/all', restrictTo('hr', 'admin'), admissionController.getAllAdmissions);
router.patch('/:id/status', restrictTo('hr', 'admin'), admissionController.updateAdmissionStatus);
router.delete('/:id', restrictTo('hr', 'admin'), admissionController.deleteAdmission);

module.exports = router;
