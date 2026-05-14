const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const Course = require('../backend/models/Course');

async function checkCourses() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses:`);
    courses.forEach(c => {
      console.log(`- ${c.title} (Published: ${c.isPublished})`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkCourses();
