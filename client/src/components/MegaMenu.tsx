'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCategory, setSubCategory } from '../store/slices/productSlice';
import { 
  ChevronDownIcon, 
  SparklesIcon, 
  StarIcon, 
  FireIcon, 
  TagIcon, 
  GiftIcon, 
  ArrowRightIcon,
  ClockIcon,
  XMarkIcon,
  UsersIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  ArrowUturnLeftIcon,
  QuestionMarkCircleIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  TruckIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import type { RootState } from '../store/types';
import { showingTranslateValue } from '../lib/utils';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory?: string | null;
}

export default function MegaMenu({ isOpen, onClose, activeCategory }: MegaMenuProps) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state: RootState) => state.products);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'main' | 'category'>('main');
  const [selectedMobileCategory, setSelectedMobileCategory] = useState<any>(null);

  const handleCategoryClick = (categoryId: string) => {
    dispatch(setCategory(categoryId));
    dispatch(setSubCategory('all'));
    onClose();
  };

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    dispatch(setCategory(categoryId));
    dispatch(setSubCategory(subCategoryId));
    onClose();
  };

  const handleMobileCategorySelect = (category: any) => {
    setSelectedMobileCategory(category);
    setMobileView('category');
  };

  const handleMobileBack = () => {
    setMobileView('main');
    setSelectedMobileCategory(null);
  };

  const features = [
    { 
      name: 'New Arrivals', 
      href: '/new-arrivals', 
      icon: SparklesIcon,
      description: 'Latest styles just in',
      badge: 'New',
      count: '50+'
    },
    { 
      name: 'Best Sellers', 
      href: '/best-sellers', 
      icon: StarIcon,
      description: 'Customer favorites',
      badge: 'Hot',
      count: '200+'
    },
    { 
      name: 'Trending', 
      href: '/trending', 
      icon: FireIcon,
      description: 'What\'s popular now',
      badge: 'Trending',
      count: '75+'
    },
    { 
      name: 'Discounts', 
      href: '/discounts', 
      icon: TagIcon,
      description: 'Great deals & offers',
      badge: 'Sale',
      count: '150+'
    },
    { 
      name: 'Limited Edition', 
      href: '/limited-edition', 
      icon: GiftIcon,
      description: 'Exclusive collections',
      badge: 'Limited',
      count: '25+'
    },
  ];

  const flashDeals = [
    {
      title: 'Premium Sneakers',
      originalPrice: '$199.99',
      salePrice: '$79.99',
      discount: '60%',
      timeLeft: '1h 30m',
      href: '/flash-deal/premium-sneakers'
    },
    {
      title: 'Designer Heels',
      originalPrice: '$299.99',
      salePrice: '$119.99',
      discount: '60%',
      timeLeft: '3h 15m',
      href: '/flash-deal/designer-heels'
    }
  ];

  if (!isOpen) return null;

  // If "More" category is selected, show different content
  if (activeCategory === 'more') {
    return (
      <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
        {/* Mobile Close Button */}
        <div className="lg:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">More</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <div className="space-y-3">
                <Link
                  href="/about"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <UsersIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      About Us
                    </p>
                    <p className="text-xs text-gray-500">Learn about our story and mission</p>
                  </div>
                </Link>
                
                <Link
                  href="/careers"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Careers
                    </p>
                    <p className="text-xs text-gray-500">Join our team</p>
                  </div>
                </Link>
                
                <Link
                  href="/contact"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Contact Us
                    </p>
                    <p className="text-xs text-gray-500">Get in touch with our team</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <div className="space-y-3">
                <Link
                  href="/shipping"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Shipping & Delivery
                    </p>
                    <p className="text-xs text-gray-500">Track orders and shipping info</p>
                  </div>
                </Link>
                
                <Link
                  href="/returns"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <ArrowUturnLeftIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Returns & Exchanges
                    </p>
                    <p className="text-xs text-gray-500">Easy 30-day returns</p>
                  </div>
                </Link>
                
                <Link
                  href="/help"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Help Center
                    </p>
                    <p className="text-xs text-gray-500">Find answers to common questions</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Legal & Accessibility */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal & Accessibility</h3>
              <div className="space-y-3">
                <Link
                  href="/accessibility"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Accessibility
                    </p>
                    <p className="text-xs text-gray-500">Our commitment to accessibility</p>
                  </div>
                </Link>
                
                <Link
                  href="/privacy"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Privacy Policy
                    </p>
                    <p className="text-xs text-gray-500">How we protect your data</p>
                  </div>
                </Link>
                
                <Link
                  href="/terms"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                  onClick={onClose}
                >
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      Terms of Service
                    </p>
                    <p className="text-xs text-gray-500">Our terms and conditions</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
      {/* Top Promotional Banner with Close Button */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-2 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <FireIcon className="h-4 w-4 animate-pulse" />
            <span className="font-semibold">MEGA SALE: Up to 80% Off + Free Shipping</span>
            <ClockIcon className="h-4 w-4" />
            <span>Ends in 2 days</span>
          </div>
        </div>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-white hover:text-gray-200 transition-colors"
          aria-label="Close mega menu"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {mobileView === 'main' ? (
            <>
              <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleMobileBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span>Back</span>
              </button>
              <h2 className="text-lg font-semibold text-gray-900">{showingTranslateValue(selectedMobileCategory?.name)}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile View */}
        <div className="lg:hidden">
          {mobileView === 'main' ? (
            <div className="space-y-6">
              {/* Categories Grid */}
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleMobileCategorySelect(category)}
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{showingTranslateValue(category.name)}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.children?.length || 0} subcategories</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">View all</span>
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <div className="flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {feature.name}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feature.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-400">{feature.count}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Flash Deals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Flash Deals</h3>
                <div className="space-y-3">
                  {flashDeals.map((deal) => (
                    <Link
                      key={deal.title}
                      href={deal.href}
                      className="block p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                          {deal.title}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {deal.discount}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-red-600">{deal.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>Ends in {deal.timeLeft}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Category Detail View */
            <div className="space-y-4">
              <div className="space-y-2">
                {selectedMobileCategory?.children?.map((subcategory: any) => (
                  <button
                    key={subcategory._id}
                    onClick={() => handleSubCategoryClick(selectedMobileCategory._id, subcategory._id)}
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-700">{showingTranslateValue(subcategory.name)}</span>
                      {(subcategory.count || 0) > 100 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{(subcategory.count || 0)}+</span>
                      <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Categories Section */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="group"
                    onMouseEnter={() => setHoveredCategory(category._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="relative">
                      <button
                        onClick={() => handleCategoryClick(category._id)}
                        className={`block text-lg font-semibold transition-colors mb-2 mega-menu-item w-full text-left p-2 rounded-lg ${
                          activeCategory === showingTranslateValue(category.name)
                            ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                            : 'text-gray-900 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        {showingTranslateValue(category.name)}
                      </button>
                      <div className="space-y-2">
                        {category.children?.map((subcategory) => (
                          <button
                            key={subcategory._id}
                            onClick={() => handleSubCategoryClick(category._id, subcategory._id)}
                            className="flex items-center justify-between group/item p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 mega-menu-item w-full text-left"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-700 group-hover/item:text-blue-600 transition-colors">
                                {showingTranslateValue(subcategory.name)}
                              </span>
                              {(subcategory as any).count > 100 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Popular
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 group-hover/item:text-blue-600 transition-colors">
                              {(subcategory as any).count || 0}+
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {/* Quick Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h3>
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <div className="flex-shrink-0">
                        <feature.icon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {feature.name}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feature.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{feature.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-xs text-gray-400">{feature.count}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Flash Deals */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Flash Deals</h3>
                  {flashDeals.map((deal) => (
                    <Link
                      key={deal.title}
                      href={deal.href}
                      className="block p-3 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-all duration-200 group"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                          {deal.title}
                        </h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {deal.discount}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-red-600">{deal.salePrice}</span>
                        <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>Ends in {deal.timeLeft}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 