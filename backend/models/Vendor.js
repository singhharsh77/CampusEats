const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);