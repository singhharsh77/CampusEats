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

dotenv.config();

// Connect to MongoDB with auto-reconnect and connection pooling
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});