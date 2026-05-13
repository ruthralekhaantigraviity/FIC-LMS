const Admission = require('../models/Admission');
const Student = require('../models/Student');
const User = require('../models/User');
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

    if (status === 'approved') {
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

    res.status(200).json({ status: 'success', data: admission });
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
    const admissions = await Admission.find({ 
      student: req.user.id, 
      status: 'approved' 
    }).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'name' }
    });
    
    const courses = admissions.map(adm => ({
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
    }));

    res.status(200).json({ status: 'success', data: courses });
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
      password,
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
