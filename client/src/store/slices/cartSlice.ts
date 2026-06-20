import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types';

export interface CartItem {
  id: string; // Internal cart ID (combination of product id and options)
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const getInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    }
  }
  return {
    items: [],
    total: 0,
    itemCount: 0,
  };
};

const initialState: CartState = getInitialState();

const saveState = (state: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(state));
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; size?: string; color?: string; quantity?: number }>) => {
      const { product, size = '', color = '', quantity = 1 } = action.payload;
      const productId = product._id;
      
      const existingItem = state.items.find(
        item => item.product._id === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: `${productId}-${size}-${color}`,
          product,
          quantity,
          size,
          color,
        });
      }

      // Update totals
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.product.prices.price * item.quantity), 0);
      saveState(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Update totals
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.product.prices.price * item.quantity), 0);
      saveState(state);
    },

    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }

      // Update totals
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.product.prices.price * item.quantity), 0);
      saveState(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      saveState(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;