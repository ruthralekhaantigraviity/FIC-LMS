const express = require('express');
const progressController = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/:courseId', progressController.getProgress);
router.post('/mark-complete', progressController.markComplete);

module.exports = router;
