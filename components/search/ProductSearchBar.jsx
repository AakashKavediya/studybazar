"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FaSearch,
  FaTimes,
  FaFilter,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp,
  FaTag,
  FaRupeeSign,
} from "react-icons/fa";

// Search Bar Component with Filters
export default function ProductSearchBar({
  initialQuery = "",
  onSearch,
  onFilter,
  isLoading = false,
  placeholder = "Search for study materials...",
  categories = [],
  className = "",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const inputRef = useRef(null);
  const filterRef = useRef(null);

  // Update active filters count
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.sortBy !== "newest") count++;
    setActiveFiltersCount(count);
  }, [filters]);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({
        query: query.trim(),
        ...filters,
      });
    }
  };

  // Handle clear search
  const handleClear = () => {
    setQuery("");
    onSearch({ query: "", ...filters });
    inputRef.current?.focus();
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Auto-apply filters when category or sort changes
    if (key === "category" || key === "sortBy") {
      onSearch({
        query: query.trim(),
        ...newFilters,
      });
    }
  };

  // Apply price filters
  const applyPriceFilter = () => {
    onSearch({
      query: query.trim(),
      ...filters,
    });
    setShowFilters(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
    onSearch({
      query: query.trim(),
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  };

  // Get category label
  const getCategoryLabel = (value) => {
    const labels = {
      notes: "Notes",
      books: "Books",
      lab: "Lab Reports",
      assignments: "Assignments",
      ppt: "Presentations",
      question_bank: "Question Bank",
      handwritten_notes: "Handwritten Notes",
      cheat_sheet: "Cheat Sheet",
      other: "Other",
    };
    return labels[value] || value;
  };

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "popular", label: "Most Popular" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="relative">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`flex items-center gap-3 bg-[#1A1A1A] rounded-2xl px-4 py-2.5 border transition-all duration-300 ${
              isFocused
                ? "border-[#F5A623] shadow-lg shadow-[#F5A623]/5"
                : "border-[#262626] hover:border-[#333333]"
            }`}
          >
            {/* Search Icon */}
            <FaSearch
              className={`text-lg flex-shrink-0 transition-colors ${
                isFocused ? "text-[#F5A623]" : "text-[#666666]"
              }`}
            />

            {/* Input */}
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent border-none outline-none text-white text-sm py-1 placeholder:text-[#666666] disabled:opacity-50"
              disabled={isLoading}
            />

            {/* Active Filters Indicator */}
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-[#F5A623] text-[#0A0A0A] text-[10px] font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-full hover:bg-[#262626] transition-colors"
                aria-label="Clear search"
              >
                <FaTimes size={14} className="text-[#666666] hover:text-white" />
              </button>
            )}

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#F5A623] text-[#0A0A0A]"
                  : "bg-[#262626] text-[#666666] hover:text-white"
              }`}
              aria-label="Toggle filters"
            >
              <FaFilter size={14} />
              <span className="text-xs font-medium hidden sm:inline">
                Filters
              </span>
            </button>

            {/* Search Button */}
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className={`px-4 py-1.5 rounded-xl font-medium text-sm transition-all ${
                query.trim() && !isLoading
                  ? "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 shadow-lg shadow-[#F5A623]/20"
                  : "bg-[#262626] text-[#666666] cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
        </form>

        {/* Filters Dropdown */}
        {showFilters && (
          <div
            ref={filterRef}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-[#262626] rounded-2xl shadow-2xl shadow-black/50 p-4 z-50 max-h-[80vh] overflow-y-auto animate-slideDown"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FaSlidersH size={14} className="text-[#F5A623]" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#F5A623] hover:text-white transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-2">
                  <FaTag size={12} />
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleFilterChange("category", "")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      !filters.category
                        ? "bg-[#F5A623] text-[#0A0A0A]"
                        : "bg-[#262626] text-[#666666] hover:text-white"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleFilterChange("category", cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filters.category === cat
                          ? "bg-[#F5A623] text-[#0A0A0A]"
                          : "bg-[#262626] text-[#666666] hover:text-white"
                      }`}
                    >
                      {getCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider flex items-center gap-2">
                  <FaRupeeSign size={12} />
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 bg-[#262626] border border-[#333333] rounded-lg text-white text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors"
                      min="0"
                    />
                  </div>
                  <span className="text-[#666666]">—</span>
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full pl-7 pr-3 py-2 bg-[#262626] border border-[#333333] rounded-lg text-white text-sm placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="px-4 py-2 bg-[#F5A623] text-[#0A0A0A] font-medium rounded-lg hover:opacity-90 transition-all whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                  Sort By
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange("sortBy", option.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        filters.sortBy === option.value
                          ? "bg-[#F5A623] text-[#0A0A0A]"
                          : "bg-[#262626] text-[#666666] hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
                <span className="text-xs text-[#666666]">
                  {activeFiltersCount} active filter{activeFiltersCount !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-[#262626] text-white font-medium rounded-lg hover:bg-[#333333] transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {filters.category && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs text-[#A3A3A3]">
              {getCategoryLabel(filters.category)}
              <button
                onClick={() => handleFilterChange("category", "")}
                className="hover:text-white transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs text-[#A3A3A3]">
              ₹{filters.minPrice || "0"} — ₹{filters.maxPrice || "∞"}
              <button
                onClick={() => {
                  setFilters({ ...filters, minPrice: "", maxPrice: "" });
                  onSearch({ query: query.trim(), ...filters, minPrice: "", maxPrice: "" });
                }}
                className="hover:text-white transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {filters.sortBy !== "newest" && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs text-[#A3A3A3]">
              {sortOptions.find((s) => s.value === filters.sortBy)?.label}
              <button
                onClick={() => handleFilterChange("sortBy", "newest")}
                className="hover:text-white transition-colors"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-[#666666] hover:text-[#F5A623] transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease;
        }
      `}</style>
    </div>
  );
}