const express = require('express');
const router = express.Router();
const { 
  createMenuItem, 
  getMenuByVendor, 
  updateMenuItem, 
  deleteMenuItem 
} = require('../controllers/menuController');
const { auth, isVendor } = require('../middleware/auth');

router.post('/', auth, isVendor, createMenuItem);
router.get('/vendor/:vendorId', getMenuByVendor);
router.put('/:id', auth, isVendor, updateMenuItem);
router.delete('/:id', auth, isVendor, deleteMenuItem);

module.exports = router;