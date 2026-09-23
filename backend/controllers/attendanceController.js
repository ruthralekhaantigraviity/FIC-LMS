const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, attendanceData, date } = req.body;
    
    const attendanceRecords = await Promise.all(
      attendanceData.map(async (record) => {
        return Attendance.findOneAndUpdate(
          { course: courseId, student: record.studentId, date: new Date(date).setHours(0,0,0,0) },
          { 
            status: record.status, 
            markedBy: req.user.id,
            remarks: record.remarks 
          },
          { upsert: true, new: true }
        );
      })
    );

    res.status(200).json({ status: 'success', data: attendanceRecords });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId, date } = req.query;
    const query = { course: courseId };
    
    if (date) {
      query.date = new Date(date).setHours(0,0,0,0);
    }

    const records = await Attendance.find(query).populate('student', 'name email');
    res.status(200).json({ status: 'success', data: records });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getStudentAttendanceStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const records = await Attendance.find({ course: courseId, student: studentId });
    
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    res.status(200).json({ 
      status: 'success', 
      data: { total, present, percentage, records } 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
