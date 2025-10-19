import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Vendor APIs
export const vendorAPI = {
  create: (data) => api.post('/vendors', data),
  getMyVendor: () => api.get('/vendors/my-vendor'), // Make sure this exists
  getById: (id) => api.get(`/vendors/${id}`),
  update: (id, data) => api.put(`/vendors/${id}`, data),
};

// Menu APIs
export const menuAPI = {
  create: (data) => api.post('/menu', data),
  getByVendor: (vendorId) => api.get(`/menu/vendor/${vendorId}`),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Order APIs
export const orderAPI = {
  getVendorOrders: (vendorId, status) => {
    const url = status 
      ? `/orders/vendor/${vendorId}?status=${status}`
      : `/orders/vendor/${vendorId}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;