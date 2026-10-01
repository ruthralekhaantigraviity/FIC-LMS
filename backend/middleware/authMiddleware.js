const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'You are not logged in! Please log in to get access.' });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_12345');

    // 3) Check if user exists in DB
    let currentUser = null;
    try {
      currentUser = await User.findById(decoded.id);
    } catch (dbErr) {
      console.error('[AUTH MIDDLEWARE DB LOOKUP ERROR]', dbErr.message);
    }

    if (!currentUser) {
      return res.status(401).json({ message: 'The user belonging to this token no longer exists.' });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'You are not logged in.' });
    }

    // Role-based check
    if (roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({ 
      message: `Permission denied. Required roles: ${roles.join(', ')}. Your role: ${req.user.role}` 
    });
  };
};
