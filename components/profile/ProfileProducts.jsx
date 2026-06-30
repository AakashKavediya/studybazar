// app/profile/components/ProfileProducts.jsx
"use client";

import { useState } from "react";
import { Package, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

export default function ProfileProducts({
  productsListed,
  productsSold,
  productsPurchased,
  isOwnProfile,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  // Categories for filter
  const categories = [
    { id: "all", label: "All", count: productsListed.length },
    { id: "notes", label: "Notes", count: productsListed.filter(p => p.category === 'notes').length },
    { id: "books", label: "Books", count: productsListed.filter(p => p.category === 'books').length },
    { id: "lab", label: "Lab", count: productsListed.filter(p => p.category === 'lab').length },
  ];

  const tabs = isOwnProfile
    ? [
        ...categories,
        { id: "sold", label: "Sold", count: productsSold.length },
        { id: "purchased", label: "Purchased", count: productsPurchased.length },
      ]
    : categories;

  const productsMap = {
    all: productsListed,
    notes: productsListed.filter(p => p.category === 'notes'),
    books: productsListed.filter(p => p.category === 'books'),
    lab: productsListed.filter(p => p.category === 'lab'),
    sold: productsSold,
    purchased: productsPurchased,
  };

  const activeProducts = productsMap[activeTab] || [];

  // Instagram-style grid - 3 columns, all squares
  const renderGridItem = (product, index) => {
    const isHovered = hoveredId === product.id;

    return (
      <div
        key={product.id}
        className="relative aspect-square bg-[#0A0A0A] group cursor-pointer overflow-hidden"
        onMouseEnter={() => setHoveredId(product.id)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          animation: `fadeIn 0.4s ease forwards ${(index % 9) * 0.03}s`,
          opacity: 0,
        }}
      >
        {/* Image */}
        <img
          src={product.image || '/placeholder-image.jpg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              {product.category}
            </span>
            <span className="w-4 h-px bg-white/20" />
            <span className="text-xs font-light text-white/90">
              {product.price}
            </span>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal size={16} className="text-white/60" />
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 mb-4 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
        <Package size={28} className="text-[#333333]" />
      </div>
      <h4 className="text-sm font-medium text-white/60">No items yet</h4>
      <p className="text-xs text-white/30 mt-1">Start sharing your study materials</p>
    </div>
  );

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
              {activeProducts.length} {activeProducts.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          {isOwnProfile && (
            <button className="text-xs font-medium text-white/50 hover:text-white transition-colors">
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
                onClick={() => setActiveTab(tab.id)}
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
        {activeProducts.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-3 gap-0.5 auto-rows-auto">
            {activeProducts.map((product, index) => renderGridItem(product, index))}
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