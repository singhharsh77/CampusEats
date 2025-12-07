import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import { Users, Clock } from 'lucide-react';

const LiveOrderQueue = ({ vendorId }) => {
    const [orderCount, setOrderCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!vendorId) return;

        fetchLiveOrderCount();

        // Poll every 10 seconds for updates
        const interval = setInterval(fetchLiveOrderCount, 10000);
        return () => clearInterval(interval);
    }, [vendorId]);

    const fetchLiveOrderCount = async () => {
        try {
            const response = await orderAPI.getLiveOrderCount(vendorId);
            setOrderCount(response.data.count);
        } catch (error) {
            console.error('Failed to fetch live order count:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-6 border border-orange-200">
                <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    <span className="text-gray-600">Loading queue status...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 mb-6 border border-orange-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-3 rounded-full">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-600">Live Order Queue</h3>
                        <p className="text-2xl font-bold text-gray-800">
                            {orderCount === 0 ? (
                                <span className="text-green-600">No orders in queue</span>
                            ) : orderCount === 1 ? (
                                <span>1 order being handled</span>
                            ) : (
                                <span>{orderCount} orders being handled</span>
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span>Live</span>
                </div>
            </div>

            {orderCount > 0 && (
                <div className="mt-3 pt-3 border-t border-orange-200">
                    <p className="text-sm text-gray-600">
                        ⏱️ Your order will be added to the queue after confirmation
                    </p>
                </div>
            )}
        </div>
    );
};

export default LiveOrderQueue;
