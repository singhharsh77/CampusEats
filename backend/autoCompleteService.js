const Order = require('./models/Order');

const autoCompleteOldOrders = async () => {
    try {
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
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ Auto-complete Error:`, error.message);
    }
};

const startAutoCompleteService = () => {
    console.log('🤖 Auto-complete service started (Integrated)');
    console.log('⏰ Checking for old orders every 5 minutes...\n');

    // Run immediately
    autoCompleteOldOrders();

    // Run every 5 minutes (300000 ms)
    setInterval(autoCompleteOldOrders, 5 * 60 * 1000);
};

module.exports = startAutoCompleteService;
