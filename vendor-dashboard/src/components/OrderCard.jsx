import React, { useState, useEffect } from 'react';
import { Clock, User, Phone, Check, X } from 'lucide-react';
import { formatDistanceToNow, differenceInMinutes } from 'date-fns';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const OrderCard = ({ order, onUpdateStatus }) => {
  const [freshnessColor, setFreshnessColor] = useState('bg-green-50');
  const [borderColor, setBorderColor] = useState('border-green-500');

  // Check if this is a history order (completed or cancelled)
  const isHistoryOrder = order.status === 'completed' || order.status === 'cancelled';

  // Swipe logic (only for active orders)
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0]);
  const background = useTransform(
    y,
    [-100, 0, 100],
    ['rgba(16, 185, 129, 0.2)', 'rgba(255, 255, 255, 1)', 'rgba(239, 68, 68, 0.2)']
  );

  useEffect(() => {
    const updateFreshness = () => {
      // If order is completed or cancelled, show neutral style
      if (isHistoryOrder) {
        setFreshnessColor('bg-white');
        setBorderColor('border-gray-200');
        return;
      }

      const minutesOld = differenceInMinutes(new Date(), new Date(order.createdAt));

      // Simple Logic:
      // < 5 mins: Green (Fresh)
      // >= 5 mins: Red (Old/Urgent)
      if (minutesOld < 5) {
        setFreshnessColor('bg-green-50');
        setBorderColor('border-green-500');
      } else {
        setFreshnessColor('bg-red-50');
        setBorderColor('border-red-500');
      }
    };

    updateFreshness();
    const interval = setInterval(updateFreshness, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [order.createdAt, order.status, isHistoryOrder]);

  const handleDragEnd = (event, info) => {
    if (isHistoryOrder) return; // No swipe for history orders

    const offset = info.offset.y;
    const velocity = info.velocity.y;

    // Swipe Up (Negative Y) -> Complete/Ready (Positive action)
    if (offset < -100 || velocity < -500) {
      if (order.status === 'ready') {
        onUpdateStatus(order._id, 'completed');
      } else {
        // Advance to next status
        const next = getNextStatus(order.status);
        if (next) onUpdateStatus(order._id, next);
      }
    }
    // Swipe Down (Positive Y) -> Cancel/Reject (Negative action)
    else if (offset > 100 || velocity > 500) {
      if (order.status === 'pending') {
        onUpdateStatus(order._id, 'cancelled');
      }
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    };
    return statusFlow[currentStatus];
  };

  const getActionLabel = (currentStatus) => {
    const labels = {
      pending: 'Accept Order',
      confirmed: 'Start Preparing',
      preparing: 'Mark as Ready',
      ready: 'Complete Order',
    };
    return labels[currentStatus];
  };

  // Render static card for history orders
  if (isHistoryOrder) {
    return (
      <div className="relative flex-shrink-0 w-80 md:w-96 p-6" style={{
        border: '2px solid black',
        margin: '1px 0px 2px 9px',
        borderRadius: '27px',
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
        backgroundColor: freshnessColor === 'bg-white' ? 'white' : freshnessColor === 'bg-green-50' ? '#f0fdf4' : '#fef2f2'
      }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">#{order.orderNumber.slice(-4)}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${order.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
            <p className="text-xs text-gray-500">{order.paymentMethod}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-4 p-3 bg-white/50 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-700">{order.userId?.name || 'Guest'}</span>
          </div>
          {order.userId?.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Phone className="w-3 h-3" />
              <span>{order.userId.phone}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 mb-4">
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 w-6">{item.quantity}x</span>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-500">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          {order.notes && (
            <div className="mt-3 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
              <span className="font-bold">Note:</span> {order.notes}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render interactive card for active orders
  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      className="relative flex-shrink-0 w-80 md:w-96 p-6 transition-shadow hover:shadow-xl cursor-grab active:cursor-grabbing group"
      style={{
        y,
        opacity,
        background,
        border: '2px solid black',
        margin: '1px 0px 2px 9px',
        borderRadius: '27px',
        textAlign: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
        backgroundColor: freshnessColor === 'bg-green-50' ? '#f0fdf4' : '#fef2f2'
      }}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-x-0 -top-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Check className="w-3 h-3" /> Swipe Up to Advance
        </span>
      </div>
      <div className="absolute inset-x-0 -bottom-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <X className="w-3 h-3" /> Swipe Down to Cancel
        </span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">#{order.orderNumber.slice(-4)}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
              order.status === 'confirmed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                order.status === 'preparing' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                  order.status === 'ready' ? 'bg-green-100 text-green-700 border-green-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-800">₹{order.totalAmount}</p>
          <p className="text-xs text-gray-500">{order.paymentMethod}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-4 p-3 bg-white/50 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-700">{order.userId?.name || 'Guest'}</span>
        </div>
        {order.userId?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Phone className="w-3 h-3" />
            <span>{order.userId.phone}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 mb-4">
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 w-6">{item.quantity}x</span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="text-gray-500">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        {order.notes && (
          <div className="mt-3 text-sm text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
            <span className="font-bold">Note:</span> {order.notes}
          </div>
        )}
      </div>

      {/* Action Hint */}
      <div className="mt-auto pt-4 border-t border-gray-100 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 mb-2">
          {order.status === 'pending' ? (
            <>
              <X className="w-4 h-4" /> Swipe down to reject
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Swipe up to advance
            </>
          )}
        </div>

        {/* Fallback Button for Desktop */}
        <button
          onClick={() => onUpdateStatus(order._id, getNextStatus(order.status))}
          className={`w-full py-2 rounded-lg font-semibold text-white transition-colors ${order.status === 'pending' ? 'bg-blue-500 hover:bg-blue-600' :
            order.status === 'confirmed' ? 'bg-orange-500 hover:bg-orange-600' :
              order.status === 'preparing' ? 'bg-green-500 hover:bg-green-600' :
                'bg-gray-800 hover:bg-gray-900'
            }`}
        >
          {getActionLabel(order.status)}
        </button>
      </div>
    </motion.div>
  );
};

export default OrderCard;