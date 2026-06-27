'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { addToCart } from '../../../store/slices/cartSlice';
import { toggleWishlist } from '../../../store/slices/wishlistSlice';
import { Product } from '../../../types';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon, 
  MinusIcon, 
  PlusIcon, 
  XMarkIcon, 
  PencilIcon, 
  ArrowLeftIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { fetchProducts } from '../../../store/slices/productSlice';
import { showingTranslateValue, getImageUrl, getQuantityStep } from '../../../lib/utils';
import type { RootState } from '../../../store/types';
import ProductService from '../../../services/productService';

export default function ProductDetailView() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const dispatch = useAppDispatch();
  const { products, loading: reduxLoading } = useAppSelector((state: RootState) => state.products);
  const { items: wishlistItems } = useAppSelector((state: RootState) => state.wishlist);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [singleProduct, setSingleProduct] = useState<Product | null>(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState(true);

  let product = products.find((p: Product) => p._id === productId || p.slug === productId);
  if (!product && singleProduct) {
    product = singleProduct;
  }

  useEffect(() => {
    const found = products.find((p: Product) => p._id === productId || p.slug === productId);
    if (found) {
      setIsLoadingSingle(false);
      return;
    }

    const fetchSingle = async () => {
      setIsLoadingSingle(true);
      try {
        const res = await ProductService.getProductBySlug(productId);
        setSingleProduct(res);
      } catch (err) {
        console.error('Failed to fetch specific product:', err);
      } finally {
        setIsLoadingSingle(false);
      }
    };

    fetchSingle();
  }, [productId, products]);

  const isInWishlist = wishlistItems.some((item: any) => item._id === product?._id);

  const relatedProducts = products
    .filter((p: Product) => p._id !== product?._id && p.category === product?.category)
    .slice(0, 8);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    if (product) {
      setQuantity(getQuantityStep(product));
    }
  }, [product]);

  if (!product && (isLoadingSingle || reduxLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 font-bold uppercase tracking-widest text-sm">Loading Product</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-black text-gray-900 mb-2">PRODUCT NOT FOUND</h1>
          <button
            onClick={() => router.push('/')}
            className="mt-6 w-full px-6 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all"
          >
            BACK TO SHOP
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      product: product as any,
      quantity,
    }));
    toast.success('Added to bag successfully!');
  };

  const productTitle = showingTranslateValue(product.title);
  const productDescription = showingTranslateValue(product.description);
  const images = Array.isArray(product.image) ? product.image : [product.image];

  const calculateDiscount = () => {
    const originalPrice = Number(product?.prices?.originalPrice);
    const currentPrice = Number(product?.prices?.price);
    if (!originalPrice || !currentPrice || isNaN(originalPrice) || isNaN(currentPrice) || originalPrice <= currentPrice) return null;
    const discount = Number((((originalPrice - currentPrice) / originalPrice) * 100).toFixed(2));
    return discount > 0 ? discount : null;
  };
  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-[2rem] overflow-hidden group border border-gray-100">
              <img
                src={getImageUrl(images[selectedImageIndex])}
                alt={productTitle}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
              />
              <button 
                onClick={() => dispatch(toggleWishlist(product as any))}
                className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm hover:bg-white transition-all active:scale-90"
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-900" />
                )}
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index ? 'border-blue-600 scale-95 shadow-md' : 'border-gray-100'
                  }`}
                >
                  <img src={getImageUrl(img)} className="w-full h-full object-cover mix-blend-multiply" alt="thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{productTitle}</h1>
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex text-yellow-400">
                  <StarSolidIcon className="h-4 w-4" />
                  <StarSolidIcon className="h-4 w-4" />
                  <StarSolidIcon className="h-4 w-4" />
                  <StarSolidIcon className="h-4 w-4" />
                  <StarSolidIcon className="h-4 w-4 text-gray-200" />
                </div>
                <span className="text-xs font-bold text-gray-400">(4.0 · 120 Reviews)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-end space-x-3">
                <span className="text-4xl font-black text-gray-900">₹{product.prices?.price}</span>
                {product.prices?.originalPrice && product.prices?.originalPrice > product.prices?.price && (
                  <>
                    <span className="text-xl text-gray-400 line-through font-bold mb-1">₹{product.prices?.originalPrice}</span>
                    {discount && (
                      <span className="text-sm font-black text-green-600 bg-green-50 px-2 py-1 rounded-md mb-2">{discount}% OFF</span>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed font-medium">
                {productDescription || "No description available."}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-900">Select Quantity</h3>
              <div className="flex items-center space-x-4 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100">
                <button
                  onClick={() => setQuantity(q => Math.max(getQuantityStep(product), q - getQuantityStep(product)))}
                  className="p-3 bg-white rounded-xl shadow-sm"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="text-lg font-black w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + getQuantityStep(product))}
                  className="p-3 bg-white rounded-xl shadow-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock < 1}
                className="flex-1 bg-gray-900 text-white py-5 px-8 rounded-3xl font-black hover:bg-black transition-all disabled:bg-gray-300 flex items-center justify-center space-x-3"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="uppercase tracking-widest text-sm">Add to Bag</span>
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Fast Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-50 rounded-xl text-green-600">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
