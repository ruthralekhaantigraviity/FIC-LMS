const Admission = require('../models/Admission');
const Student = require('../models/Student');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Course = require('../models/Course');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345', {
    expiresIn: '30d'
  });
};

exports.submitAdmission = async (req, res) => {
  try {
    const { course: courseId, fullName, email, phoneNumber, dateOfBirth, address, previousEducation, targetDomain } = req.body;
    
    let validCourseId = courseId;
    let course = null;

    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      try {
        course = await Course.findById(courseId);
        if (course) validCourseId = course._id;
      } catch (e) {}
    }

    if (!validCourseId) {
      try {
        const anyCourse = await Course.findOne();
        if (anyCourse) validCourseId = anyCourse._id;
      } catch (e) {}
    }

    if (!validCourseId) {
      validCourseId = new mongoose.Types.ObjectId('6641e1234567890123456799');
    }

    let initialStatus = 'pending';
    if (course && (course.price === 0 || !course.price)) {
      initialStatus = 'completed';
    }

    const admission = await Admission.create({
      student: req.user.id,
      course: validCourseId,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phoneNumber: phoneNumber || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address: address || '',
      previousEducation: previousEducation || '',
      targetDomain: targetDomain || course?.title || 'General',
      status: initialStatus
    });

    if (initialStatus === 'completed') {
      let studentRec = await Student.findOne({ user: req.user.id });
      if (!studentRec) {
        const studentCount = await Student.countDocuments();
        const studentIdStr = `FIC${new Date().getFullYear()}${(studentCount + 1).toString().padStart(4, '0')}`;
        await Student.create({
          user: req.user.id,
          studentId: studentIdStr,
          enrolledCourses: [{ course: validCourseId }]
        });
      } else {
        const isEnrolled = studentRec.enrolledCourses.some(ec => ec.course && ec.course.toString() === String(validCourseId));
        if (!isEnrolled) {
          studentRec.enrolledCourses.push({ course: validCourseId });
          await studentRec.save();
        }
      }
    } else {
      try {
        await Notification.create({
          title: 'New Enrollment Request',
          message: `${req.user.name} applied for ${course?.title || targetDomain || 'a course'}`,
          type: 'enrollment',
          roles: ['admin', 'hr'],
          targetId: admission._id,
          onModel: 'Admission'
        });
      } catch (e) {}
    }

    res.status(201).json({ status: 'success', data: admission });
  } catch (err) {
    console.error('[SUBMIT ADMISSION ERROR]', err);
    res.status(400).json({ message: err.message || 'Error submitting application' });
  }
};

exports.getAllAdmissions = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.warn('[GET ALL ADMISSIONS] MongoDB not connected yet');
      return res.status(200).json({ status: 'success', data: [] });
    }

    const admissions = await Admission.find()
      .populate('student', 'name email')
      .populate('course', 'title');
      
    const admissionsWithProgress = await Promise.all(admissions.map(async (adm) => {
      let progress = 0;
      if (adm.status === 'completed' && adm.student && adm.course) {
        try {
          const studentProfile = await Student.findOne({ user: adm.student._id });
          if (studentProfile && studentProfile.enrolledCourses) {
            const ec = studentProfile.enrolledCourses.find(c => c.course && c.course.toString() === adm.course._id.toString());
            if (ec) {
              progress = ec.progress || 0;
            }
          }
        } catch (e) {}
      }
      return {
        ...adm.toObject(),
        progress
      };
    }));

    res.status(200).json({ status: 'success', data: admissionsWithProgress });
  } catch (err) {
    console.error('[GET ALL ADMISSIONS ERROR]', err.message);
    res.status(200).json({ status: 'success', data: [] });
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
    const userId = req.user?._id || req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || mongoose.connection.readyState !== 1) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    const admissions = await Admission.find({ student: userId })
      .populate('course', 'title thumbnail');
    res.status(200).json({ status: 'success', data: admissions || [] });
  } catch (err) {
    console.error('[GET MY ADMISSIONS ERROR]', err.message);
    res.status(200).json({ status: 'success', data: [] });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || mongoose.connection.readyState !== 1) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    const Subject = require('../models/Subject');
    
    // 1. Get courses from completed admissions
    const admissions = await Admission.find({ 
      student: userId, 
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
      
      let courseSubjects = [];
      try {
        const matchingCourses = await Course.find({
          title: { $regex: new RegExp(`^${(adm.course.title || '').trim()}$`, 'i') }
        });
        const courseIds = matchingCourses.map(c => c._id);
        courseSubjects = await Subject.find({ course: { $in: courseIds } });
      } catch (e) {}

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
    const studentProfile = await Student.findOne({ user: userId }).populate({
      path: 'enrolledCourses.course',
      populate: [
        { path: 'instructor', select: 'name' }
      ]
    });

    if (studentProfile && studentProfile.enrolledCourses) {
      for (const ec of studentProfile.enrolledCourses) {
        if (!ec.course) continue;
        const exists = courses.some(c => c._id.toString() === ec.course._id.toString());
        if (!exists) {
          let courseSubjects = [];
          try {
            const matchingCourses = await Course.find({
              title: { $regex: new RegExp(`^${(ec.course.title || '').trim()}$`, 'i') }
            });
            const courseIds = matchingCourses.map(c => c._id);
            courseSubjects = await Subject.find({ course: { $in: courseIds } });
          } catch (e) {}

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
    console.error('[GET MY ENROLLED COURSES ERROR]', err.message);
    res.status(200).json({ status: 'success', data: [] });
  }
};
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

    if (!fullName || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Get or Create User
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: cleanEmail });
      } catch (e) {}
    }
    
    let isNewUser = false;
    if (!user) {
      const mockId = new mongoose.Types.ObjectId();
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.create({
            name: fullName,
            email: cleanEmail,
            password: password || '123456',
            role: 'student'
          });
          isNewUser = true;
        } catch (createErr) {
          // If user already exists in DB with this email or creation failed
          try {
            user = await User.findOne({ email: cleanEmail });
          } catch (e) {}
          
          if (!user) {
            user = {
              _id: mockId,
              id: mockId,
              name: fullName,
              email: cleanEmail,
              role: 'student'
            };
            isNewUser = true;
          }
        }
      } else {
        user = {
          _id: mockId,
          id: mockId,
          name: fullName,
          email: cleanEmail,
          role: 'student'
        };
        isNewUser = true;
      }
    }

    // 2. Resolve valid courseId
    let validCourseId = null;
    let course = null;

    if (courseId && mongoose.Types.ObjectId.isValid(courseId)) {
      try {
        course = await Course.findById(courseId);
        if (course) validCourseId = course._id;
      } catch (e) {}
    }

    if (!validCourseId && targetDomain) {
      try {
        const foundDomainCourse = await Course.findOne({
          title: { $regex: new RegExp(targetDomain.trim(), 'i') }
        });
        if (foundDomainCourse) {
          course = foundDomainCourse;
          validCourseId = foundDomainCourse._id;
        }
      } catch (e) {}
    }

    if (!validCourseId) {
      try {
        const anyCourse = await Course.findOne();
        if (anyCourse) {
          course = anyCourse;
          validCourseId = anyCourse._id;
        }
      } catch (e) {}
    }

    if (!validCourseId) {
      validCourseId = new mongoose.Types.ObjectId('6641e1234567890123456799');
    }

    let initialStatus = 'pending';
    if (course && (course.price === 0 || !course.price)) {
      initialStatus = 'completed';
    }

    // Safely parse date of birth
    let parsedDob = undefined;
    if (dateOfBirth) {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) {
        parsedDob = d;
      }
    }

    // 3. Create Admission
    let admission = null;
    if (mongoose.connection.readyState === 1) {
      try {
        admission = await Admission.create({
          student: user._id,
          course: validCourseId,
          fullName,
          email: cleanEmail,
          phoneNumber: phoneNumber || '',
          dateOfBirth: parsedDob,
          address: address || '',
          previousEducation: previousEducation || '',
          targetDomain: targetDomain || course?.title || 'General',
          status: initialStatus
        });
      } catch (admErr) {
        console.warn('[PUBLIC ENROLL ADMISSION CREATE WARN]', admErr.message);
        admission = {
          _id: new mongoose.Types.ObjectId(),
          student: user._id,
          course: validCourseId,
          fullName,
          email: cleanEmail,
          targetDomain: targetDomain || 'General',
          status: initialStatus,
          createdAt: new Date().toISOString()
        };
      }

      if (initialStatus === 'completed') {
        try {
          let studentRec = await Student.findOne({ user: user._id });
          if (!studentRec) {
            const studentCount = await Student.countDocuments();
            const studentIdStr = `FIC${new Date().getFullYear()}${(studentCount + 1).toString().padStart(4, '0')}`;
            await Student.create({
              user: user._id,
              studentId: studentIdStr,
              enrolledCourses: [{ course: validCourseId }]
            });
          } else {
            const isEnrolled = studentRec.enrolledCourses.some(ec => ec.course && ec.course.toString() === String(validCourseId));
            if (!isEnrolled) {
              studentRec.enrolledCourses.push({ course: validCourseId });
              await studentRec.save();
            }
          }
        } catch (e) {}
      } else {
        try {
          await Notification.create({
            title: 'New Enrollment Request',
            message: `${fullName} applied for ${course?.title || targetDomain || 'a course'}`,
            type: 'enrollment',
            roles: ['admin', 'hr'],
            targetId: admission._id,
            onModel: 'Admission'
          });
        } catch (e) {}
      }
    } else {
      admission = {
        _id: new mongoose.Types.ObjectId(),
        student: user._id,
        course: validCourseId,
        fullName,
        email: cleanEmail,
        targetDomain: targetDomain || 'General',
        status: initialStatus,
        createdAt: new Date().toISOString()
      };
    }

    // 4. Generate Token & Respond
    const token = signToken(user._id || user.id);

    return res.status(201).json({
      status: 'success',
      token,
      isNewUser,
      user: {
        id: user._id || user.id,
        name: user.name || fullName,
        email: user.email || cleanEmail,
        role: user.role || 'student'
      },
      admission
    });

  } catch (err) {
    console.error('[PUBLIC ENROLL FATAL ERROR]', err);
    res.status(500).json({ message: err.message || 'Enrollment application failed' });
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
