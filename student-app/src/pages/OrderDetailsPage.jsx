import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, CheckCircle, Store, User, Volume2, VolumeX, Play } from 'lucide-react';
import { NOTIFICATION_SOUND } from '../constants/audio';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Audio notification state
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('studentAudioEnabled');
    return saved !== 'false'; // Default to true
  });

  // Use ref to track current audio state (prevents stale closure)
  const audioEnabledRef = useRef(audioEnabled);
  const prevStatusRef = useRef(null);
  const audioRef = useRef(new Audio(NOTIFICATION_SOUND));

  // Update ref when state changes
  useEffect(() => {
    audioEnabledRef.current = audioEnabled;
  }, [audioEnabled]);

  useEffect(() => {
    fetchOrder();

    // Poll for order updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderAPI.getById(orderId);
      setOrder(response.data);
    } catch (error) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };


  // Check for status changes to play audio
  useEffect(() => {
    if (!order) return;

    // Track status changes
    if (prevStatusRef.current && prevStatusRef.current !== order.status) {
      console.log(`🔄 Status changed: ${prevStatusRef.current} -> ${order.status}`);

      if (audioEnabledRef.current) {
        if (order.status === 'confirmed') {
          speakMessage('Your order has been confirmed');
        } else if (order.status === 'preparing') {
          speakMessage('Your food is being prepared');
        } else if (order.status === 'ready') {
          speakOrderReady(order);
        }
      }
    }

    // Update ref
    prevStatusRef.current = order.status;
  }, [order]);

  const playNotificationSound = () => {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.error('Audio play failed:', e);
        toast.error('Tap anywhere to enable audio');
      });
    } catch (error) {
      console.error('Audio error:', error);
    }
  };

  const speakMessage = (text) => {
    // Play sound first (more reliable on mobile)
    playNotificationSound();

    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    toast(`🔊 ${text}`, { icon: '🔔' });
  };

  const speakOrderReady = (order) => {
    // Play sound first
    playNotificationSound();

    if (!window.speechSynthesis) return;

    const itemNames = order.items.map(i => `${i.quantity} ${i.name}`).join(', ');
    const text = `Your order at ${order.vendorId?.name} of ${itemNames} is ready to pickup. Please receive it from the counter.`;

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
    localStorage.setItem('studentAudioEnabled', newAudioState.toString());

    if (newAudioState) {
      // Play to unlock audio context
      playNotificationSound();
      toast.success('Audio notifications enabled');
    } else {
      toast.success('Audio notifications disabled');
    }
  };

  const getStatusSteps = () => {
    const steps = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
    const currentIndex = steps.indexOf(order?.status);

    return steps.map((step, index) => ({
      name: step.charAt(0).toUpperCase() + step.slice(1),
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Order #{order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {order.status === 'ready' && (
              <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold animate-pulse">
                Ready for Pickup!
              </div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{
                    width: `${(statusSteps.filter((s) => s.completed).length / statusSteps.length) * 100}%`,
                  }}
                />
              </div>

              {statusSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${step.completed
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                      }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${step.active ? 'text-orange-600' : 'text-gray-600'
                      }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Ordering from</p>
                <p className="text-lg font-bold text-gray-800">
                  {order.vendorId?.name || 'Vendor'}
                </p>
              </div>
            </div>
          </div>

          {/* Queue Position */}
          {order.queuePosition && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Your Queue Position</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {order.queuePosition === 1 ? (
                      <span className="text-green-600">Next in line! 🎉</span>
                    ) : (
                      <span>
                        Position #{order.queuePosition}
                        <span className="text-base font-normal text-gray-600 ml-2">
                          ({order.queuePosition - 1} {order.queuePosition - 1 === 1 ? 'order' : 'orders'} before you)
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{item.quantity}x</span>
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          {order.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Special Instructions:
              </p>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="border-t pt-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-orange-600">₹{order.totalAmount}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-800">
                {order.paymentMethod || 'Cash'}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {(order.status === 'ready' || order.status === 'preparing') && order.qrCode && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {order.status === 'ready' ? 'Show this QR Code at pickup (not in use)' : 'Your Pickup QR Code (not in use)'}
            </h3>
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-xl border-4 border-orange-500">
                <QRCodeSVG value={order.orderNumber} size={200} />
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Order Number: <span className="font-bold">{order.orderNumber}</span>
            </p>
            {order.status === 'ready' && (
              <p className="text-green-600 font-semibold mt-2 animate-pulse">
                Your food is ready! Please collect from the counter
              </p>
            )}
          </div>
        )}

        {/* Estimated Time */}
        {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'preparing') && (
          <div className="bg-orange-50 rounded-xl p-6 text-center mt-6">
            <Clock className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Estimated Preparation Time
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {order.estimatedTime || 20} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;