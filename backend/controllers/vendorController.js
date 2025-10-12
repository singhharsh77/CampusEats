const Vendor = require('../models/Vendor');

const createVendor = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    
    const vendor = new Vendor({
      name,
      description,
      imageUrl,
      userId: req.userId
    });

    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createVendor, getAllVendors, getVendorById, updateVendor };