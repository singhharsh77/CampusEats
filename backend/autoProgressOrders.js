const Order = require('./models/Order');
const Notification = require('./models/Notification');

const autoProgressOrders = async () => {
    try {
        const now = new Date();

        // 1. Auto-transition: confirmed → preparing (after 15 seconds)
        const fifteenSecondsAgo = new Date(now.getTime() - 15 * 1000);

        const confirmedOrders = await Order.find({
            status: 'confirmed',
            createdAt: { $lt: fifteenSecondsAgo }
        });

        for (const order of confirmedOrders) {
            await Order.findByIdAndUpdate(order._id, {
                status: 'preparing',
                updatedAt: now
            });

            console.log(`✅ Auto-progressed order ${order.orderNumber}: confirmed → preparing`);

            // Create notification
            await Notification.create({
                userId: order.userId,
                title: 'Order Update',
                message: `Your order #${order.orderNumber} is being prepared`,
                type: 'order_preparing',
                orderId: order._id
            });
        }

        // 2. Auto-transition: preparing → ready (after 5 minutes from creation)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        const preparingOrders = await Order.find({
            status: 'preparing',
            createdAt: { $lt: fiveMinutesAgo }
        });

        for (const order of preparingOrders) {
            await Order.findByIdAndUpdate(order._id, {
                status: 'ready',
                updatedAt: now
            });

            console.log(`✅ Auto-progressed order ${order.orderNumber}: preparing → ready`);

            // Create notification
            await Notification.create({
                userId: order.userId,
                title: 'Order Ready!',
                message: `Your order #${order.orderNumber} is ready for pickup!`,
                type: 'order_ready',
                orderId: order._id
            });
        }

        // 3. Auto-transition: ready → completed (after 15 seconds)
        const readyFifteenSecondsAgo = new Date(now.getTime() - 15 * 1000);

        const readyOrders = await Order.find({
            status: 'ready',
            updatedAt: { $lt: readyFifteenSecondsAgo }
        });

        for (const order of readyOrders) {
            await Order.findByIdAndUpdate(order._id, {
                status: 'completed',
                updatedAt: now
            });

            console.log(`✅ Auto-progressed order ${order.orderNumber}: ready → completed`);
        }

        if (confirmedOrders.length > 0 || preparingOrders.length > 0 || readyOrders.length > 0) {
            console.log(`[${new Date().toLocaleTimeString()}] 🤖 Auto-progressed: ${confirmedOrders.length} to preparing, ${preparingOrders.length} to ready, ${readyOrders.length} to completed`);
        }
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] ❌ Auto-progress Error:`, error.message);
    }
};

const startAutoProgressService = () => {
    console.log('🤖 Auto-progress service started');
    console.log('⏰ Checking orders every 5 seconds...\n');

    // Run immediately
    autoProgressOrders();

    // Run every 5 seconds (to catch 15-second transitions quickly)
    setInterval(autoProgressOrders, 5 * 1000);
};

module.exports = startAutoProgressService;
