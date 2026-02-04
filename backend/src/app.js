const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes - with error handling
try {
  console.log('Registering routes...');
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✓ Auth routes registered');
  
  app.use('/api/students', require('./routes/studentRoutes'));
  console.log('✓ Student routes registered');
  
  app.use('/api/companies', require('./routes/companyRoutes'));
  console.log('✓ Company routes registered');
  
  app.use('/api/admin', require('./routes/adminRoutes'));
  console.log('✓ Admin routes registered');
  
  app.use('/api/jobs', require('./routes/jobRoutes'));
  console.log('✓ Job routes registered');
  
  app.use('/api/notifications', require('./routes/notificationRoutes'));
  console.log('✓ Notification routes registered');
  console.log('All routes registered successfully!');
} catch (error) {
  console.error('Error registering routes:', error);
  process.exit(1);
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

