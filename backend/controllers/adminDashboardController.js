const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enquiry = require('../models/Enquiry');
const Admission = require('../models/Admission');

exports.getDashboardStats = async (req, res) => {
  try {
    let totalStudents = 0;
    let activeCourses = 0;
    let totalRevenue = 0;
    let pendingFees = 0;
    let pipeline = { new: 0, contacted: 0, converted: 0, dropped: 0 };
    let monthlyRevenue = [];
    let courseEnrollments = [];
    let recentStudents = [];
    let recentEnrollments = [];
    let recentPayments = [];

    try {
      totalStudents = await User.countDocuments({ role: 'student' });
    } catch (e) {}

    try {
      activeCourses = await Course.countDocuments({ isPublished: true });
    } catch (e) {}
    
    try {
      const revenueStats = await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;
    } catch (e) {}

    try {
      const pendingFeesStats = await Payment.aggregate([
        { $match: { status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      pendingFees = pendingFeesStats.length > 0 ? pendingFeesStats[0].total : 0;
    } catch (e) {}

    try {
      const enquiryStats = await Enquiry.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      enquiryStats.forEach(stat => {
        if (pipeline.hasOwnProperty(stat._id)) {
          pipeline[stat._id] = stat.count;
        }
      });
    } catch (e) {}

    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      monthlyRevenue = await Payment.aggregate([
        { $match: { status: 'completed', paidAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
            revenue: { $sum: '$amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);
    } catch (e) {}

    try {
      courseEnrollments = await Admission.aggregate([
        { $group: { _id: '$course', count: { $sum: 1 } } },
        {
          $lookup: {
            from: 'courses',
            localField: '_id',
            foreignField: '_id',
            as: 'courseDetails'
          }
        },
        { $unwind: '$courseDetails' },
        { $project: { title: '$courseDetails.title', count: 1 } }
      ]);
    } catch (e) {}

    try {
      recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name createdAt');
    } catch (e) {}

    try {
      recentEnrollments = await Admission.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name').populate('course', 'title');
    } catch (e) {}

    try {
      recentPayments = await Payment.find({ status: 'completed' }).sort({ paidAt: -1 }).limit(5).populate('student', 'name');
    } catch (e) {}

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeCourses,
        totalRevenue,
        pendingFees
      },
      pipeline,
      monthlyRevenue,
      courseEnrollments,
      recentActivities: {
        students: recentStudents || [],
        enrollments: recentEnrollments || [],
        payments: recentPayments || []
      }
    });
  } catch (error) {
    console.error('[ADMIN STATS FATAL ERROR]', error);
    res.status(200).json({
      success: true,
      stats: { totalStudents: 0, activeCourses: 0, totalRevenue: 0, pendingFees: 0 },
      pipeline: { new: 0, contacted: 0, converted: 0, dropped: 0 },
      monthlyRevenue: [],
      courseEnrollments: [],
      recentActivities: { students: [], enrollments: [], payments: [] }
    });
  }
};
