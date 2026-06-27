import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity = 1, color?: string, size?: string) => {
        set((state) => {
          const existingItem = state.items.find(
            item => item.product._id === product._id && 
            item.selectedColor === color && 
            item.selectedSize === size
          );

          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }

          const newItem: CartItem = {
            id: `${product._id}-${Date.now()}`,
            product,
            quantity,
            selectedColor: color,
            selectedSize: size,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== itemId)
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === itemId
              ? { ...item, quantity: Math.max(0, quantity) }
              : item
          ).filter(item => item.quantity > 0)
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + ((item.product.prices?.price || 0) * item.quantity), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
); 
