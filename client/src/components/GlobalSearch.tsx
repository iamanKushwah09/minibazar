'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  DialogPanel, 
  Transition, 
  TransitionChild 
} from '@headlessui/react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ArrowRightIcon,
  ClockIcon,
  FireIcon,
  TagIcon,
  ArrowUpRightIcon
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSearchQuery } from '../store/slices/productSlice';
import type { RootState } from '../store/types';
import Image from 'next/image';
import { showingTranslateValue } from '../lib/utils';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state: RootState) => state.products);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from local storage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));

      dispatch(setSearchQuery(searchQuery));
      onClose();
      router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const filteredProducts = query 
    ? products.filter(p => {
        const name = showingTranslateValue(p.title).toLowerCase();
        return name.includes(query.toLowerCase());
      }).slice(0, 4)
    : [];

  const trendingCategories = [
    { name: 'Air Max Sneakers', href: '/category/men/sneakers' },
    { name: 'Women\'s Heels', href: '/category/women/heels' },
    { name: 'Running Shoes', href: '/category/sports/running' },
    { name: 'New Arrivals', href: '/new-arrivals' },
  ];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 transition-all">
              <div className="relative">
                <MagnifyingGlassIcon
                  className="pointer-events-none absolute left-4 top-3.5 h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  className="h-14 w-full border-0 bg-transparent pl-12 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Search for your favorite kicks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(query);
                  }}
                  autoFocus
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Search Content */}
              <div className="flex divide-x divide-gray-100">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto max-h-[60vh] p-4">
                  {query === '' ? (
                    <div className="space-y-6">
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1.5" />
                            Recent Searches
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {recentSearches.map((s) => (
                              <button
                                key={s}
                                onClick={() => handleSearch(s)}
                                className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors flex items-center group"
                              >
                                {s}
                                <ArrowUpRightIcon className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending */}
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                          <FireIcon className="h-4 w-4 mr-1.5 text-orange-500" />
                          Trending Styles
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {trendingCategories.map((cat) => (
                            <button
                              key={cat.name}
                              onClick={() => {
                                onClose();
                                router.push(cat.href);
                              }}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 group transition-all border border-transparent hover:border-blue-100"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{cat.name}</span>
                              <ArrowRightIcon className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transform transition-transform group-hover:translate-x-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.length > 0 ? (
                        <>
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Top Results
                          </h3>
                          <div className="space-y-2">
                            {filteredProducts.map((p) => (
                              <button
                                key={p._id}
                                onClick={() => {
                                  onClose();
                                  router.push(`/product/${p._id}`);
                                }}
                                className="flex items-center w-full p-2.5 rounded-xl hover:bg-gray-50 group transition-all"
                              >
                                <div className="h-14 w-14 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-300">{showingTranslateValue(p.title)[0]}</span>
                                  </div>
                                  {p.image && p.image[0] && (
                                    <Image
                                      src={p.image[0]}
                                      alt={showingTranslateValue(p.title)}
                                      fill
                                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity"
                                      onError={(e) => {
                                        (e.target as any).style.display = 'none';
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="ml-4 text-left flex-1">
                                  <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {showingTranslateValue(p.title)}
                                  </div>
                                  <div className="text-xs text-gray-500">{p.category}</div>
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                  ₹{p.prices.price}
                                </div>
                              </button>
                            ))}
                          </div>
                          {filteredProducts.length >= 4 && (
                            <button 
                              onClick={() => handleSearch(query)}
                              className="w-full text-center py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              View all results for "{query}"
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="py-12 text-center">
                          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                            <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">No results found for "{query}". Try something else?</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sidebar / Quick Links */}
                <div className="hidden sm:block w-48 p-4 bg-gray-50/50">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Quick Access
                  </h3>
                  <div className="space-y-3">
                    <button onClick={() => { onClose(); router.push('/category/men'); }} className="block text-xs font-medium text-gray-600 hover:text-blue-600">Men's Kicks</button>
                    <button onClick={() => { onClose(); router.push('/category/women'); }} className="block text-xs font-medium text-gray-600 hover:text-blue-600">Women's Collection</button>
                    <button onClick={() => { onClose(); router.push('/category/kids'); }} className="block text-xs font-medium text-gray-600 hover:text-blue-600">Kids Section</button>
                    <button onClick={() => { onClose(); router.push('/category/sports'); }} className="block text-xs font-medium text-gray-600 hover:text-blue-600">Performance Gear</button>
                  </div>

                  <div className="mt-8">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                      <p className="text-[10px] font-bold opacity-80 uppercase tracking-tight">Summer Sale</p>
                      <p className="text-xs font-bold mb-2">Up to 40% OFF</p>
                      <button 
                        onClick={() => { onClose(); router.push('/discounts'); }}
                        className="text-[10px] font-bold bg-white text-blue-700 px-2 py-1 rounded"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 text-[10px] text-gray-400">
                <div className="flex items-center space-x-4">
                  <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">Enter</kbd> to search</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">Esc</kbd> to close</span>
                </div>
                <div className="font-medium">
                  Shivanya Fresh Masale <span className="text-blue-500">Global Search</span>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

