import { create } from 'zustand';

const useOrdersStore = create((set) => ({
  orders: [],
  selectedStatus: 'pending',
  
  setOrders: (orders) => set({ orders }),
  
  setSelectedStatus: (status) => set({ selectedStatus: status }),
  
  updateOrderStatus: (orderId, newStatus) => set((state) => ({
    orders: state.orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    ),
  })),
  
  removeOrder: (orderId) => set((state) => ({
    orders: state.orders.filter((order) => order._id !== orderId),
  })),
}));

export default useOrdersStore;