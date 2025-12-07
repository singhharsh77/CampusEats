import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || '';
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  return url + '/api';
};

const API_URL = getBaseUrl();

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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Vendor APIs
export const vendorAPI = {
  getAll: () => api.get('/vendors'),
  getById: (id) => api.get(`/vendors/${id}`),
};

// Menu APIs
export const menuAPI = {
  getByVendor: (vendorId) => api.get(`/menu/vendor/${vendorId}`),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getLiveOrderCount: (vendorId) => api.get(`/orders/vendor/${vendorId}/live-count`),
};

export default api;