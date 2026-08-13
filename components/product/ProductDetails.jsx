"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaHeart,
  FaShare,
  FaStar,
  FaEye,
  FaBookmark,
  FaUser,
  FaGraduationCap,
  FaFileAlt,
  FaDownload,
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaTag,
} from "react-icons/fa";

// Product Details Component
export default function ProductDetails({ product, seller, onBack }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Destructure product data
  const {
    title,
    description,
    category,
    price,
    thumbnail,
    images = [],
    tags = [],
    is_verified = false,
    views_count = 0,
    likes_count = 0,
    saved_count = 0,
    created_at,
    seller_name,
    seller_campus,
    pages = 48, // Example - you can add this to schema
    rating = 4.7, // Example - you can add this to schema
    total_reviews = 12, // Example - you can add this to schema
    product_type = "digital",
  } = product;

  // Get seller info
  const sellerInfo = seller || {
    name: seller_name || "Unknown Seller",
    campus: seller_campus || "University",
    year: "2nd Year",
    branch: "CSE",
    avatar: null,
    rating: 4.7,
    total_reviews: 12,
    verified: is_verified,
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get category icon
  const getCategoryIcon = (cat) => {
    const icons = {
      notes: <FaFileAlt />,
      books: <FaBookmark />,
      lab: <FaDownload />,
      assignments: <FaFileAlt />,
      ppt: <FaFileAlt />,
      question_bank: <FaFileAlt />,
      handwritten_notes: <FaFileAlt />,
      cheat_sheet: <FaFileAlt />,
      other: <FaFileAlt />,
    };
    return icons[cat] || <FaFileAlt />;
  };

  // Get category label
  const getCategoryLabel = (cat) => {
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
    return labels[cat] || cat;
  };

  // Generate stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-[#F5A623] fill-[#F5A623]" size={14} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <FaStar className="text-[#333333]" size={14} />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <FaStar className="text-[#F5A623] fill-[#F5A623]" size={14} />
            </div>
          </div>
        );
      } else {
        stars.push(<FaStar key={i} className="text-[#333333]" size={14} />);
      }
    }
    return stars;
  };

  // All images (thumbnail + additional images)
  const allImages = [thumbnail, ...images].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors mb-4 group"
      >
        <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Images */}
        <div className="space-y-3">
          {/* Main Image */}
          <div className="relative bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#262626]">
            <div className="aspect-square relative">
              <img
                src={allImages[selectedImage] || "/placeholder-image.jpg"}
                alt={title}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Verified Badge */}
            {is_verified && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-[#F5A623]/10 backdrop-blur-sm rounded-lg border border-[#F5A623]/20">
                <span className="text-[10px] font-bold text-[#F5A623] uppercase tracking-wider flex items-center gap-1">
                  <FaCheckCircle size={12} />
                  Verified
                </span>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
              <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                {getCategoryIcon(category)}
                {getCategoryLabel(category)}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === index
                      ? "border-[#F5A623]"
                      : "border-[#262626] hover:border-[#666666]"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-5">
          {/* Title & Actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#262626] transition-all group"
              >
                <FaHeart
                  size={18}
                  className={isLiked ? "text-[#FF3B30] fill-[#FF3B30]" : "text-[#666666] group-hover:text-white"}
                />
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#262626] transition-all group"
              >
                <FaBookmark
                  size={18}
                  className={isSaved ? "text-[#F5A623] fill-[#F5A623]" : "text-[#666666] group-hover:text-white"}
                />
              </button>
              <button className="p-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#262626] transition-all group">
                <FaShare size={18} className="text-[#666666] group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center flex-shrink-0">
              <FaUser size={16} className="text-[#0A0A0A]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">
                  {sellerInfo.name}
                </span>
                {sellerInfo.verified && (
                  <FaCheckCircle size={12} className="text-[#F5A623]" />
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-[#666666]">
                <span className="flex items-center gap-1">
                  <FaGraduationCap size={10} />
                  {sellerInfo.year} {sellerInfo.branch}
                </span>
                <span>•</span>
                <span>{sellerInfo.campus}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="flex items-center gap-0.5">
                {renderStars(sellerInfo.rating)}
              </div>
              <span className="text-[#A3A3A3] ml-1">
                ({sellerInfo.total_reviews})
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <div className="flex items-center justify-center gap-1 text-[#F5A623]">
                <FaEye size={14} />
                <span className="text-sm font-semibold text-white">{views_count}</span>
              </div>
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Views</span>
            </div>
            <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <div className="flex items-center justify-center gap-1 text-[#FF3B30]">
                <FaHeart size={14} />
                <span className="text-sm font-semibold text-white">{likes_count}</span>
              </div>
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Likes</span>
            </div>
            <div className="text-center p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <div className="flex items-center justify-center gap-1 text-[#F5A623]">
                <FaBookmark size={14} />
                <span className="text-sm font-semibold text-white">{saved_count}</span>
              </div>
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Saves</span>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-[#666666] uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Product Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Category</span>
              <p className="text-sm text-white font-medium">{getCategoryLabel(category)}</p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Type</span>
              <p className="text-sm text-white font-medium capitalize">{product_type}</p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Pages</span>
              <p className="text-sm text-white font-medium">{pages} Pages</p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#262626]">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">Posted</span>
              <p className="text-sm text-white font-medium">{formatDate(created_at)}</p>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-[#1A1A1A] rounded-full text-xs text-[#666666] border border-[#262626]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & Actions */}
          <div className="pt-4 border-t border-[#262626]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs text-[#666666] uppercase tracking-wider">Price</span>
                <p className="text-3xl font-bold text-[#F5A623]">₹{price}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2.5 bg-[#1A1A1A] border border-[#262626] text-white font-medium rounded-xl hover:bg-[#262626] transition-all">
                  Message Seller
                </button>
                <button className="px-6 py-2.5 bg-gradient-to-r from-[#F5A623] to-[#E0961A] text-[#0A0A0A] font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#F5A623]/20">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}