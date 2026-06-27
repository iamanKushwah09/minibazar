'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

export default function ProductSearch() {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, selectedSubCategory, categories } = useAppSelector((state: RootState) => state.products);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const currentCategory = categories.find(cat => cat._id === selectedCategory);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearchQuery));
  };

  const handleClear = () => {
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localSearchQuery));
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchQuery, dispatch]);

  const getSearchPlaceholder = () => {
    if (selectedCategory === 'all') {
      return 'Search for products, brands and more';
    }
    return `Search in ${showingTranslateValue(currentCategory?.name) || 'this category'}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative group">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
          />
          {localSearchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </form>
      
      {/* Search Suggestions (Optional Future Feature) */}
      {searchQuery && (
        <div className="mt-3 flex items-center space-x-2 animate-in fade-in slide-in-from-top-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Searching for:</span>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
            {searchQuery}
          </span>
          {selectedCategory !== 'all' && (
            <>
              <span className="text-gray-300 text-xs">/</span>
              <span className="text-xs font-bold text-gray-500">{showingTranslateValue(currentCategory?.name)}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
