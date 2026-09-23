const express = require('express');
const { createEnquiry, getAllEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Public — anyone can submit an enquiry (no auth required)
router.post('/', createEnquiry);

// Protected — admin/hr only
router.use(protect);
router.get('/', restrictTo('admin', 'hr'), getAllEnquiries);
router.patch('/:id/status', restrictTo('admin', 'hr'), updateEnquiryStatus);
router.delete('/:id', restrictTo('admin'), deleteEnquiry);

module.exports = router;
