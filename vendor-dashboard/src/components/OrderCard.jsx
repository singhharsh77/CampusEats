import React from 'react';
import { Clock, User, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const OrderCard = ({ order, onUpdateStatus }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'border-yellow-400 bg-yellow-50',
      confirmed: 'border-blue-400 bg-blue-50',
      preparing: 'border-orange-400 bg-orange-50',
      ready: 'border-green-400 bg-green-50',
      completed: 'border-gray-400 bg-gray-50',
    };
    return colors[status] || 'border-gray-300 bg-white';
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

  return (
    <div className={`border-2 rounded-xl p-6 ${getStatusColor(order.status)} transition-all hover:shadow-lg`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Order #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
            order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
            order.status === 'confirmed' ? 'bg-blue-200 text-blue-800' :
            order.status === 'preparing' ? 'bg-orange-200 text-orange-800' :
            order.status === 'ready' ? 'bg-green-200 text-green-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {order.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User className="w-4 h-4" />
          <span className="font-semibold">{order.userId?.name || 'Customer'}</span>
        </div>
        {order.userId?.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Phone className="w-4 h-4" />
            <span>{order.userId.phone}</span>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm bg-white rounded-lg p-2">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Instructions */}
      {order.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-xs font-semibold text-yellow-800 mb-1">Special Instructions:</p>
          <p className="text-sm text-yellow-900">{order.notes}</p>
        </div>
      )}

      {/* Action Buttons */}
      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <div className="flex gap-2">
          <button
            onClick={() => onUpdateStatus(order._id, getNextStatus(order.status))}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition"
          >
            {getActionLabel(order.status)}
          </button>
          {order.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(order._id, 'cancelled')}
              className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;