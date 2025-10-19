import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  vendor: JSON.parse(localStorage.getItem('vendor')) || null,

  setAuth: (user, token, vendor) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (vendor) {
      localStorage.setItem('vendor', JSON.stringify(vendor));
    }
    set({ user, token, vendor, isAuthenticated: true });
  },

  setVendor: (vendor) => {
    localStorage.setItem('vendor', JSON.stringify(vendor));
    set({ vendor });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('vendor');
    set({ user: null, token: null, vendor: null, isAuthenticated: false });
  },
}));

export default useAuthStore;