const express = require('express');
const authController = require('../controllers/authController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(protect);
router.get('/users', restrictTo('admin'), authController.getAllUsers);
router.patch('/users/:id/role', restrictTo('admin'), authController.updateUserRole);

module.exports = router;
