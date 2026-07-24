const ALLOWED_BUDGETS = [
  "Below ₹10,000",
  "₹10,000 - ₹25,000",
  "₹25,000 - ₹50,000",
  "Above ₹50,000"
];

function validateLead(req, res, next) {
  const { name, email, budget, message } = req.body;
  const errors = {};

  // Name validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Budget validation
  if (!budget || typeof budget !== 'string' || !budget.trim()) {
    errors.budget = 'Budget range selection is required';
  } else if (!ALLOWED_BUDGETS.includes(budget.trim())) {
    errors.budget = 'Please select a valid budget range';
  }

  // Message validation
  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message content is required';
  } else if (message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Sanitize trimmed strings
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.budget = budget.trim();
  req.body.message = message.trim();

  next();
}

module.exports = validateLead;
