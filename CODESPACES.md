# 🚀 CampusEats - Codespaces Setup Guide

## Quick Start in GitHub Codespaces

### 1. Open in Codespaces
1. Go to https://github.com/singhharsh77/CampusEats
2. Click the green "Code" button
3. Select "Codespaces" tab
4. Click "Create codespace on main"

### 2. Fresh Install (Recommended)

Run the automated setup script:

```bash
./fresh-setup.sh
```

This will:
- Kill any existing processes
- Remove old node_modules
- Fresh install all dependencies
- Set up all 4 applications

### 3. Manual Setup (Alternative)

If the script doesn't work, run manually:

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

# Student App
cd student-app
rm -rf node_modules package-lock.json
npm install
cd ..

# Vendor Dashboard
cd vendor-dashboard
rm -rf node_modules package-lock.json
npm install
cd ..

# Admin Panel
cd admin-panel
rm -rf node_modules package-lock.json
npm install
cd ..
```

### 4. Run All Applications

Open **4 terminals** in Codespaces:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Student App:**
```bash
cd student-app
npm run dev
```

**Terminal 3 - Vendor Dashboard:**
```bash
cd vendor-dashboard
npm run dev
```

**Terminal 4 - Admin Panel:**
```bash
cd admin-panel
npm run dev
```

---

## 🔧 Troubleshooting

### Vendor Dashboard Showing Old Version

If the vendor dashboard seems stuck on an old version:

1. **Hard Refresh Browser:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

2. **Clear Build Cache:**
   ```bash
   cd vendor-dashboard
   rm -rf dist node_modules .vite
   npm install
   npm run dev
   ```

3. **Check Git Version:**
   ```bash
   git log --oneline -1
   ```
   Should show: `dda0fac` or later

4. **Verify Files:**
   ```bash
   cat vendor-dashboard/src/pages/OrdersPage.jsx | head -20
   ```
   Should show audio notification code

### Port Already in Use

```bash
# Kill all ports
lsof -ti :5001 | xargs kill -9
lsof -ti :5173 | xargs kill -9
lsof -ti :5174 | xargs kill -9
lsof -ti :5175 | xargs kill -9
```

### MongoDB Connection Issues

The `.env` file is included in the repo (private repo).
If issues persist:

1. Check `backend/.env` exists
2. Verify `MONGO_URI` is set
3. Restart backend

### Missing Dependencies

```bash
# Reinstall specific app
cd [app-name]
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

---

## 📱 Access URLs in Codespaces

Codespaces will automatically forward ports. Look for popup or:

1. Click "PORTS" tab at bottom
2. Find port numbers:
   - 5001 - Backend API
   - 5173 - Student App
   - 5174 - Vendor Dashboard
   - 5175 - Admin Panel
3. Click globe icon to open in browser

---

## 🔑 Login Credentials

### Admin Panel
- Email: `admin@campuseats.com`
- Password: `Admin@123`
- URL: Port 5175

### Vendor Dashboard
- Register new vendor or use existing

### Student App
- Register new student or use existing

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on port 5001
- [ ] Student app accessible
- [ ] Vendor dashboard accessible with latest UI
- [ ] Admin panel accessible
- [ ] Can login to admin panel
- [ ] MongoDB connection working
- [ ] Orders refreshing in vendor dashboard

---

## 🎯 Latest Features (Vendor Dashboard)

The vendor dashboard should have:
- ✅ Horizontal scrolling orders
- ✅ Audio notifications (speaker icon)
- ✅ Black borders on order cards
- ✅ Rounded (27px) corners
- ✅ Custom shadow effects
- ✅ Auto-complete for old orders
- ✅ Static history cards

If you don't see these, you're on an old version!

---

## 🔄 Force Update

If absolutely nothing works:

```bash
# Go to repository root
cd ~/workspace/CampusEats  # or wherever it is

# Nuclear option - reclone
cd ..
rm -rf CampusEats
git clone https://github.com/singhharsh77/CampusEats.git
cd CampusEats
./fresh-setup.sh
```

---

## 📊 Current Version

Latest commit: `dda0fac`
Last major update: Admin panel + vendor dashboard fixes

Check your version:
```bash
git log --oneline -1
```

---

## 💡 Tips for Codespaces

1. **Save Codespace**: Your codespace will save your setup
2. **Rebuild**: Use "Rebuild Container" if persistent issues
3. **Browser Cache**: Always hard refresh after updates
4. **Multiple Codespaces**: Delete old ones to save resources

---

## 🆘 Still Having Issues?

1. Check all 4 apps are running
2. Verify ports are forwarded in Codespaces
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for errors
5. Verify you're on latest commit

---

**Need Help?** Check the main README.md for more details.

**Repository:** https://github.com/singhharsh77/CampusEats
