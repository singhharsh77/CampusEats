import React, { useState } from 'react';
import { adminAuthAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import toast, { Toaster } from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('admin@campuseats.com');
    const [password, setPassword] = useState('Admin@123');
    const [loading, setLoading] = useState(false);
    const setAdmin = useAuthStore((state) => state.setAdmin);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAuthAPI.login({ email, password });
            const { user, token } = response.data;

            if (user.role !== 'admin') {
                toast.error('Access denied. Admin privileges required.');
                return;
            }

            setAdmin(user, token);
            toast.success('Welcome back, Admin!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Toaster position="top-right" />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">CampusEats Admin</h1>
                        <p className="text-gray-500 mt-2">Sign in to manage your platform</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="admin@campuseats.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Default Credentials:</span><br />
                            Email: admin@campuseats.com<br />
                            Password: Admin@123
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 mt-6">
                    CampusEats Admin Panel © 2025
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
