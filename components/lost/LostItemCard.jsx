"use client";

import { useState } from "react";
import { FaClock, FaMapMarkerAlt, FaUser, FaEllipsisH } from "react-icons/fa";
import { COLORS } from "@/constants/colors";
import { ChatButton } from "@/components/chat";

export default function LostItemCard({ item, onPress, onOptions }) {
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    description,
    category,
    location,
    campus,
    images = [],
    status,
    is_resolved,
    user_name,
    created_at,
    views_count,
  } = item;

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    const now = new Date();
    const posted = new Date(date);
    const diff = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return posted.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "lost": return "bg-[#EF4444]";
      case "found": return "bg-[#34C759]";
      case "resolved": return "bg-[#22C55E]";
      case "closed": return "bg-[#6B6B6B]";
      default: return "bg-[#6B6B6B]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "lost": return "Lost";
      case "found": return "Found";
      case "resolved": return "Resolved";
      case "closed": return "Closed";
      default: return status || "Unknown";
    }
  };

  // Category icon mapping
  const getCategoryIcon = (cat) => {
    const icons = {
      electronics: "💻",
      books: "📚",
      clothing: "👕",
      id_card: "🪪",
      bag: "🎒",
      water_bottle: "🧴",
      umbrella: "🌂",
      keys: "🔑",
      jewelry: "💍",
      other: "📦",
    };
    return icons[cat] || "📦";
  };

  const mainImage = images && images.length > 0 ? images[0] : null;

  return (
    <div
      className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)] hover:border-white active:scale-[0.98] cursor-pointer mb-4"
      onClick={() => onPress?.(item)}
    >
      {/* Image Section */}
      <div className="relative pt-[75%] overflow-hidden bg-[#1A1A1A]">
        {!imageError && mainImage ? (
          <img
            src={mainImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1E1E1E] text-[#6B6B6B]">
            <span className="text-5xl">{getCategoryIcon(category)}</span>
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-semibold text-white uppercase tracking-[0.5px] backdrop-blur-sm z-10 ${getStatusColor(status)}`}>
          {is_resolved ? "✅ Resolved" : getStatusLabel(status)}
        </div>

        {/* Options Button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border-none flex items-center justify-center text-white cursor-pointer transition-all hover:bg-black/80 hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation();
            onOptions?.(item);
          }}
        >
          <FaEllipsisH size={14} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title & Category */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">{getCategoryIcon(category)}</span>
          <h3 className="text-[16px] font-semibold text-white leading-tight line-clamp-1 m-0 flex-1">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#A0A0A0] leading-relaxed line-clamp-2 mb-2.5">
          {description}
        </p>

        {/* Location Info */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#6B6B6B] mb-3">
          <FaMapMarkerAlt size={12} className="text-white" />
          <span>{location}</span>
          <span className="text-[#6B6B6B]">•</span>
          <span>{campus}</span>
        </div>
        

        {/* Chat Button */}
        <div className="flex justify-between items-center mt-3">
          <ChatButton 
            targetUserId={item.user_id} 
            productId={item.id} 
            className="flex-1 max-w-[120px]"
          />
          <span className="text-xs text-[#6B6B6B]">{item.views_count || 0} views</span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A]">
          <div className="flex items-center gap-1.5 text-[12px] text-[#A0A0A0]">
            <FaUser size={10} className="text-[#6B6B6B]" />
            <span className="font-medium">{user_name || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#6B6B6B]">
            <FaClock size={10} />
            <span>{formatDate(created_at)}</span>
            {views_count > 0 && (
              <>
                <span className="text-[#6B6B6B]">•</span>
                <span>{views_count} views</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}