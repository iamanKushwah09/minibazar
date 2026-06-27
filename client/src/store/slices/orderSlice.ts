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

// Normalizer to map backend schema to frontend type
const normalizeOrder = (order: any): Order => {
  if (!order) return order;

  const statusMap: Record<string, 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = {
    'Pending': 'pending',
    'Processing': 'processing',
    'Delivered': 'delivered',
    'Cancel': 'cancelled'
  };

  const normalizedStatus = statusMap[order.status] || (order.status?.toLowerCase() as any) || 'pending';

  return {
    id: order._id || order.id || '',
    total: order.total || 0,
    paymentMethod: order.paymentMethod || 'Cash On Delivery',
    status: normalizedStatus,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
    shippingAddress: {
      name: order.user_info?.name || order.shippingAddress?.name || '',
      address: order.user_info?.address || order.shippingAddress?.address || '',
      city: order.user_info?.city || order.shippingAddress?.city || '',
      state: order.user_info?.state || order.shippingAddress?.state || '',
      zipCode: order.user_info?.zipCode || order.shippingAddress?.zipCode || '',
      country: order.user_info?.country || order.shippingAddress?.country || '',
    },
    items: (order.cart || order.items || []).map((item: any) => ({
      id: item.id || item._id || '',
      product: {
        id: item.id || item._id || '',
        name: item.title || item.product?.name || '',
        price: item.price || item.product?.price || 0,
        brand: item.brand || item.product?.brand || '',
      },
      size: item.size || '',
      color: item.color || '',
      quantity: item.quantity || 1,
    })),
  };
};

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData: any) => {
    const data = await OrderService.addOrder(orderData);
    return normalizeOrder(data);
  }
);

// Async thunk for fetching user orders
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const data = await OrderService.getCustomerOrders();
    // Assuming backend returns an array or an object with an array
    const rawOrders = Array.isArray(data) ? data : data.orders || [];
    return rawOrders.map(normalizeOrder);
  }
);

// Async thunk for fetching a specific order
export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id: string) => {
    const data = await OrderService.getOrderById(id);
    return normalizeOrder(data);
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
