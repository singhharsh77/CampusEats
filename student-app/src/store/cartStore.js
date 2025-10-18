import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  vendor: null,

  addItem: (item, vendor) => {
    const { items, vendor: currentVendor } = get();

    // Check if adding from different vendor
    if (currentVendor && currentVendor._id !== vendor._id) {
      if (!window.confirm('Clear cart and add items from this vendor?')) {
        return;
      }
      set({ items: [{ ...item, quantity: 1 }], vendor });
      return;
    }

    // Check if item already in cart
    const existingItem = items.find((i) => i._id === item._id);

    if (existingItem) {
      set({
        items: items.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }], vendor });
    }
  },

  removeItem: (itemId) => {
    const items = get().items.filter((i) => i._id !== itemId);
    set({ items, vendor: items.length === 0 ? null : get().vendor });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i._id === itemId ? { ...i, quantity } : i
      ),
    });
  },

  clearCart: () => set({ items: [], vendor: null }),

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export default useCartStore;