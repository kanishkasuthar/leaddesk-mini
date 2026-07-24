const express = require('express');
const router = express.Router();
const { login, registerAdmin, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Auth Endpoints
router.post('/login', login);
router.post('/register', registerAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected Auth Endpoint
router.get('/me', authMiddleware, getMe);

module.exports = router;
