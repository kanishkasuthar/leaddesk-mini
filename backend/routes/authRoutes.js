const express = require('express');
const router = express.Router();
const { login, registerAdmin, getMe, forgotPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register', authMiddleware, registerAdmin);
router.get('/me', authMiddleware, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
