const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const MenuItem = require('./models/MenuItem');
const Order = require('./models/Order');
const User = require('./models/User');

dotenv.config();

const checkAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('✅ Connected to MongoDB\n');

        const vendors = await Vendor.find({});
        const menuItems = await MenuItem.find({});
        const orders = await Order.find({});
        const users = await User.find({});

        console.log('📊 DATABASE STATUS:');
        console.log(`   Vendors: ${vendors.length}`);
        console.log(`   Menu Items: ${menuItems.length}`);
        console.log(`   Orders: ${orders.length}`);
        console.log(`   Users: ${users.length}\n`);

        if (vendors.length > 0) {
            console.log('📝 Vendor Details:');
            vendors.forEach(v => {
                console.log(`   - ${v.name} (Active: ${v.isActive})`);
            });
        }

        if (menuItems.length > 0) {
            console.log(`\n📝 Menu Items (showing first 5):`);
            menuItems.slice(0, 5).forEach(m => {
                console.log(`   - ${m.name} (₹${m.price})`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkAll();
