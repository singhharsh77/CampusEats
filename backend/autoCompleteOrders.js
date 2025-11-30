const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const autoCompleteOldOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME
        });

        console.log('✅ Connected to MongoDB\n');

        // Find orders older than 10 minutes that are not completed or cancelled
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const oldOrders = await Order.find({
            createdAt: { $lt: tenMinutesAgo },
            status: { $nin: ['completed', 'cancelled'] }
        });

        console.log(`📊 Found ${oldOrders.length} orders older than 10 minutes\n`);

        if (oldOrders.length > 0) {
            // Update all old orders to completed
            const result = await Order.updateMany(
                {
                    createdAt: { $lt: tenMinutesAgo },
                    status: { $nin: ['completed', 'cancelled'] }
                },
                {
                    $set: { status: 'completed' }
                }
            );

            console.log(`✅ Auto-completed ${result.modifiedCount} orders\n`);

            oldOrders.forEach(order => {
                console.log(`   - Order #${order.orderNumber.slice(-4)} (${order.status} → completed)`);
            });
        } else {
            console.log('✅ No old orders to auto-complete');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

autoCompleteOldOrders();
