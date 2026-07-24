const express = require('express');
const router = express.Router();
const {
  createLead,
  getAllLeads,
  updateStatus,
  searchLeads,
  getStats
} = require('../controllers/leadController');
const validateLead = require('../middleware/validateLead');

// API Route Mappings
router.post('/', validateLead, createLead);
router.get('/', getAllLeads);
router.get('/search', searchLeads);
router.get('/stats', getStats);
router.put('/:id', updateStatus);

module.exports = router;
