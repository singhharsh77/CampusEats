# 🍔 CampusEats - Campus Food Ordering Platform

A modern, full-stack food ordering platform designed for campus environments, featuring separate interfaces for vendors and students.

## ✨ Features

### For Vendors 🏪
- **Real-time Order Management** - Live order dashboard with auto-refresh
- **Audio Notifications** - Voice alerts for new orders
- **Swipe Gestures** - Quick order status updates with touch-friendly controls
- **Menu Management** - Easy add/edit/delete menu items
- **Order History** - Track completed and cancelled orders
- **Auto-complete** - Orders automatically move to history after 10 minutes

### For Students 🎓
- **Browse Vendors** - View all active campus vendors
- **Menu Browsing** - See available items with prices
- **Quick Ordering** - Simple cart and checkout
- **Order Tracking** - Real-time order status updates
- **Order History** - View past orders

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Zustand** - State management
- **Framer Motion** - Animations and gestures
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Express Rate Limit** - DoS protection

## 📁 Project Structure

```
CampusEats/
├── backend/              # Express API server
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── index.js         # Entry point
├── vendor-dashboard/    # Vendor React app
│   └── src/
│       ├── components/  # Reusable components
│       ├── pages/       # Page components
│       ├── services/    # API services
│       └── store/       # Zustand stores
└── student-app/         # Student React app
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── store/
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/CampusEats.git
cd CampusEats
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

3. **Setup Vendor Dashboard**
```bash
cd vendor-dashboard
npm install
npm run dev
```

4. **Setup Student App**
```bash
cd student-app
npm install
npm run dev
```

### Environment Variables

Create `.env` in `backend/`:
```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=campuseats
PORT=5001
JWT_SECRET=your_secret_key
```

## 🎯 Usage

1. **Vendor Dashboard**: http://localhost:5174
2. **Student App**: http://localhost:5173
3. **Backend API**: http://localhost:5001

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Rate Limiting (1000 req/15min)
- ✅ CORS Protection
- ✅ Input Validation
- ✅ Password Hashing (bcrypt)

## 🎨 UI Features

- **Responsive Design** - Works on mobile and desktop
- **Touch Gestures** - Swipe to update order status
- **Real-time Updates** - Auto-refresh every 5 seconds
- **Audio Notifications** - Browser speech synthesis
- **Horizontal Scrolling** - Smooth card navigation
- **Custom Styling** - Black borders, rounded corners, premium shadows

## 📱 Mobile Support

- Touch-friendly swipe gestures
- Responsive grid layouts
- Mobile-optimized UI components
- Works on all modern browsers

## 🤖 Automation

- **Auto-complete Service** - Runs every 5 minutes
- **Order Cleanup** - Completes orders older than 10 minutes
- **MongoDB Auto-reconnect** - Handles connection drops

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Vendors
- `GET /api/vendors` - Get all active vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `PUT /api/vendors/:id` - Update vendor

### Menu
- `GET /api/menu/vendor/:vendorId` - Get vendor menu
- `POST /api/menu` - Add menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `GET /api/orders/vendor/:vendorId` - Get vendor orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

## 🐛 Known Issues

- Backend sleeps on free tier (Render) after 15 mins inactivity
- First request after sleep takes ~30s (cold start)

## 🚀 Deployment

See [deployment_guide.md](deployment_guide.md) for detailed instructions on deploying to:
- **Backend**: Render (free)
- **Frontend**: Vercel (free)
- **Database**: MongoDB Atlas (free)

## 📝 License

MIT

## 👨‍💻 Author

Harsh Singh

## 🙏 Acknowledgments

- Built with ❤️ for campus communities
- Inspired by modern food delivery platforms
- Designed for simplicity and efficiency
