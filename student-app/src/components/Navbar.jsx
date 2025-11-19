import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { ShoppingCart, User, LogOut, Home, Package } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-gray-800">CampusEats</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:inline">Home</span>
            </Link>

            <Link
              to="/orders"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
            >
              <Package className="w-5 h-5" />
              <span className="hidden md:inline">Orders</span>
            </Link>

            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
              <span className="hidden md:inline">Cart</span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
                
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;