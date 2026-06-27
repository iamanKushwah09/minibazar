'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import {
  fetchProducts,
  fetchCategories,
  fetchItemGroups,
  toggleCategory,
  toggleItemGroup,
  setSubCategory,
  setSearchQuery,
  clearFilters
} from '../store/slices/productSlice';
import { fetchCurrentUser } from '../store/slices/authSlice';
import ProductService from '../services/productService';
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
  RectangleGroupIcon,
  PhotoIcon,
  FolderIcon,
  ShoppingBagIcon,
  TagIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import type { RootState } from '../store/types';
import { showingTranslateValue, getImageUrl } from '../lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{
    suggestions: any[];
    categories: any[];
    itemGroups: any[];
  }>({ suggestions: [], categories: [], itemGroups: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktopSearchExpanded, setIsDesktopSearchExpanded] = useState(false);

  const [itemGroupSearch, setItemGroupSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'category' | 'itemGroup' | null>(null);
  const [mobileTab, setMobileTab] = useState<'category' | 'branding'>('category');

  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const { itemCount: cartCount } = useAppSelector((state: RootState) => state.cart);
  const { items: wishlistItems } = useAppSelector((state: RootState) => state.wishlist);
  const { categories, itemGroups, selectedCategories, selectedItemGroups } = useAppSelector((state: RootState) => state.products);

  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchItemGroups());

    // Fetch user profile if token exists but user data is missing
    const token = localStorage.getItem('authToken');
    if (token && !user) {
      // For now we'll use a placeholder or just set isAuthenticated
      // In a real app, you'd decode the token or call /me endpoint
      // dispatch(fetchCurrentUser('some-id'));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          const data = await ProductService.getSearchSuggestions(searchTerm);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions', error);
        }
      }, 300);
    } else {
      setSuggestions({ suggestions: [], categories: [], itemGroups: [] });
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        // We can't access latest searchTerm easily here because of empty dependency array, 
        // so we check the input element directly.
        const searchInput = searchRef.current.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput && !searchInput.value.trim()) {
          setIsDesktopSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile overlays are open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm));
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setShowSuggestions(false);
      setActiveDropdown(null);
    }
  };

  const handleSuggestionClick = (type: 'product' | 'category' | 'itemGroup', id: string, name: string) => {
    if (type === 'category') {
      dispatch(toggleCategory(id));
    } else if (type === 'itemGroup') {
      dispatch(toggleItemGroup(id));
    } else {
      dispatch(setSearchQuery(name));
      setSearchTerm(name);
    }
    setShowSuggestions(false);
    setIsSearchOpen(false);
    setIsMenuOpen(false);
  };

  const mainCategories = (categories.length > 0 && categories[0] && (showingTranslateValue(categories[0].name) === 'Home' || (typeof categories[0]?.name === 'object' && (categories[0].name as any).en === 'Home')))
    ? categories[0].children || []
    : categories;

  const flattenTree = (items: any[]): any[] => {
    let flat: any[] = [];
    items.forEach(i => {
      flat.push(i);
      if (i.children && i.children.length > 0) {
        flat = [...flat, ...flattenTree(i.children)];
      }
    });
    return flat;
  };

  const allFlatCategories = flattenTree(mainCategories);
  const filteredCategories = allFlatCategories.filter(cat =>
    showingTranslateValue(cat.name).toLowerCase().includes(categorySearch.toLowerCase())
  );

  const allFlatItemGroups = flattenTree(itemGroups);
  const filteredItemGroups = allFlatItemGroups.filter(group =>
    group.name.toLowerCase().includes(itemGroupSearch.toLowerCase())
  );

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed top-0 left-0 right-0 z-[100] border-b border-gray-100 shadow-sm w-full transition-all duration-300" ref={navRef}>
      <div className="bg-gray-900 text-white py-1 sm:py-1.5 px-2 sm:px-4 text-center" style={{ overflowX: 'hidden' }}>
        <p className="text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-tight md:tracking-[0.2em] truncate">
          Premium Spices • Worldwide Shipping • Authentic Flavors
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20 lg:h-24">

          {/* Logo */}
          <Link href="/" onClick={() => { dispatch(clearFilters()); dispatch(setSearchQuery('')); }} className="flex items-center flex-shrink-0 group min-w-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img src="/shivanya-logo.jpg" alt="Shivanya Fresh Masale" className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <div className="flex flex-col justify-center">
                <span className="text-[10px] sm:text-sm md:text-lg lg:text-xl font-black text-gray-900 tracking-tight leading-none uppercase">
                  Shivanya Fresh
                </span>
                <span className="text-[6px] sm:text-[9px] md:text-xs font-black text-[#0d9e6d] tracking-[0.2em] uppercase mt-0.5 sm:mt-1">
                  Masale
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation - With increased spacing from search */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-shrink-0 px-2 lg:px-4">
            <div className="relative h-full">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                className={`flex items-center space-x-2 py-6 lg:py-8 text-[11px] lg:text-[12px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeDropdown === 'category' ? 'text-blue-600 border-blue-600' : 'text-gray-900 border-transparent hover:text-blue-600'
                  }`}
              >
                <span>item Group</span>
                <ChevronDownIcon className={`w-3 lg:w-3.5 h-3 lg:h-3.5 transition-transform duration-500 ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'category' && (
                <div className="absolute top-full left-0 w-[320px] sm:w-[360px] lg:w-[400px] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col mt-2 z-[110]">
                  <div className="p-5 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search item group..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all placeholder:text-gray-400"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {categorySearch ? (
                      filteredCategories.map((cat: any) => (
                        <button key={cat._id} onClick={() => dispatch(toggleCategory(cat._id))} className="w-full flex items-center px-6 py-3 hover:bg-gray-50 transition-colors group/item text-left">
                          <div className={`w-4 h-4 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(cat._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/item:border-blue-400'}`}>
                            {selectedCategories.includes(cat._id) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                          </div>
                          <span className={`ml-4 text-[11px] font-black uppercase tracking-[0.1em] ${selectedCategories.includes(cat._id) ? 'text-blue-600' : 'text-gray-700'}`}>{showingTranslateValue(cat.name)}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 space-y-4">
                        {mainCategories.map((parent: any) => (
                          <div key={parent._id} className="space-y-2">
                            <button onClick={() => dispatch(toggleCategory(parent._id))} className="w-full flex items-center px-4 py-1 group/parent">
                              <div className={`w-4 h-4 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(parent._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/parent:border-blue-400'}`}>
                                {selectedCategories.includes(parent._id) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                              </div>
                              <span className={`ml-3 text-[12px] font-black uppercase tracking-[0.15em] ${selectedCategories.includes(parent._id) ? 'text-blue-600' : 'text-gray-900'}`}>{showingTranslateValue(parent.name)}</span>
                            </button>
                            {parent.children?.length > 0 && (
                              <div className="ml-10 space-y-1 border-l-2 border-gray-50 pl-3">
                                {parent.children.map((child: any) => (
                                  <button key={child._id} onClick={() => dispatch(toggleCategory(child._id))} className="w-full flex items-center py-1.5 group/child text-left">
                                    <div className={`w-3.5 h-3.5 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(child._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                                      {selectedCategories.includes(child._id) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`ml-3 text-[10px] font-bold uppercase tracking-wider ${selectedCategories.includes(child._id) ? 'text-blue-600' : 'text-gray-400 group-hover/child:text-gray-900'}`}>{showingTranslateValue(child.name)}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative h-full">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'itemGroup' ? null : 'itemGroup')}
                className={`flex items-center space-x-2 py-6 lg:py-8 text-[11px] lg:text-[12px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all border-b-2 whitespace-nowrap ${activeDropdown === 'itemGroup' ? 'text-blue-600 border-blue-600' : 'text-gray-900 border-transparent hover:text-blue-600'
                  }`}
              >
                <span>Brands</span>
                <ChevronDownIcon className={`w-3 lg:w-3.5 h-3 lg:h-3.5 transition-transform duration-500 ${activeDropdown === 'itemGroup' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'itemGroup' && (
                <div className="absolute top-full left-0 w-[320px] sm:w-[360px] lg:w-[400px] bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col mt-2 z-[110]">
                  <div className="p-5 bg-gray-50 border-b border-gray-100">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all placeholder:text-gray-400"
                        value={itemGroupSearch}
                        onChange={(e) => setItemGroupSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-200">
                    {itemGroupSearch ? (
                      filteredItemGroups.map((group: any) => (
                        <button key={group._id} onClick={() => dispatch(toggleItemGroup(group._id))} className="w-full flex items-center px-6 py-3 hover:bg-gray-50 transition-colors group/item text-left">
                          <div className={`w-4 h-4 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(group._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/item:border-blue-400'}`}>
                            {selectedItemGroups.includes(group._id) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                          </div>
                          <span className={`ml-4 text-[11px] font-black uppercase tracking-[0.1em] ${selectedItemGroups.includes(group._id) ? 'text-blue-600' : 'text-gray-700'}`}>{group.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 space-y-4">
                        {itemGroups.map((parent: any) => (
                          <div key={parent._id} className="space-y-2">
                            <button onClick={() => dispatch(toggleItemGroup(parent._id))} className="w-full flex items-center px-4 py-1 group/parent">
                              <div className={`w-4 h-4 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(parent._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/parent:border-blue-400'}`}>
                                {selectedItemGroups.includes(parent._id) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                              </div>
                              <span className={`ml-3 text-[12px] font-black uppercase tracking-[0.15em] ${selectedItemGroups.includes(parent._id) ? 'text-blue-600' : 'text-gray-900'}`}>{parent.name}</span>
                            </button>
                            {parent.children?.length > 0 && (
                              <div className="ml-10 space-y-1 border-l-2 border-gray-50 pl-3">
                                {parent.children.map((child: any) => (
                                  <button key={child._id} onClick={() => dispatch(toggleItemGroup(child._id))} className="w-full flex items-center py-1.5 group/child text-left">
                                    <div className={`w-3.5 h-3.5 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(child._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                                      {selectedItemGroups.includes(child._id) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                    </div>
                                    <span className={`ml-3 text-[10px] font-bold uppercase tracking-wider ${selectedItemGroups.includes(child._id) ? 'text-blue-600' : 'text-gray-400 group-hover/child:text-gray-900'}`}>{child.name}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="flex items-center space-x-2 py-6 lg:py-8 text-[11px] lg:text-[12px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all border-b-2 whitespace-nowrap text-gray-900 border-transparent hover:text-blue-600"
            >
              <span>About Us</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center space-x-2 py-6 lg:py-8 text-[11px] lg:text-[12px] font-black uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all border-b-2 whitespace-nowrap text-gray-900 border-transparent hover:text-blue-600"
            >
              <span>Contact</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center ml-auto pl-2 md:pl-4 lg:pl-8 space-x-1 sm:space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 flex-1 justify-end min-w-0">

            {/* SEARCH */}
            <div className="flex flex-initial items-center relative" ref={searchRef}>

              {/* Desktop Search */}
              <div className={`hidden lg:block transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDesktopSearchExpanded ? 'w-[240px] xl:w-[320px]' : 'w-10 xl:w-12'}`}>
                <form 
                  onSubmit={handleSearch} 
                  className={`flex items-center bg-gray-50 border border-gray-100 rounded-full h-10 xl:h-12 w-full focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-200 shadow-sm overflow-hidden transition-all duration-500 ${isDesktopSearchExpanded ? 'px-2' : 'px-0'}`}
                >
                  <button 
                    type={isDesktopSearchExpanded ? "submit" : "button"}
                    onClick={() => {
                      if (!isDesktopSearchExpanded) {
                        setIsDesktopSearchExpanded(true);
                        setTimeout(() => {
                          const input = searchRef.current?.querySelector('input');
                          if (input) input.focus();
                        }, 100);
                      }
                    }}
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 xl:w-12 xl:h-12 hover:bg-gray-100 rounded-full transition-colors text-gray-900"
                  >
                    <MagnifyingGlassIcon className="w-5 xl:w-6 h-5 xl:h-6" />
                  </button>
                  <input
                    type="text"
                    placeholder="SEARCH..."
                    className={`bg-transparent border-none outline-none ring-0 focus:ring-0 focus:outline-none text-[10px] xl:text-[12px] font-black text-gray-900 h-full uppercase tracking-[0.15em] placeholder:text-gray-400 transition-all duration-500 ${isDesktopSearchExpanded ? 'w-full opacity-100 ml-2' : 'w-0 opacity-0 ml-0 p-0'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim().length > 1 && setShowSuggestions(true)}
                  />
                </form>
              </div>

              {/* Mobile Search Icon */}
              <div className="lg:hidden">
                <button onClick={() => setIsSearchOpen(true)} className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all">
                  <MagnifyingGlassIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-900" />
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.suggestions.length > 0 || suggestions.categories.length > 0 || suggestions.itemGroups.length > 0) && (
                <div className="absolute top-full right-0 mt-3 lg:mt-5 w-[280px] sm:w-[320px] lg:w-[600px] bg-white rounded-[2.5rem] shadow-[0_35px_80px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden z-[120] animate-in fade-in slide-in-from-top-6 duration-500">
                  <div className="max-h-[400px] lg:max-h-[580px] overflow-y-auto py-6 lg:py-8 scrollbar-thin">

                    {/* Item Group Suggestions - HORIZONTAL ONE LINE */}
                    {suggestions.itemGroups.length > 0 && (
                      <div className="px-8 mb-10">
                        <span className="text-[11px] font-black text-purple-600 uppercase tracking-[0.3em] mb-5 block">Brands</span>
                        <div className="flex flex-wrap gap-3">
                          {suggestions.itemGroups.map((group: any) => (
                            <button
                              key={group.id}
                              onClick={() => handleSuggestionClick('itemGroup', group.id, group.name)}
                              className="px-6 py-3 bg-purple-50 text-purple-600 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-md border border-purple-100 active:scale-95"
                            >
                              {group.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category Suggestions */}
                    {suggestions.categories.length > 0 && (
                      <div className="px-8 mb-10">
                        <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em] mb-5 block">item Group</span>
                        <div className="grid grid-cols-2 gap-4">
                          {suggestions.categories.map((cat: any) => (
                            <button
                              key={cat.id}
                              onClick={() => handleSuggestionClick('category', cat.id, cat.name)}
                              className="flex items-center space-x-4 p-4 bg-blue-50/50 hover:bg-blue-600 hover:text-white rounded-[1.5rem] transition-all group/suggestion text-left border border-blue-50"
                            >
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover/suggestion:bg-blue-500 transition-colors">
                                <Squares2X2Icon className="w-5 h-5" />
                              </div>
                              <span className="text-[12px] font-bold uppercase tracking-tight">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product Suggestions */}
                    {suggestions.suggestions.length > 0 && (
                      <div className="px-8">
                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-5 block">Top Products</span>
                        <div className="space-y-3">
                          {suggestions.suggestions.map((product: any) => (
                            <button
                              key={product.id}
                              onClick={() => handleSuggestionClick('product', product.id, product.name)}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-[1.5rem] transition-all group/suggestion text-left border border-transparent hover:border-gray-100"
                            >
                              <div className="flex items-center space-x-5">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                                  <ShoppingBagIcon className="w-6 h-6 text-gray-300" />
                                </div>
                                <span className="text-[13px] font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</span>
                              </div>
                              <ChevronDownIcon className="w-5 h-5 text-gray-300 -rotate-90" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-3 xl:space-x-4 flex-shrink-0">
              <Link href="/wishlist" className="relative p-1.5 sm:p-2 group hover:bg-red-50 rounded-lg sm:rounded-xl transition-all flex-shrink-0">
                <HeartIcon className="w-5 sm:w-6 md:w-6 lg:w-7 h-5 sm:h-6 md:h-6 lg:h-7 text-gray-900 group-hover:text-red-500 transition-colors" />
                {isMounted && wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[7px] sm:text-[8px] font-black w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full flex items-center justify-center shadow-md">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-1.5 sm:p-2 group hover:bg-blue-50 rounded-lg sm:rounded-xl transition-all flex-shrink-0">
                <ShoppingBagIcon className="w-5 sm:w-6 md:w-6 lg:w-7 h-5 sm:h-6 md:h-6 lg:h-7 text-gray-900 group-hover:text-blue-600 transition-colors" />
                {isMounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[7px] sm:text-[8px] font-black w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full flex items-center justify-center shadow-lg shadow-blue-200">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-1.5 sm:p-2 text-gray-900 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-all flex-shrink-0">
                <Bars3Icon className="w-6 sm:w-7 h-6 sm:h-7" />
              </button>

              <div className="hidden md:flex flex-shrink-0">
                {isMounted ? (
                  isAuthenticated ? (
                    <Link href="/dashboard" className="flex items-center space-x-1 lg:space-x-2 bg-gray-50 rounded-full px-2 md:px-3 lg:px-4 xl:px-6 py-1.5 lg:py-2 xl:py-2.5 hover:bg-gray-100 transition-all border border-gray-100 group flex-shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs md:text-sm lg:text-base xl:text-xl group-hover:scale-110 transition-transform flex-shrink-0">
                        {user?.name?.[0]}
                      </div>
                      <span className="text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] font-black text-gray-900 hidden lg:block uppercase tracking-widest leading-none truncate">{user?.name?.split(' ')[0]}</span>
                    </Link>
                  ) : (
                    <Link href="/login" className="bg-gray-900 text-white px-4 md:px-5 lg:px-6 xl:px-8 py-2 md:py-2.5 lg:py-3 xl:py-3.5 rounded-full text-[8px] md:text-[9px] lg:text-[10px] xl:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.25em] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95 whitespace-nowrap flex-shrink-0 inline-flex items-center justify-center">
                      Sign In
                    </Link>
                  )
                ) : (
                  <div className="w-[100px] h-[40px]"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[1000] p-4 sm:p-6 md:hidden flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 flex-shrink-0">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
              <img src="/shivanya-logo.jpg" alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 sm:p-3 bg-gray-100 text-gray-900 rounded-full active:scale-90 transition-all hover:bg-gray-200">
              <XMarkIcon className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>

          {/* Menu Content Container */}
          <div className="flex-1 flex flex-col justify-between py-6 overflow-y-auto min-h-0">
            <div className="space-y-6 sm:space-y-8">
              {/* Mobile Tabs */}
              <div className="flex border-b border-gray-100 flex-shrink-0">
                <button
                  onClick={() => setMobileTab('category')}
                  className={`flex-1 pb-3 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border-b-2 text-center ${mobileTab === 'category' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-900'
                    }`}
                >
                  item Group
                </button>
                <button
                  onClick={() => setMobileTab('branding')}
                  className={`flex-1 pb-3 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] transition-all border-b-2 text-center ${mobileTab === 'branding' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-900'
                    }`}
                >
                  Branding
                </button>
              </div>

              {mobileTab === 'category' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">item Group</span>
                      <div className="h-[1px] flex-1 bg-gray-50 ml-4 sm:ml-6"></div>
                    </div>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search item Group..."
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-transparent rounded-lg sm:rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-blue-200 transition-all placeholder:text-gray-400"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {categorySearch ? (
                      filteredCategories.map((cat: any) => (
                        <button key={cat._id} onClick={() => dispatch(toggleCategory(cat._id))} className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors group/item text-left">
                          <div className={`w-5 h-5 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(cat._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/item:border-blue-400'}`}>
                            {selectedCategories.includes(cat._id) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                          </div>
                          <span className={`ml-3 sm:ml-4 text-[12px] sm:text-[13px] font-black uppercase tracking-[0.1em] ${selectedCategories.includes(cat._id) ? 'text-blue-600' : 'text-gray-700'}`}>{showingTranslateValue(cat.name)}</span>
                        </button>
                      ))
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {mainCategories.length > 0 ? (
                          mainCategories.map((parent: any) => (
                            <div key={parent._id} className="space-y-2">
                              <button onClick={() => dispatch(toggleCategory(parent._id))} className="w-full flex items-center px-2 py-2 group/parent">
                                <div className={`w-5 h-5 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(parent._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/parent:border-blue-400'}`}>
                                  {selectedCategories.includes(parent._id) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                </div>
                                <span className={`ml-3 sm:ml-4 text-[12px] sm:text-[13px] font-black uppercase tracking-[0.15em] ${selectedCategories.includes(parent._id) ? 'text-blue-600' : 'text-gray-900'}`}>{showingTranslateValue(parent.name)}</span>
                              </button>
                              {parent.children?.length > 0 && (
                                <div className="ml-10 sm:ml-11 space-y-1 border-l-2 border-gray-50 pl-3 sm:pl-4">
                                  {parent.children.map((child: any) => (
                                    <button key={child._id} onClick={() => dispatch(toggleCategory(child._id))} className="w-full flex items-center py-1.5 sm:py-2 group/child text-left">
                                      <div className={`w-4 h-4 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${selectedCategories.includes(child._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                                        {selectedCategories.includes(child._id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                      </div>
                                      <span className={`ml-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${selectedCategories.includes(child._id) ? 'text-blue-600' : 'text-gray-400 group-hover/child:text-gray-900'}`}>{showingTranslateValue(child.name)}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No item Group available</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {mobileTab === 'branding' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Brands</span>
                      <div className="h-[1px] flex-1 bg-gray-50 ml-4 sm:ml-6"></div>
                    </div>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search brands..."
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-gray-50 border border-transparent rounded-lg sm:rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-blue-200 transition-all placeholder:text-gray-400"
                        value={itemGroupSearch}
                        onChange={(e) => setItemGroupSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {itemGroupSearch ? (
                      filteredItemGroups.map((group: any) => (
                        <button key={group._id} onClick={() => dispatch(toggleItemGroup(group._id))} className="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors group/item text-left">
                          <div className={`w-5 h-5 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(group._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/item:border-blue-400'}`}>
                            {selectedItemGroups.includes(group._id) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                          </div>
                          <span className={`ml-3 sm:ml-4 text-[12px] sm:text-[13px] font-black uppercase tracking-[0.1em] ${selectedItemGroups.includes(group._id) ? 'text-blue-600' : 'text-gray-700'}`}>{group.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="space-y-3 sm:space-y-4">
                        {itemGroups.length > 0 ? (
                          itemGroups.map((parent: any) => (
                            <div key={parent._id} className="space-y-2">
                              <button onClick={() => dispatch(toggleItemGroup(parent._id))} className="w-full flex items-center px-2 py-2 group/parent">
                                <div className={`w-5 h-5 border-2 rounded-lg flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(parent._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover/parent:border-blue-400'}`}>
                                  {selectedItemGroups.includes(parent._id) && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>}
                                </div>
                                <span className={`ml-3 sm:ml-4 text-[12px] sm:text-[13px] font-black uppercase tracking-[0.15em] ${selectedItemGroups.includes(parent._id) ? 'text-blue-600' : 'text-gray-900'}`}>{parent.name}</span>
                              </button>
                              {parent.children?.length > 0 && (
                                <div className="ml-10 sm:ml-11 space-y-1 border-l-2 border-gray-50 pl-3 sm:pl-4">
                                  {parent.children.map((child: any) => (
                                    <button key={child._id} onClick={() => dispatch(toggleItemGroup(child._id))} className="w-full flex items-center py-1.5 sm:py-2 group/child text-left">
                                      <div className={`w-4 h-4 border-2 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${selectedItemGroups.includes(child._id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                                        {selectedItemGroups.includes(child._id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                      </div>
                                      <span className={`ml-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${selectedItemGroups.includes(child._id) ? 'text-blue-600' : 'text-gray-400 group-hover/child:text-gray-900'}`}>{child.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="py-10 text-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No brands available</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Links */}
            <div className="pt-6 border-t border-gray-100 mt-6 flex-shrink-0 flex flex-col space-y-4">
              <Link
                href="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-[12px] font-black uppercase tracking-[0.15em] text-gray-900 hover:text-blue-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-[12px] font-black uppercase tracking-[0.15em] text-gray-900 hover:text-blue-600 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Mobile User Section (Sticky/Bottom of Drawer Content) */}
            <div className="pt-6 border-t border-gray-100 mt-8 flex-shrink-0">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm uppercase">
                      {user?.name?.[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-black text-gray-900 uppercase tracking-wider truncate">{user?.name}</span>
                      <span className="text-[9px] font-bold text-gray-400 truncate">{user?.email}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-700 transition-all active:scale-95"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        toast.success('Logged out successfully');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 py-3 bg-red-50 hover:bg-red-100 rounded-xl text-[10px] font-black uppercase tracking-wider text-red-600 transition-all active:scale-95"
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center mb-2">Access Your Account</p>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center py-4 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:bg-black transition-all active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[1000] p-4 sm:p-6 lg:hidden flex flex-col h-full overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 flex-shrink-0">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
              <img src="/shivanya-logo.jpg" alt="Shivanya Fresh Masale" className="h-12 sm:h-16 w-auto object-contain scale-[1.5] origin-left" />
            </Link>
            <button onClick={() => setIsSearchOpen(false)} className="p-2 sm:p-3 bg-gray-100 text-gray-900 rounded-full active:scale-90 transition-all hover:bg-gray-200">
              <XMarkIcon className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
          </div>

          {/* Search Input */}
          <div className="py-4 sm:py-6 flex-shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="SEARCH SPICES..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-xs font-black text-gray-900 uppercase tracking-[0.15em] transition-all outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </form>
          </div>

          {/* Content (Suggestions or Popular Searches) */}
          <div className="flex-1 overflow-y-auto min-h-0 pb-10">
            {searchTerm.trim().length > 1 && (suggestions.suggestions.length > 0 || suggestions.categories.length > 0 || suggestions.itemGroups.length > 0) ? (
              <div className="space-y-8">
                {/* Brand Suggestions */}
                {suggestions.itemGroups.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.25em] block">Brands</span>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.itemGroups.map((group: any) => (
                        <button
                          key={group.id}
                          onClick={() => handleSuggestionClick('itemGroup', group.id, group.name)}
                          className="px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-wider hover:bg-purple-600 hover:text-white transition-all border border-purple-100 active:scale-95"
                        >
                          {group.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Suggestions */}
                {suggestions.categories.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] block">item Group</span>
                    <div className="grid grid-cols-2 gap-3">
                      {suggestions.categories.map((cat: any) => (
                        <button
                          key={cat.id}
                          onClick={() => handleSuggestionClick('category', cat.id, cat.name)}
                          className="flex items-center space-x-3 p-3 bg-blue-50/50 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-left border border-blue-50"
                        >
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm text-gray-500">
                            <Squares2X2Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-tight truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Suggestions */}
                {suggestions.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block">Top Products</span>
                    <div className="space-y-2">
                      {suggestions.suggestions.map((product: any) => (
                        <button
                          key={product.id}
                          onClick={() => handleSuggestionClick('product', product.id, product.name)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-all text-left border border-transparent hover:border-gray-100 bg-gray-50/50"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              <ShoppingBagIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <span className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1 min-w-0">{product.name}</span>
                          </div>
                          <ChevronDownIcon className="w-4 h-4 text-gray-400 -rotate-90 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Popular Searches */
              <div className="space-y-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] block">Popular Searches</span>
                <div className="flex flex-wrap gap-2">
                  {['Spices', 'Herbs', 'Masale', 'Seasoning', 'Powder'].map(term => (
                    <button
                      key={term}
                      onClick={() => { setSearchTerm(term); dispatch(setSearchQuery(term)); setIsSearchOpen(false); }}
                      className="px-4 py-2.5 bg-gray-50 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-600 hover:bg-blue-600 hover:text-white transition-all border border-gray-100"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
