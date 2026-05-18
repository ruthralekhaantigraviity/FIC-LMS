const Course = require('../models/Course');
const Subject = require('../models/Subject');

exports.getAllCourses = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const courses = await Course.find(filter).populate('instructor', 'name');
    res.status(200).json({ status: 'success', data: courses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Find all courses with matching case-insensitive title
    const matchingCourses = await Course.find({
      title: { $regex: new RegExp(`^${course.title.trim()}$`, 'i') }
    });
    const courseIds = matchingCourses.map(c => c._id);
    
    // Find all subjects belonging to any of these courses
    const subjects = await Subject.find({ course: { $in: courseIds } }).sort({ order: 1 });
    
    // Attach subjects dynamically
    const courseObj = course.toObject();
    courseObj.subjects = subjects;
    
    res.status(200).json({ status: 'success', data: courseObj });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create({
      ...req.body,
      instructor: req.body.instructor || req.user.id
    });
    res.status(201).json({ status: 'success', data: newCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: course });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
