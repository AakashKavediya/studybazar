// app/profile/components/ProfileProducts.jsx
"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Package,
  Heart,
  MoreHorizontal,
  Trash2,
  Loader2,
  PackageX,
} from "lucide-react";

/* ---------- Empty state ---------- */
const EmptyState = ({ label = "No items yet" }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 mb-4 rounded-full border-2 border-[#1A1A1A] flex items-center justify-center">
      <Package size={28} className="text-[#333333]" />
    </div>
    <h4 className="text-sm font-medium text-white/60">{label}</h4>
    <p className="text-xs text-white/30 mt-1">
      Start sharing your study materials
    </p>
  </div>
);

/* ---------- Grid item ---------- */
const GridItem = ({
  product,
  index,
  isHovered,
  onHover,
  onDelete,
  isDeleting,
  isOwnProfile,
  variant = "product", // "product" | "lostfound"
}) => {
  const handleMouseEnter = useCallback(
    () => onHover(product._id || product.id),
    [onHover, product._id, product.id]
  );
  const handleMouseLeave = useCallback(() => onHover(null), [onHover]);

  const imageSrc =
    product.thumbnail ||
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    "/placeholder-image.jpg";

  const priceLabel =
    variant === "lostfound"
      ? product.type === "lost"
        ? "LOST"
        : "ISSUE"
      : product.price
      ? `₹${product.price}`
      : "Free";

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      onDelete?.(product._id || product.id);
    },
    [onDelete, product._id, product.id]
  );

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
      <Image
        src={imageSrc}
        alt={product.title || "Product image"}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 33vw, 25vw"
        loading="lazy"
        quality={80}
      />

      {/* Hover overlay */}
      <div
        className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <div className="flex items-center gap-6 text-white">
          <div className="flex items-center gap-1.5">
            <Heart size={20} className="fill-white" />
            <span className="text-sm font-medium">
              {product.likes_count || 0}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MoreHorizontal size={20} />
            <span className="text-sm font-medium">
              {product.views_count || 0}
            </span>
          </div>
        </div>

        {/* Delete button — own profile only */}
        {isOwnProfile && onDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-[#FF3B30] flex items-center justify-center text-white transition-all disabled:opacity-50"
            aria-label="Delete"
          >
            {isDeleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-white/70 tracking-wider uppercase">
            {product.category || (variant === "lostfound" ? "Lost&Found" : "General")}
          </span>
          <span className="w-4 h-px bg-white/20" />
          <span className="text-xs font-light text-white/90">{priceLabel}</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- Main component ---------- */
function ProfileProducts({
  productsListed = [],
  lostFoundItems = [],
  isLoadingProducts = false,
  isLoadingLostFound = false,
  isOwnProfile,
  onDeleteProduct,
  deletingProductId,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [hoveredId, setHoveredId] = useState(null);

  // Product tabs
  const categories = useMemo(
    () => [
      { id: "all", label: "All", count: productsListed.length },
      {
        id: "notes",
        label: "Notes",
        count: productsListed.filter((p) => p.category === "notes").length,
      },
      {
        id: "books",
        label: "Books",
        count: productsListed.filter((p) => p.category === "books").length,
      },
      {
        id: "lab",
        label: "Lab",
        count: productsListed.filter((p) => p.category === "lab").length,
      },
    ],
    [productsListed]
  );

  const tabs = useMemo(() => {
    const base = [...categories];
    if (isOwnProfile) {
      base.push({
        id: "lostfound",
        label: "Lost & Found",
        count: lostFoundItems.length,
      });
    }
    return base;
  }, [categories, isOwnProfile, lostFoundItems.length]);

  const productsMap = useMemo(
    () => ({
      all: productsListed,
      notes: productsListed.filter((p) => p.category === "notes"),
      books: productsListed.filter((p) => p.category === "books"),
      lab: productsListed.filter((p) => p.category === "lab"),
      lostfound: lostFoundItems,
    }),
    [productsListed, lostFoundItems]
  );

  const activeItems = useMemo(
    () => productsMap[activeTab] || [],
    [productsMap, activeTab]
  );

  const productCount = activeItems.length;
  const isLostFound = activeTab === "lostfound";

  const isLoading =
    (activeTab === "lostfound" && isLoadingLostFound) ||
    (activeTab !== "lostfound" && isLoadingProducts);

  const handleHover = useCallback((id) => setHoveredId(id), []);
  const handleTabChange = useCallback((tabId) => setActiveTab(tabId), []);

  const gridItems = useMemo(() => {
    return activeItems.map((product, index) => {
      const id = product._id || product.id;
      return (
        <GridItem
          key={id || index}
          product={product}
          index={index}
          isHovered={hoveredId === id}
          onHover={handleHover}
          onDelete={
            isOwnProfile && !isLostFound ? onDeleteProduct : undefined
          }
          isDeleting={deletingProductId === id}
          isOwnProfile={isOwnProfile}
          variant={isLostFound ? "lostfound" : "product"}
        />
      );
    });
  }, [
    activeItems,
    hoveredId,
    handleHover,
    isOwnProfile,
    isLostFound,
    onDeleteProduct,
    deletingProductId,
  ]);

  return (
    <div className="bg-[#0A0A0A] mb-4 border border-[#1A1A1A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              {isOwnProfile ? "Your Items" : "Items"}
            </h2>
            <p className="text-xs text-white/30 font-light">
              {productCount} {productCount === 1 ? "item" : "items"}
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

      {/* Tabs */}
      <div className="px-4 py-2.5 border-b border-[#1A1A1A] overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`px-3.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? "bg-white text-black"
                    : "text-white/40 hover:text-white/70"
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
                <span
                  className={`ml-1 text-[10px] ${
                    active ? "text-black/40" : "text-white/20"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="p-0.5">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#111] animate-pulse"
              />
            ))}
          </div>
        ) : productCount === 0 ? (
          <EmptyState
            label={
              isLostFound ? "No lost & found posts yet" : "No items yet"
            }
          />
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
      `}</style>
    </div>
  );
}

export default ProfileProducts;