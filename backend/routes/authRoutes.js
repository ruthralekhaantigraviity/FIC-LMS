const express = require('express');
const authController = require('../controllers/authController');

const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(protect);
router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', authController.updateMe);

router.get('/users', restrictTo('admin', 'hr'), authController.getAllUsers);
router.patch('/users/:id/role', restrictTo('admin'), authController.updateUserRole);
router.patch('/users/:id', restrictTo('admin', 'hr'), authController.updateUser);
router.delete('/users/:id', restrictTo('admin', 'hr'), authController.deleteUser);

module.exports = router;
