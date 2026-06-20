
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Input } from "@windmill/react-ui";

const SearchableDropdown = ({
  options = [],
  onChange,
  disabled,
  placeholder = "Select...",
  value = "",
  onSearch,
  onLoadMore,
  hasMore = false,
  loading = false,
  loadingMore = false,
  debounceDelay = 500
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const debounceTimer = useRef(null);
  const onSearchRef = useRef(onSearch);

  // Keep onSearch reference fresh without triggering effects
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Pre-process options for faster local matching and deduplicate by value
  const processedOptions = useMemo(() => {
    const uniqueMap = new Map();
    options.forEach(opt => {
      if (opt.value && !uniqueMap.has(opt.value)) {
        uniqueMap.set(opt.value, {
          ...opt,
          _searchIndex: `${opt.label || ""} ${opt.code || ""} ${opt.print_name || ""}`.toLowerCase()
        });
      }
    });
    return Array.from(uniqueMap.values());
  }, [options]);

  // Improved Fuzzy logic for local filtering
  const fuzzyMatch = (query, item) => {
    if (!query || !item) return { matches: false, score: 0 };
    const q = query.toLowerCase().trim();
    const t = item._searchIndex || "";
    const label = (item.label || "").toLowerCase();

    if (label === q) return { matches: true, score: 999999 };
    if (label.startsWith(q)) return { matches: true, score: 100000 - label.length };
    if (t === q) return { matches: true, score: 80000 };

    const wordStartRegex = new RegExp(`(^|\\s)${q}`, 'i');
    if (wordStartRegex.test(t)) return { matches: true, score: 50000 - t.indexOf(q) };
    if (t.includes(q)) return { matches: true, score: 10000 - t.indexOf(q) };

    let queryIndex = 0;
    let textIndex = 0;
    let score = 0;
    let lastMatchIndex = -1;

    while (queryIndex < q.length && textIndex < t.length) {
      if (q[queryIndex] === t[textIndex]) {
        if (lastMatchIndex !== -1 && textIndex === lastMatchIndex + 1) {
          score += 50;
        } else {
          score += 10;
        }
        lastMatchIndex = textIndex;
        queryIndex++;
      }
      textIndex++;
    }

    return queryIndex === q.length ? { matches: true, score: score + (100 / (t.length + 1)) } : { matches: false, score: 0 };
  };

  // Handle Input Changes & Local Filtering
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setIsOpen(true);

    if (!onSearchRef.current) {
      if (!val.trim()) {
        setFiltered(processedOptions);
      } else {
        const results = processedOptions
          .map(opt => {
            const { matches, score } = fuzzyMatch(val, opt);
            return { ...opt, _score: score, _matches: matches };
          })
          .filter(opt => opt._matches)
          .sort((a, b) => b._score - a._score);
        setFiltered(results);
      }
    } else {
      const results = processedOptions
        .map(opt => {
          const { matches, score } = fuzzyMatch(val, opt);
          return { ...opt, _score: score, _matches: matches };
        })
        .filter(opt => opt._matches)
        .sort((a, b) => b._score - a._score);
      setFiltered(results);
    }
  };

  // Scroll listener for infinite scroll
  const handleScroll = (e) => {
    if (!listRef.current || !onLoadMore || !hasMore || loadingMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // If we're within 50px of the bottom, load more
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      onLoadMore(inputValue);
    }
  };

  // Debounced Async Search
  useEffect(() => {
    if (onSearchRef.current) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        onSearchRef.current(inputValue);
      }, debounceDelay);
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [inputValue, debounceDelay]);

  // Sync filtered options
  useEffect(() => {
    if (!inputValue.trim()) {
      setFiltered(processedOptions);
    } else {
      const results = processedOptions
        .map(opt => {
          const { matches, score } = fuzzyMatch(inputValue, opt);
          return { ...opt, _score: score, _matches: matches };
        })
        .filter(opt => opt._matches)
        .sort((a, b) => b._score - a._score);
      setFiltered(results);
    }
  }, [processedOptions, inputValue]);

  // Sync internal state with value prop
  useEffect(() => {
    if (!value) {
      setInputValue("");
      setSelectedLabel("");
    } else {
      setInputValue(value.label || "");
      setSelectedLabel(value.label || "");
    }
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setSelectedLabel(option.label || "");
    setInputValue(option.label || "");
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue("");
    setSelectedLabel("");
    onChange(null);
    if (onSearchRef.current) onSearchRef.current("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Input
          disabled={disabled}
          value={inputValue || ""}
          onChange={handleInputChange}
          onClick={() => !disabled && setIsOpen(true)}
          placeholder={placeholder}
          className="pr-16"
        />
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 bg-white px-1">
          {loading && (
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          {inputValue && (
            <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-600">
            <svg className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <ul
          ref={listRef}
          onScroll={handleScroll}
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-y-auto"
          style={{ maxHeight: "400px", zIndex: 9999 }}
        >
          {filtered.length > 0 ? (
            <>
              {filtered.map((opt, index) => (
                <li key={`${opt.value}-${index}`} onClick={() => handleSelect(opt)} className="px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0">
                  {opt.label || ""}
                </li>
              ))}
              {loadingMore && (
                <li className="px-4 py-3 text-sm text-gray-500 flex justify-center items-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading more...
                </li>
              )}
            </>
          ) : (
            <li className="px-4 py-3 text-sm text-gray-400 italic">{loading ? "Searching..." : "No results found"}</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
