import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle, XCircle, Volume2, VolumeX, Play } from 'lucide-react';
import { NOTIFICATION_SOUND } from '../constants/audio';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Tracking refs
  const audioEnabledRef = useRef(false);
  const prevOrdersRef = useRef([]);
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND));

  useEffect(() => {
    fetchOrders();

    // Poll for updates every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Audio notification state
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('studentAudioEnabled');
    return saved !== 'false'; // Default to true
  });

  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  const playNotificationSound = () => {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.error('Audio play failed:', e);
        toast.error('Tap the audio icon to enable sound');
      });
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const toggleAudio = () => {
    const newAudioState = !audioEnabled;
    setAudioEnabled(newAudioState);
    localStorage.setItem('studentAudioEnabled', newAudioState.toString());

    if (newAudioState) {
      // Play to unlock audio context
      playNotificationSound();
      toast.success('Audio notifications enabled');
    } else {
      toast.success('Audio notifications disabled');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      const newOrders = response.data;

      // Check for status changes to play audio
      if (prevOrdersRef.current.length > 0 && audioEnabledRef.current) {
        newOrders.forEach(newOrder => {
          const oldOrder = prevOrdersRef.current.find(o => o._id === newOrder._id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            // Status changed!
            if (['confirmed', 'preparing', 'ready'].includes(newOrder.status)) {
              speakStatusUpdate(newOrder);
            }
          }
        });
      }

      setOrders(newOrders);
      prevOrdersRef.current = newOrders;
    } catch (error) {
      // toast.error('Failed to load orders'); // Suppress to avoid spamming on poll fail
      console.error('Poll failed', error);
    } finally {
      setLoading(false);
    }
  };

  const speakStatusUpdate = (order) => {
    // Play sound first
    playNotificationSound();

    if (!window.speechSynthesis) return;

    let text = '';
    if (order.status === 'confirmed') text = `Your order has been confirmed.`;
    if (order.status === 'preparing') text = `Your order at ${order.vendorId?.name} is being prepared.`;
    if (order.status === 'ready') text = `Your order at ${order.vendorId?.name} is ready for pickup!`;

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel(); // Stop overlap
      window.speechSynthesis.speak(utterance);
      toast(`🔊 ${text}`, { icon: '🔔' });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-yellow-100 text-yellow-700',
      ready: 'bg-green-100 text-green-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5" />;
    if (status === 'cancelled') return <XCircle className="w-5 h-5" />;
    return <Clock className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start ordering delicious food!</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Browse Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

          {/* Audio Toggle Button */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-colors ${audioEnabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
              }`}
            title={audioEnabled ? "Mute Audio" : "Enable Audio"}
          >
            {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orders/${order._id}`)}
              className="bg-white shadow-md hover:shadow-lg transition-all cursor-pointer p-6"
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '9px',
                margin: '1px 4px 9px 0px'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                  <h3 className="text-lg font-bold text-gray-800">
                    {order.vendorId?.name || 'Vendor'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-semibold capitalize">{order.status}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items.map((item) => item.name).join(', ')}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;