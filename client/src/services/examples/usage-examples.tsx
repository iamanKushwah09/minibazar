// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  ProductService,
  AuthService,
  CartService,
  OrderService,
  CategoryService,
  WishlistService,
  ReviewService,
} from '../index';

// Example: Product listing component
export const ProductListExample: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductService.getProducts(1, 12);
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">${product.price}</p>
            <button
              onClick={() => CartService.addToCart({
                productId: product.id,
                quantity: 1
              })}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Example: Authentication component
export const AuthExample: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout} disabled={loading}>
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        <div>
          <h3>Login</h3>
          {/* Login form would go here */}
        </div>
      )}
    </div>
  );
};

// Example: Cart management
export const CartExample: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartSummary, setCartSummary] = useState<any>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const [items, summary] = await Promise.all([
          CartService.getCart(),
          CartService.getCartSummary()
        ]);
        setCartItems(items);
        setCartSummary(summary);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await CartService.updateCartItem(itemId, { quantity });
      // Refresh cart data
      const items = await CartService.getCart();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartSummary && (
        <div className="mb-4">
          <p>Total Items: {cartSummary.totalItems}</p>
          <p>Total Price: ${cartSummary.totalPrice}</p>
        </div>
      )}
      {cartItems.map((item) => (
        <div key={item.id} className="border p-4 mb-2">
          <h3>{item.product.name}</h3>
          <p>Quantity: {item.quantity}</p>
          <p>Price: ${item.product.price}</p>
          <button
            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            className="bg-green-500 text-white px-2 py-1 rounded mr-2"
          >
            +
          </button>
          <button
            onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            -
          </button>
        </div>
      ))}
    </div>
  );
};

// Example: Order management
export const OrderExample: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await OrderService.getOrders(1, 10);
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateOrder = async (orderData: any) => {
    try {
      const order = await OrderService.createOrder(orderData);
      console.log('Order created:', order);
      // Refresh orders list
      const response = await OrderService.getOrders(1, 10);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-2">
          <h3>Order #{order.id}</h3>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

// Example: Wishlist management
export const WishlistExample: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await WishlistService.getWishlist(1, 12);
        setWishlistItems(response.data);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (productId: string) => {
    try {
      await WishlistService.addToWishlist(productId);
      // Refresh wishlist
      const response = await WishlistService.getWishlist(1, 12);
      setWishlistItems(response.data);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  return (
    <div>
      <h2>My Wishlist</h2>
      {wishlistItems.map((item) => (
        <div key={item.id} className="border p-4 mb-2">
          <h3>{item.product.name}</h3>
          <p>Price: ${item.product.price}</p>
          <button
            onClick={() => WishlistService.moveToCart(item.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Move to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

// Example: Review system
export const ReviewExample: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);

  useEffect(() => {
    const fetchReviews = async (productId: string) => {
      try {
        const [reviewsResponse, statsResponse] = await Promise.all([
          ReviewService.getProductReviews(productId, 1, 10),
          ReviewService.getProductReviewStats(productId)
        ]);
        setReviews(reviewsResponse.data);
        setReviewStats(statsResponse);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };

    // Example product ID
    fetchReviews('example-product-id');
  }, []);

  const handleCreateReview = async (productId: string, rating: number, comment: string) => {
    try {
      await ReviewService.createReview({
        productId,
        rating,
        comment
      });
      // Refresh reviews
      const response = await ReviewService.getProductReviews(productId, 1, 10);
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to create review:', error);
    }
  };

  return (
    <div>
      <h2>Product Reviews</h2>
      {reviewStats && (
        <div className="mb-4">
          <p>Average Rating: {reviewStats.averageRating}/5</p>
          <p>Total Reviews: {reviewStats.totalReviews}</p>
        </div>
      )}
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 mb-2">
          <div className="flex items-center mb-2">
            <span className="font-semibold">{review.user.name}</span>
            <span className="ml-2">★ {review.rating}/5</span>
          </div>
          <p>{review.comment}</p>
          <p className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}; 