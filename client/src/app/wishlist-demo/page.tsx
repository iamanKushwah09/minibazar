'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import ProductCard from '../../components/ProductCard';
import WishlistSummary from '../../components/WishlistSummary';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { showingTranslateValue } from '../../lib/utils';

// Sample products for demo
const sampleProducts = [
  {
    _id: '1',
    title: { en: 'Nike Air Max 270', ar: 'نايكي إير ماكس 270' },
    brand: { en: 'Nike', ar: 'نايكي' },
    prices: { price: 129.99, originalPrice: 159.99, discount: 19 },
    image: ['/images/nike-air-max-270.jpg'],
    category: 'men',
    itemGroup: 'sneakers',
    description: { en: 'Comfortable running shoes with Air Max technology', ar: 'أحذية جري مريحة بتقنية إير ماكس' },
    variants: [],
    status: 'show',
    inStock: true,
  },
  {
    _id: '2',
    title: { en: 'Adidas Ultraboost 22', ar: 'أديداس ألترا بوست 22' },
    brand: { en: 'Adidas', ar: 'أديداس' },
    prices: { price: 179.99, originalPrice: 179.99, discount: 0 },
    image: ['/images/adidas-ultraboost-22.jpg'],
    category: 'women',
    itemGroup: 'sports',
    description: { en: 'Premium running shoes with Boost technology', ar: 'أحذية جري مميزة بتقنية بوست' },
    variants: [],
    status: 'show',
    inStock: true,
  },
  {
    _id: '3',
    title: { en: 'Converse Chuck Taylor', ar: 'كونفيرس تشاك تايلور' },
    brand: { en: 'Converse', ar: 'كونفيرس' },
    prices: { price: 59.99, originalPrice: 59.99, discount: 0 },
    image: ['/images/converse-chuck-taylor.jpg'],
    category: 'kids',
    itemGroup: 'casual',
    description: { en: 'Classic canvas sneakers for everyday wear', ar: 'حذاء قماش كلاسيكي للارتداء اليومي' },
    variants: [],
    status: 'show',
    inStock: true,
  },
  {
    _id: '4',
    title: { en: 'Puma RS-X', ar: 'بوما RS-X' },
    brand: { en: 'Puma', ar: 'بوما' },
    prices: { price: 89.99, originalPrice: 119.99, discount: 25 },
    image: ['/images/puma-rs-x.jpg'],
    category: 'men',
    itemGroup: 'sneakers',
    description: { en: 'Retro-inspired sneakers with bold design', ar: 'أحذية رياضية مستوحاة من الماضي بتصميم جريء' },
    variants: [],
    status: 'show',
    inStock: true,
  },
  {
    _id: '5',
    title: { en: 'New Balance 574', ar: 'نيو بالانس 574' },
    brand: { en: 'New Balance', ar: 'نيو بالانس' },
    prices: { price: 79.99, originalPrice: 79.99, discount: 0 },
    image: ['/images/new-balance-574.jpg'],
    category: 'women',
    itemGroup: 'casual',
    description: { en: 'Comfortable lifestyle sneakers', ar: 'أحذية رياضية مريحة لنمط الحياة' },
    variants: [],
    status: 'show',
    inStock: true,
  },
  {
    _id: '6',
    title: { en: 'Vans Old Skool', ar: 'فانز أولد سكول' },
    brand: { en: 'Vans', ar: 'فانز' },
    prices: { price: 64.99, originalPrice: 64.99, discount: 0 },
    image: ['/images/vans-old-skool.jpg'],
    category: 'kids',
    itemGroup: 'casual',
    description: { en: 'Iconic skate shoes with side stripe', ar: 'أحذية تزلج أيقونية مع شريط جانبي' },
    variants: [],
    status: 'show',
    inStock: true,
  }
];

export default function WishlistDemoPage() {
  const dispatch = useAppDispatch();

  const handleAddSampleToWishlist = (product: any) => {
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Wishlist Demo</h1>
              <p className="mt-2 text-gray-600">
                Test the wishlist functionality with sample products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/wishlist"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                View Full Wishlist
              </Link>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sample Products */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Products</h2>
              <p className="text-gray-600 mb-4">
                Click the heart icon on any product to add it to your wishlist
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sampleProducts.map((product) => (
                  // @ts-ignore - Demo page uses simplified sample product data
                  <ProductCard key={product._id} product={product as any} />
                ))}
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add to Wishlist</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sampleProducts.slice(0, 6).map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleAddSampleToWishlist(product)}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {showingTranslateValue(product.title)}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {showingTranslateValue(product.brand)}
                    </div>
                    <div className="text-sm font-semibold text-blue-600 mt-1">
                      ₹{product.prices.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="lg:col-span-1">
            <WishlistSummary maxItems={8} />
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Wishlist Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">❤️</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Add to Wishlist</h3>
              <p className="text-sm text-gray-600">
                Click the heart icon on any product to save it for later
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🛒</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Move to Cart</h3>
              <p className="text-sm text-gray-600">
                Easily move wishlist items to your shopping cart
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">📱</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Bulk Actions</h3>
              <p className="text-sm text-gray-600">
                Select multiple items and perform bulk operations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-600 text-xl">👁️</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Quick View</h3>
              <p className="text-sm text-gray-600">
                View product details without leaving the wishlist
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 text-xl">🗑️</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Remove Items</h3>
              <p className="text-sm text-gray-600">
                Remove individual items or clear entire wishlist
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 text-xl">📊</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Dashboard Integration</h3>
              <p className="text-sm text-gray-600">
                View wishlist summary in your dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 