const Subject = require('../models/Subject');
const Course = require('../models/Course');

exports.createSubject = async (req, res) => {
  try {
    const newSubject = await Subject.create(req.body);
    
    // Add subject to course
    await Course.findByIdAndUpdate(req.body.course, {
      $push: { subjects: newSubject._id }
    });

    res.status(201).json({ status: 'success', data: newSubject });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({ status: 'success', data: subject });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    // Remove from course
    await Course.findByIdAndUpdate(subject.course, {
      $pull: { subjects: subject._id }
    });

    await Subject.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSubjectsByCourse = async (req, res) => {
  try {
    const filter = req.query.module ? { module: req.query.module } : { course: req.params.courseId };
    const subjects = await Subject.find(filter)
      .sort({ order: 1 });
    res.status(200).json({ status: 'success', data: subjects });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTrainerCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('subjects');
    res.status(200).json({ status: 'success', data: courses });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

