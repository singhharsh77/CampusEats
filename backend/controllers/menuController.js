const MenuItem = require('../models/MenuItem');

const createMenuItem = async (req, res) => {
  try {
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuByVendor = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      vendorId: req.params.vendorId,
      isAvailable: true 
    });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createMenuItem, getMenuByVendor, updateMenuItem, deleteMenuItem };