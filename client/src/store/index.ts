import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import wishlistReducer from './slices/wishlistSlice';
import reviewReducer from './slices/reviewSlice';
import { clientShippingApiSlice } from './slices/clientShippingApiSlice';
import type { RootState } from './types';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    reviews: reviewReducer,
    [clientShippingApiSlice.reducerPath]: clientShippingApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(clientShippingApiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type { RootState }; 
