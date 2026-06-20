import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import OrderService from '../../services/orderService';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    brand: string;
  };
  size: string;
  color: string;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData: any) => {
    return await OrderService.addOrder(orderData);
  }
);

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const data = await OrderService.getCustomerOrders();
    // Assuming backend returns an array or an object with an array
    return Array.isArray(data) ? data : data.orders || [];
  }
);

// Async thunk for fetching a specific order
export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id: string) => {
    return await OrderService.getOrderById(id);
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      })
      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      // Fetch Order By Id
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;