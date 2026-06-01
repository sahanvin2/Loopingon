import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;

  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

function calculateSummary(items: CartItem[]): { itemCount: number; subtotal: number } {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    return sum + parseFloat(item.price || "0") * item.quantity;
  }, 0);
  return { itemCount, subtotal: Math.round(subtotal * 100) / 100 };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (i) =>
            i.productId === item.productId &&
            i.variantId === item.variantId,
        );

        let newItems: CartItem[];

        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
          };
        } else {
          newItems = [...items, item];
        }

        const { itemCount, subtotal } = calculateSummary(newItems);
        set({ items: newItems, itemCount, subtotal });
      },

      removeItem: (itemId) => {
        const newItems = get().items.filter((i) => i.id !== itemId);
        const { itemCount, subtotal } = calculateSummary(newItems);
        set({ items: newItems, itemCount, subtotal });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        const newItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        );
        const { itemCount, subtotal } = calculateSummary(newItems);
        set({ items: newItems, itemCount, subtotal });
      },

      clearCart: () => {
        set({ items: [], itemCount: 0, subtotal: 0 });
      },

      setCart: (items) => {
        const { itemCount, subtotal } = calculateSummary(items);
        set({ items, itemCount, subtotal });
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        itemCount: state.itemCount,
        subtotal: state.subtotal,
      }),
    },
  ),
);
