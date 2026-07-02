"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({ 
  initialValue = "", 
  onSearch, 
  placeholder = "Search users...",
  isLoading = false,
  autoFocus = true,
  className = "",
}) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Update query when initialValue changes
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  }, [query, onSearch]);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <form 
      className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#0A0A0A] border-b border-[#1A1A1A] ${className}`} 
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2 sm:gap-3 max-w-[700px] mx-auto">
        {/* Search Wrapper */}
        <div className={`flex items-center flex-1 gap-2 sm:gap-3 bg-[#1A1A1A] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 border border-[#262626] ${
          isFocused ? 'border-[#333333] bg-[#1A1A1A]' : 'hover:border-[#333333]'
        }`}>
          {/* Search Icon */}
          <FaSearch className={`text-base sm:text-lg flex-shrink-0 transition-colors ${
            isFocused ? 'text-[#F5F5F5]' : 'text-[#666666]'
          }`} />
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white text-sm sm:text-base py-1.5 sm:py-2 min-w-0 placeholder:text-[#555555] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
            autoFocus={autoFocus}
          />
          
          {/* Clear Button */}
          {query && (
            <button 
              type="button" 
              className="flex w-6 h-6 sm:w-7 sm:h-7 items-center justify-center bg-[#262626] text-[#666666] rounded-full hover:bg-[#333333] hover:text-white transition-colors flex-shrink-0"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <FaTimes size={10} className="sm:text-xs" />
            </button>
          )}
          
          {/* Search Button */}
          <button 
            type="submit" 
            className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#262626] text-[#F5F5F5] font-medium text-xs sm:text-sm rounded-lg sm:rounded-xl hover:bg-[#333333] transition-all hover:scale-95 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 min-w-[32px] sm:min-w-[60px]"
            disabled={isLoading || !query.trim()}
            aria-label="Search"
          >
            {isLoading ? (
              <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-[#F5F5F5] border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <>
                <FaSearch size={12} className="sm:text-sm" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}