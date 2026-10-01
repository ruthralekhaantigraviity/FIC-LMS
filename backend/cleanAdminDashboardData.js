const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const User = require('./models/User');

async function cleanAdminDummyData() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  const db = mongoose.connection.db;

  // Clear dummy operational collections shown in admin dashboard
  await db.collection('admissions').deleteMany({});
  await db.collection('students').deleteMany({});
  await db.collection('enquiries').deleteMany({});
  await db.collection('notifications').deleteMany({});
  await db.collection('skillexchanges').deleteMany({});
  await db.collection('skillassessments').deleteMany({});
  await db.collection('exchangesessions').deleteMany({});
  await db.collection('userskills').deleteMany({});
  await db.collection('skillfeedbacks').deleteMany({});
  
  // Clean dummy users
  const dummyUserEmails = ['alex@lms.com', 'sarah@lms.com', 'david@lms.com', 'emma@lms.com', 'usera@test.com', 'userb@test.com', 'studenta@test.com', 'studentb@test.com'];
  await User.deleteMany({ email: { $in: dummyUserEmails } });

  console.log('SUCCESS: Cleaned dummy operational data from Admin Dashboards.');
  process.exit(0);
}

cleanAdminDummyData().catch(err => {
  console.error(err);
  process.exit(1);
});
