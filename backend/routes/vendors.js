const express = require('express');
const router = express.Router();
const { 
  createVendor, 
  getAllVendors, 
  getVendorById, 
  updateVendor 
} = require('../controllers/vendorController');
const { auth, isVendor } = require('../middleware/auth');

router.post('/', auth, isVendor, createVendor);
router.get('/', getAllVendors);
router.get('/:id', getVendorById);
router.put('/:id', auth, isVendor, updateVendor);

module.exports = router;