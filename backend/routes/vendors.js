const express = require('express');
const router = express.Router();
const { 
  createVendor, 
  getAllVendors, 
  getVendorById, 
  updateVendor,
  getVendorByUserId
} = require('../controllers/vendorController');
const { auth, isVendor } = require('../middleware/auth');

router.post('/', auth, isVendor, createVendor);
router.get('/', getAllVendors);
router.get('/my-vendor', auth, isVendor, getVendorByUserId); // Must be BEFORE /:id
router.get('/:id', getVendorById);
router.put('/:id', auth, isVendor, updateVendor);

module.exports = router;