import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ShoppingBag, Search, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000); // Auto-refresh every 10s
        return () => clearInterval(interval);
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            const params = {};
            if (statusFilter !== 'all') params.status = statusFilter;

            const response = await adminAPI.getOrders(params);
            setOrders(response.data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'preparing': return 'bg-orange-100 text-orange-700';
            case 'ready': return 'bg-green-100 text-green-700';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-orange-500" />
                    Order Monitoring
                </h1>
                <div className="text-sm text-gray-600">
                    Total: {orders.length} orders
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {['all', 'pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status !== 'all' && (
                                <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-30 rounded-full text-xs">
                                    {orders.filter(o => o.status === status).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center py-12 text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No orders found</div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            #{order.orderNumber.slice(-8)}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</div>
                                    <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Customer</div>
                                    <div className="font-medium">{order.userId?.name}</div>
                                    <div className="text-sm text-gray-600">{order.userId?.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Vendor</div>
                                    <div className="font-medium">{order.vendorId?.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">Items</div>
                                    <div className="font-medium">{order.items.length} items</div>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs text-gray-500 mb-2 uppercase">Order Items</div>
                                <div className="space-y-2">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center text-sm">
                                            <span>
                                                <span className="font-medium">{item.quantity}x</span> {item.name}
                                            </span>
                                            <span className="font-medium">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
