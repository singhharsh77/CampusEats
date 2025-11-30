const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Get system statistics
exports.getStats = async (req, res) => {
    try {
        const totalVendors = await Vendor.countDocuments();
        const activeVendors = await Vendor.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Calculate total revenue
        const completedOrders = await Order.find({ status: 'completed' });
        const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        // Orders today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

        // Recent orders
        const recentOrders = await Order.find()
            .populate('userId', 'name email')
            .populate('vendorId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            totalVendors,
            activeVendors,
            totalUsers,
            totalOrders,
            totalRevenue,
            ordersToday,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all vendors with filters
exports.getVendors = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        if (status === 'active') query.isActive = true;
        if (status === 'inactive') query.isActive = false;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const vendors = await Vendor.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(vendors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Toggle vendor active status
exports.toggleVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        vendor.isActive = !vendor.isActive;
        await vendor.save();

        res.json({ message: `Vendor ${vendor.isActive ? 'enabled' : 'disabled'}`, vendor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete vendor
exports.deleteVendor = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id);
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        // Delete associated menu items
        await MenuItem.deleteMany({ vendorId: req.params.id });

        // Delete vendor
        await Vendor.findByIdAndDelete(req.params.id);

        res.json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users with filters
exports.getUsers = async (req, res) => {
    try {
        const { role, search, status } = req.query;
        let query = {};

        if (role) query.role = role;
        if (status === 'active') query.isActive = true;
        if (status === 'banned') query.isActive = false;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { collegeId: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ban/Unban user
exports.toggleUserBan = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot ban admin users' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ message: `User ${user.isActive ? 'unbanned' : 'banned'}`, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin users' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all orders with filters
exports.getOrders = async (req, res) => {
    try {
        const { status, vendor, user, startDate, endDate } = req.query;
        let query = {};

        if (status) query.status = status;
        if (vendor) query.vendorId = vendor;
        if (user) query.userId = user;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email collegeId')
            .populate('vendorId', 'name')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get order details
exports.getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone collegeId')
            .populate('vendorId', 'name description imageUrl');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
    try {
        // Orders per day (last 7 days)
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const count = await Order.countDocuments({
                createdAt: { $gte: date, $lt: nextDate }
            });

            last7Days.push({
                date: date.toISOString().split('T')[0],
                orders: count
            });
        }

        // Revenue per day (last 7 days)
        const revenueData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const orders = await Order.find({
                createdAt: { $gte: date, $lt: nextDate },
                status: 'completed'
            });

            const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            revenueData.push({
                date: date.toISOString().split('T')[0],
                revenue
            });
        }

        // Top vendors by orders
        const topVendors = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$vendorId', totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$totalAmount' } } },
            { $sort: { totalOrders: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'vendors',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'vendor'
                }
            },
            { $unwind: '$vendor' },
            {
                $project: {
                    name: '$vendor.name',
                    totalOrders: 1,
                    totalRevenue: 1
                }
            }
        ]);

        res.json({
            ordersPerDay: last7Days,
            revenuePerDay: revenueData,
            topVendors
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
