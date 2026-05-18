const mongoose = require('mongoose');
const User = require('./models/User'); // Load User model first
const Course = require('./models/Course');
const Module = require('./models/Module');
const Subject = require('./models/Subject');

const dbUri = 'mongodb://localhost:27017/fic_lms';

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB. Scanning courses, modules, and topics...\n');

    const courses = await Course.find().populate('instructor', 'name email');
    console.log(`Found ${courses.length} courses total:\n`);

    for (const course of courses) {
      console.log(`Course Title: "${course.title}"`);
      console.log(`Course ID: ${course._id}`);
      console.log(`Instructor: ${course.instructor ? `${course.instructor.name} (${course.instructor.email})` : 'None'}`);
      
      const modules = await Module.find({ course: course._id });
      console.log(`Modules count: ${modules.length}`);
      for (const mod of modules) {
        console.log(`  - Module: "${mod.name}" (ID: ${mod._id})`);
        const subjects = await Subject.find({ module: mod._id });
        console.log(`    Topics (${subjects.length}):`);
        for (const sub of subjects) {
          console.log(`      * Topic: "${sub.title}" (ID: ${sub._id}) - Video: ${sub.videoUrl ? 'Yes' : 'No'}, PDF: ${sub.pdfUrl ? 'Yes' : 'No'}`);
        }
      }
      console.log('--------------------------------------------------\n');
    }

    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
