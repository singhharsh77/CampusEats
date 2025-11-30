const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

// All routes require admin authentication
router.use(adminAuth);

// Statistics
router.get('/stats', adminController.getStats);
router.get('/analytics', adminController.getAnalytics);

// Vendor Management
router.get('/vendors', adminController.getVendors);
router.put('/vendors/:id/toggle', adminController.toggleVendor);
router.delete('/vendors/:id', adminController.deleteVendor);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/ban', adminController.toggleUserBan);
router.delete('/users/:id', adminController.deleteUser);

// Order Monitoring
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', adminController.getOrderDetails);

module.exports = router;
