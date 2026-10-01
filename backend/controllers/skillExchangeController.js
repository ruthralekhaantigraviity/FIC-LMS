const UserSkill = require('../models/UserSkill');
const SkillExchange = require('../models/SkillExchange');
const ExchangeSession = require('../models/ExchangeSession');
const SkillFeedback = require('../models/SkillFeedback');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Skill = require('../models/Skill');
const mongoose = require('mongoose');

// 0. MASTER SKILLS CATALOG
exports.getMasterSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ status: 'active' }).sort({ name: 1 });
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMasterSkill = async (req, res) => {
  try {
    const { name, category } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Skill name is required' });

    let existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Skill already exists in catalog.' });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category: category || 'Development',
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Helper to calculate average rating for a user
const getUserRatingStats = async (userId) => {
  const ratings = await SkillFeedback.aggregate([
    { $match: { toUser: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  const completedCount = await SkillExchange.countDocuments({
    $or: [{ requester: userId }, { receiver: userId }],
    status: 'completed'
  });

  return {
    rating: ratings.length > 0 ? parseFloat(ratings[0].avgRating.toFixed(1)) : 5.0,
    ratingCount: ratings.length > 0 ? ratings[0].count : 0,
    completedExchanges: completedCount
  };
};

// 1. MY SKILLS (Teach)
exports.getMyTeachSkills = async (req, res) => {
  try {
    const skills = await UserSkill.find({ user: req.user.id, type: 'teach' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addTeachSkill = async (req, res) => {
  try {
    const { skillName, category, level, description } = req.body;
    if (!skillName) return res.status(400).json({ success: false, message: 'Skill name is required' });

    const skill = await UserSkill.create({
      user: req.user.id,
      type: 'teach',
      skillName: skillName.trim(),
      category: category || 'Development',
      level: level || 'Intermediate',
      description: description || ''
    });

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already added this skill to teach.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteTeachSkill = async (req, res) => {
  try {
    await UserSkill.findOneAndDelete({ _id: req.params.id, user: req.user.id, type: 'teach' });
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 2. SKILLS I WANT TO LEARN
exports.getMyLearnSkills = async (req, res) => {
  try {
    const skills = await UserSkill.find({ user: req.user.id, type: 'learn' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addLearnSkill = async (req, res) => {
  try {
    const { skillName, category, level, description } = req.body;
    if (!skillName) return res.status(400).json({ success: false, message: 'Skill name is required' });

    const skill = await UserSkill.create({
      user: req.user.id,
      type: 'learn',
      skillName: skillName.trim(),
      category: category || 'Development',
      level: level || 'Beginner',
      description: description || ''
    });

    res.status(201).json({ success: true, data: skill });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already added this skill to learn.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteLearnSkill = async (req, res) => {
  try {
    await UserSkill.findOneAndDelete({ _id: req.params.id, user: req.user.id, type: 'learn' });
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 3. FIND SKILLS / BROWSE STUDENTS
exports.browseSkills = async (req, res) => {
  try {
    const { search, category, level } = req.query;

    const query = { type: 'teach', user: { $ne: req.user.id }, status: 'active', verified: true };
    if (search) {
      query.skillName = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (level && level !== 'All') {
      query.level = level;
    }

    const teachSkills = await UserSkill.find(query).populate('user', 'name email profileImage courseDomain studentStatus');

    // Group by student
    const studentMap = {};
    for (const ts of teachSkills) {
      if (!ts.user) continue;
      const uId = ts.user._id.toString();
      if (!studentMap[uId]) {
        const stats = await getUserRatingStats(uId);
        studentMap[uId] = {
          user: ts.user,
          teachSkills: [],
          learnSkills: [],
          rating: stats.rating,
          ratingCount: stats.ratingCount,
          completedExchanges: stats.completedExchanges
        };
      }
      studentMap[uId].teachSkills.push(ts);
    }

    // Populate learn skills for found students
    const studentIds = Object.keys(studentMap);
    if (studentIds.length > 0) {
      const learnSkills = await UserSkill.find({ user: { $in: studentIds }, type: 'learn', status: 'active' });
      learnSkills.forEach(ls => {
        const uId = ls.user.toString();
        if (studentMap[uId]) {
          studentMap[uId].learnSkills.push(ls);
        }
      });
    }

    res.status(200).json({ success: true, data: Object.values(studentMap) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. SKILL MATCHING (Smart Reciprocal Engine with Verification Rule)
exports.getSkillMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Skills current user can teach (Must be VERIFIED)
    const myTeachSkills = await UserSkill.find({ user: currentUserId, type: 'teach', status: 'active', verified: true });
    const myTeachNames = myTeachSkills.map(s => s.skillName.toLowerCase());

    // Skills current user wants to learn (Does not require verification)
    const myLearnSkills = await UserSkill.find({ user: currentUserId, type: 'learn', status: 'active' });
    const myLearnNames = myLearnSkills.map(s => s.skillName.toLowerCase());

    if (myTeachNames.length === 0 && myLearnNames.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Other users' VERIFIED teach skills
    const otherTeachSkills = await UserSkill.find({ 
      user: { $ne: currentUserId }, 
      type: 'teach', 
      status: 'active',
      verified: true 
    }).populate('user', 'name email profileImage courseDomain');

    const matches = [];

    // Group by partner user
    const partnerMap = {};
    for (const ots of otherTeachSkills) {
      if (!ots.user) continue;
      const partnerId = ots.user._id.toString();
      if (!partnerMap[partnerId]) {
        partnerMap[partnerId] = {
          user: ots.user,
          teachSkills: [],
          learnSkills: []
        };
      }
      partnerMap[partnerId].teachSkills.push(ots);
    }

    const partnerIds = Object.keys(partnerMap);
    if (partnerIds.length > 0) {
      const otherLearnSkills = await UserSkill.find({ user: { $in: partnerIds }, type: 'learn', status: 'active' });
      otherLearnSkills.forEach(ols => {
        const pId = ols.user.toString();
        if (partnerMap[pId]) partnerMap[pId].learnSkills.push(ols);
      });
    }

    // Helper to normalize strings for robust fuzzy comparison
    const norm = (str) => (str || '').toLowerCase()
      .replace(/\.js\b/g, '')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]/g, '');

    const isMatch = (nameA, nameB) => {
      const a = norm(nameA);
      const b = norm(nameB);
      if (!a || !b) return false;
      return a === b || a.includes(b) || b.includes(a);
    };

    // Calculate match scores
    for (const pId of Object.keys(partnerMap)) {
      const partner = partnerMap[pId];

      // Reciprocal check using robust normalized matching:
      // 1. Current user wants to learn a skill that partner can teach
      const learnTeachMatch = myLearnSkills.find(myLearn => 
        partner.teachSkills.some(pTeach => isMatch(myLearn.skillName, pTeach.skillName))
      );

      // 2. Partner wants to learn a skill that current user can teach
      const teachLearnMatch = myTeachSkills.find(myTeach => 
        partner.learnSkills.some(pLearn => isMatch(myTeach.skillName, pLearn.skillName))
      );

      if (learnTeachMatch && teachLearnMatch) {
        const partnerTeachSkillDoc = partner.teachSkills.find(pTeach => isMatch(learnTeachMatch.skillName, pTeach.skillName));
        const myTeachSkillDoc = myTeachSkills.find(myTeach => partner.learnSkills.some(pLearn => isMatch(myTeach.skillName, pLearn.skillName)));

        const stats = await getUserRatingStats(pId);

        matches.push({
          partner: partner.user,
          reciprocal: true,
          youLearn: partnerTeachSkillDoc ? partnerTeachSkillDoc.skillName : learnTeachMatch.skillName,
          youTeach: myTeachSkillDoc ? myTeachSkillDoc.skillName : teachLearnMatch.skillName,
          rating: stats.rating,
          ratingCount: stats.ratingCount,
          completedExchanges: stats.completedExchanges
        });
      }
    }

    res.status(200).json({ success: true, data: matches });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5. EXCHANGE REQUESTS
exports.sendExchangeRequest = async (req, res) => {
  try {
    const { receiverId, skillToLearn, skillToTeach, message } = req.body;

    if (!receiverId || !skillToLearn || !skillToTeach) {
      return res.status(400).json({ success: false, message: 'Receiver ID, skill to learn, and skill to teach are required.' });
    }

    if (receiverId.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a skill exchange with yourself.' });
    }

    // Check for existing pending request
    const existing = await SkillExchange.findOne({
      requester: req.user.id,
      receiver: receiverId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have a pending exchange request with this student.' });
    }

    const exchange = await SkillExchange.create({
      requester: req.user.id,
      receiver: receiverId,
      skillToLearn,
      skillToTeach,
      message: message || ''
    });

    // Notify receiver
    try {
      await Notification.create({
        title: 'New Skill Exchange Request',
        message: `${req.user.name || 'A student'} requested a skill exchange (${skillToLearn} ↔ ${skillToTeach}).`,
        type: 'skill_exchange',
        roles: ['student'],
        targetId: exchange._id,
        onModel: 'SkillExchange'
      });
    } catch (nErr) {}

    res.status(201).json({ success: true, message: 'Exchange request sent successfully!', data: exchange });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getExchangeRequests = async (req, res) => {
  try {
    const received = await SkillExchange.find({ receiver: req.user.id })
      .populate('requester', 'name email profileImage courseDomain')
      .sort({ createdAt: -1 });

    const sent = await SkillExchange.find({ requester: req.user.id })
      .populate('receiver', 'name email profileImage courseDomain')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { received, sent } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.respondExchangeRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const exchange = await SkillExchange.findOne({ _id: req.params.id, receiver: req.user.id });

    if (!exchange) {
      return res.status(404).json({ success: false, message: 'Exchange request not found.' });
    }

    if (action === 'accept') {
      exchange.status = 'accepted';
      exchange.acceptedAt = new Date();
    } else if (action === 'reject') {
      exchange.status = 'rejected';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    await exchange.save();

    // Notify requester
    try {
      await Notification.create({
        title: `Skill Exchange Request ${action === 'accept' ? 'Accepted' : 'Rejected'}`,
        message: `Your request to exchange ${exchange.skillToLearn} for ${exchange.skillToTeach} was ${action}ed.`,
        type: 'skill_exchange',
        roles: ['student'],
        targetId: exchange._id,
        onModel: 'SkillExchange'
      });
    } catch (nErr) {}

    res.status(200).json({ success: true, data: exchange });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 6. MY EXCHANGES
exports.getMyExchanges = async (req, res) => {
  try {
    const exchanges = await SkillExchange.find({
      $or: [{ requester: req.user.id }, { receiver: req.user.id }],
      status: { $in: ['accepted', 'completed'] }
    })
      .populate('requester', 'name email profileImage')
      .populate('receiver', 'name email profileImage')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, data: exchanges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeExchange = async (req, res) => {
  try {
    const exchange = await SkillExchange.findOne({
      _id: req.params.id,
      $or: [{ requester: req.user.id }, { receiver: req.user.id }],
      status: 'accepted'
    });

    if (!exchange) return res.status(404).json({ success: false, message: 'Active exchange not found' });

    exchange.status = 'completed';
    exchange.completedAt = new Date();
    await exchange.save();

    res.status(200).json({ success: true, data: exchange });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 7. SESSIONS
exports.scheduleSession = async (req, res) => {
  try {
    const { exchangeId, skill, date, time, mode, meetingLink, notes } = req.body;

    const exchange = await SkillExchange.findOne({
      _id: exchangeId,
      $or: [{ requester: req.user.id }, { receiver: req.user.id }],
      status: 'accepted'
    });

    if (!exchange) return res.status(404).json({ success: false, message: 'Accepted exchange not found.' });

    const session = await ExchangeSession.create({
      exchange: exchangeId,
      createdBy: req.user.id,
      skill,
      date,
      time,
      mode: mode || 'Online',
      meetingLink: meetingLink || '',
      notes: notes || ''
    });

    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await ExchangeSession.find({ exchange: req.params.exchangeId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8. RATINGS & FEEDBACK
exports.submitFeedback = async (req, res) => {
  try {
    const { exchangeId, rating, communicationRating, teachingRating, comment } = req.body;

    const exchange = await SkillExchange.findById(exchangeId);
    if (!exchange || exchange.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Exchange must be marked as completed before submitting feedback.' });
    }

    const partnerId = exchange.requester.toString() === req.user.id.toString()
      ? exchange.receiver
      : exchange.requester;

    const feedback = await SkillFeedback.create({
      exchange: exchangeId,
      fromUser: req.user.id,
      toUser: partnerId,
      rating: Number(rating) || 5,
      communicationRating: Number(communicationRating) || 5,
      teachingRating: Number(teachingRating) || 5,
      comment: comment || ''
    });

    res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already submitted feedback for this exchange.' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getUserFeedback = async (req, res) => {
  try {
    const targetUserId = req.params.userId || (req.user ? req.user.id : null);
    if (!targetUserId) {
      return res.status(200).json({ success: true, stats: { rating: 5.0, ratingCount: 0, completedExchanges: 0 }, data: [] });
    }
    const feedbacks = await SkillFeedback.find({ toUser: targetUserId })
      .populate('fromUser', 'name profileImage')
      .sort({ createdAt: -1 });

    const stats = await getUserRatingStats(targetUserId);

    res.status(200).json({ success: true, stats, data: feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 9. ADMIN ANALYTICS & MANAGEMENT
exports.getAdminSkillStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalOffered = await UserSkill.countDocuments({ type: 'teach' });
    const totalWanted = await UserSkill.countDocuments({ type: 'learn' });
    const pendingRequests = await SkillExchange.countDocuments({ status: 'pending' });
    const activeExchanges = await SkillExchange.countDocuments({ status: 'accepted' });
    const completedExchanges = await SkillExchange.countDocuments({ status: 'completed' });

    const avgRatingAgg = await SkillFeedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const averageRating = avgRatingAgg.length > 0 ? parseFloat(avgRatingAgg[0].avg.toFixed(1)) : 5.0;

    const mostOffered = await UserSkill.aggregate([
      { $match: { type: 'teach' } },
      { $group: { _id: '$skillName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const mostRequested = await UserSkill.aggregate([
      { $match: { type: 'learn' } },
      { $group: { _id: '$skillName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const allSkills = await UserSkill.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    const exchangesList = await SkillExchange.find()
      .populate('requester', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    const feedbackList = await SkillFeedback.find()
      .populate('fromUser', 'name')
      .populate('toUser', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOffered,
        totalWanted,
        pendingRequests,
        activeExchanges,
        completedExchanges,
        averageRating
      },
      mostOffered,
      mostRequested,
      allSkills,
      exchangesList,
      feedbackList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSkillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const skill = await UserSkill.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ success: true, data: skill });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
