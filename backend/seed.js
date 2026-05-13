const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@fic.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'Student User',
    email: 'student@fic.com',
    password: 'student123',
    role: 'student'
  },
  {
    name: 'HR Manager',
    email: 'hr@fic.com',
    password: 'manager123',
    role: 'hr'
  },
  {
    name: 'Lead Trainer',
    email: 'trainer@fic.com',
    password: 'trainer123',
    role: 'trainer'
  }
];

const seedDB = async () => {
  try {
    const DB = process.env.MONGODB_URI || 'mongodb://localhost:27017/fic_lms';
    await mongoose.connect(DB);
    console.log('DB connection successful!');

    // Delete existing users to avoid duplicates
    await User.deleteMany({ email: { $in: users.map(u => u.email) } });

    // Create users (this will trigger the 'pre-save' hook for hashing)
    await User.create(users);

    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
