const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.send('CAMPUSEATS Backend is running!');
});

// Example: simple orders route
app.get('/orders', (req, res) => {
  res.json({ message: 'Orders route works!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
