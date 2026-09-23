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

// Enable CORS with full preflight support and dynamic origin reflection for all origins
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
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
const progressRoutes = require('./routes/progressRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check / Basic Route
app.get('/', (req, res) => {
  res.send('FIC Learning Management System API is running...');
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Global Error Handler to guarantee JSON & CORS headers on any error
app.use((err, req, res, next) => {
  console.error('[SERVER GLOBAL ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Port & Server Start (Listen immediately to pass Render health checks)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Disable buffering globally to fail fast instead of hanging requests for 10s
mongoose.set('bufferCommands', false);

// Database Connection in Background
const User = require('./models/User');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fic_lms';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log('MongoDB Connected successfully');
  } catch (err) {
    console.error('Primary MongoDB connection error:', err.message);
    if (!isProduction && process.env.MONGODB_URI && uri !== 'mongodb://localhost:27017/fic_lms') {
      console.log('Attempting fallback to local MongoDB (development only)...');
      try {
        await mongoose.connect('mongodb://localhost:27017/fic_lms', {
          serverSelectionTimeoutMS: 2000,
          bufferCommands: false
        });
        console.log('Fallback MongoDB Connected successfully');
      } catch (fallbackErr) {
        console.error('Fallback database connection error:', fallbackErr.message);
      }
    }
  }

  // Auto-create default accounts
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
};

connectDB();
