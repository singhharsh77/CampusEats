import React, { useState } from 'react';
import useAuthStore from './store/authStore';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import VendorsPage from './pages/VendorsPage';
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

function App() {
  const { token } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!token) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'vendors':
        return <VendorsPage />;
      case 'users':
        return <UsersPage />;
      case 'orders':
        return <OrdersPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 overflow-auto">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
