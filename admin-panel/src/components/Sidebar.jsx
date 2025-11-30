import React from 'react';
import { Home, Users, Store, ShoppingBag, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Sidebar = ({ currentPage, setCurrentPage }) => {
    const { admin, logout } = useAuthStore();

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'vendors', icon: Store, label: 'Vendors' },
        { id: 'users', icon: Users, label: 'Users' },
        { id: 'orders', icon: ShoppingBag, label: 'Orders' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white min-h-screen flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold">CampusEats</h1>
                <p className="text-blue-200 text-sm mt-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-4">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${currentPage === item.id
                                ? 'bg-white text-blue-600 shadow-lg'
                                : 'text-white hover:bg-blue-500'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                        <span className="font-bold">{admin?.name?.[0] || 'A'}</span>
                    </div>
                    <div>
                        <p className="font-medium">{admin?.name || 'Admin'}</p>
                        <p className="text-xs text-blue-200">{admin?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
