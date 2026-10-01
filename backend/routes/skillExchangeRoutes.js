const express = require('express');
const router = express.Router();
const {
  getMyTeachSkills, addTeachSkill, deleteTeachSkill,
  getMyLearnSkills, addLearnSkill, deleteLearnSkill,
  browseSkills, getSkillMatches,
  sendExchangeRequest, getExchangeRequests, respondExchangeRequest,
  getMyExchanges, completeExchange,
  scheduleSession, getSessions,
  submitFeedback, getUserFeedback,
  getAdminSkillStats, updateSkillStatus,
  getMasterSkills, createMasterSkill
} = require('../controllers/skillExchangeController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);

// Master Catalog Skills
router.get('/master-skills', getMasterSkills);
router.post('/master-skills', restrictTo('admin'), createMasterSkill);

// Student Skill Management
router.get('/my-teach-skills', getMyTeachSkills);
router.post('/my-teach-skills', addTeachSkill);
router.delete('/my-teach-skills/:id', deleteTeachSkill);

router.get('/my-learn-skills', getMyLearnSkills);
router.post('/my-learn-skills', addLearnSkill);
router.delete('/my-learn-skills/:id', deleteLearnSkill);

// Search & Matching
router.get('/browse', browseSkills);
router.get('/matches', getSkillMatches);

// Requests
router.post('/requests', sendExchangeRequest);
router.get('/requests', getExchangeRequests);
router.patch('/requests/:id/respond', respondExchangeRequest);

// Active & Completed Exchanges
router.get('/my-exchanges', getMyExchanges);
router.patch('/exchanges/:id/complete', completeExchange);

// Sessions
router.post('/sessions', scheduleSession);
router.get('/sessions/:exchangeId', getSessions);

// Feedback
router.post('/feedback', submitFeedback);
router.get('/feedback', getUserFeedback);
router.get('/feedback/:userId', getUserFeedback);

// Admin Routes
router.get('/admin/stats', restrictTo('admin'), getAdminSkillStats);
router.patch('/admin/skills/:id/status', restrictTo('admin'), updateSkillStatus);

module.exports = router;
