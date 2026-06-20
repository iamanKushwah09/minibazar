'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromWishlist, clearWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Product } from '../../types';
import { HeartIcon, TrashIcon, ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { showingTranslateValue, getImageUrl, getQuantityStep } from '../../lib/utils';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items: wishlistItems } = useAppSelector(state => state.wishlist);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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

  const handleMoveToCart = (product: Product) => {
    const moq = getQuantityStep(product);
    dispatch(addToCart({
      product,
      size: '', 
      color: '',
      quantity: moq
    }));
    dispatch(removeFromWishlist(product._id));
    toast.success('Moved to cart!');
  };

  const handleSelectItem = (productId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === wishlistItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(wishlistItems.map(item => item._id)));
    }
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      dispatch(removeFromWishlist(productId));
    });
    setSelectedItems(new Set());
    toast.success(`Removed ${selectedItems.size} items from wishlist`);
  };

  const handleMoveSelectedToCart = () => {
    const selectedProducts = wishlistItems.filter(item => selectedItems.has(item._id));
    selectedProducts.forEach(product => {
      const moq = getQuantityStep(product);
      dispatch(addToCart({
        product,
        size: '',
        color: '',
        quantity: moq
      }));
      dispatch(removeFromWishlist(product._id));
    });
    setSelectedItems(new Set());
    toast.success(`Moved ${selectedProducts.length} items to cart!`);
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist());
      setSelectedItems(new Set());
      toast.success('Wishlist cleared');
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <HeartIcon className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-600">
              Start adding items to your wishlist to see them here
            </p>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="mt-2 text-gray-600">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedItems.size === wishlistItems.length && wishlistItems.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Select All</span>
              </label>
              {selectedItems.size > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedItems.size} of {wishlistItems.length} selected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {selectedItems.size > 0 && (
                <>
                  <button
                    onClick={handleMoveSelectedToCart}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-1" />
                    Move to Cart ({selectedItems.size})
                  </button>
                  <button
                    onClick={handleRemoveSelected}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove ({selectedItems.size})
                  </button>
                </>
              )}
              <button
                onClick={handleClearWishlist}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {wishlistItems.map((product) => {
            const productTitle = showingTranslateValue(product.title);
            const productImage = getImageUrl(product.image);
            const price = product.prices?.price || 0;
            const originalPrice = product.prices?.originalPrice;

            return (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={productImage}
                    alt={productTitle}
                    fill
                    className="object-contain p-4"
                  />
                  
                  {/* Item Selection Checkbox */}
                  <div className="absolute top-2 left-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(product._id)}
                      onChange={() => handleSelectItem(product._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(product._id)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </button>

                  {/* Sale Badge */}
                  {originalPrice && originalPrice > price && (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{product.unit || 'Standard'}</span>
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  </div>

                  <Link href={`/product/${product.slug}`} className="block flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 text-sm uppercase italic tracking-tight">
                      {productTitle}
                    </h3>
                  </Link>

                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-black text-gray-900">
                      {formatPrice(price)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.stock < 1}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShoppingCartIcon className="h-4 w-4" />
                      <span>{product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}</span>
                    </button>
                    
                    <Link
                      href={`/product/${product.slug}`}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}