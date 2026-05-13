const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const reseedAdmin = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        console.error('MONGODB_URI is not defined in .env');
        process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected successfully.');

    const adminEmail = 'admin@fic.com';
    
    // Delete existing admin to be sure
    console.log(`Deleting existing user with email: ${adminEmail}...`);
    await User.deleteMany({ email: adminEmail });

    console.log('Creating fresh admin user...');
    const admin = await User.create({
      name: 'FIC Admin',
      email: adminEmail,
      password: 'admin123',
      role: 'admin'
    });

    console.log('-----------------------------------');
    console.log('ADMIN CREATED SUCCESSFULLY');
    console.log(`Email: ${admin.email}`);
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('-----------------------------------');

    process.exit(0);
  } catch (err) {
    console.error('Error reseeding admin:', err);
    process.exit(1);
  }
};

reseedAdmin();
