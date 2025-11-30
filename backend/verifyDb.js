const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const verifyDb = async () => {
    try {
        console.log('🔌 Connecting to:', process.env.MONGO_URI);
        console.log('📂 Database Name:', process.env.DB_NAME);

        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('✅ Connected to MongoDB');

        const count = await Order.countDocuments();
        console.log(`📊 Total Orders in DB: ${count}`);

        if (count > 0) {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(3);
            console.log('📝 Latest 3 Orders:');
            orders.forEach(o => {
                console.log(`- [${o.status}] ${o.orderNumber} (Amount: ${o.totalAmount})`);
            });
        } else {
            console.log('⚠️ No orders found in this database.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyDb();
