const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'trainer', 'student'],
    default: 'student'
  },
  profileImage: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1622543210/sample.jpg'
  },
  phoneNumber: String,
  isActive: {
    type: Boolean,
    default: true
  },
  courseDomain: {
    type: String,
    enum: ['MERN Stack', 'Python & Data Science', 'UI/UX Design', 'Digital Marketing', 'Cyber Security', 'Cloud Computing', 'Mobile App Development', 'Java Full Stack', 'Other'],
    default: 'Other'
  },
  studentStatus: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);
    if (isMatch) return true;
  } catch (err) {
    // If bcrypt compare fails or throws, fall back to plain text check
  }
  return candidatePassword === userPassword;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
