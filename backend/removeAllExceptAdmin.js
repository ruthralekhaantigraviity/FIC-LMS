const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const User = require('./models/User');

async function removeAllUsersExceptAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  
  // Delete all users whose role is not admin
  const result = await User.deleteMany({ role: { $ne: 'admin' } });
  console.log(`Successfully removed ${result.deletedCount} non-admin users.`);

  // Ensure Admin Accounts are present and intact
  let admin1 = await User.findOne({ email: 'admin@fic.com' });
  if (!admin1) {
    admin1 = new User({ name: 'System Admin', email: 'admin@fic.com', password: 'admin123', role: 'admin', isApproved: true });
  } else {
    admin1.password = 'admin123';
    admin1.role = 'admin';
    admin1.isApproved = true;
  }
  await admin1.save();

  let admin2 = await User.findOne({ email: 'admin@lms.com' });
  if (!admin2) {
    admin2 = new User({ name: 'LMS Admin', email: 'admin@lms.com', password: 'admin123', role: 'admin', isApproved: true });
  } else {
    admin2.password = 'admin123';
    admin2.role = 'admin';
    admin2.isApproved = true;
  }
  await admin2.save();

  const remainingAdmins = await User.find({});
  console.log('Remaining Users in DB:');
  remainingAdmins.forEach(u => console.log(` - ${u.name} (${u.email}) [Role: ${u.role}]`));

  process.exit(0);
}

removeAllUsersExceptAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
