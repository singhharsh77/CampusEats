import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { DollarSign, ShoppingBag, Clock, TrendingUp, Package } from 'lucide-react';

const DashboardPage = () => {
  const { vendor } = useAuthStore();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendor) {
      fetchDashboardData();
    }
  }, [vendor]);

  const fetchDashboardData = async () => {
    try {
      let currentVendorId = vendor?._id;

      if (!currentVendorId) {
        try {
          const vendorResponse = await import('../services/api').then(m => m.vendorAPI.getMyVendor());
          const vendorData = vendorResponse.data;
          useAuthStore.getState().setVendor(vendorData);
          currentVendorId = vendorData._id;
        } catch (err) {
          console.error('Failed to fetch vendor profile:', err);
          setLoading(false);
          return;
        }
      }

      if (!currentVendorId) {
        setLoading(false);
        return;
      }

      // Fetch all orders for vendor
      const response = await orderAPI.getVendorOrders(currentVendorId);
      const orders = response.data;

      // Calculate stats
      const today = new Date().setHours(0, 0, 0, 0);

      const todayOrders = orders.filter(
        (order) => new Date(order.createdAt).setHours(0, 0, 0, 0) === today
      );

      const todayRevenue = todayOrders
        .filter((order) => order.paymentStatus === 'completed')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const pendingOrders = orders.filter(
        (order) => ['pending', 'confirmed', 'preparing'].includes(order.status)
      ).length;

      const completedOrders = orders.filter(
        (order) => order.status === 'completed'
      ).length;

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        pendingOrders,
        completedOrders,
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-5 h-5 text-green-500" />
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {vendor?.name || 'Vendor'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Today's Orders"
          value={stats.todayOrders}
          color="bg-blue-500"
          subtext="Orders received today"
        />
        <StatCard
          icon={DollarSign}
          label="Today's Revenue"
          value={`₹${stats.todayRevenue}`}
          color="bg-green-500"
          subtext="Total earnings today"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="bg-yellow-500"
          subtext="Awaiting action"
        />
        <StatCard
          icon={Package}
          label="Completed Orders"
          value={stats.completedOrders}
          color="bg-purple-500"
          subtext="Total completed"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} items • {order.userId?.name || 'Customer'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">₹{order.totalAmount}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'preparing'
                          ? 'bg-orange-100 text-orange-800'
                          : order.status === 'ready'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;