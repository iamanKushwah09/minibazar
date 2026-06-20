'use client';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { HeartIcon, TrashIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { showingTranslateValue } from '../lib/utils';

interface WishlistSummaryProps {
  maxItems?: number;
  showActions?: boolean;
  className?: string;
}

export default function WishlistSummary({ 
  maxItems = 5, 
  showActions = true,
  className = '' 
}: WishlistSummaryProps) {
  const dispatch = useAppDispatch();
  const { items: wishlistItems, itemCount } = useAppSelector(state => state.wishlist);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart({
      product,
    }));
    dispatch(removeFromWishlist(product._id));
    toast.success('Moved to cart!');
  };

  const displayedItems = wishlistItems.slice(0, maxItems);
  const hasMoreItems = wishlistItems.length > maxItems;

  if (wishlistItems.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No wishlist items</h3>
          <p className="mt-1 text-sm text-gray-500">Start adding items to your wishlist</p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900">Wishlist</h3>
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
          </div>
          <Link
            href="/wishlist"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200">
        {displayedItems.map((product) => (
          <div key={product._id} className="px-6 py-4">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Image</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/product/${product._id}`} className="block">
                  <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-600">
                    {showingTranslateValue(product.title)}
                  </p>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.prices.price)}
                  </span>
                  {product.prices.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      {formatPrice(product.prices.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock <= 0}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                    title="Move to cart"
                  >
                    <ShoppingCartIcon className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/product/${product._id}`}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="View details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleRemoveItem(product._id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {hasMoreItems && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <Link
            href="/wishlist"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View {wishlistItems.length - maxItems} more items
          </Link>
        </div>
      )}
    </div>
  );
} 