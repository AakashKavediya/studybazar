"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes, FaFilter } from "react-icons/fa";

export default function LostFilterBar({
  onSearch,
  onFilterChange,
  activeFilters = {},
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    campus: "",
    ...activeFilters,
  });
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const cleared = { status: "", category: "", campus: "" };
    setFilters(cleared);
    onFilterChange?.(cleared);
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={`relative mb-5 ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-full px-3 py-2 transition-all duration-200 focus-within:border-white focus-within:bg-[#141414] focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] gap-2.5">
          <FaSearch className="text-[#6B6B6B] shrink-0" />
          <input
            type="text"
            placeholder="Search lost items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-base text-white placeholder:text-[#6B6B6B] py-1.5"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-none border-none cursor-pointer p-1 flex items-center justify-center text-[#6B6B6B] transition-colors hover:text-white hover:bg-[#2A2A2A] rounded-full"
            >
              <FaTimes size={14} />
            </button>
          )}
          <button
            type="button"
            className={`p-2 rounded-full border-none cursor-pointer flex items-center justify-center transition-all shrink-0 relative gap-1.5 ${
              activeFilterCount > 0
                ? "bg-white text-black"
                : "bg-[#2A2A2A] text-[#A0A0A0] hover:bg-white hover:text-black"
            }`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter size={14} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Filters Dropdown */}
      {showFilters && (
        <div
          ref={filterRef}
          className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] z-50 p-4 animate-[slideDown_0.2s_ease]"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "", label: "All" },
                  { value: "lost", label: "Lost" },
                  { value: "found", label: "Found" },
                  { value: "resolved", label: "Resolved" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                      filters.status === option.value
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-[#A0A0A0] border-[#2A2A2A] hover:border-[#A0A0A0]"
                    }`}
                    onClick={() => handleFilterChange("status", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "", label: "All" },
                  { value: "electronics", label: "Electronics" },
                  { value: "books", label: "Books" },
                  { value: "clothing", label: "Clothing" },
                  { value: "id_card", label: "ID Card" },
                  { value: "bag", label: "Bag" },
                  { value: "water_bottle", label: "Water Bottle" },
                  { value: "umbrella", label: "Umbrella" },
                  { value: "keys", label: "Keys" },
                  { value: "jewelry", label: "Jewelry" },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors border ${
                      filters.category === option.value
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-[#A0A0A0] border-[#2A2A2A] hover:border-[#A0A0A0]"
                    }`}
                    onClick={() => handleFilterChange("category", option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">
                Campus
              </label>
              <input
                type="text"
                placeholder="Enter campus name"
                value={filters.campus}
                onChange={(e) => handleFilterChange("campus", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] text-white text-sm outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="flex gap-3 pt-3 border-t border-[#2A2A2A]">
              <button
                onClick={clearFilters}
                className="flex-1 py-2.5 rounded-xl border border-[#2A2A2A] bg-transparent text-[#A0A0A0] text-sm font-medium hover:border-[#EF4444] hover:text-[#EF4444] transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 py-2.5 rounded-xl border-none bg-white text-black text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {filters.status && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-xs text-[#A0A0A0]">
              {filters.status}
              <button
                onClick={() => handleFilterChange("status", "")}
                className="bg-none border-none cursor-pointer text-[#6B6B6B] p-0.5 hover:text-[#EF4444]"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-xs text-[#A0A0A0]">
              {filters.category}
              <button
                onClick={() => handleFilterChange("category", "")}
                className="bg-none border-none cursor-pointer text-[#6B6B6B] p-0.5 hover:text-[#EF4444]"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          {filters.campus && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#2A2A2A] border border-[#2A2A2A] rounded-full text-xs text-[#A0A0A0]">
              {filters.campus}
              <button
                onClick={() => handleFilterChange("campus", "")}
                className="bg-none border-none cursor-pointer text-[#6B6B6B] p-0.5 hover:text-[#EF4444]"
              >
                <FaTimes size={10} />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-white font-medium bg-none border-none cursor-pointer px-1 hover:opacity-80"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}