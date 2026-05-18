const Progress = require('../models/Progress');
const Course = require('../models/Course');
const Student = require('../models/Student');

exports.getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ 
      user: req.user.id, 
      course: req.params.courseId 
    });
    
    res.status(200).json({
      status: 'success',
      data: progress || { completedSubjects: [] }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.markComplete = async (req, res) => {
  try {
    const { courseId, subjectId } = req.body;
    
    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    
    if (!progress) {
      progress = await Progress.create({
        user: req.user.id,
        course: courseId,
        completedSubjects: [subjectId]
      });
    } else {
      if (!progress.completedSubjects.includes(subjectId)) {
        progress.completedSubjects.push(subjectId);
        progress.lastAccessed = Date.now();
        await progress.save();
      }
    }
    
    // Update overall progress percentage in Student model if needed
    const course = await Course.findById(courseId).populate('subjects');
    if (course && course.subjects) {
      const total = course.subjects.length;
      const completed = progress.completedSubjects.length;
      const percentage = Math.round((completed / total) * 100);
      
      const updateData = {
        'enrolledCourses.$.progress': percentage
      };
      
      if (percentage >= 100) {
        updateData['enrolledCourses.$.status'] = 'completed';
      }
      
      await Student.findOneAndUpdate(
        { user: req.user.id, 'enrolledCourses.course': courseId },
        { $set: updateData }
      );
    }
    
    res.status(200).json({
      status: 'success',
      data: progress
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
