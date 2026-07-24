const LeadModel = require('../models/leadModel');
const asyncHandler = require('../middleware/asyncHandler');

const ALLOWED_STATUSES = ['New', 'Contacted', 'Closed'];

// @desc    Capture new lead enquiry
// @route   POST /api/leads
// @access  Public
const createLead = asyncHandler(async (req, res) => {
  const { name, email, budget, message } = req.body;
  const insertId = await LeadModel.create({ name, email, budget, message });
  const newLead = await LeadModel.getById(insertId);

  return res.status(201).json({
    success: true,
    message: 'Opportunity captured successfully.',
    data: newLead || { id: insertId, name, email, budget, message, status: 'New', created_at: new Date().toISOString() }
  });
});

// @desc    Retrieve all leads ordered by newest first
// @route   GET /api/leads
// @access  Admin (Protected)
const getAllLeads = asyncHandler(async (req, res) => {
  const leads = await LeadModel.getAll();
  return res.status(200).json({
    success: true,
    count: leads.length,
    data: leads
  });
});

// @desc    Update lead pipeline status
// @route   PUT /api/leads/:id
// @access  Admin (Protected)
const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Allowed status options: ${ALLOWED_STATUSES.join(', ')}`
    });
  }

  const updated = await LeadModel.updateStatus(id, status);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: `Opportunity #${id} not found.`
    });
  }

  const updatedLead = await LeadModel.getById(id);

  return res.status(200).json({
    success: true,
    message: `Status for opportunity #${id} updated to "${status}".`,
    data: updatedLead
  });
});

// @desc    Search leads by term
// @route   GET /api/leads/search
// @access  Admin (Protected)
const searchLeads = asyncHandler(async (req, res) => {
  const queryStr = (req.query.q || '').trim();
  if (!queryStr) {
    const all = await LeadModel.getAll();
    return res.status(200).json({ success: true, count: all.length, data: all });
  }

  const leads = await LeadModel.search(queryStr);
  return res.status(200).json({
    success: true,
    query: queryStr,
    count: leads.length,
    data: leads
  });
});

// @desc    Get dashboard summary metrics
// @route   GET /api/leads/stats
// @access  Admin (Protected)
const getStats = asyncHandler(async (req, res) => {
  const stats = await LeadModel.getStats();
  return res.status(200).json({
    success: true,
    data: stats
  });
});

module.exports = {
  createLead,
  getAllLeads,
  updateStatus,
  searchLeads,
  getStats
};
