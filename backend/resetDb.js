const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const Notification = require('./models/Notification');
const User = require('./models/User');

dotenv.config();

const resetDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('✅ Connected to MongoDB');

        // 1. Clear existing data
        await Vendor.deleteMany({});
        await MenuItem.deleteMany({});
        await Order.deleteMany({});
        await Notification.deleteMany({});
        console.log('🗑️ Cleared Vendors, MenuItems, Orders, and Notifications');

        // 2. Find the vendor user
        const vendorUser = await User.findOne({ email: 'vendor@college.edu' });
        if (!vendorUser) {
            console.error('❌ Vendor user (vendor@college.edu) not found! Please create it first.');
            process.exit(1);
        }
        console.log(`👤 Found vendor user: ${vendorUser.name} (${vendorUser._id})`);

        // 3. Create new Vendor Profile
        const newVendor = new Vendor({
            name: "CampusEats Official Vendor",
            description: "The main canteen serving delicious meals for students. Hygiene and taste guaranteed!",
            imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
            isActive: true,
            rating: 4.8,
            totalRatings: 15,
            userId: vendorUser._id,
            commissionRate: 5
        });
        await newVendor.save();
        console.log(`🏪 Created Vendor: ${newVendor.name}`);

        // 4. Create Menu Items
        const menuItems = [
            {
                name: "Rajma Chawal",
                description: "Classic comfort food. Kidney beans curry served with steamed basmati rice.",
                price: 80,
                category: "lunch",
                isAvailable: true,
                preparationTime: 10,
                vendorId: newVendor._id
            },
            {
                name: "Veg Grilled Sandwich",
                description: "Crispy toasted bread filled with fresh vegetables, cheese, and green chutney.",
                price: 60,
                category: "snacks",
                isAvailable: true,
                preparationTime: 15,
                vendorId: newVendor._id
            },
            {
                name: "Cold Coffee",
                description: "Chilled creamy coffee topped with chocolate syrup.",
                price: 50,
                category: "beverages",
                isAvailable: true,
                preparationTime: 5,
                vendorId: newVendor._id
            },
            {
                name: "Masala Dosa",
                description: "Crispy rice crepe filled with spiced potato masala, served with sambar and chutney.",
                price: 90,
                category: "breakfast",
                isAvailable: true,
                preparationTime: 20,
                vendorId: newVendor._id
            }
        ];

        await MenuItem.insertMany(menuItems);
        console.log(`🍔 Created ${menuItems.length} Menu Items`);

        console.log('✨ Database reset complete! You can now test with a single vendor.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
};

resetDb();
