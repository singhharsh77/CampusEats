import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Users, Search, Shield, Ban, Trash2, User } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            const params = {};
            if (roleFilter !== 'all') params.role = roleFilter;
            if (statusFilter !== 'all') params.status = statusFilter;
            if (searchQuery) params.search = searchQuery;

            const response = await adminAPI.getUsers(params);
            setUsers(response.data);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleBan = async (id, isActive, name) => {
        try {
            const response = await adminAPI.toggleUserBan(id);
            toast.success(response.data.message);
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id, name) => {
        if (!confirm(`Are you sure you want to delete user "${name}"?`)) {
            return;
        }

        try {
            await adminAPI.deleteUser(id);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete user');
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Users className="w-8 h-8 text-green-500" />
                    User Management
                </h1>
                <div className="text-sm text-gray-600">
                    Total: {users.length} users
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={fetchUsers}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Role Filter */}
                    <div className="flex gap-2">
                        {['all', 'student', 'vendor'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setRoleFilter(role)}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${roleFilter === role
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {['all', 'active', 'banned'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${statusFilter === status
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="text-center py-12 text-gray-600">Loading users...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No users found</div>
            ) : (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">User</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">College ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.collegeId}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'vendor' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Banned'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.role !== 'admin' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleToggleBan(user._id, user.isActive, user.name)}
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${user.isActive
                                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                                : 'bg-green-500 text-white hover:bg-green-600'
                                                            }`}
                                                    >
                                                        {user.isActive ? 'Ban' : 'Unban'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.name)}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
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

export default UsersPage;
