import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vendorAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Store, Star, Clock, ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await vendorAPI.getAll();
      setVendors(response.data);
    } catch (error) {
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Store className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Vendors Available</h2>
        <p className="text-gray-600">Check back later for food options!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Available Vendors
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => navigate(`/menu/${vendor._id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                {vendor.imageUrl ? (
                  <img
                    src={vendor.imageUrl}
                    alt={vendor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-20 h-20 text-white" />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {vendor.name}
                </h3>
                
                {vendor.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {vendor.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {vendor.rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>15-20 min</span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;