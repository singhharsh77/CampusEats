import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const { items, vendor, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const user = useAuthStore((state) => state.user);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        vendorId: vendor._id,
        items: items.map((item) => ({
          menuItemId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotal(),
        notes: notes || undefined,
        paymentMethod: 'Cash', // For now, we'll add Razorpay later
      };

      const response = await orderAPI.create(orderData);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some delicious items to get started</p>
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
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-600 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Vendor Info */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-sm text-gray-600">Ordering from</p>
              <p className="text-lg font-bold text-gray-800">{vendor.name}</p>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl p-4 shadow-md flex items-center gap-4"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-2xl">🍽️</span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">₹{item.price} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="font-semibold w-8 text-center">{item.quantity}</span>

                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-bold text-gray-800">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}

            {/* Notes */}
            <div className="bg-white rounded-xl p-4 shadow-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests? (e.g., less spicy, no onions)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows="3"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₹{getTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">₹{getTotal()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;