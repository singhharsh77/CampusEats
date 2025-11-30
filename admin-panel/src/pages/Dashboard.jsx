import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';
import { Store, Users, ShoppingBag, DollarSign, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, analyticsRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getAnalytics()
            ]);
            setStats(statsRes.data);
            setAnalytics(analyticsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-600">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Store}
                    title="Total Vendors"
                    value={stats?.totalVendors || 0}
                    color="#3B82F6"
                    trend={`${stats?.activeVendors || 0} active`}
                />
                <StatCard
                    icon={Users}
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    color="#10B981"
                />
                <StatCard
                    icon={ShoppingBag}
                    title="Total Orders"
                    value={stats?.totalOrders || 0}
                    color="#F59E0B"
                    trend={`${stats?.ordersToday || 0} today`}
                />
                <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value={`₹${stats?.totalRevenue || 0}`}
                    color="#EF4444"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Orders Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Orders (Last 7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analytics?.ordersPerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        Revenue (Last 7 Days)
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analytics?.revenuePerDay || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Recent Orders
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Vendor</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats?.recentOrders?.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">#{order.orderNumber.slice(-6)}</td>
                                    <td className="px-4 py-3 text-sm">{order.userId?.name}</td>
                                    <td className="px-4 py-3 text-sm">{order.vendorId?.name}</td>
                                    <td className="px-4 py-3 text-sm font-medium">₹{order.totalAmount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
