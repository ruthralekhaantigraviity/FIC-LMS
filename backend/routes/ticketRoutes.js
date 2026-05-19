const express = require('express');
const {
  createTicket,
  getStudentTickets,
  getAllTickets,
  addReply,
  resolveTicket
} = require('../controllers/ticketController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// Student routes
router.post('/', restrictTo('student'), createTicket);
router.get('/my-tickets', restrictTo('student'), getStudentTickets);

// Trainer/Admin/HR routes
router.get('/', restrictTo('trainer', 'admin', 'hr'), getAllTickets);
router.patch('/:id/resolve', restrictTo('trainer', 'admin', 'hr'), resolveTicket);

// Reply route (accessible to both students and staff involved)
router.post('/:id/reply', addReply);

module.exports = router;
