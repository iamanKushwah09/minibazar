import api from './api';
import { ApiResponse, PaginatedResponse, Review, CreateReviewRequest } from './types';

export class ReviewService {
  // Get reviews for a product
  static async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/product/${productId}?${params}`
    );
    return response.data.data;
  }

  // Get user's reviews
  static async getUserReviews(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews/user?${params}`);
    return response.data.data;
  }

  // Create a review
  static async createReview(reviewData: CreateReviewRequest): Promise<Review> {
    const response = await api.post<ApiResponse<Review>>('/reviews', reviewData);
    return response.data.data;
  }

  // Update a review
  static async updateReview(
    reviewId: string,
    reviewData: Partial<CreateReviewRequest>
  ): Promise<Review> {
    const response = await api.put<ApiResponse<Review>>(`/reviews/${reviewId}`, reviewData);
    return response.data.data;
  }

  // Delete a review
  static async deleteReview(reviewId: string): Promise<void> {
    await api.delete<ApiResponse<void>>(`/reviews/${reviewId}`);
  }

  // Get review statistics for a product
  static async getProductReviewStats(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: number; // 1-5 stars
    };
    verifiedPurchases: number;
  }> {
    const response = await api.get<ApiResponse<{
      averageRating: number;
      totalReviews: number;
      ratingDistribution: {
        [key: number]: number;
      };
      verifiedPurchases: number;
    }>>(`/reviews/product/${productId}/stats`);
    return response.data.data;
  }

  // Get reviews by rating
  static async getReviewsByRating(
    productId: string,
    rating: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      rating: rating.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/product/${productId}/rating?${params}`
    );
    return response.data.data;
  }

  // Get verified purchase reviews
  static async getVerifiedPurchaseReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/product/${productId}/verified?${params}`
    );
    return response.data.data;
  }

  // Like a review
  static async likeReview(reviewId: string): Promise<{
    likes: number;
    userLiked: boolean;
  }> {
    const response = await api.post<ApiResponse<{
      likes: number;
      userLiked: boolean;
    }>>(`/reviews/${reviewId}/like`);
    return response.data.data;
  }

  // Unlike a review
  static async unlikeReview(reviewId: string): Promise<{
    likes: number;
    userLiked: boolean;
  }> {
    const response = await api.delete<ApiResponse<{
      likes: number;
      userLiked: boolean;
    }>>(`/reviews/${reviewId}/like`);
    return response.data.data;
  }

  // Report a review
  static async reportReview(
    reviewId: string,
    reason: string
  ): Promise<void> {
    await api.post<ApiResponse<void>>(`/reviews/${reviewId}/report`, { reason });
  }

  // Get helpful reviews (most liked)
  static async getHelpfulReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/product/${productId}/helpful?${params}`
    );
    return response.data.data;
  }

  // Get recent reviews
  static async getRecentReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Review>>>(
      `/reviews/product/${productId}/recent?${params}`
    );
    return response.data.data;
  }

  // Check if user can review a product
  static async canReviewProduct(productId: string): Promise<{
    canReview: boolean;
    reason?: string;
    purchasedProduct?: boolean;
  }> {
    const response = await api.get<ApiResponse<{
      canReview: boolean;
      reason?: string;
      purchasedProduct?: boolean;
    }>>(`/reviews/can-review/${productId}`);
    return response.data.data;
  }

  // Get review by ID
  static async getReview(reviewId: string): Promise<Review> {
    const response = await api.get<ApiResponse<Review>>(`/reviews/${reviewId}`);
    return response.data.data;
  }
} 
