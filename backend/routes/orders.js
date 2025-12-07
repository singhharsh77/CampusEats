const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
  getVendorLiveOrderCount
} = require('../controllers/orderController');
const { auth, isVendor } = require('../middleware/auth');

// Public route - no auth required
router.get('/vendor/:vendorId/live-count', getVendorLiveOrderCount);

router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);
router.get('/:id', auth, getOrderById);
router.get('/vendor/:vendorId', auth, isVendor, getVendorOrders);
router.put('/:id/status', auth, isVendor, updateOrderStatus);

module.exports = router;