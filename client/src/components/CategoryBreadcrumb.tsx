'use client';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCategory, setSubCategory, setItemGroup } from '../store/slices/productSlice';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

export default function CategoryBreadcrumb() {
  const dispatch = useAppDispatch();
  const { categories, selectedCategory, selectedSubCategory, selectedItemGroup } = useAppSelector((state: RootState) => state.products);

  // The backend returns [ { _id: ..., name: "Home", children: [...] } ]
  const mainCategories = categories.length > 0 && categories[0].name === 'Home' || (typeof categories[0]?.name === 'object' && (categories[0].name as any).en === 'Home')
    ? (categories[0] as any).children || []
    : categories;

  const currentCategory = mainCategories.find((cat: any) => cat._id === selectedCategory);
  const currentSubCategory = currentCategory?.children?.find((sub: any) => sub._id === selectedSubCategory);

  const handleHomeClick = () => {
    dispatch(setCategory('all'));
    dispatch(setSubCategory('all'));
    dispatch(setItemGroup('all'));
  };

  const handleCategoryClick = () => {
    dispatch(setSubCategory('all'));
  };

  if (selectedCategory === 'all' && selectedItemGroup === 'all') {
    return (
      <nav className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
        <div className="flex items-center space-x-2">
          <HomeIcon className="w-3.5 h-3.5" />
          <span>New Collection</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-3 text-xs font-black uppercase tracking-widest text-gray-400 mb-8 overflow-x-auto no-scrollbar py-2">
      <button
        onClick={handleHomeClick}
        className="flex items-center space-x-2 hover:text-blue-600 transition-all flex-shrink-0"
      >
        <HomeIcon className="w-3.5 h-3.5" />
        <span>HOME</span>
      </button>
      
      {selectedItemGroup !== 'all' && (
        <>
          <ChevronRightIcon className="w-3 h-3 flex-shrink-0" />
          <span className="text-gray-900 flex-shrink-0">{selectedItemGroup}</span>
        </>
      )}

      {selectedCategory !== 'all' && (
        <>
          <ChevronRightIcon className="w-3 h-3 flex-shrink-0" />
          <button
            onClick={handleCategoryClick}
            className={`transition-all flex-shrink-0 ${selectedSubCategory === 'all' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            {showingTranslateValue(currentCategory?.name)}
          </button>
        </>
      )}
      
      {selectedSubCategory !== 'all' && currentSubCategory && (
        <>
          <ChevronRightIcon className="w-3 h-3 flex-shrink-0" />
          <span className="text-blue-600 flex-shrink-0">
            {showingTranslateValue(currentSubCategory.name)}
          </span>
        </>
      )}
    </nav>
  );
}
