import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Store, ShoppingCart, Bell, CreditCard, QrCode, CheckCircle } from 'lucide-react';

const WorkflowDiagram = () => {
  const [expandedSection, setExpandedSection] = useState('student');

  const sections = {
    student: {
      title: 'Student Workflow',
      icon: User,
      color: 'bg-blue-500',
      steps: [
        { num: 1, title: 'Registration/Login', desc: 'POST /api/auth/register or /login', detail: 'Student creates account with college email & gets JWT token' },
        { num: 2, title: 'Browse Vendors', desc: 'GET /api/vendors', detail: 'View all active canteens/food stalls on campus' },
        { num: 3, title: 'View Menu', desc: 'GET /api/menu/vendor/:vendorId', detail: 'See food items, prices, preparation time' },
        { num: 4, title: 'Add to Cart', desc: 'Frontend only', detail: 'Select items & quantities (stored in browser)' },
        { num: 5, title: 'Place Order', desc: 'POST /api/orders', detail: 'Send items, vendorId, totalAmount → Get QR code back' },
        { num: 6, title: 'Payment', desc: 'Razorpay/UPI (future)', detail: 'Complete payment → paymentStatus: completed' },
        { num: 7, title: 'Track Order', desc: 'GET /api/orders/my-orders', detail: 'Watch status: pending → confirmed → preparing → ready' },
        { num: 8, title: 'Get Notification', desc: 'Real-time alerts', detail: 'Receive push notification when order is ready' },
        { num: 9, title: 'Show QR Code', desc: 'Display at counter', detail: 'Vendor scans QR code to verify order' },
        { num: 10, title: 'Collect Food', desc: 'Order completed', detail: 'Vendor marks order as completed' }
      ]
    },
    vendor: {
      title: 'Vendor Workflow',
      icon: Store,
      color: 'bg-green-500',
      steps: [
        { num: 1, title: 'Vendor Registration', desc: 'POST /api/auth/register (role: vendor)', detail: 'Create vendor account with college approval' },
        { num: 2, title: 'Create Vendor Profile', desc: 'POST /api/vendors', detail: 'Add canteen name, description, image, location' },
        { num: 3, title: 'Add Menu Items', desc: 'POST /api/menu', detail: 'Add food items with name, price, category, prep time' },
        { num: 4, title: 'Manage Availability', desc: 'PUT /api/menu/:id', detail: 'Mark items as available/unavailable (sold out)' },
        { num: 5, title: 'Receive Orders', desc: 'GET /api/orders/vendor/:vendorId', detail: 'View incoming orders in real-time queue' },
        { num: 6, title: 'Confirm Order', desc: 'PUT /api/orders/:id/status', detail: 'Change status to "confirmed" → Student notified' },
        { num: 7, title: 'Start Preparing', desc: 'PUT /api/orders/:id/status', detail: 'Change status to "preparing" → Student notified' },
        { num: 8, title: 'Mark Ready', desc: 'PUT /api/orders/:id/status', detail: 'Change status to "ready" → Push notification sent' },
        { num: 9, title: 'Scan QR Code', desc: 'Verify pickup', detail: 'Student shows QR code for order verification' },
        { num: 10, title: 'Complete Order', desc: 'PUT /api/orders/:id/status', detail: 'Mark as "completed" → Order history updated' }
      ]
    },
    technical: {
      title: 'Technical Flow',
      icon: ShoppingCart,
      color: 'bg-purple-500',
      steps: [
        { num: 1, title: 'Client Request', desc: 'Frontend → Backend', detail: 'HTTP request with JWT token in Authorization header' },
        { num: 2, title: 'Auth Middleware', desc: 'middleware/auth.js', detail: 'Verify JWT token → Extract userId & role' },
        { num: 3, title: 'Route Handler', desc: 'routes/*.js', detail: 'Match endpoint → Call appropriate controller' },
        { num: 4, title: 'Controller Logic', desc: 'controllers/*.js', detail: 'Process request → Interact with database' },
        { num: 5, title: 'Database Query', desc: 'MongoDB via Mongoose', detail: 'CRUD operations on User/Vendor/Order/MenuItem' },
        { num: 6, title: 'Business Logic', desc: 'Generate QR, hash passwords', detail: 'Additional processing (bcrypt, QR code, etc.)' },
        { num: 7, title: 'Create Notification', desc: 'models/Notification.js', detail: 'Auto-create notification on order status change' },
        { num: 8, title: 'Response', desc: 'JSON data', detail: 'Send response back to client with data/token/error' },
        { num: 9, title: 'Frontend Update', desc: 'React state update', detail: 'Update UI based on response' },
        { num: 10, title: 'Real-time Sync', desc: 'WebSocket (future)', detail: 'Push updates to vendor dashboard instantly' }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">🍔 CampusEats Workflow</h1>
          <p className="text-xl text-gray-600">Complete System Architecture & Flow</p>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">System Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
              <User className="w-12 h-12 text-blue-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Students</h3>
              <p className="text-sm text-gray-600">Browse menus, place orders, track status, receive notifications</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
              <Store className="w-12 h-12 text-green-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Vendors</h3>
              <p className="text-sm text-gray-600">Manage menu, receive orders, update status, verify pickup</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
              <ShoppingCart className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="font-bold text-lg mb-2">Backend API</h3>
              <p className="text-sm text-gray-600">MongoDB, JWT auth, REST APIs, QR codes, notifications</p>
            </div>
          </div>
        </div>

        {/* Workflow Sections */}
        {Object.entries(sections).map(([key, section]) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === key;
          
          return (
            <div key={key} className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
              <button
                onClick={() => setExpandedSection(isExpanded ? null : key)}
                className={`w-full p-6 flex items-center justify-between ${section.color} text-white hover:opacity-90 transition`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-8 h-8" />
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button>
              
              {isExpanded && (
                <div className="p-6">
                  <div className="space-y-4">
                    {section.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className={`${section.color} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                          {step.num}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800">{step.title}</h3>
                          <p className="text-sm text-gray-600 font-mono bg-gray-100 px-3 py-1 rounded mt-1 inline-block">
                            {step.desc}
                          </p>
                          <p className="text-gray-700 mt-2">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Order Status Flow */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Status Flow</h2>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed'].map((status, idx) => (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-gray-400' :
                    idx === 1 ? 'bg-blue-400' :
                    idx === 2 ? 'bg-yellow-400' :
                    idx === 3 ? 'bg-green-400' :
                    'bg-green-600'
                  } text-white font-bold`}>
                    {idx + 1}
                  </div>
                  <p className="mt-2 font-semibold text-center">{status}</p>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {idx === 0 ? 'Order placed' :
                     idx === 1 ? 'Vendor accepts' :
                     idx === 2 ? 'Food being made' :
                     idx === 3 ? 'Ready to pickup' :
                     'Order delivered'}
                  </p>
                </div>
                {idx < 4 && (
                  <div className="hidden md:block w-12 h-1 bg-gray-300 flex-shrink-0"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Database Models */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Database Models</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border-2 border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-blue-600">User</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• name, email, collegeId</li>
                <li>• password (hashed)</li>
                <li>• role: student/vendor/admin</li>
                <li>• walletBalance</li>
              </ul>
            </div>
            <div className="border-2 border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-green-600">Vendor</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• name, description</li>
                <li>• imageUrl, rating</li>
                <li>• isActive</li>
                <li>• userId (ref)</li>
              </ul>
            </div>
            <div className="border-2 border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-yellow-600">MenuItem</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• name, price, category</li>
                <li>• description, imageUrl</li>
                <li>• isAvailable</li>
                <li>• vendorId (ref)</li>
              </ul>
            </div>
            <div className="border-2 border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-purple-600">Order</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• orderNumber, qrCode</li>
                <li>• items[], totalAmount</li>
                <li>• status, paymentStatus</li>
                <li>• userId, vendorId (refs)</li>
              </ul>
            </div>
            <div className="border-2 border-red-200 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-red-600">Notification</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• title, message, type</li>
                <li>• isRead</li>
                <li>• userId, orderId (refs)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Endpoints Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">API Endpoints (15+)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-blue-600">Authentication</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                  <span className="font-mono">/api/auth/register</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                  <span className="font-mono">/api/auth/login</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                  <span className="font-mono">/api/auth/profile</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-green-600">Vendors</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                  <span className="font-mono">/api/vendors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                  <span className="font-mono">/api/vendors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-mono text-xs">PUT</span>
                  <span className="font-mono">/api/vendors/:id</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-yellow-600">Menu</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                  <span className="font-mono">/api/menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                  <span className="font-mono">/api/menu/vendor/:id</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono text-xs">DEL</span>
                  <span className="font-mono">/api/menu/:id</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-purple-600">Orders</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs">POST</span>
                  <span className="font-mono">/api/orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono text-xs">GET</span>
                  <span className="font-mono">/api/orders/my-orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-mono text-xs">PUT</span>
                  <span className="font-mono">/api/orders/:id/status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDiagram;