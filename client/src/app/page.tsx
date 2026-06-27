'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchItemGroups, 
  toggleCategory, 
  toggleItemGroup,
  setSubCategory, 
  clearFilters 
} from '../store/slices/productSlice';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryBreadcrumb from '../components/CategoryBreadcrumb';
import MobileCategoryFilter from '../components/MobileCategoryFilter';
import ItemGroupFilter from '../components/ItemGroupFilter';
import { FunnelIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

export default function Home() {
  const dispatch = useAppDispatch();
  const { 
    filteredProducts, 
    loading,
    selectedCategories,
    selectedItemGroups,
    categories, 
    searchQuery,
    page,
    hasMore,
    loadingMore,
    totalDoc
  } = useAppSelector((state: RootState) => state.products);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        dispatch(fetchProducts({ append: true }));
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, dispatch]);

  // Initial load
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchItemGroups());
  }, [dispatch]);

  // Fetch products when filters change
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch, selectedCategories, selectedItemGroups, searchQuery]);

  const getPageTitle = () => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (selectedItemGroups.length > 0) return 'Branding';
    if (selectedCategories.length === 0) return 'Premium Collection';
    
    if (selectedCategories.length === 1) {
      const cat = categories.find(c => c._id === selectedCategories[0]);
      return (cat && showingTranslateValue(cat.name)) || 'Products';
    }
    
    return 'Multiple Categories';
  };
  
  const getActiveFiltersCount = () => {
    return selectedCategories.length + selectedItemGroups.length;
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden w-full max-w-[100vw]">
      <Hero />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          <div className="flex items-center justify-between mb-10">
              <CategoryBreadcrumb />
            </div>

            {/* Browse Collections removed as per user request */}

            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic break-words">
                {getPageTitle()}
              </h2>
              <div className="h-2 w-32 bg-blue-600 rounded-full mt-6"></div>
            </div>

            {/* Quick Brands Filter - Visible on all screens for better UX */}
            <ItemGroupFilter />

            {/* Filter & Info Bar - Always visible for better UX */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex flex-col min-w-0 flex-1 pr-0 sm:pr-4">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] sm:tracking-[0.3em] mb-1 line-clamp-2">
                  {loading ? 'Discovering Authentic Flavors...' : `Displaying ${filteredProducts.length} Premium Spices`}
                </div>
                {getActiveFiltersCount() > 0 && (
                  <button 
                    onClick={() => dispatch(clearFilters())}
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest text-left hover:underline inline-block mt-1"
                  >
                    Clear {getActiveFiltersCount()} Filter(s)
                  </button>
                )}
              </div>
              <div className="h-[1px] flex-1 bg-gray-100 mx-6 hidden sm:block"></div>
              
              {/* Mobile Filter Trigger */}
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-gray-900 text-white px-5 py-3 rounded-xl active:scale-95 transition-all shadow-lg shadow-gray-200"
              >
                <FunnelIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="space-y-6 animate-pulse">
                    <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem]"></div>
                    <div className="space-y-3 px-2">
                      <div className="h-5 bg-gray-100 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
                      <div className="h-8 bg-gray-100 rounded-xl w-1/3 mt-6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                  {filteredProducts.map((product, index) => {
                    if (filteredProducts.length === index + 1) {
                      return (
                        <div ref={lastProductElementRef} key={product._id}>
                          <ProductCard product={product} />
                        </div>
                      );
                    } else {
                      return <ProductCard key={product._id} product={product} />;
                    }
                  })}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="mt-16 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                      Fetching More Authentic Flavors...
                    </span>
                  </div>
                )}

                {!hasMore && filteredProducts.length > 0 && (
                  <div className="mt-20 text-center">
                    <div className="h-[1px] w-32 bg-gray-100 mx-auto mb-8"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
                      You've reached the end of the collection
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                <div className="text-7xl mb-8">📭</div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter uppercase">No Products Found</h3>
                <p className="text-gray-500 font-bold mb-10 text-sm uppercase tracking-widest">Your search didn't match any premium items.</p>
                <button
                  onClick={() => dispatch(clearFilters())}
                  className="bg-gray-900 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-2xl shadow-gray-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
      </section>

      <MobileCategoryFilter 
        isOpen={isMobileFilterOpen} 
        onClose={() => setIsMobileFilterOpen(false)} 
      />

      {/* Trust Badges */}
      <section className="bg-white py-24 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <span className="text-3xl group-hover:scale-110 transition-transform">🚀</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Global Spice Delivery</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Fast global delivery for all your kitchen essentials within 24 hours.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-green-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <span className="text-3xl group-hover:scale-110 transition-transform">🌿</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">100% Pure & Authentic</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Each product undergoes a rigorous quality inspection for purity and freshness.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">🛡️</span>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Secure Checkout</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest leading-loose">Military-grade encryption for all your financial transactions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

