// app/profile/components/ProfileProducts.jsx
"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Package, Heart, MessageCircle, MoreHorizontal } from "lucide-react";

// Memoized empty state component to prevent recreation
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 mb-4 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
      <Package size={28} className="text-[#333333]" />
    </div>
    <h4 className="text-sm font-medium text-white/60">No items yet</h4>
    <p className="text-xs text-white/30 mt-1">Start sharing your study materials</p>
  </div>
);

// Memoized grid item component
const GridItem = ({ product, index, isHovered, onHover }) => {
  const handleMouseEnter = useCallback(() => onHover(product.id), [onHover, product.id]);
  const handleMouseLeave = useCallback(() => onHover(null), [onHover]);

  return (
    <div
      className="relative aspect-square bg-[#0A0A0A] group cursor-pointer overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        animation: `fadeIn 0.4s ease forwards ${(index % 9) * 0.03}s`,
        opacity: 0,
      }}
    >
      {/* Image - Using Next.js Image for optimization */}
      <Image
        src={product.image || '/placeholder-image.jpg'}
        alt={product.title || 'Product image'}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 33vw, 25vw"
        loading="lazy"
        quality={80}
      />

      {/* Instagram-style overlay on hover */}
      <div 
        className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-6 text-white">
          {/* Like */}
          <div className="flex items-center gap-1.5">
            <Heart size={20} className="fill-white" />
            <span className="text-sm font-medium">1.2k</span>
          </div>
          {/* Comment */}
          <div className="flex items-center gap-1.5">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">43</span>
          </div>
        </div>
      </div>

      {/* Minimal info - bottom left */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/70 tracking-wider uppercase">
            {product.category || 'General'}
          </span>
          <span className="w-4 h-px bg-white/20" />
          <span className="text-xs font-light text-white/90">
            {product.price || 'Free'}
          </span>
        </div>
        <button 
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="More options"
        >
          <MoreHorizontal size={16} className="text-white/60" />
        </button>
      </div>
    </div>
  );
};

function ProfileProducts({
  productsListed,
  productsSold,
  productsPurchased,
  isOwnProfile,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  // Memoize categories - only recalculate when productsListed changes
  const categories = useMemo(() => [
    { id: "all", label: "All", count: productsListed.length },
    { id: "notes", label: "Notes", count: productsListed.filter(p => p.category === 'notes').length },
    { id: "books", label: "Books", count: productsListed.filter(p => p.category === 'books').length },
    { id: "lab", label: "Lab", count: productsListed.filter(p => p.category === 'lab').length },
  ], [productsListed]);

  // Memoize tabs - only recalculate when dependencies change
  const tabs = useMemo(() => {
    const baseTabs = [...categories];
    if (isOwnProfile) {
      baseTabs.push(
        { id: "sold", label: "Sold", count: productsSold.length },
        { id: "purchased", label: "Purchased", count: productsPurchased.length }
      );
    }
    return baseTabs;
  }, [categories, isOwnProfile, productsSold.length, productsPurchased.length]);

  // Memoize products map - only recalculate when products change
  const productsMap = useMemo(() => ({
    all: productsListed,
    notes: productsListed.filter(p => p.category === 'notes'),
    books: productsListed.filter(p => p.category === 'books'),
    lab: productsListed.filter(p => p.category === 'lab'),
    sold: productsSold,
    purchased: productsPurchased,
  }), [productsListed, productsSold, productsPurchased]);

  // Memoize active products
  const activeProducts = useMemo(() => 
    productsMap[activeTab] || [],
    [productsMap, activeTab]
  );

  // Memoize active product count
  const productCount = useMemo(() => activeProducts.length, [activeProducts]);

  // Handle hover with useCallback
  const handleHover = useCallback((id) => {
    setHoveredId(id);
  }, []);

  // Handle tab change with useCallback
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Memoize grid items
  const gridItems = useMemo(() => {
    return activeProducts.map((product, index) => (
      <GridItem
        key={product.id}
        product={product}
        index={index}
        isHovered={hoveredId === product.id}
        onHover={handleHover}
      />
    ));
  }, [activeProducts, hoveredId, handleHover]);

  // Memoize empty state check
  const isEmpty = useMemo(() => productCount === 0, [productCount]);

  return (
    <div className="bg-[#0A0A0A]">
      {/* Header - Instagram style */}
      <div className="px-4 py-3 border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isOwnProfile ? 'Your Items' : 'Items'}
            </h2>
            <p className="text-xs text-white/30 font-light">
              {productCount} {productCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          {isOwnProfile && (
            <button 
              className="text-xs font-medium text-white/50 hover:text-white transition-colors"
              aria-label="Manage items"
            >
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Instagram story-style */}
      <div className="px-4 py-2.5 border-b border-[#1A1A1A] overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`px-3.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  active 
                    ? 'bg-white text-black' 
                    : 'text-white/40 hover:text-white/70'
                }`}
                onClick={() => handleTabChange(tab.id)}
                aria-label={`Filter by ${tab.label}`}
                aria-current={active ? 'page' : undefined}
              >
                {tab.label}
                <span className={`ml-1 text-[10px] ${active ? 'text-black/40' : 'text-white/20'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid - 3 column Instagram layout */}
      <div className="p-0.5">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-3 gap-0.5 auto-rows-auto">
            {gridItems}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Hover effect for mobile */
        @media (hover: none) {
          .group:hover .absolute {
            opacity: 0 !important;
          }
          .group:active .absolute {
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfileProducts;