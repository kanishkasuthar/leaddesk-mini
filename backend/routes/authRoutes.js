const express = require('express');
const router = express.Router();
const { login, getMe, forgotPassword } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
