const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminModel = require('../models/adminModel');
const asyncHandler = require('../middleware/asyncHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'leaddesk_sandstone_espresso_jwt_secret_key_2026';

// Helper to sanitize strings
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper to validate strong password
function isStrongPassword(password) {
  if (typeof password !== 'string') return false;
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
}

// @desc    Authenticate admin & get JWT token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required.'
    });
  }

  const sanitizedEmail = email.trim().toLowerCase();

  // Find admin by email
  const admin = await AdminModel.findByEmail(sanitizedEmail);
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify credentials.'
    });
  }

  // Compare hashed password with bcrypt
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password. Please verify credentials.'
    });
  }

  // Expiration duration: 7 days if rememberMe checked, 24 hours otherwise
  const expiresIn = rememberMe ? '7d' : '24h';

  const token = jwt.sign(
    { id: admin.id, name: admin.name, email: admin.email },
    JWT_SECRET,
    { expiresIn }
  );

  return res.status(200).json({
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

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Protected
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required fields.'
    });
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const sanitizedName = sanitizeString(name);

  // Prevent duplicate admin emails
  const existing = await AdminModel.findByEmail(sanitizedEmail);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An admin account with this email address already exists.'
    });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain at least one letter and one number.'
    });
  }

  // Hash password using bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  const insertId = await AdminModel.create({
    name: sanitizedName,
    email: sanitizedEmail,
    password: hashedPassword
  });

  return res.status(201).json({
    success: true,
    message: 'Admin account created successfully.',
    data: {
      id: insertId,
      name: sanitizedName,
      email: sanitizedEmail
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

  return res.status(200).json({
    success: true,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      created_at: admin.created_at
    }
  });
});

// @desc    Request password reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your registered admin email address.'
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.'
    });
  }

  const sanitizedEmail = email.trim().toLowerCase();
  const admin = await AdminModel.findByEmail(sanitizedEmail);

  if (!admin) {
    return res.status(200).json({
      success: true,
      message: 'If an admin account exists for this email address, password recovery instructions have been dispatched.'
    });
  }

  // Generate secure random bytes token (64 hex characters)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token for database storage (SHA-256)
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expires in 1 hour (3600000 ms)
  const expiryTime = new Date(Date.now() + 3600000).toISOString();

  await AdminModel.setResetToken(sanitizedEmail, hashedToken, expiryTime);

  const resetUrl = `/reset-password/${resetToken}`;

  return res.status(200).json({
    success: true,
    message: 'Password reset instructions dispatched successfully.',
    resetToken,
    resetUrl
  });
});

// @desc    Reset password using reset token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password reset token is required.'
    });
  }

  if (!newPassword || typeof newPassword !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'New password is required.'
    });
  }

  if (!isStrongPassword(newPassword)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long and contain at least one letter and one number.'
    });
  }

  // Hash token to compare with database
  const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');

  const admin = await AdminModel.findByResetToken(hashedToken);

  if (!admin) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token.'
    });
  }

  // Check if token has expired
  if (admin.reset_token_expiry && new Date() > new Date(admin.reset_token_expiry)) {
    return res.status(400).json({
      success: false,
      message: 'Password reset token has expired. Please request a new link.'
    });
  }

  // Hash new password with bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await AdminModel.updatePassword(admin.id, hashedPassword);

  return res.status(200).json({
    success: true,
    message: 'Your password has been successfully reset. You may now log in.'
  });
});

module.exports = {
  login,
  registerAdmin,
  getMe,
  forgotPassword,
  resetPassword
};
