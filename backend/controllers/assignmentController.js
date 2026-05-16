const Assignment = require('../models/Assignment');

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, courseId, course, dueDate } = req.body;
    const assignment = await Assignment.create({
      title,
      description,
      course: courseId || course,
      trainer: req.user.id,
      dueDate
    });

    res.status(201).json({ status: 'success', data: assignment });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId })
      .populate('trainer', 'name');
    res.status(200).json({ status: 'success', data: assignments });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if student already submitted
    const existingSubmission = assignment.submissions.find(
      s => s.student.toString() === req.user.id
    );

    if (existingSubmission) {
      existingSubmission.fileUrl = fileUrl;
      existingSubmission.submittedAt = Date.now();
    } else {
      assignment.submissions.push({
        student: req.user.id,
        fileUrl
      });
    }

    await assignment.save();
    res.status(200).json({ status: 'success', message: 'Assignment submitted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('course', 'title')
      .populate('trainer', 'name');
    res.status(200).json({ status: 'success', data: assignments });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
