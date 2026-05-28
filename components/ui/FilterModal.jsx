// components/ui/FilterModal.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { COLORS } from "@/constants/colors";

// Icons
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }) {
  const [selectedCategories, setSelectedCategories] = useState(initialFilters?.categories || []);
  const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || { min: "", max: "" });
  const [condition, setCondition] = useState(initialFilters?.condition || "");
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || "newest");
  const [expandedSection, setExpandedSection] = useState(null);
  const modalRef = useRef(null);

  const categories = [
    { id: "books", name: "Books", icon: "📚", count: 234 },
    { id: "electronics", name: "Electronics", icon: "💻", count: 156 },
    { id: "furniture", name: "Furniture", icon: "🪑", count: 89 },
    { id: "clothing", name: "Clothing", icon: "👕", count: 145 },
    { id: "stationery", name: "Stationery", icon: "✏️", count: 67 },
    { id: "sports", name: "Sports", icon: "⚽", count: 43 },
    { id: "other", name: "Other", icon: "📦", count: 78 },
  ];

  const conditions = [
    { id: "new", name: "New", icon: "✨" },
    { id: "like-new", name: "Like New", icon: "🌟" },
    { id: "good", name: "Good", icon: "👍" },
    { id: "fair", name: "Fair", icon: "👌" },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest First", icon: "🕒" },
    { id: "price-low", name: "Price: Low to High", icon: "💰" },
    { id: "price-high", name: "Price: High to Low", icon: "💎" },
    { id: "popular", name: "Most Popular", icon: "🔥" },
  ];

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setCondition("");
    setSortBy("newest");
  };

  const applyFilters = () => {
    onApply({
      categories: selectedCategories,
      priceRange,
      condition,
      sortBy,
    });
    onClose();
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="filter-overlay" onClick={onClose}>
        <div className="filter-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="filter-header">
            <h2>Filters</h2>
            <button className="close-button" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div className="filter-content">
            {/* Categories Section */}
            <div className="filter-section">
              <div 
                className="section-header"
                onClick={() => toggleSection("categories")}
              >
                <span>Categories</span>
                <ChevronDownIcon />
              </div>
              {expandedSection === "categories" && (
                <div className="section-content categories-grid">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`category-chip ${selectedCategories.includes(category.id) ? "active" : ""}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                      <span className="category-count">{category.count}</span>
                      {selectedCategories.includes(category.id) && (
                        <span className="check-icon"><CheckIcon /></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Section */}
            <div className="filter-section">
              <div 
                className="section-header"
                onClick={() => toggleSection("price")}
              >
                <span>Price Range</span>
                <ChevronDownIcon />
              </div>
              {expandedSection === "price" && (
                <div className="section-content price-range">
                  <div className="price-inputs">
                    <div className="price-input-wrapper">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="price-input"
                      />
                    </div>
                    <span className="price-separator">—</span>
                    <div className="price-input-wrapper">
                      <span className="currency">$</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="price-input"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Condition Section */}
            <div className="filter-section">
              <div 
                className="section-header"
                onClick={() => toggleSection("condition")}
              >
                <span>Condition</span>
                <ChevronDownIcon />
              </div>
              {expandedSection === "condition" && (
                <div className="section-content condition-options">
                  {conditions.map((cond) => (
                    <button
                      key={cond.id}
                      className={`condition-option ${condition === cond.id ? "active" : ""}`}
                      onClick={() => setCondition(cond.id)}
                    >
                      <span className="condition-icon">{cond.icon}</span>
                      <span className="condition-name">{cond.name}</span>
                      {condition === cond.id && <CheckIcon />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort By Section */}
            <div className="filter-section">
              <div 
                className="section-header"
                onClick={() => toggleSection("sort")}
              >
                <span>Sort By</span>
                <ChevronDownIcon />
              </div>
              {expandedSection === "sort" && (
                <div className="section-content sort-options">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className={`sort-option ${sortBy === option.id ? "active" : ""}`}
                      onClick={() => setSortBy(option.id)}
                    >
                      <span className="sort-icon">{option.icon}</span>
                      <span className="sort-name">{option.name}</span>
                      {sortBy === option.id && <CheckIcon />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="filter-footer">
            <button className="reset-button" onClick={resetFilters}>
              <ResetIcon />
              Reset All
            </button>
            <div className="footer-buttons">
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button className="apply-button" onClick={applyFilters}>
                Apply Filters
                {(selectedCategories.length > 0 || priceRange.min || priceRange.max || condition) && (
                  <span className="active-count">
                    {selectedCategories.length + (condition ? 1 : 0) + (priceRange.min || priceRange.max ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global >{`
        .filter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }
        
        .filter-modal {
          background: ${COLORS.card};
          border-radius: 28px 28px 0 0;
          width: 100%;
          max-width: 500px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow: hidden;
        }
        
        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 12px;
          border-bottom: 0.5px solid ${COLORS.border};
        }
        
        .filter-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: ${COLORS.textPrimary};
          margin: 0;
        }
        
        .close-button {
          background: ${COLORS.secondaryBg};
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: ${COLORS.textSecondary};
          transition: all 0.2s;
        }
        
        .close-button:hover {
          background: ${COLORS.primary};
          color: white;
        }
        
        .filter-content {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }
        
        .filter-section {
          border-bottom: 0.5px solid ${COLORS.border};
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          transition: background 0.2s;
        }
        
        .section-header:hover {
          background: ${COLORS.secondaryBg};
        }
        
        .section-content {
          padding: 12px 20px 20px;
          animation: slideDown 0.2s ease;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        
        .category-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: ${COLORS.inputBg};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: ${COLORS.textSecondary};
          position: relative;
        }
        
        .category-chip.active {
          border-color: ${COLORS.primary};
          background: rgba(245, 158, 11, 0.1);
          color: ${COLORS.primary};
        }
        
        .category-icon {
          font-size: 20px;
        }
        
        .category-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }
        
        .category-count {
          font-size: 12px;
          color: ${COLORS.textMuted};
        }
        
        .check-icon {
          margin-left: 4px;
        }
        
        .price-range {
          padding: 16px 0;
        }
        
        .price-inputs {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .price-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .currency {
          position: absolute;
          left: 12px;
          color: ${COLORS.textMuted};
          font-size: 16px;
        }
        
        .price-input {
          width: 100%;
          padding: 12px 12px 12px 28px;
          background: ${COLORS.inputBg};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          color: ${COLORS.textPrimary};
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
        }
        
        .price-input:focus {
          border-color: ${COLORS.primary};
        }
        
        .price-separator {
          color: ${COLORS.textMuted};
        }
        
        .condition-options, .sort-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .condition-option, .sort-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: ${COLORS.inputBg};
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: ${COLORS.textSecondary};
        }
        
        .condition-option.active, .sort-option.active {
          border-color: ${COLORS.primary};
          background: rgba(245, 158, 11, 0.1);
          color: ${COLORS.primary};
        }
        
        .condition-icon, .sort-icon {
          font-size: 18px;
        }
        
        .condition-name, .sort-name {
          flex: 1;
          font-size: 14px;
          font-weight: 500;
        }
        
        .filter-footer {
          padding: 16px 20px 20px;
          border-top: 0.5px solid ${COLORS.border};
          background: ${COLORS.card};
        }
        
        .reset-button {
          width: 100%;
          padding: 10px;
          background: none;
          border: 1px solid ${COLORS.border};
          border-radius: 12px;
          color: ${COLORS.textSecondary};
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: all 0.2s;
        }
        
        .reset-button:hover {
          border-color: ${COLORS.error};
          color: ${COLORS.error};
        }
        
        .footer-buttons {
          display: flex;
          gap: 12px;
        }
        
        .cancel-button, .apply-button {
          flex: 1;
          padding: 14px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cancel-button {
          background: ${COLORS.secondaryBg};
          border: none;
          color: ${COLORS.textSecondary};
        }
        
        .cancel-button:hover {
          background: ${COLORS.border};
        }
        
        .apply-button {
          background: ${COLORS.primary};
          border: none;
          color: ${COLORS.background};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .apply-button:hover {
          opacity: 0.9;
          transform: scale(0.98);
        }
        
        .active-count {
          background: rgba(0, 0, 0, 0.2);
          padding: 2px 8px;
          border-radius: 20px;
          font-size: 12px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Mobile */
        @media (max-width: 768px) {
          .filter-modal {
            max-height: 90vh;
          }
          
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
        
        /* iPhone Notch */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .filter-footer {
            padding-bottom: calc(20px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}