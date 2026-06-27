'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleItemGroup, clearFilters } from '../store/slices/productSlice';
import { RootState } from '../store/types';

export default function ItemGroupFilter() {
  const dispatch = useAppDispatch();
  const { itemGroups, selectedItemGroups } = useAppSelector((state: RootState) => state.products);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || itemGroups.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Browse Brands</h3>
        {selectedItemGroups.length > 0 && (
          <button 
            onClick={() => dispatch(toggleItemGroup('all'))}
            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
          >
            Clear Selected
          </button>
        )}
      </div>
      
      <div className="flex overflow-x-auto pb-4 space-x-3 no-scrollbar -mx-1 px-1">
        {/* All Collection */}
        <button
          onClick={() => dispatch(toggleItemGroup('all'))}
          className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
            selectedItemGroups.length === 0
              ? 'bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-200 scale-105'
              : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-900'
          }`}
        >
          All
        </button>

        {/* Dynamic ItemGroups */}
        {itemGroups.map((group) => {
          const isSelected = selectedItemGroups.includes(group._id);
          return (
            <button
              key={group._id}
              onClick={() => dispatch(toggleItemGroup(group._id))}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 border-2 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105'
                  : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-gray-900'
              }`}
            >
              {group.name.replace(/_/g, ' ')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

