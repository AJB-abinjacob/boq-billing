const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const { authenticate } = require('./middleware/authMiddleware');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration to allow frontend requests
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.1.10:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public API Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Protected API Routes (authentication temporarily disabled for development)
app.use('/api/companies', /* authenticate, */ require('./routes/companyRoutes'));
app.use('/api/categories', /* authenticate, */ require('./routes/categoryRoutes'));
app.use('/api/products', /* authenticate, */ require('./routes/productRoutes'));
app.use('/api/templates', /* authenticate, */ require('./routes/templateRoutes'));
app.use('/api/bills', /* authenticate, */ require('./routes/billRoutes'));
app.use('/api/payments', /* authenticate, */ require('./routes/paymentRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BOQ Billing API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;