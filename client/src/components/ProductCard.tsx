'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { Product } from '../types';
// import { ClockIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import WishlistButton from './WishlistButton';
import { showingTranslateValue, getImageUrl, getQuantityStep } from '../lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

  const calculateDiscount = () => {
    const sale = Number((product as any).sale_price || product.prices?.price);
    const mrp = Number((product as any).mrp || product.prices?.originalPrice);
    if (!mrp || !sale || isNaN(mrp) || isNaN(sale) || mrp <= sale) return null;
    const discount = Number((((mrp - sale) / mrp) * 100).toFixed(2));
    return discount > 0 ? discount : null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const moq = getQuantityStep(product);
    
    // Default to first size/color for quick add
    dispatch(addToCart({
      product: {
        ...product,
        id: product._id, // Map for cart consistency if needed
        name: showingTranslateValue(product.title),
        price: (product as any).sale_price || product.prices?.price,
        image: getImageUrl(product.image),
      } as any,
      quantity: moq,
    }));
    toast.success(`${showingTranslateValue(product.title)} added to cart!`);
  };

  const discount = calculateDiscount();
  const productTitle = showingTranslateValue(product.title);
  const productImage = getImageUrl(product.image);
  const salePrice = (product as any).sale_price || product.prices?.price || 0;
  const mrp = (product as any).mrp || product.prices?.originalPrice;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full relative">
        <div className="relative aspect-[4/5] sm:aspect-square bg-gray-50 overflow-hidden">
      {/* Product Image Section */}
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-100 uppercase tracking-tighter select-none">
              {productTitle[0]}
            </span>
          </div>
          
          <Image
            src={productImage}
            alt={productTitle}
            fill
            className={`object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ${imageError ? 'opacity-0' : 'opacity-100'}`}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </Link>

        {/* Wishlist Trigger */}
        <div className="absolute top-3 right-3 z-10 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <WishlistButton product={product as any} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        {/* Delivery Time Badge
        <div className="flex items-center space-x-1 mb-1.5 sm:mb-2 bg-gray-50 self-start px-2 py-0.5 rounded-md border border-gray-100">
          <ClockIcon className="h-3 w-3 text-gray-500" />
          <span className="text-[9px] sm:text-[10px] font-black text-gray-600 uppercase tracking-tight">12 MINS</span>
        </div> */}

        {/* Title & Brand */}
        <Link href={`/product/${product.slug}`} className="block flex-1 min-h-[40px] sm:min-h-[48px]">
          <h3 className="text-[13px] sm:text-base font-bold text-gray-900 leading-tight mb-0.5 line-clamp-2 hover:text-blue-600 transition-colors">
            {productTitle}
          </h3>
          <p className="text-[11px] sm:text-[12px] text-gray-500 mb-2 truncate">
            {product.unit || 'Standard'} · MOQ: {getQuantityStep(product)}
          </p>
        </Link>

        {/* Bottom Section: Price & Add Button */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black text-gray-900 leading-none">{formatPrice(salePrice)}</span>
              {mrp && mrp > salePrice && (
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[10px] sm:text-[11px] text-gray-400 line-through font-medium">{formatPrice(mrp)}</span>
                  {discount && (
                    <span className="text-[10px] font-black text-green-600">{discount}%</span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className="group/btn relative bg-white border border-[#24963f]/30 hover:bg-[#24963f]/5 text-[#24963f] font-black text-[10px] sm:text-xs px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span>ADD</span>
              <PlusIcon className="h-3 w-3" />
              <div className="absolute inset-0 border border-[#24963f] rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
