import api from './api';
import { ApiResponse, PaginatedResponse, WishlistItem } from './types';

export class WishlistService {
  // Get user's wishlist
  static async getWishlist(
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<WishlistItem>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<WishlistItem>>>(`/wishlist?${params}`);
    return response.data.data;
  }

  // Add item to wishlist
  static async addToWishlist(productId: string): Promise<WishlistItem> {
    const response = await api.post<ApiResponse<WishlistItem>>('/wishlist', { productId });
    return response.data.data;
  }

  // Remove item from wishlist
  static async removeFromWishlist(itemId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/wishlist/${itemId}`);
  }

  // Remove item from wishlist by product ID
  static async removeFromWishlistByProduct(productId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/wishlist/product/${productId}`);
  }

  // Check if product is in wishlist
  static async isInWishlist(productId: string): Promise<boolean> {
    try {
      const response = await api.get<ApiResponse<{ inWishlist: boolean }>>(`/wishlist/check/${productId}`);
      return response.data.data.inWishlist;
    } catch (error) {
      return false;
    }
  }

  // Get wishlist count
  static async getWishlistCount(): Promise<number> {
    const response = await api.get<ApiResponse<{ count: number }>>('/wishlist/count');
    return response.data.data.count;
  }

  // Move item from wishlist to cart
  static async moveToCart(itemId: string): Promise<void> {
    await api.post<ApiResponse<void>>(`/wishlist/${itemId}/move-to-cart`);
  }

  // Move all wishlist items to cart
  static async moveAllToCart(): Promise<void> {
    await api.post<ApiResponse<void>>('/wishlist/move-all-to-cart');
  }

  // Clear entire wishlist
  static async clearWishlist(): Promise<void> {
    await api.delete<ApiResponse<void>>('/wishlist');
  }

  // Share wishlist
  static async shareWishlist(emails: string[]): Promise<{
    shareId: string;
    shareUrl: string;
  }> {
    const response = await api.post<ApiResponse<{
      shareId: string;
      shareUrl: string;
    }>>('/wishlist/share', { emails });
    return response.data.data;
  }

  // Get shared wishlist
  static async getSharedWishlist(shareId: string): Promise<{
    wishlist: WishlistItem[];
    sharedBy: string;
    sharedAt: string;
  }> {
    const response = await api.get<ApiResponse<{
      wishlist: WishlistItem[];
      sharedBy: string;
      sharedAt: string;
    }>>(`/wishlist/shared/${shareId}`);
    return response.data.data;
  }

  // Get wishlist recommendations
  static async getWishlistRecommendations(limit: number = 6): Promise<WishlistItem[]> {
    const response = await api.get<ApiResponse<WishlistItem[]>>(`/wishlist/recommendations?limit=${limit}`);
    return response.data.data;
  }

  // Export wishlist
  static async exportWishlist(format: 'csv' | 'pdf' = 'csv'): Promise<{
    downloadUrl: string;
    filename: string;
  }> {
    const response = await api.get<ApiResponse<{
      downloadUrl: string;
      filename: string;
    }>>(`/wishlist/export?format=${format}`);
    return response.data.data;
  }
} 