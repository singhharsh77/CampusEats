import React, { useEffect, useState, useRef } from 'react';
import { orderAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useOrdersStore from '../store/ordersStore';
import OrderCard from '../components/OrderCard';
import toast from 'react-hot-toast';
import { RefreshCw, ShoppingBag, Volume2, VolumeX, Clock } from 'lucide-react';

const OrdersPage = () => {
  const { vendor } = useAuthStore();
  const { orders, setOrders, updateOrderStatus } = useOrdersStore();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load audio state from localStorage
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('audioEnabled');
    return saved === 'true';
  });

  // Use ref to track current audio state (prevents stale closure)
  const audioEnabledRef = useRef(audioEnabled);
  const prevOrdersRef = useRef([]);

  // Update ref when state changes
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    if (vendor) {
      fetchOrders(true); // Initial load

      // Auto-refresh every 5 seconds
      const interval = setInterval(() => fetchOrders(false), 5000);
      return () => clearInterval(interval);
    }
  }, [vendor]); // Removed selectedStatus dependency as we fetch all

  const fetchOrders = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);

    try {
      let currentVendorId = vendor?._id;

      // If vendor ID is missing, try to fetch vendor profile first
      if (!currentVendorId) {
        try {
          const vendorResponse = await import('../services/api').then(m => m.vendorAPI.getMyVendor());
          const vendorData = vendorResponse.data;
          useAuthStore.getState().setVendor(vendorData);
          currentVendorId = vendorData._id;
        } catch (err) {
          console.error('Failed to fetch vendor profile:', err);
          // Don't show error toast here to avoid spamming, just return
          return;
        }
      }

      if (!currentVendorId) return;

      // Fetch ALL orders (including completed and cancelled)
      const response = await orderAPI.getVendorOrders(currentVendorId);
      const allOrders = response.data;

      // Audio Notification for New Pending Orders (only in live view)
      if (!showHistory) {
        const activeOrders = allOrders.filter(order =>
          ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
        );

        const newPendingOrders = activeOrders.filter(
          n => n.status === 'pending' &&
            !prevOrdersRef.current.find(p => p._id === n._id)
        );

        console.log('🔍 Audio Debug:', {
          newPendingOrders: newPendingOrders.length,
          audioEnabled: audioEnabledRef.current,
          showHistory
        });

        if (newPendingOrders.length > 0) {
          console.log('🆕 New orders detected:', newPendingOrders.map(o => o.orderNumber));

          if (audioEnabledRef.current) {
            console.log('🔊 Playing audio for new orders');
            newPendingOrders.forEach(order => speakOrder(order));
          } else {
            console.log('🔇 Audio is disabled - click the speaker icon to enable');
          }
        }

        prevOrdersRef.current = activeOrders;
      }

      // Store all orders for filtering
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // toast.error('Failed to load orders'); // Suppress frequent error toasts
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const speakOrder = (order) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    const text = `New order received. ${order.items.map(i => `${i.quantity} ${i.name}`).join(', ')}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Speak the order
    window.speechSynthesis.speak(utterance);
  };

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    localStorage.setItem('audioEnabled', newAudioState.toString());

    console.log('🔊 Audio toggled:', newAudioState);

    if (newAudioState) {
      // Test audio to initialize context
      const testUtterance = new SpeechSynthesisUtterance('Audio notifications enabled');
      testUtterance.volume = 0.5;
      window.speechSynthesis.speak(testUtterance);
      toast.success('Audio notifications enabled');
    } else {
      toast.success('Audio notifications disabled');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders(false); // Refresh orders after status change
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const toggleHistory = () => setShowHistory(!showHistory);

  // Filter orders based on view
  const displayedOrders = showHistory
    ? orders.filter(o => o.status === 'completed' || o.status === 'cancelled')
    : orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {showHistory ? 'Order History' : 'Live Orders'}
          </h1>
          <p className="text-gray-600">
            {displayedOrders.length} {showHistory ? 'past' : 'active'} orders
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleHistory}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showHistory ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
          >
            {showHistory ? 'View Live Orders' : 'View History'}
          </button>

          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${audioEnabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}
            title={audioEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          <button
            onClick={() => fetchOrders(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-6 h-6 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No {showHistory ? 'past' : 'active'} orders</h3>
          <p className="text-gray-500 mt-1">
            {showHistory ? 'Completed orders will appear here' : 'New orders will appear here automatically'}
          </p>
        </div>
      ) : (
        <div className="flex gap-6" style={{
          display: 'flex',
          width: '100%',
          overflow: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {displayedOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;