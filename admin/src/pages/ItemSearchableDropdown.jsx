import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Input } from "@windmill/react-ui";

const ItemSearchableDropdown = ({
  options,
  onChange,
  disabled,
  placeholder = "Select...",
  value = "",
  cacheTimeout = 300000,
  initialLimit = 20, // Initial records to show when no search
  maxSearchResults = 50, // Maximum search results to show
  enableLargeDatasetOptimization = true, // Enable optimization for large datasets
  debounceDelay = 300 // Debounce delay in milliseconds
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchCache, setSearchCache] = useState(new Map());
  const containerRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // Memoized options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    
    // Pre-process options for faster search
    return options.map(option => ({
      ...option,
      _searchIndex: option.label.toLowerCase().replace(/\s+/g, '')
    }));
  }, [options]);

  // Cache management
  const getCacheKey = useCallback((query) => {
    return `search_${query.toLowerCase().replace(/\s+/g, '')}`;
  }, []);

  const getCachedResults = useCallback((query) => {
    const cacheKey = getCacheKey(query);
    const cached = searchCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.results;
    }
    
    return null;
  }, [searchCache, cacheTimeout, getCacheKey]);

  const setCachedResults = useCallback((query, results) => {
    const cacheKey = getCacheKey(query);
    const newCache = new Map(searchCache);
    newCache.set(cacheKey, {
      results,
      timestamp: Date.now()
    });
    
    // Limit cache size to prevent memory issues
    if (newCache.size > 100) {
      const oldestKey = newCache.keys().next().value;
      newCache.delete(oldestKey);
    }
    
    setSearchCache(newCache);
  }, [searchCache, getCacheKey]);

  // Enhanced search function with result limiting and better debouncing
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      // Show limited initial results for large datasets
      if (enableLargeDatasetOptimization && memoizedOptions.length > initialLimit * 5) {
        setFiltered(memoizedOptions.slice(0, initialLimit));
      } else {
        setFiltered(memoizedOptions.slice(0, 50)); // Show first 50 items when no query for smaller datasets
      }
      setIsSearching(false);
      return;
    }

    const cachedResults = getCachedResults(query);
    if (cachedResults) {
      // Limit cached results to prevent huge screens
      setFiltered(cachedResults.slice(0, maxSearchResults));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Enhanced debounced search with better performance
    searchTimeoutRef.current = setTimeout(() => {
      const queryLower = query.toLowerCase().replace(/\s+/g, '');
      
      // Optimized search with early termination and result limiting
      const allResults = memoizedOptions.filter((option) => {
        // Check if the search index includes the query
        return option._searchIndex.includes(queryLower);
      });

      // Limit search results to prevent huge screens
      const limitedResults = allResults.slice(0, maxSearchResults);
      
      // Cache results (but cache the full results for future use)
      setCachedResults(query, allResults);
      setFiltered(limitedResults);
      setIsSearching(false);
    }, debounceDelay);

  }, [memoizedOptions, getCachedResults, setCachedResults, enableLargeDatasetOptimization, initialLimit, maxSearchResults, debounceDelay]);

  // Enhanced input handler with better debouncing
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Perform search immediately for better UX
    performSearch(newValue);
  }, [performSearch]);

  // Effects
  useEffect(() => {
    performSearch(inputValue);
  }, [inputValue, performSearch]);

  useEffect(() => {
    if (!value) {
      setInputValue("");
      setSelectedLabel("");
    } else {
      setInputValue(value.label || "");
      setSelectedLabel(value.label || "");
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSelect = (value, label) => {
    onChange({value, label});
    setSelectedLabel(label || "");
    setInputValue(label || "");
    setIsOpen(false);
    setIsSearching(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setSelectedLabel("");
    setFiltered([]);
    setIsSearching(false);
    onChange(null);
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      // Show cached results or limited options when opening
      if (inputValue.trim()) {
        performSearch(inputValue);
      } else {
        // Show limited results for large datasets
        if (enableLargeDatasetOptimization && memoizedOptions.length > initialLimit * 5) {
          setFiltered(memoizedOptions.slice(0, initialLimit));
        } else {
          setFiltered(memoizedOptions.slice(0, 50));
        }
      }
    }
  };

  // Enhanced image error handling with multiple fallback strategies
  const handleImageError = useCallback((e) => {
    const img = e.target;
    const originalSrc = img.getAttribute('data-original-src') || img.src;
    
    // Strategy 1: If image URL doesn't start with http/https, try adding the base URL
    if (!originalSrc.startsWith('http://') && !originalSrc.startsWith('https://')) {
      const baseUrl = window.location.origin;
      const newSrc = baseUrl + (originalSrc.startsWith('/') ? '' : '/') + originalSrc;
      img.src = newSrc;
      img.setAttribute('data-original-src', newSrc);
      return;
    }
    
    // Strategy 2: Try common image extensions if none found
    if (!originalSrc.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      for (const ext of extensions) {
        if (!originalSrc.includes(ext)) {
          const newSrc = originalSrc + ext;
          img.src = newSrc;
          img.setAttribute('data-original-src', newSrc);
          return;
        }
      }
    }
    
    // Strategy 3: Try adding 'items/' prefix if not present
    if (!originalSrc.includes('/items/') && !originalSrc.includes('items/')) {
      const newSrc = originalSrc.replace(/(\/)(?!.*\/)/, '/items/');
      if (newSrc !== originalSrc) {
        img.src = newSrc;
        img.setAttribute('data-original-src', newSrc);
        return;
      }
    }
    
    // Strategy 4: Show placeholder icon
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkwyMCAyNEwyNCAxNkgxNlYxNloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
    img.classList.add('bg-gray-100', 'flex', 'items-center', 'justify-center');
  }, []);

  // Create a default placeholder image
  const createPlaceholderImage = useCallback(() => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNiAxNkwyMCAyNEwyNCAxNkgxNlYxNloiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
  }, []);

  // Check if we're showing limited results for large datasets
  const isShowingLimitedResults = useMemo(() => {
    return enableLargeDatasetOptimization &&
           memoizedOptions.length > initialLimit * 5 &&
           !inputValue.trim() &&
           filtered.length === initialLimit;
  }, [enableLargeDatasetOptimization, memoizedOptions.length, initialLimit, inputValue, filtered.length]);

  // Check if search results are limited
  const isSearchResultsLimited = useMemo(() => {
    return inputValue.trim() && filtered.length === maxSearchResults;
  }, [inputValue, filtered.length, maxSearchResults]);

  return (
    <div
      className="relative w-full"
      ref={containerRef}
    >
      <div className="relative">
        <Input
          disabled={disabled}
          value={inputValue || ""}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="pr-16"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 bg-gray px-1">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-400 hover:text-gray-600"
            disabled={disabled}
          >
            {isSearching ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <ul
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto"
          style={{
            maxHeight: "400px",
            zIndex: 9999,
          }}
        >
          {isSearching ? (
            <li className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <svg
                className="w-4 h-4 animate-spin mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </li>
          ) : filtered.length > 0 ? (
            <>
              {filtered.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value, option.label)}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    {/* Item Image with enhanced error handling */}
                    {option.image ? (
                      <div className="flex-shrink-0">
                        <img
                          src={option.image}
                          alt={option.label}
                          className="w-10 h-10 object-cover rounded-md border border-gray-200"
                          onError={handleImageError}
                          data-original-src={option.image}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {option.label}
                      </div>
                      {/* Stock Information */}
                      {option.stock !== undefined && (
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            option.stock > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            Stock: {option.stock}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              {/* Show message when initial results are limited */}
              {isShowingLimitedResults && (
                <li className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center">
                  Showing first {initialLimit} records. Use search to find specific items.
                </li>
              )}
              
              {/* Show message when search results are limited */}
              {isSearchResultsLimited && (
                <li className="px-4 py-2 text-xs text-gray-500 bg-gray-50 text-center">
                  Showing first {maxSearchResults} search results. Refine your search for more specific results.
                </li>
              )}
            </>
          ) : (
            <li className="px-4 py-3 text-sm text-gray-400">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ItemSearchableDropdown;
