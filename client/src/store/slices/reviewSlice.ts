import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  submitting: boolean;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
  submitting: false,
};

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'John D.',
    rating: 4,
    title: 'Great product!',
    comment: 'Excellent quality and very comfortable. The fit is perfect and the design is stylish. Highly recommend this product!',
    isVerifiedPurchase: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Sarah M.',
    rating: 5,
    title: 'Amazing comfort',
    comment: 'These shoes are incredibly comfortable for long walks. The cushioning is perfect and they look great too!',
    isVerifiedPurchase: true,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '3',
    productId: '1',
    userId: 'user3',
    userName: 'Mike R.',
    rating: 4,
    title: 'Good value for money',
    comment: 'Solid shoes with good build quality. The price is reasonable for what you get. Would buy again.',
    isVerifiedPurchase: true,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },
];

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockReviews.filter(review => review.productId === productId);
  }
);

export const submitReview = createAsyncThunk(
  'reviews/submitReview',
  async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newReview: Review = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return newReview;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReviews: (state) => {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      // Submit Review
      .addCase(submitReview.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Failed to submit review';
      });
  },
});

export const { clearError, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer; 