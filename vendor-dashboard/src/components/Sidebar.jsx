import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LayoutDashboard, ShoppingBag, Menu, History, Settings, LogOut, Store } from 'lucide-react';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/orders', icon: ShoppingBag, label: 'Live Orders' },
    { path: '/menu', icon: Menu, label: 'Menu Management' },
    { path: '/history', icon: History, label: 'Order History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-orange-500 to-red-500 text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-orange-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Store className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">CampusEats</h1>
            <p className="text-xs text-orange-100">Vendor Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-orange-400">
        <p className="text-sm text-orange-100">Logged in as</p>
        <p className="font-semibold truncate">{user?.name}</p>
        <p className="text-xs text-orange-100 truncate">{user?.email}</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-white text-orange-600 font-semibold'
                        : 'text-white hover:bg-orange-400'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-orange-400">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;