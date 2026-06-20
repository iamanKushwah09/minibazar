import { Product, User, Category } from '../types';

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Product API types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// User API types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Cart API types
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Order API types
export interface Order {
  id: string;
  userId: string;
  items: Array<{
    productId: string;
    product: Product;
    quantity: number;
    price: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
}

// Wishlist API types
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

// Review API types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  productId: string;
  rating: number;
  comment: string;
} 