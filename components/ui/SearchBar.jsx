// components/ui/SearchBar.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS } from "@/constants/colors";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="10" y1="18" x2="14" y2="18" />
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="14" cy="12" r="2" />
    <circle cx="8" cy="18" r="2" />
    <circle cx="16" cy="18" r="2" />
  </svg>
);

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const RecentSearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const saveSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Handle search submit
  const handleSearch = (query) => {
    if (!query.trim()) return;
    saveSearch(query);
    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  // Remove recent search
  const removeRecentSearch = (query) => {
    const updated = recentSearches.filter(s => s !== query);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="search-section">
      <div className="search-container">
        <div className={`search-wrapper ${isFocused ? "focused" : ""}`}>
          <div className="search-icon">
            <SearchIcon />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          
          {searchQuery && (
            <button className="clear-button" onClick={clearSearch}>
              <ClearIcon />
            </button>
          )}
          
          <button className="filter-button">
            <FilterIcon />
          </button>
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && (searchQuery || recentSearches.length > 0) && (
          <div className="suggestions-dropdown" ref={suggestionsRef}>
            {searchQuery && (
              <div className="suggestion-item" onClick={() => handleSearch(searchQuery)}>
                <SearchIcon />
                <span>Search for "{searchQuery}"</span>
              </div>
            )}
            
            {recentSearches.length > 0 && !searchQuery && (
              <>
                <div className="suggestions-header">
                  <span>Recent Searches</span>
                  <button 
                    className="clear-all"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem("recentSearches");
                    }}
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((query, index) => (
                  <div key={index} className="suggestion-item recent">
                    <RecentSearchIcon />
                    <span onClick={() => handleSearch(query)}>{query}</span>
                    <button 
                      className="remove-item"
                      onClick={() => removeRecentSearch(query)}
                    >
                      <ClearIcon />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        .search-section {
          padding: 20px 20px 12px;
          background: ${COLORS.background};
        }
        
        .search-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .search-wrapper {
          display: flex;
          align-items: center;
          background: ${COLORS.inputBg};
          border: 1.5px solid ${COLORS.border};
          border-radius: 30px;
          padding: 8px 12px;
          transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          gap: 10px;
        }
        
        .search-wrapper.focused {
          border-color: ${COLORS.primary};
          background: ${COLORS.card};
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        
        .search-icon {
          display: flex;
          align-items: center;
          color: ${COLORS.textMuted};
          flex-shrink: 0;
        }
        
        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 16px;
          color: ${COLORS.textPrimary};
          font-family: -apple-system, 'SF Pro Text', system-ui;
          padding: 6px 0;
        }
        
        .search-input::placeholder {
          color: ${COLORS.textMuted};
        }
        
        .clear-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${COLORS.textMuted};
          transition: all 0.2s ease;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        .clear-button:hover {
          color: ${COLORS.textPrimary};
          background: ${COLORS.secondaryBg};
        }
        
        .filter-button {
          background: ${COLORS.secondaryBg};
          border: none;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${COLORS.textSecondary};
          transition: all 0.2s ease;
          border-radius: 25px;
          flex-shrink: 0;
        }
        
        .filter-button:hover {
          background: ${COLORS.primary};
          color: white;
        }
        
        /* Suggestions Dropdown */
        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: ${COLORS.card};
          border-radius: 20px;
          border: 1px solid ${COLORS.border};
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          background: rgba(20, 20, 20, 0.95);
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease;
        }
        
        .suggestions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 0.5px solid ${COLORS.border};
          color: ${COLORS.textSecondary};
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .clear-all {
          background: none;
          border: none;
          color: ${COLORS.primary};
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .clear-all:hover {
          background: rgba(245, 158, 11, 0.1);
        }
        
        .suggestion-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: ${COLORS.textSecondary};
        }
        
        .suggestion-item:hover {
          background: ${COLORS.secondaryBg};
          color: ${COLORS.textPrimary};
        }
        
        .suggestion-item.recent {
          justify-content: space-between;
        }
        
        .suggestion-item span {
          flex: 1;
          font-size: 14px;
        }
        
        .remove-item {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${COLORS.textMuted};
          border-radius: 50%;
          transition: all 0.2s;
        }
        
        .remove-item:hover {
          color: ${COLORS.error};
          background: rgba(239, 68, 68, 0.1);
        }
        
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
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-section {
            padding: 16px 16px 8px;
          }
          
          .search-wrapper {
            padding: 6px 12px;
          }
          
          .search-input {
            font-size: 15px;
          }
          
          .filter-button {
            padding: 6px;
          }
          
          .suggestions-dropdown {
            position: fixed;
            top: auto;
            left: 16px;
            right: 16px;
            max-height: 80vh;
            overflow-y: auto;
          }
        }
        
        /* Tablet */
        @media (min-width: 768px) and (max-width: 1024px) {
          .search-section {
            padding: 20px 24px 12px;
          }
        }
      `}</style>
    </div>
  );
}