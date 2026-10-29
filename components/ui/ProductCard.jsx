// components/ui/ProductCard.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaHeart, FaRegHeart, FaPaperPlane, FaUser } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.107.168.22";

export default function ProductCard({ 
  product,
  onLike,
  onPress 
}) {
  const router = useRouter();
  const { accessToken, user } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    id,
    title,
    description,
    price,
    thumbnail,
    seller_name,
    seller_id,
    seller_campus,
    created_at,
  } = product;

  const productId = _id || id;

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike?.(productId, !isLiked);
  };

  // --- Real Chat Redirection ---
  const handleChatClick = async (e) => {
    e.stopPropagation();

    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }

    if (!seller_id) {
      alert("Seller information not available.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/chat/room`,
        { participant_id: seller_id, product_id: productId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data) {
        const roomId = response.data.id || response.data._id;
        router.push(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  // --- Format Price ---
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price || 0);

  return (
    <div 
      className="group relative bg-[#141414] rounded-3xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-1.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] cursor-pointer border border-[#2A2A2A] hover:border-[#F5A623]/20"
      onClick={() => onPress?.(product)}
    >
      
      {/* --- 1. THE IMAGE LAYER --- */}
      <div className="relative w-full aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
        {!imageError && thumbnail ? (
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B6B6B] bg-[#1A1A1A]">
            <span className="text-5xl opacity-10">📸</span>
          </div>
        )}

        {/* 1a. LIVE PRICE OVERLAY - Top Left */}
        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/50 backdrop-blur-lg rounded-full border border-white/5 shadow-lg select-none">
          <span className="text-[14px] font-bold text-white tracking-tight">
            {formattedPrice}
          </span>
        </div>

        {/* 1b. STEALTH LIKE BUTTON - Top Right */}
        <button 
          className="absolute top-4 right-4 w-9 h-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300"
          onClick={handleLike}
        >
          {isLiked ? <FaHeart className="text-[#FF453A]" size={16} /> : <FaRegHeart className="text-white/70 group-hover:text-white" size={16} />}
        </button>
      </div>

      {/* --- 2. THE CONTENT LAYER --- */}
      <div className="p-5 space-y-3 relative">
        
        {/* 2a. Title - Bold and large */}
        <h3 className="text-[18px] font-bold text-white leading-tight tracking-tight line-clamp-1">
          {title}
        </h3>

        {/* 2b. Description - Soft and clean */}
        <p className="text-[13px] text-[#A0A0A0] leading-relaxed line-clamp-2">
          {description || "No description provided."}
        </p>

        {/* 2c. DIVIDER */}
        <div className="w-full h-px bg-[#2A2A2A]/50 my-1" />

        {/* 2d. SELLER ROW - Minimalist */}
        <div className="flex items-center justify-between pt-1">
          
          {/* Left: Avatar + Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[12px] font-bold text-[#0A0A0A]">
              {seller_name?.charAt(0).toUpperCase() || <FaUser size={12} />}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium text-white">
                {seller_name || "Student"}
              </span>
              <span className="text-[11px] text-[#6B6B6B]">
                {seller_campus || "Campus"}
              </span>
            </div>
          </div>

          {/* Right: Chat Action (Premium Ghost Button) */}
          <button 
            onClick={handleChatClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent border border-[#2A2A2A] rounded-full text-[12px] font-medium text-[#A0A0A0] hover:bg-[#F5A623] hover:text-[#0A0A0A] hover:border-[#F5A623] transition-all duration-300"
          >
            <FaPaperPlane size={12} />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </div>

    </div>
  );
}