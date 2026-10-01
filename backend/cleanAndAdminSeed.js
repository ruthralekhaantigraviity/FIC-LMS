const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const User = require('./models/User');

async function seedFreshAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  
  const testEmails = [
    'usera@test.com', 'userb@test.com', 'studenta@test.com', 'studentb@test.com', 'studentc@test.com',
    'regression_student@lms.com', 'regression_partner@lms.com', 'hr@gmail.com'
  ];
  
  await User.deleteMany({ email: { $in: testEmails } });
  console.log('Removed test dummy users');

  let admin = await User.findOne({ email: 'admin@lms.com' });
  if (!admin) {
    admin = new User({
      name: 'System Admin',
      email: 'admin@lms.com',
      password: 'AdminPassword123!',
      role: 'admin',
      isVerified: true
    });
  } else {
    admin.name = 'System Admin';
    admin.password = 'AdminPassword123!';
    admin.role = 'admin';
  }
  await admin.save();
  console.log('SUCCESS: admin@lms.com / AdminPassword123!');

  process.exit(0);
}

seedFreshAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
