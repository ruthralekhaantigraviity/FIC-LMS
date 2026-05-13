const Course = require('../models/Course');
const Subject = require('../models/Subject');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('instructor', 'name');
    res.status(200).json({ status: 'success', data: courses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name')
      .populate('subjects');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.status(200).json({ status: 'success', data: course });
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
