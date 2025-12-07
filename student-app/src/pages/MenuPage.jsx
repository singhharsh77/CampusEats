import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vendorAPI, menuAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';
import { Plus, Clock, Star, ArrowLeft } from 'lucide-react';
import LiveOrderQueue from '../components/LiveOrderQueue';

const MenuPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    try {
      const [vendorRes, menuRes] = await Promise.all([
        vendorAPI.getById(vendorId),
        menuAPI.getByVendor(vendorId),
      ]);

      setVendor(vendorRes.data);
      setMenuItems(menuRes.data);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addItem(item, vendor);
    toast.success(`${item.name} added to cart`);
  };

  const categories = ['all', ...new Set(menuItems.map((item) => item.category))];

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Vendor not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Vendor Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-4 hover:underline"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Vendors
          </button>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center">
              {vendor.imageUrl ? (
                <img
                  src={vendor.imageUrl}
                  alt={vendor.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl">🍔</span>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
              {vendor.description && (
                <p className="text-orange-100 mb-2">{vendor.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>15-20 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Order Queue */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <LiveOrderQueue vendorId={vendorId} />
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${selectedCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No items in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">🍽️</span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{item.price}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.preparationTime || 15} mins
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;