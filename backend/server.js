const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const authRoutes = require('./routes/authRoutes');

console.info(`✓ dotenv loaded`);

const app = express();
let PORT = parseInt(process.env.PORT || '5001', 10);

// Production CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request Logging Middleware
app.use((req, res, next) => {
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'LeadDesk Mini Backend Production API'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
console.info(`✓ Authentication routes registered (/api/auth)`);

app.use('/api/leads', leadRoutes);
console.info(`✓ Lead management routes registered (/api/leads)`);

console.info(`✓ JWT initialized`);

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found.`
  });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server with Graceful Port Conflict Handling
function startServer(portToTry) {
  const server = app.listen(portToTry, () => {
    console.info(`=======================================================`);
    console.info(`✓ Server running on port ${portToTry}`);
    console.info(`🌐 Auth Endpoint: http://localhost:${portToTry}/api/auth/login`);
    console.info(`🌐 Leads Endpoint: http://localhost:${portToTry}/api/leads`);
    console.info(`=======================================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Port Notice] Port ${portToTry} is currently occupied. Attempting alternative port ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Fatal Server Listen Error:', err);
    }
  });
}

// Initialize Database & Start Server
initDB().then(() => {
  startServer(PORT);
});

module.exports = app;
