const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fic_lms');
    console.log('MongoDB Connected for seeding...');

    const adminEmail = 'admin@fic.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists. Updating password to "admin123"...');
      existingAdmin.password = 'admin123';
      await existingAdmin.save();
      console.log('Admin updated successfully.');
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'FIC Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin created successfully.');
    }

    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();
