const Order = require('../models/Order');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

const generateOrderNumber = () => {
  return 'ORD' + Date.now() + Math.floor(Math.random() * 1000);
};

const createOrder = async (req, res) => {
  try {
    const { vendorId, items, totalAmount, notes, paymentMethod } = req.body;

    const orderNumber = generateOrderNumber();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(orderNumber);

    const order = new Order({
      orderNumber,
      userId: req.userId,
      vendorId,
      items,
      totalAmount,
      notes,
      paymentMethod,
      qrCode,
      status: 'confirmed', // Auto-confirm all orders
      estimatedTime: 20 // default 20 minutes
    });

    await order.save();

    // Create notification
    await Notification.create({
      userId: req.userId,
      title: 'Order Confirmed',
      message: `Your order #${orderNumber} has been confirmed automatically`,
      type: 'order_confirmed',
      orderId: order._id
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('vendorId', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('vendorId', 'name imageUrl')
      .populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Calculate queue position for active orders
    let queuePosition = null;
    const activeStatuses = ['confirmed', 'preparing', 'ready'];

    if (activeStatuses.includes(order.status)) {
      // Count how many active orders for the same vendor were created before this order
      queuePosition = await Order.countDocuments({
        vendorId: order.vendorId,
        status: { $in: activeStatuses },
        createdAt: { $lt: order.createdAt }
      }) + 1; // +1 because position is 1-indexed
    }

    // Add queue position to response
    const orderWithQueue = order.toObject();
    orderWithQueue.queuePosition = queuePosition;

    res.json(orderWithQueue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { status } = req.query;

    const filter = { vendorId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('userId', 'name phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create notification based on status
    let notificationMessage = '';
    if (status === 'confirmed') {
      notificationMessage = `Your order #${order.orderNumber} has been confirmed`;
    } else if (status === 'preparing') {
      notificationMessage = `Your order #${order.orderNumber} is being prepared`;
    } else if (status === 'ready') {
      notificationMessage = `Your order #${order.orderNumber} is ready for pickup!`;
    } else if (status === 'completed') {
      notificationMessage = `Your order #${order.orderNumber} has been completed`;
    }

    if (notificationMessage) {
      await Notification.create({
        userId: order.userId,
        title: 'Order Update',
        message: notificationMessage,
        type: `order_${status}`,
        orderId: order._id
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVendorLiveOrderCount = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Count active orders (confirmed, preparing, ready)
    const count = await Order.countDocuments({
      vendorId,
      status: { $in: ['confirmed', 'preparing', 'ready'] }
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderStatus,
  getVendorLiveOrderCount
};