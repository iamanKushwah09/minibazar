# E-commerce API Services

This directory contains a comprehensive set of API services for the e-commerce application. All services are built using TypeScript and Axios for type safety and better developer experience.

## 📁 File Structure

```
src/services/
├── api.ts                 # Base API configuration with interceptors
├── types.ts              # API-specific TypeScript interfaces
├── index.ts              # Main export file
├── productService.ts     # Product management
├── authService.ts        # Authentication & user management
├── cartService.ts        # Shopping cart operations
├── orderService.ts       # Order management
├── categoryService.ts    # Category management
├── wishlistService.ts    # Wishlist operations
├── reviewService.ts      # Product reviews & ratings
├── examples/             # Usage examples
│   └── usage-examples.tsx
└── README.md            # This file
```

## 🚀 Quick Start

### Installation

The services use `axios` for HTTP requests. It's already installed in the project:

```bash
npm install axios
```

### Basic Usage

```typescript
import { ProductService, AuthService, CartService } from '@/services';

// Get products
const products = await ProductService.getProducts(1, 12);

// Login user
const authResponse = await AuthService.login({ email, password });

// Add to cart
await CartService.addToCart({ productId: '123', quantity: 1 });
```

## 🔧 API Configuration

### Base Configuration (`api.ts`)

The base API configuration includes:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Timeout**: 10 seconds default
- **Request Interceptors**: Automatically adds authentication tokens
- **Response Interceptors**: Handles common errors (401, 403)

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📚 Service Documentation

### 1. ProductService

Handles all product-related operations.

```typescript
import { ProductService } from '@/services';

// Get products with pagination and filters
const products = await ProductService.getProducts(1, 12, {
  category: 'electronics',
  minPrice: 10,
  maxPrice: 100,
  search: 'laptop',
  sortBy: 'price',
  sortOrder: 'asc'
});

// Get single product
const product = await ProductService.getProduct('product-id');

// Search products
const searchResults = await ProductService.searchProducts('laptop');

// Get featured products
const featured = await ProductService.getFeaturedProducts(8);

// Admin operations
await ProductService.createProduct(productData);
await ProductService.updateProduct('id', updateData);
await ProductService.deleteProduct('id');
```

### 2. AuthService

Handles authentication and user management.

```typescript
import { AuthService } from '@/services';

// Login
const authResponse = await AuthService.login({ email, password });

// Register
const authResponse = await AuthService.register(userData);

// Logout
await AuthService.logout();

// Get current user
const user = await AuthService.getCurrentUser();

// Update profile
const updatedUser = await AuthService.updateProfile(profileData);

// Password operations
await AuthService.changePassword(passwordData);
await AuthService.forgotPassword(email);
await AuthService.resetPassword(token, newPassword);

// Check authentication status
const isAuthenticated = AuthService.isAuthenticated();
```

### 3. CartService

Manages shopping cart operations.

```typescript
import { CartService } from '@/services';

// Get cart
const cartItems = await CartService.getCart();

// Add to cart
await CartService.addToCart({ productId: '123', quantity: 2 });

// Update cart item
await CartService.updateCartItem('item-id', { quantity: 3 });

// Remove from cart
await CartService.removeFromCart('item-id');

// Get cart summary
const summary = await CartService.getCartSummary();

// Apply coupon
const couponResult = await CartService.applyCoupon('SAVE10');

// Validate cart
const validation = await CartService.validateCart();
```

### 4. OrderService

Handles order creation and management.

```typescript
import { OrderService } from '@/services';

// Create order
const order = await OrderService.createOrder(orderData);

// Get user orders
const orders = await OrderService.getOrders(1, 10);

// Get specific order
const order = await OrderService.getOrder('order-id');

// Track order
const tracking = await OrderService.trackOrder('order-id');

// Cancel order
await OrderService.cancelOrder('order-id', 'Changed mind');

// Request return
const returnRequest = await OrderService.requestReturn('order-id', items);

// Get order statistics
const stats = await OrderService.getOrderStats();
```

### 5. CategoryService

Manages product categories.

```typescript
import { CategoryService } from '@/services';

// Get all categories
const categories = await CategoryService.getCategories();

// Get category tree
const categoryTree = await CategoryService.getCategoryTree();

// Get subcategories
const subcategories = await CategoryService.getSubcategories('parent-id');

// Search categories
const searchResults = await CategoryService.searchCategories('electronics');

// Admin operations
await CategoryService.createCategory(categoryData);
await CategoryService.updateCategory('id', updateData);
await CategoryService.deleteCategory('id');
```

### 6. WishlistService

Handles wishlist operations.

```typescript
import { WishlistService } from '@/services';

// Get wishlist
const wishlist = await WishlistService.getWishlist(1, 12);

// Add to wishlist
await WishlistService.addToWishlist('product-id');

// Remove from wishlist
await WishlistService.removeFromWishlist('item-id');

// Check if in wishlist
const isInWishlist = await WishlistService.isInWishlist('product-id');

// Move to cart
await WishlistService.moveToCart('item-id');

// Share wishlist
const shareResult = await WishlistService.shareWishlist(['email@example.com']);
```

### 7. ReviewService

Manages product reviews and ratings.

```typescript
import { ReviewService } from '@/services';

// Get product reviews
const reviews = await ReviewService.getProductReviews('product-id', 1, 10);

// Create review
await ReviewService.createReview({
  productId: 'product-id',
  rating: 5,
  comment: 'Great product!'
});

// Get review statistics
const stats = await ReviewService.getProductReviewStats('product-id');

// Like/unlike review
await ReviewService.likeReview('review-id');
await ReviewService.unlikeReview('review-id');

// Get reviews by rating
const fiveStarReviews = await ReviewService.getReviewsByRating('product-id', 5);
```

## 🔒 Authentication

All services automatically handle authentication:

1. **Token Storage**: Tokens are stored in `localStorage`
2. **Automatic Headers**: Auth tokens are automatically added to requests
3. **Token Refresh**: Automatic token refresh on 401 errors
4. **Logout Cleanup**: Tokens are cleared on logout

## 🛠️ Error Handling

All services include comprehensive error handling:

```typescript
try {
  const products = await ProductService.getProducts();
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

## 📝 TypeScript Support

All services are fully typed with TypeScript:

```typescript
import { Product, CartItem, Order } from '@/services/types';

// Type-safe API responses
const products: Product[] = await ProductService.getProducts();
const cartItems: CartItem[] = await CartService.getCart();
const orders: Order[] = await OrderService.getOrders();
```

## 🧪 Testing

Example usage in React components:

```typescript
import React, { useState, useEffect } from 'react';
import { ProductService } from '@/services';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getProducts(1, 12);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

## 🔄 State Management Integration

The services work well with state management libraries:

### Redux Toolkit
```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProductService } from '@/services';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { page: number; limit: number }) => {
    const response = await ProductService.getProducts(params.page, params.limit);
    return response;
  }
);
```

### Zustand
```typescript
import { create } from 'zustand';
import { ProductService } from '@/services';

interface ProductStore {
  products: Product[];
  loading: boolean;
  fetchProducts: () => Promise<void>;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await ProductService.getProducts();
      set({ products: response.data });
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
```

## 🚀 Best Practices

1. **Error Handling**: Always wrap service calls in try-catch blocks
2. **Loading States**: Use loading states for better UX
3. **Type Safety**: Leverage TypeScript for better development experience
4. **Caching**: Consider implementing caching for frequently accessed data
5. **Optimistic Updates**: Update UI immediately, then sync with server
6. **Retry Logic**: Implement retry logic for failed requests
7. **Offline Support**: Consider offline-first approach for better UX

## 📞 Support

For questions or issues with the API services, please refer to the usage examples in `examples/usage-examples.tsx` or check the individual service files for detailed method documentation. 