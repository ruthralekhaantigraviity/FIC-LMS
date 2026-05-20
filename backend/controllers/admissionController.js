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
      
    const admissionsWithProgress = await Promise.all(admissions.map(async (adm) => {
      let progress = 0;
      if (adm.status === 'completed' && adm.student && adm.course) {
        const studentProfile = await Student.findOne({ user: adm.student._id });
        if (studentProfile && studentProfile.enrolledCourses) {
          const ec = studentProfile.enrolledCourses.find(c => c.course && c.course.toString() === adm.course._id.toString());
          if (ec) {
            progress = ec.progress || 0;
          }
        }
      }
      return {
        ...adm.toObject(),
        progress
      };
    }));

    res.status(200).json({ status: 'success', data: admissionsWithProgress });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAdmissionStatus = async (req, res) => {
  try {
    const { status, reviewNotes, feesDetails } = req.body;
    const admission = await Admission.findByIdAndUpdate(
      req.params.id, 
      { status, reviewNotes, feesDetails, reviewedBy: req.user.id },
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
    const Subject = require('../models/Subject');
    
    // 1. Get courses from completed admissions
    const admissions = await Admission.find({ 
      student: req.user.id, 
      status: 'completed' 
    }).populate({
      path: 'course',
      populate: [
        { path: 'instructor', select: 'name' }
      ]
    });
    
    let courses = [];
    for (const adm of admissions) {
      if (!adm.course) continue;
      
      // Find matching courses case-insensitively
      const matchingCourses = await Course.find({
        title: { $regex: new RegExp(`^${adm.course.title.trim()}$`, 'i') }
      });
      const courseIds = matchingCourses.map(c => c._id);
      const courseSubjects = await Subject.find({ course: { $in: courseIds } });
      
      courses.push({
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
        hasVideos: courseSubjects.some(s => s.videoUrl && s.videoUrl.trim() !== ""),
        hasPdfs: courseSubjects.some(s => (s.pdfUrl && s.pdfUrl.trim() !== "") || (s.resources && s.resources.length > 0)),
      });
    }

    // 2. Check Student profile for manual assignments not in Admission model
    const studentProfile = await Student.findOne({ user: req.user.id }).populate({
      path: 'enrolledCourses.course',
      populate: [
        { path: 'instructor', select: 'name' }
      ]
    });

    if (studentProfile && studentProfile.enrolledCourses) {
      for (const ec of studentProfile.enrolledCourses) {
        if (!ec.course) continue;
        // Check if already in the list from admissions
        const exists = courses.some(c => c._id.toString() === ec.course._id.toString());
        if (!exists) {
          // Find matching courses case-insensitively
          const matchingCourses = await Course.find({
            title: { $regex: new RegExp(`^${ec.course.title.trim()}$`, 'i') }
          });
          const courseIds = matchingCourses.map(c => c._id);
          const courseSubjects = await Subject.find({ course: { $in: courseIds } });
          
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
            hasVideos: courseSubjects.some(s => s.videoUrl && s.videoUrl.trim() !== ""),
            hasPdfs: courseSubjects.some(s => (s.pdfUrl && s.pdfUrl.trim() !== "") || (s.resources && s.resources.length > 0)),
          });
        }
      }
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

    // 2. Update existing pending Admission record or create a new "completed" one
    // Fetch user details first to satisfy required fields in Admission model
    const user = await User.findById(studentId);
    
    const existingPending = await Admission.findOne({ student: studentId, status: 'pending' });
    
    if (existingPending) {
      existingPending.status = 'completed';
      existingPending.course = courseId;
      existingPending.reviewedBy = req.user.id;
      existingPending.fullName = existingPending.fullName || user?.name || 'Assigned Student';
      existingPending.email = existingPending.email || user?.email || 'assigned@example.com';
      await existingPending.save();

      // Update any other duplicate pending admissions for this student to avoid stuck UI
      await Admission.updateMany(
        { student: studentId, status: 'pending' },
        { status: 'completed', course: courseId, reviewedBy: req.user.id }
      );
    } else {
      await Admission.create({
        student: studentId,
        course: courseId,
        fullName: user?.name || 'Assigned Student',
        email: user?.email || 'assigned@example.com',
        status: 'completed',
        reviewedBy: req.user.id,
        appliedAt: new Date()
      });
    }

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

    // 1. Get or Create User
    let user = await User.findOne({ email });
    let isNewUser = false;
    if (!user) {
      user = await User.create({
        name: fullName,
        email,
        password: password || '123456', // Default password since it's removed from UI
        role: 'student'
      });
      isNewUser = true;
    }

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

    // Notify Admin and HR
    const course = await Course.findById(courseId);
    await Notification.create({
      title: 'New Enrollment Request',
      message: `${fullName} applied for ${course?.title || 'a course'}`,
      type: 'enrollment',
      roles: ['admin', 'hr'],
      targetId: admission._id,
      onModel: 'Admission'
    });

    // 3. Generate Token
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      isNewUser,
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

exports.getCompletedCourses = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('user', 'name email')
      .populate('enrolledCourses.course', 'title');
    
    const completions = [];
    students.forEach(student => {
      if (student.enrolledCourses) {
        student.enrolledCourses.forEach(ec => {
          if (ec.progress >= 100 || ec.status === 'completed') {
            completions.push({
              id: `${student._id}_${ec.course?._id}`,
              studentId: student._id,
              studentName: student.user?.name || 'Unknown Student',
              email: student.user?.email || 'N/A',
              courseId: ec.course?._id,
              course: ec.course?.title || 'Unknown Course',
              completionDate: ec.certificateDate ? new Date(ec.certificateDate).toLocaleDateString() : new Date(ec.enrollmentDate || Date.now()).toLocaleDateString(),
              status: ec.certificateIssued ? 'Issued' : 'Pending'
            });
          }
        });
      }
    });
    
    res.status(200).json({ status: 'success', data: completions });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.issueCertificate = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }
    
    let courseFound = false;
    if (student.enrolledCourses) {
      student.enrolledCourses.forEach(ec => {
        if (ec.course && ec.course.toString() === courseId) {
          ec.certificateIssued = true;
          ec.certificateDate = Date.now();
          courseFound = true;
        }
      });
    }
    
    if (!courseFound) {
      return res.status(404).json({ message: 'Enrollment for this course not found on student profile.' });
    }
    
    await student.save();
    
    res.status(200).json({ status: 'success', message: 'Certificate issued successfully!' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!admission) {
      return res.status(404).json({ message: 'No enrollment found with that ID' });
    }
    
    // Sync Student profile course enrollment if status is completed
    if (admission.status === 'completed') {
      const student = await Student.findOne({ user: admission.student });
      if (student) {
        const hasCourse = student.enrolledCourses.some(ec => ec.course && ec.course.toString() === admission.course.toString());
        if (!hasCourse) {
          student.enrolledCourses.push({ course: admission.course });
          await student.save();
        }
      }
    }
    
    res.status(200).json({ status: 'success', data: admission });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
