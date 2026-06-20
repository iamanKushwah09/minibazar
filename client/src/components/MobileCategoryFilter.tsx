'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleCategory, setSubCategory, toggleItemGroup, clearFilters } from '../store/slices/productSlice';
import { ChevronDownIcon, ChevronRightIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

interface MobileCategoryFilterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileCategoryFilter({ isOpen, onClose }: MobileCategoryFilterProps) {
  const dispatch = useAppDispatch();
  const { categories, itemGroups, selectedCategory, selectedSubCategory, selectedCategories, selectedItemGroups } = useAppSelector((state: RootState) => state.products);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // The backend returns [ { _id: ..., name: "Home", children: [...] } ]
  const mainCategories = (categories.length > 0 && categories[0] && (showingTranslateValue(categories[0].name) === 'Home' || (typeof categories[0]?.name === 'object' && (categories[0].name as any).en === 'Home')))
    ? (categories[0] as any).children || []
    : categories;

  const handleCategoryClick = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
    dispatch(setSubCategory('all'));
    // We don't close here to allow subcategory selection or viewing results
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    dispatch(setSubCategory(subCategoryId));
    onClose();
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  const isExpanded = (categoryId: string) => expandedCategories.includes(categoryId);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedSubCategory !== 'all') count++;
    return count;
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Filter Panel */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FunnelIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <span className="flex items-center justify-center px-2 py-0.5 text-[10px] font-black bg-blue-600 text-white rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all active:scale-90"
            >
              <XMarkIcon className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
            {/* All Products */}
            <div className="mb-6">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                  selectedCategory === 'all' && selectedSubCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="font-bold uppercase tracking-wider text-sm">All Products</span>
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">item Group</span>
                <div className="h-[1px] flex-1 bg-gray-100 ml-6"></div>
              </div>
              {mainCategories.length > 0 ? (
                mainCategories.map((category: any) => (
                  <div key={category._id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {/* Main Category */}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleCategoryClick(category._id)}
                        className={`flex-1 text-left px-4 py-3.5 transition-colors ${
                          selectedCategory === category._id || (selectedCategories && selectedCategories.includes(category._id))
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-900'
                        }`}
                      >
                        <span className="font-bold text-sm uppercase">{showingTranslateValue(category.name)}</span>
                      </button>
                      
                      {category.children && category.children.length > 0 && (
                        <button 
                          onClick={() => toggleCategoryExpansion(category._id)}
                          className="px-4 py-3.5 border-l border-gray-50 text-gray-400"
                        >
                          {isExpanded(category._id) ? (
                            <ChevronDownIcon className="w-5 h-5" />
                          ) : (
                            <ChevronRightIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {category.children && category.children.length > 0 && isExpanded(category._id) && (
                      <div className="border-t border-gray-50 bg-gray-50/50">
                        {category.children.map((subCategory: any) => (
                          <button
                            key={subCategory._id}
                            onClick={() => handleSubCategoryClick(subCategory._id)}
                            className={`w-full flex items-center justify-between px-8 py-3 text-left transition-colors ${
                              selectedSubCategory === subCategory._id
                                ? 'text-blue-600 font-bold bg-blue-50/50'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-sm">{showingTranslateValue(subCategory.name)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No categories available</p>
                </div>
              )}
            </div>

            {/* Brands */}
            <div className="mt-10 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Brands</span>
                <div className="h-[1px] flex-1 bg-gray-100 ml-6"></div>
              </div>
              {itemGroups.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {itemGroups.map((group: any) => {
                    const isSelected = selectedItemGroups.includes(group._id);
                    return (
                      <button
                        key={group._id}
                        onClick={() => dispatch(toggleItemGroup(group._id))}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 text-center ${
                          isSelected
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {group.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No brands available</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
            <div className="flex space-x-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-widest"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="flex-[2] px-4 py-3 text-sm font-black bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 uppercase tracking-widest"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}