const express = require('express');
const moduleController = require('../controllers/moduleController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', restrictTo('admin', 'trainer'), moduleController.createModule);
router.get('/course/:courseId', moduleController.getModulesByCourse);
router.patch('/:id', restrictTo('admin', 'trainer'), moduleController.updateModule);
router.delete('/:id', restrictTo('admin', 'trainer'), moduleController.deleteModule);

module.exports = router;
