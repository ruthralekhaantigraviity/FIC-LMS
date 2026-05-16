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
  max: 100, // Limit each IP to 100 requests per windowMs
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

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/notifications', notificationRoutes);

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
        console.log('Admin user exists but role is not admin. Updating role...');
        adminUser.role = 'admin';
        await adminUser.save();
        console.log('Admin role updated successfully.');
      }
    } catch (err) {
      console.error('Error ensuring default admin:', err);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
