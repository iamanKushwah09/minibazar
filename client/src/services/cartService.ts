import api from './api';
import { CartItem } from '../types';
import { 
  ApiResponse, 
  AddToCartRequest, 
  UpdateCartItemRequest 
} from './types';

export class CartService {
  // Get user's cart
  static async getCart(): Promise<CartItem[]> {
    const response = await api.get<ApiResponse<CartItem[]>>('/cart');
    return response.data.data;
  }

  // Add item to cart
  static async addToCart(cartData: AddToCartRequest): Promise<CartItem> {
    const response = await api.post<ApiResponse<CartItem>>('/cart', cartData);
    return response.data.data;
  }

  // Update cart item
  static async updateCartItem(itemId: string, updateData: UpdateCartItemRequest): Promise<CartItem> {
    const response = await api.put<ApiResponse<CartItem>>(`/cart/${itemId}`, updateData);
    return response.data.data;
  }

  // Remove item from cart
  static async removeFromCart(itemId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/cart/${itemId}`);
  }

  // Clear entire cart
  static async clearCart(): Promise<void> {
    await api.delete<ApiResponse<void>>('/cart');
  }

  // Get cart summary (total items, total price)
  static async getCartSummary(): Promise<{
    totalItems: number;
    totalPrice: number;
    itemCount: number;
  }> {
    const response = await api.get<ApiResponse<{
      totalItems: number;
      totalPrice: number;
      itemCount: number;
    }>>('/cart/summary');
    return response.data.data;
  }

  // Apply coupon code
  static async applyCoupon(code: string): Promise<{
    discount: number;
    discountType: 'percentage' | 'fixed';
    code: string;
    valid: boolean;
  }> {
    const response = await api.post<ApiResponse<{
      discount: number;
      discountType: 'percentage' | 'fixed';
      code: string;
      valid: boolean;
    }>>('/cart/apply-coupon', { code });
    return response.data.data;
  }

  // Remove coupon code
  static async removeCoupon(): Promise<void> {
    await api.delete<ApiResponse<void>>('/cart/coupon');
  }

  // Save cart for later (wishlist)
  static async saveForLater(itemId: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/cart/${itemId}/save-for-later`);
  }

  // Move item from wishlist to cart
  static async moveToCart(itemId: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/wishlist/${itemId}/move-to-cart`);
  }

  // Get cart count (for header badge)
  static async getCartCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>('/cart/count');
    return response.data.data.count;
  }

  // Merge guest cart with user cart (after login)
  static async mergeGuestCart(guestCartItems: Array<{
    productId: string;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>): Promise<void> {
    await api.post<ApiResponse<void>>('/cart/merge-guest', { items: guestCartItems });
  }

  // Validate cart items (check stock, prices, etc.)
  static async validateCart(): Promise<{
    valid: boolean;
    errors: Array<{
      itemId: string;
      message: string;
      type: 'stock' | 'price' | 'availability';
    }>;
  }> {
    const response = await api.post<ApiResponse<{
      valid: boolean;
      errors: Array<{
        itemId: string;
        message: string;
        type: 'stock' | 'price' | 'availability';
      }>;
    }>>('/cart/validate');
    return response.data.data;
  }
} 
