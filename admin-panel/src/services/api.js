import axios from 'axios';

// Use environment variable for production, or relative path for local proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Admin Auth API
export const adminAuthAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
};

// Admin API
export const adminAPI = {
    // Statistics
    getStats: () => api.get('/admin/stats'),
    getAnalytics: () => api.get('/admin/analytics'),

    // Vendor Management
    getVendors: (params) => api.get('/admin/vendors', { params }),
    toggleVendor: (id) => api.put(`/admin/vendors/${id}/toggle`),
    deleteVendor: (id) => api.delete(`/admin/vendors/${id}`),

    // User Management
    getUsers: (params) => api.get('/admin/users', { params }),
    toggleUserBan: (id) => api.put(`/admin/users/${id}/ban`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // Order Monitoring
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrderDetails: (id) => api.get(`/admin/orders/${id}`),
};

export default api;
