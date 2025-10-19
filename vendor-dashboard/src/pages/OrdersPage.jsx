import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useOrdersStore from '../store/ordersStore';
import OrderCard from '../components/OrderCard';
import toast from 'react-hot-toast';
import { RefreshCw, ShoppingBag } from 'lucide-react';

const OrdersPage = () => {
  const { vendor } = useAuthStore();
  const { orders, selectedStatus, setOrders, setSelectedStatus, updateOrderStatus } = useOrdersStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (vendor) {
      fetchOrders();
      
      // Auto-refresh every 10 seconds
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [vendor, selectedStatus]);

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await orderAPI.getVendorOrders(vendor._id, selectedStatus);
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      updateOrderStatus(orderId, newStatus);
      
      toast.success(
        newStatus === 'confirmed'
          ? 'Order confirmed!'
          : newStatus === 'preparing'
          ? 'Started preparing order'
          : newStatus === 'ready'
          ? 'Order marked as ready!'
          : newStatus === 'completed'
          ? 'Order completed!'
          : newStatus === 'cancelled'
          ? 'Order cancelled'
          : 'Status updated'
      );

      // Refresh orders after status change
      fetchOrders(false);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const statusTabs = [
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'ready', label: 'Ready', color: 'green' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Live Orders</h1>
          <p className="text-gray-600">Manage incoming orders</p>
        </div>
        <button
          onClick={() => fetchOrders(false)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                selectedStatus === tab.value
                  ? `bg-${tab.color}-500 text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No {selectedStatus} orders
          </h3>
          <p className="text-gray-600">
            {selectedStatus === 'pending'
              ? 'New orders will appear here'
              : `No orders in ${selectedStatus} status`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;