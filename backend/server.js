const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('FIC Learning Management System API is running...');
});

// Port
const PORT = process.env.PORT || 5000;

// Database Connection
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fic_lms')
  .then(async () => {
    console.log('MongoDB Connected successfully');
    
    // Auto-create Admin if it doesn't exist
    try {
      const adminEmail = 'admin@fic.com';
      const adminUser = await User.findOne({ email: adminEmail });
      
      if (!adminUser) {
        console.log('No admin user found. Creating default admin...');
        await User.create({
          name: 'FIC Admin',
          email: adminEmail,
          password: 'admin123',
          role: 'admin'
        });
        console.log(`Default admin created: ${adminEmail} / admin123`);
      } else if (adminUser.role !== 'admin') {
        await User.updateOne({ email: adminEmail }, { role: 'admin' });
      }

      // Ensure HR User
      const hrEmail = 'hr@fic.com';
      const hrUser = await User.findOne({ email: hrEmail });
      if (!hrUser) {
        await User.create({
          name: 'FIC HR Manager',
          email: hrEmail,
          password: 'hr123',
          role: 'hr'
        });
        console.log(`Default HR created: ${hrEmail} / hr123`);
      } else if (hrUser.role !== 'hr') {
        await User.updateOne({ email: hrEmail }, { role: 'hr' });
      }

      // Ensure Trainer User
      const trainerEmail = 'trainer@fic.com';
      const trainerUser = await User.findOne({ email: trainerEmail });
      if (!trainerUser) {
        await User.create({
          name: 'FIC Senior Trainer',
          email: trainerEmail,
          password: 'trainer123',
          role: 'trainer'
        });
        console.log(`Default Trainer created: ${trainerEmail} / trainer123`);
      } else if (trainerUser.role !== 'trainer') {
        await User.updateOne({ email: trainerEmail }, { role: 'trainer' });
      }

      // Ensure Student User
      const studentEmail = 'student@fic.com';
      const studentUser = await User.findOne({ email: studentEmail });
      if (!studentUser) {
        await User.create({
          name: 'FIC Student',
          email: studentEmail,
          password: 'student123',
          role: 'student'
        });
        console.log(`Default Student created: ${studentEmail} / student123`);
      } else if (studentUser.role !== 'student') {
        await User.updateOne({ email: studentEmail }, { role: 'student' });
      }
    } catch (err) {
      console.error('Error ensuring default accounts:', err);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
