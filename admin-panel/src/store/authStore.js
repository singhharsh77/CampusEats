import { create } from 'zustand';

const useAuthStore = create((set) => ({
    admin: null,
    token: localStorage.getItem('adminToken'),

    setAdmin: (admin, token) => {
        localStorage.setItem('adminToken', token);
        set({ admin, token });
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        set({ admin: null, token: null });
    },
}));

export default useAuthStore;
