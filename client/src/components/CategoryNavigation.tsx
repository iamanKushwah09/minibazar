'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleCategory, clearFilters } from '../store/slices/productSlice';
import { ChevronDownIcon, ChevronRightIcon, RectangleGroupIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

export default function CategoryNavigation() {
  const dispatch = useAppDispatch();
  const { categories, selectedCategories } = useAppSelector((state: RootState) => state.products);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const mainCategories = categories.length > 0 && categories[0].name === 'Home' || (typeof categories[0]?.name === 'object' && (categories[0].name as any).en === 'Home')
    ? (categories[0] as any).children || []
    : categories;

  const handleCategoryToggle = (categoryId: string, hasChildren: boolean) => {
    dispatch(toggleCategory(categoryId));
    
    if (hasChildren) {
      if (expandedCategories.includes(categoryId)) {
        setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
      } else {
        setExpandedCategories([...expandedCategories, categoryId]);
      }
    }
  };

  const isExpanded = (categoryId: string) => expandedCategories.includes(categoryId);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 sticky top-24 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Categories</h3>
        <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
      </div>
      
      {/* All Products */}
      <div className="mb-6">
        <button
          onClick={() => dispatch(toggleCategory('all'))}
          className={`w-full flex items-center px-5 py-4 rounded-2xl text-left transition-all duration-300 font-black text-xs uppercase tracking-widest border ${
            selectedCategories.length === 0
              ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-200'
              : 'text-gray-500 hover:bg-gray-50 border-transparent hover:text-gray-900'
          }`}
        >
          <RectangleGroupIcon className="w-4 h-4 mr-3" />
          <span>All Products</span>
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-450px)] pr-2 no-scrollbar">
        {mainCategories.map((category: any) => {
          const isSelected = selectedCategories.includes(category._id);
          const hasChildren = category.children && category.children.length > 0;
          
          return (
            <div key={category._id} className="space-y-2">
              <button
                onClick={() => handleCategoryToggle(category._id, hasChildren)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-all duration-300 border ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                    : 'bg-white border-gray-50 text-gray-600 hover:bg-gray-50 hover:border-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-3.5 h-3.5 border rounded-md mr-3 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-wider">{showingTranslateValue(category.name)}</span>
                </div>
                {hasChildren && (
                  isExpanded(category._id) ? (
                    <ChevronDownIcon className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <ChevronRightIcon className="w-3.5 h-3.5 text-gray-300" />
                  )
                )}
              </button>

              {/* Subcategories */}
              {hasChildren && isExpanded(category._id) && (
                <div className="space-y-2 ml-4 border-l-2 border-gray-50 pl-4 animate-in slide-in-from-top-1 duration-200">
                  {category.children.map((subCategory: any) => {
                    const isSubSelected = selectedCategories.includes(subCategory._id);
                    return (
                      <button
                        key={subCategory._id}
                        onClick={() => dispatch(toggleCategory(subCategory._id))}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                          isSubSelected
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wide">{showingTranslateValue(subCategory.name)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear Filters */}
      {selectedCategories.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-100">
          <button
            onClick={() => dispatch(clearFilters())}
            className="w-full py-4 bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all active:scale-95"
          >
            Clear All Selection
          </button>
        </div>
      )}
    </div>
  );
}