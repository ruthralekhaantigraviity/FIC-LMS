const Admission = require('../models/Admission');
const Student = require('../models/Student');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345', {
    expiresIn: '30d'
  });
};

exports.submitAdmission = async (req, res) => {
  try {
    const admission = await Admission.create({
      ...req.body,
      student: req.user.id
    });

    // Notify Admin and HR
    const course = await Course.findById(req.body.course);
    await Notification.create({
      title: 'New Enrollment Request',
      message: `${req.user.name} applied for ${course?.title || 'a course'}`,
      type: 'enrollment',
      roles: ['admin', 'hr'],
      targetId: admission._id,
      onModel: 'Admission'
    });

    res.status(201).json({ status: 'success', data: admission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find()
      .populate('student', 'name email')
      .populate('course', 'title');
    res.status(200).json({ status: 'success', data: admissions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id, 
      { status, reviewNotes, reviewedBy: req.user.id },
      { new: true }
    );

    if (status === 'completed') {
      // Create student profile if it doesn't exist
      let student = await Student.findOne({ user: admission.student });
      
      if (!student) {
        // Generate a student ID
        const studentCount = await Student.countDocuments();
        const studentId = `FIC${new Date().getFullYear()}${(studentCount + 1).toString().padStart(4, '0')}`;
        
        student = await Student.create({
          user: admission.student,
          studentId,
          enrolledCourses: [{ course: admission.course }]
        });
      } else {
        // Add course to existing student profile
        student.enrolledCourses.push({ course: admission.course });
        await student.save();
      }
    }

    // Notify Student
    const course = await Course.findById(admission.course);
    await Notification.create({
      title: 'Application Status Updated',
      message: `Your application for ${course?.title} has been ${status}`,
      type: 'enrollment',
      roles: ['student'],
      targetId: admission._id,
      onModel: 'Admission',
      readBy: [] // Ensure it's not marked as read by the admin who updated it
    });

    res.status(200).json({ status: 'success', data: admission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndDelete(req.params.id);
    if (!admission) {
      return res.status(404).json({ message: 'No admission found with that ID' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find({ student: req.user.id })
      .populate('course', 'title thumbnail');
    res.status(200).json({ status: 'success', data: admissions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    // 1. Get courses from completed admissions
    const admissions = await Admission.find({ 
      student: req.user.id, 
      status: 'completed' 
    }).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name' }
    });
    
    let courses = admissions.map(adm => {
      if (!adm.course) return null;
      return {
        _id: adm.course._id,
        title: adm.course.title,
        description: adm.course.description,
        category: adm.course.category,
        thumbnail: adm.course.thumbnail,
        instructor: adm.course.instructor,
        level: adm.course.level,
        duration: adm.course.duration,
        totalLessons: adm.course.totalLessons,
        enrolledAt: adm.appliedAt,
      };
    }).filter(c => c !== null);

    // 2. Check Student profile for manual assignments not in Admission model
    const studentProfile = await Student.findOne({ user: req.user.id }).populate({
      path: 'enrolledCourses.course',
      populate: { path: 'instructor', select: 'name' }
    });

    if (studentProfile && studentProfile.enrolledCourses) {
      studentProfile.enrolledCourses.forEach(ec => {
        if (!ec.course) return;
        // Check if already in the list from admissions
        const exists = courses.some(c => c._id.toString() === ec.course._id.toString());
        if (!exists) {
          courses.push({
            _id: ec.course._id,
            title: ec.course.title,
            description: ec.course.description,
            category: ec.course.category,
            thumbnail: ec.course.thumbnail,
            instructor: ec.course.instructor,
            level: ec.course.level,
            duration: ec.course.duration,
            totalLessons: ec.course.totalLessons,
            enrolledAt: ec.enrollmentDate,
          });
        }
      });
    }

    res.status(200).json({ status: 'success', data: courses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.assignCourse = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    // 1. Create or Update Student Profile
    let student = await Student.findOne({ user: studentId });
    if (!student) {
      const studentCount = await Student.countDocuments();
      const studentIdStr = `FIC${new Date().getFullYear()}${(studentCount + 1).toString().padStart(4, '0')}`;
      student = await Student.create({
        user: studentId,
        studentId: studentIdStr,
        enrolledCourses: [{ course: courseId }]
      });
    } else {
      const isEnrolled = student.enrolledCourses.some(ec => ec.course && ec.course.toString() === courseId);
      if (!isEnrolled) {
        student.enrolledCourses.push({ course: courseId });
        await student.save();
      }
    }

    // 2. Create a "completed" Admission record
    // Fetch user details first to satisfy required fields in Admission model
    const user = await User.findById(studentId);
    
    await Admission.create({
      student: studentId,
      course: courseId,
      fullName: user?.name || 'Assigned Student',
      email: user?.email || 'assigned@example.com',
      status: 'completed',
      reviewedBy: req.user.id,
      appliedAt: new Date()
    });

    res.status(201).json({ status: 'success', data: student });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.publicEnroll = async (req, res) => {
  try {
    const { 
      fullName, email, password, phoneNumber, 
      dateOfBirth, address, previousEducation, 
      targetDomain, courseId 
    } = req.body;

    // 1. Create User
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: fullName,
      email,
      password: password || '123456', // Default password since it's removed from UI
      role: 'student'
    });

    // 2. Create Admission
    const admission = await Admission.create({
      student: user._id,
      course: courseId,
      fullName,
      email,
      phoneNumber,
      dateOfBirth,
      address,
      previousEducation,
      targetDomain,
      status: 'pending'
    });

    // 3. Generate Token
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      admission
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
