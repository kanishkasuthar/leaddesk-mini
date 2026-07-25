const express = require('express');
const router = express.Router();
const {
  createLead,
  getAllLeads,
  updateStatus,
  deleteLead,
  searchLeads,
  getStats
} = require('../controllers/leadController');
const validateLead = require('../middleware/validateLead');
const authMiddleware = require('../middleware/authMiddleware');

// Public lead submission endpoint
router.post('/', validateLead, createLead);

// Admin endpoints (Protected via JWT Auth Middleware)
router.get('/', authMiddleware, getAllLeads);
router.get('/stats', authMiddleware, getStats);
router.get('/search', authMiddleware, searchLeads);
router.put('/:id', authMiddleware, updateStatus);
router.delete('/:id', authMiddleware, deleteLead);

module.exports = router;
