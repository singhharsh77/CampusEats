const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const startAutoCompleteService = require('./autoCompleteService');
const startAutoProgressService = require('./autoProgressOrders');

dotenv.config();

// Initialize Express app
const app = express();
app.set('trust proxy', 1); // Trust first proxy (Render/Vercel)
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting
const { generalLimiter, strictLimiter } = require('./middleware/rateLimiter');
app.use(generalLimiter); // Apply global limit

// Routes
app.get('/', (req, res) => {
  res.send('🍔 CAMPUSEATS Backend is running!');
});

// API Routes
app.use('/api/auth', strictLimiter, authRoutes); // Strict limit for auth
app.use('/api/vendors', vendorRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', strictLimiter, orderRoutes); // Strict limit for orders
app.use('/api/admin', adminRoutes); // Admin routes with built-in auth

// Log 404s for debugging
app.use((req, res, next) => {
  console.log(`❌ 404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server FIRST (don't wait for MongoDB)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously (in background)
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    // Start auto-complete service after DB connection
    startAutoCompleteService();
    startAutoProgressService();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server running without database connection');
  });