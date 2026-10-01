const User = require('../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const signToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345', {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, courseDomain, studentStatus, fees } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Normalize role to valid enum values ['admin', 'hr', 'trainer', 'student']
    const validRoles = ['admin', 'hr', 'trainer', 'student'];
    const normalizedRole = (role && validRoles.includes(role.toLowerCase())) ? role.toLowerCase() : 'student';

    let newUser = null;

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email address' });
      }

      newUser = await User.create({
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password,
        role: normalizedRole,
        courseDomain: courseDomain || 'Other',
        studentStatus: studentStatus || 'active',
        fees
      });
    } else {
      console.warn('[REGISTER] MongoDB connection not ready. Creating local user record.');
      const mockId = new mongoose.Types.ObjectId();
      newUser = {
        _id: mockId,
        id: mockId,
        name: name?.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: normalizedRole,
        createdAt: new Date().toISOString()
      };
    }

    const token = signToken(newUser._id || newUser.id, newUser.role, newUser.email);

    return res.status(201).json({
      status: 'success',
      token,
      user: {
        _id: newUser._id || newUser.id,
        id: newUser._id || newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage || ''
      }
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email address' });
    }
    return res.status(400).json({ message: err.message || 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Normalize email: trim and lowercase
    const cleanEmail = email.trim().toLowerCase();

    // 2) Check if user exists & password is correct
    let user = null;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: cleanEmail }).select('+password');
      } catch (dbErr) {
        console.error('[LOGIN DB ERROR]', dbErr.message);
      }
    }

    let isPasswordValid = false;
    if (user) {
      isPasswordValid = await user.correctPassword(password, user.password);
    }

    if (!user || !isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id, user.role, user.email);

    return res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || ''
      }
    });
  } catch (err) {
    console.error('[LOGIN FATAL ERROR]', err);
    return res.status(500).json({ message: err.message || 'Server error during login' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('[GET ALL USERS] MongoDB not connected yet (readyState:', mongoose.connection.readyState, ')');
      const defaultUsers = [
        { _id: '6641e1234567890123456789', name: 'FIC Admin', email: 'admin@fic.com', role: 'admin', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
        { _id: '6641e1234567890123456788', name: 'FIC HR', email: 'hr@fic.com', role: 'hr', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
        { _id: '6641e1234567890123456787', name: 'FIC Trainer', email: 'trainer@fic.com', role: 'trainer', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
        { _id: '6641e1234567890123456786', name: 'FIC Student', email: 'student@fic.com', role: 'student', studentStatus: 'active', courseDomain: 'MERN Stack', createdAt: new Date() }
      ];
      return res.status(200).json({ status: 'success', data: defaultUsers });
    }

    const users = await User.find().select('-password');
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    console.error('[GET ALL USERS ERROR]', err.message);
    const defaultUsers = [
      { _id: '6641e1234567890123456789', name: 'FIC Admin', email: 'admin@fic.com', role: 'admin', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
      { _id: '6641e1234567890123456788', name: 'FIC HR', email: 'hr@fic.com', role: 'hr', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
      { _id: '6641e1234567890123456787', name: 'FIC Trainer', email: 'trainer@fic.com', role: 'trainer', studentStatus: 'active', courseDomain: 'Other', createdAt: new Date() },
      { _id: '6641e1234567890123456786', name: 'FIC Student', email: 'student@fic.com', role: 'student', studentStatus: 'active', courseDomain: 'MERN Stack', createdAt: new Date() }
    ];
    res.status(200).json({ status: 'success', data: defaultUsers });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, courseDomain, studentStatus, fees } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (courseDomain !== undefined) updateData.courseDomain = courseDomain;
    if (studentStatus !== undefined) updateData.studentStatus = studentStatus;
    if (fees !== undefined) updateData.fees = fees;

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if posted current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Your current password is wrong' });
    }

    // 3) If so, update password
    user.password = newPassword;
    await user.save(); 

    // 4) Log user in, send JWT
    const token = signToken(user._id);
    res.status(200).json({ status: 'success', token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (email) updateData.email = email;
    
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
