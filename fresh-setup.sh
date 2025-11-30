#!/bin/bash

# CampusEats - Fresh Setup Script
# This script ensures a clean installation in Codespaces or fresh clones

echo "🚀 CampusEats Fresh Setup"
echo "========================="
echo ""

# Kill any existing processes on ports
echo "🔧 Cleaning up ports..."
lsof -ti :5001 | xargs kill -9 2>/dev/null || true
lsof -ti :5173 | xargs kill -9 2>/dev/null || true
lsof -ti :5174 | xargs kill -9 2>/dev/null || true
lsof -ti :5175 | xargs kill -9 2>/dev/null || true

# Clean node_modules and reinstall
echo ""
echo "📦 Installing Backend..."
cd backend
rm -rf node_modules package-lock.json
npm install
cd ..

echo ""
echo "📦 Installing Student App..."
cd student-app
rm -rf node_modules package-lock.json
npm install
cd ..

echo ""
echo "📦 Installing Vendor Dashboard..."
cd vendor-dashboard
rm -rf node_modules package-lock.json
npm install
cd ..

echo ""
echo "📦 Installing Admin Panel..."
cd admin-panel
rm -rf node_modules package-lock.json
npm install
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🎯 To run all apps, open 4 terminals:"
echo ""
echo "Terminal 1: cd backend && npm run dev"
echo "Terminal 2: cd student-app && npm run dev"
echo "Terminal 3: cd vendor-dashboard && npm run dev"
echo "Terminal 4: cd admin-panel && npm run dev"
echo ""
echo "📱 Access URLs:"
echo "Backend: http://localhost:5001"
echo "Student App: http://localhost:5173"
echo "Vendor Dashboard: http://localhost:5174"
echo "Admin Panel: http://localhost:5175"
echo ""
echo "🔑 Admin Login:"
echo "Email: admin@campuseats.com"
echo "Password: Admin@123"
