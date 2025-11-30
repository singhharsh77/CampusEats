# 🚀 Quick Setup Guide - CampusEats

This is a **private repository** with all configuration pre-loaded. Just clone and run!

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn installed
- MongoDB Atlas account (connection string already configured)

## ⚡ Quick Start (3 Steps)

### 1. Clone the Repository

```bash
git clone https://github.com/singhharsh77/CampusEats.git
cd CampusEats
```

### 2. Install Dependencies

Open **3 separate terminals** and run:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
Server will start on: `http://localhost:5001`

**Terminal 2 - Vendor Dashboard:**
```bash
cd vendor-dashboard
npm install
npm run dev
```
Dashboard will open at: `http://localhost:5174`

**Terminal 3 - Student App:**
```bash
cd student-app
npm install
npm run dev
```
App will open at: `http://localhost:5173`

### 3. Start Using!

- **Vendor Dashboard**: http://localhost:5174
- **Student App**: http://localhost:5173
- **API**: http://localhost:5001

That's it! Everything is pre-configured. 🎉

## 🤖 Optional: Auto-Complete Service

To automatically move old orders to history every 5 minutes:

**Terminal 4:**
```bash
cd backend
npm run auto-complete
```

## 📱 Features

### Vendor Dashboard
- ✅ Real-time order management
- ✅ Audio notifications (click 🔊 to enable)
- ✅ Swipe gestures for order updates
- ✅ Menu management
- ✅ Order history

### Student App
- ✅ Browse vendors
- ✅ View menus
- ✅ Place orders
- ✅ Track order status
- ✅ Order history

## 🔧 Configuration

All environment variables are pre-configured in `backend/.env`:
- ✅ MongoDB connection
- ✅ Database name
- ✅ Server port
- ✅ JWT secret

**No additional setup required!**

## 🐛 Troubleshooting

### Port Already in Use
If you see `EADDRINUSE` error:

```bash
# Kill process on port 5001
lsof -ti :5001 | xargs kill -9

# Then restart backend
cd backend && npm run dev
```

### MongoDB Connection Issues
- Check if MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify the connection string in `backend/.env`

### Frontend Not Connecting
- Make sure backend is running on port 5001
- Check browser console for errors
- Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

## 📊 Default Credentials

The database already has sample data. You can:
- Register new users
- Login with existing accounts
- Create vendors
- Add menu items
- Place orders

## 🎨 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **State**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📞 Support

For issues or questions, contact: [Your Email/Contact]

---

**Enjoy using CampusEats! 🍔**
