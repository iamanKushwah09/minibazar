import { Product, Category, ItemGroup } from '../types';
import { Review } from './slices/reviewSlice';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  itemGroups: ItemGroup[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  selectedCategories: string[];
  selectedSubCategory: string;
  selectedItemGroups: string[];
  searchQuery: string;
  // Pagination
  page: number;
  limit: number;
  totalDoc: number;
  hasMore: boolean;
  // Legacy single-value fields kept for compatibility
  selectedCategory: string;
  selectedItemGroup: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface WishlistState {
  items: Product[];
  itemCount: number;
}

export interface OrderItem {
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

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

export interface RootState {
  auth: AuthState;
  products: ProductState;
  cart: CartState;
  orders: OrderState;
  wishlist: WishlistState;
  reviews: ReviewState;
} 