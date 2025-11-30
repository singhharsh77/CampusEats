const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

let isConnected = false;

const connectDB = async () => {
    if (!isConnected) {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    }
};

const autoCompleteOldOrders = async () => {
    try {
        await connectDB();

        // Find orders older than 10 minutes that are not completed or cancelled
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const result = await Order.updateMany(
            {
                createdAt: { $lt: tenMinutesAgo },
                status: { $nin: ['completed', 'cancelled'] }
            },
            {
                $set: { status: 'completed' }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`[${new Date().toLocaleTimeString()}] ✅ Auto-completed ${result.modifiedCount} orders`);
        } else {
            console.log(`[${new Date().toLocaleTimeString()}] ℹ️  No old orders to auto-complete`);
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ Error:`, error.message);
    }
};

// Run immediately on start
console.log('🤖 Auto-complete service started');
console.log('⏰ Checking for old orders every 5 minutes...\n');
autoCompleteOldOrders();

// Run every 5 minutes (300000 ms)
setInterval(autoCompleteOldOrders, 5 * 60 * 1000);

// Keep the process running
process.on('SIGINT', () => {
    console.log('\n👋 Auto-complete service stopped');
    process.exit(0);
});
