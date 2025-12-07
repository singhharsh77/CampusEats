import { create } from 'zustand';

const useOrdersStore = create((set) => ({
  orders: [],
  selectedStatus: 'pending',

  setOrders: (orders) => set({ orders }),

  setSelectedStatus: (status) => set({ selectedStatus: status }),

  updateOrderStatus: async (orderId, newStatus) => {
    // Import orderAPI dynamically to avoid circular dependency
    const { orderAPI } = await import('../services/api');

    // Make API call to update status
    await orderAPI.updateStatus(orderId, newStatus);

    // Update local state
    set((state) => ({
      orders: state.orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      ),
    }));
  },

  removeOrder: (orderId) => set((state) => ({
    orders: state.orders.filter((order) => order._id !== orderId),
  })),
}));

export default useOrdersStore;