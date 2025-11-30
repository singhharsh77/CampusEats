# 🎉 CampusEats - Complete Platform

A comprehensive campus food ordering system with **4 separate applications**.

---

## 📱 Applications

### 1. Student App (Port 5173)
Browse vendors, order food, track orders
- URL: http://localhost:5173

### 2. Vendor Dashboard (Port 5174)
Manage menu, orders, real-time notifications
- URL: http://localhost:5174

### 3. Admin Panel (Port 5175) 🆕
**Complete platform control and monitoring**
- URL: http://localhost:5175
- **Email**: admin@campuseats.com
- **Password**: Admin@123

### 4. Backend API (Port 5001)
RESTful API for all applications
- URL: http://localhost:5001

---

## 🚀 Quick Start

### Option 1: Run All (4 terminals)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Student App
cd student-app
npm run dev

# Terminal 3 - Vendor Dashboard
cd vendor-dashboard  
npm run dev

# Terminal 4 - Admin Panel
cd admin-panel
npm run dev
```

### Option 2: Fresh Clone

```bash
git clone https://github.com/singhharsh77/CampusEats.git
cd CampusEats

# Install all dependencies
cd backend && npm install && cd ..
cd student-app && npm install && cd ..
cd vendor-dashboard && npm install && cd ..
cd admin-panel && npm install && cd ..

# Run all (4 separate terminals)
```

---

## 🔑 Login Credentials

### Admin Panel
- Email: `admin@campuseats.com`
- Password: `Admin@123`

### Create Your Own Accounts
- Students: Register in Student App
- Vendors: Register in Vendor Dashboard

---

## 🎯 Admin Panel Features

### Dashboard
- 📊 Total vendors, users, orders, revenue stats
- 📈 Charts for orders and revenue (last 7 days)
- 🕐 Recent orders feed
- ♻️ Auto-refresh every 30 seconds

### Vendor Management
- 👀 View all vendors with images
- ✅ Enable/disable vendors
- 🗑️ Delete vendors and menus
- 🔍 Search and filter

### User Management
- 📋 View all students and vendors
- 🚫 Ban/unban users
- 🗑️ Delete user accounts
- 🔍 Filter by role and status
- 🔒 Protected: Cannot ban/delete admins

### Order Monitoring
- 📦 See all platform orders
- ♻️ Real-time updates (10s refresh)
- 🏷️ Filter by status
- 👥 View customer and vendor details

---

## 🛠️ Tech Stack

### Frontend
- **React** + **Vite**
- **Zustand** (State Management)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **Recharts** (Charts)
- **React Hot Toast** (Notifications)
- **Lucide React** (Icons)

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (Authentication)
- **Bcrypt** (Password Hashing)
- **Express Rate Limit** (Security)

---

## 📂 Project Structure

```
CampusEats/
├── backend/              # Express API
│   ├── controllers/      # Route handlers
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & rate limiting
│   └── seedAdmin.js     # Create admin user
├── student-app/         # Student interface
├── vendor-dashboard/    # Vendor interface
└── admin-panel/         # Admin interface 🆕
    ├── src/
    │   ├── components/  # Sidebar, StatCard
    │   ├── pages/       # Dashboard, Vendors, Users, Orders
    │   ├── services/    # API client
    │   └── store/       # Auth state
    └── package.json
```

---

## 🔐 API Endpoints

### Admin Routes (Requires Admin Token)

```
GET  /api/admin/stats              # Platform statistics
GET  /api/admin/analytics          # Charts data
GET  /api/admin/vendors            # All vendors
PUT  /api/admin/vendors/:id/toggle # Enable/disable
DELETE /api/admin/vendors/:id      # Delete vendor
GET  /api/admin/users              # All users
PUT  /api/admin/users/:id/ban      # Ban/unban
DELETE /api/admin/users/:id        # Delete user
GET  /api/admin/orders             # All orders
GET  /api/admin/orders/:id         # Order details
```

### Other Routes
```
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
GET  /api/vendors        # Active vendors
GET  /api/menu/:vendorId # Vendor menu
POST /api/orders         # Create order
GET  /api/orders/vendor/:id # Vendor orders
```

---

## ✨ Special Features

### Backend
- ✅ MongoDB auto-reconnect
- ✅ Rate limiting (1000 req/15min)
- ✅ CORS protection
- ✅ JWT authentication
- ✅ Auto-complete old orders (script)

### Vendor Dashboard
- ✅ Audio notifications
- ✅ Swipe gestures
- ✅ Auto-refresh orders
- ✅ Horizontal scroll layout

### Admin Panel
- ✅ Real-time monitoring
- ✅ Beautiful analytics charts
- ✅ Search and filters
- ✅ Responsive design
- ✅ Auto-refresh data

---

## 🤖 Automation

### Auto-Complete Service
Automatically marks orders as completed after 10 minutes:

```bash
cd backend
npm run auto-complete
```

Runs every 5 minutes in the background.

---

## 📝 Notes

- **Database**: MongoDB Atlas (cloud)
- **Rate Limiting**: Disabled for localhost
- **Admin User**: Pre-seeded in database
- **Private Repo**: `.env` files included
- **Ready to Deploy**: All apps configured

---

## 🌐 Deployment

See [deployment_guide.md](deployment_guide.md) for hosting instructions on:
- **Backend**: Render (free)
- **Frontends**: Vercel (free)
- **Database**: MongoDB Atlas (free)

---

## 📊 Statistics

- **4 Applications**: Student, Vendor, Admin, Backend
- **30+ React Components**
- **15+ API Endpoints**
- **3 User Roles**: Student, Vendor, Admin
- **Real-time Features**: Auto-refresh, notifications
- **Mobile Responsive**: All interfaces

---

## 🎯 Use Cases

- **Students**: Order food from campus vendors
- **Vendors**: Manage menu and orders
- **Admins**: Monitor and control entire platform

---

## 🔗 Repository

GitHub: https://github.com/singhharsh77/CampusEats

---

**Built with ❤️ for campus communities**

