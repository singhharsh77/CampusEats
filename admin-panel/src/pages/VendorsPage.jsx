import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Store, Search, ToggleLeft, ToggleRight, Trash2, Eye } from 'lucide-react';

const VendorsPage = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchVendors();
    }, [filter]);

    const fetchVendors = async () => {
        try {
            const params = {};
            if (filter !== 'all') params.status = filter;
            if (searchQuery) params.search = searchQuery;

            const response = await adminAPI.getVendors(params);
            setVendors(response.data);
        } catch (error) {
            toast.error('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleVendor = async (id) => {
        try {
            const response = await adminAPI.toggleVendor(id);
            toast.success(response.data.message);
            fetchVendors();
        } catch (error) {
            toast.error('Failed to toggle vendor');
        }
    };

    const handleDeleteVendor = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all menu items.`)) {
            return;
        }

        try {
            await adminAPI.deleteVendor(id);
            toast.success('Vendor deleted successfully');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to delete vendor');
        }
    };

    const handleSearch = () => {
        fetchVendors();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Store className="w-8 h-8 text-blue-500" />
                    Vendor Management
                </h1>
                <div className="text-sm text-gray-600">
                    Total: {vendors.length} vendors
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search vendors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filter */}
                    <div className="flex gap-2">
                        {['all', 'active', 'inactive'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`flex-1 py-2 rounded-lg font-medium transition-colors ${filter === status
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Vendors List */}
            {loading ? (
                <div className="text-center py-12 text-gray-600">Loading vendors...</div>
            ) : vendors.length === 0 ? (
                <div className="text-center py-12 text-gray-600">No vendors found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.map((vendor) => (
                        <div key={vendor._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <img
                                src={vendor.imageUrl || 'https://via.placeholder.com/400x200'}
                                alt={vendor.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{vendor.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Owner: {vendor.userId?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${vendor.isActive
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {vendor.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {vendor.description}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                    <span>⭐ {vendor.rating || 0}</span>
                                    <span>•</span>
                                    <span>{vendor.totalRatings || 0} ratings</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleVendor(vendor._id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${vendor.isActive
                                                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                                                : 'bg-green-500 text-white hover:bg-green-600'
                                            }`}
                                    >
                                        {vendor.isActive ? (
                                            <>
                                                <ToggleLeft className="w-4 h-4" />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <ToggleRight className="w-4 h-4" />
                                                Enable
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteVendor(vendor._id, vendor.name)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorsPage;
