import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const HistoryPage = () => {
  const { vendor } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    if (vendor) {
      fetchHistory();
    }
  }, [vendor]);

  const fetchHistory = async () => {
    try {
      const response = await orderAPI.getVendorOrders(vendor._id);
      // Only show completed orders
      const completedOrders = response.data.filter(
        (order) => order.status === 'completed'
      );
      setOrders(completedOrders);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return orders.filter(
          (order) =>
            new Date(order.createdAt).toDateString() === now.toDateString()
        );
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orders.filter(
          (order) => new Date(order.createdAt) >= weekAgo
        );
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return orders.filter(
          (order) => new Date(order.createdAt) >= monthAgo
        );
      default:
        return orders;
    }
  };

  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order History</h1>
        <p className="text-gray-600">View all completed orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">
                {filteredOrders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0}
              </p>
            </div>
            </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setDateFilter(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                  dateFilter === filter.value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {dateFilter === 'today'
              ? 'No orders completed today'
              : dateFilter === 'week'
              ? 'No orders completed this week'
              : dateFilter === 'month'
              ? 'No orders completed this month'
              : 'No completed orders yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Order #
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {order.orderNumber}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{order.userId?.name || 'Customer'}</p>
                      <p className="text-sm text-gray-500">{order.userId?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">{order.items.length} items</p>
                      <p className="text-sm text-gray-500">
                        {order.items.map((item) => item.name).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-800">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'hh:mm a')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                      <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;