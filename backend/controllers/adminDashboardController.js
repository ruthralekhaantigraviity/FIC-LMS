const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Enquiry = require('../models/Enquiry');
const Admission = require('../models/Admission');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeCourses = await Course.countDocuments({ isPublished: true });
    
    const revenueStats = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    const pendingFeesStats = await Payment.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingFees = pendingFeesStats.length > 0 ? pendingFeesStats[0].total : 0;

    // Enquiry Pipeline
    const enquiryStats = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const pipeline = {
      new: 0,
      contacted: 0,
      converted: 0,
      dropped: 0
    };
    
    enquiryStats.forEach(stat => {
      if (pipeline.hasOwnProperty(stat._id)) {
        pipeline[stat._id] = stat.count;
      }
    });

    // Monthly Revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Payment.aggregate([
      { $match: { status: 'completed', paidAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Course-wise Enrollment
    const courseEnrollments = await Admission.aggregate([
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

    // Recent Activities
    const recentStudents = await User.find({ role: 'student' }).sort({ createdAt: -1 }).limit(5).select('name createdAt');
    const recentEnrollments = await Admission.find().sort({ createdAt: -1 }).limit(5).populate('student', 'name').populate('course', 'title');
    const recentPayments = await Payment.find({ status: 'completed' }).sort({ paidAt: -1 }).limit(5).populate('student', 'name');

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
        students: recentStudents,
        enrollments: recentEnrollments,
        payments: recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
