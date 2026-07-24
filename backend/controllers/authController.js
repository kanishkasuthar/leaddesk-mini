const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
const asyncHandler = require('../middleware/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'leaddesk_sandstone_espresso_jwt_secret_key_2026';

// @desc    Authenticate admin & get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email address and password.'
    });
  }

  // Find admin by email
  const admin = await AdminModel.findByEmail(email.trim());
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify your credentials.'
    });
  }

  // Compare hashed password with bcrypt
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify your credentials.'
    });
  }

  // Expiration duration: 7 days if rememberMe checked, 24 hours otherwise
  const expiresIn = rememberMe ? '7d' : '24h';

  const token = jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email },
    JWT_SECRET,
    { expiresIn }
  );

  return res.json({
    success: true,
    message: 'Authentication successful.',
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  });
});

// @desc    Get current authenticated admin user
// @route   GET /api/auth/me
// @access  Private (Protected by authMiddleware)
const getMe = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findById(req.admin.id);
  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin account not found.'
    });
  }

  return res.json({
    success: true,
    admin
  });
});

// @desc    Simulated Forgot Password workflow
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your registered admin email address.'
    });
  }

  return res.json({
    success: true,
    message: 'If an admin account exists for this email, password reset instructions have been dispatched.'
  });
});

module.exports = {
  login,
  getMe,
  forgotPassword
};
