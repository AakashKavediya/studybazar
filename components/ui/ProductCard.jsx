// components/ui/ProductCard.jsx
"use client";

import { useState } from "react";
import { COLORS } from "@/constants/colors";

// Icons
const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const HeartIcon = ({ liked = false }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? COLORS.error : "none"} stroke={liked ? COLORS.error : COLORS.textMuted} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.primary} stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function ProductCard({ 
  product,
  onChat,
  onLike,
  onPress 
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    title,
    description,
    price,
    condition,
    seller,
    location,
    image,
    isVerified = false,
    createdAt
  } = product;

  const getConditionColor = (cond) => {
    switch(cond?.toLowerCase()) {
      case 'new': return COLORS.success;
      case 'like new': return '#34C759';
      case 'good': return '#FFCC00';
      case 'used': return '#FF9500';
      default: return COLORS.textMuted;
    }
  };

  const getConditionLabel = (cond) => {
    switch(cond?.toLowerCase()) {
      case 'new': return 'New';
      case 'like new': return 'Like New';
      case 'good': return 'Good';
      case 'used': return 'Used';
      default: return cond || 'Used';
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(id, !isLiked);
  };

  const handleChat = () => {
    onChat?.(product);
  };

  const handlePress = () => {
    onPress?.(product);
  };

  return (
    <div className="product-card" onClick={handlePress}>
      {/* Image Section */}
      <div className="card-image-wrapper">
        {!imageError ? (
          <img 
            src={image || "/api/placeholder/300/200"} 
            alt={title}
            className="product-image"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">
            <span>📷</span>
          </div>
        )}
        
        {/* Condition Badge */}
        <div className="condition-badge" style={{ background: getConditionColor(condition) }}>
          {getConditionLabel(condition)}
        </div>
        
        {/* Like Button */}
        <button 
          className="like-button" 
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <HeartIcon liked={isLiked} />
        </button>
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Title & Price Row */}
        <div className="title-price-row">
          <h3 className="product-title">{title}</h3>
          <div className="price-tag">
            <span className="currency">₹</span>
            <span className="price">{price?.toLocaleString()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="product-description">{description}</p>

        {/* Seller Info */}
        <div className="seller-info">
          <div className="seller-avatar">
            {seller?.avatar ? (
              <img src={seller.avatar} alt={seller.name} />
            ) : (
              <div className="avatar-placeholder">
                {seller?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="seller-details">
            <div className="seller-name">
              {seller?.name}
              {isVerified && <VerifiedIcon />}
            </div>
            <div className="seller-location">
              <LocationIcon />
              <span>{location || seller?.location || "Campus"}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button 
            className="chat-button"
            onClick={(e) => {
              e.stopPropagation();
              handleChat();
            }}
          >
            <ChatIcon />
            <span>Chat</span>
          </button>
          <div className="post-time">
            {createdAt && new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .product-card {
          background: ${COLORS.card};
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          cursor: pointer;
          border: 1px solid ${COLORS.border};
          margin-bottom: 16px;
        }
        
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
          border-color: ${COLORS.primary};
        }
        
        .product-card:active {
          transform: scale(0.98);
        }
        
        /* Image Section */
        .card-image-wrapper {
          position: relative;
          padding-top: 66.66%;
          overflow: hidden;
          background: ${COLORS.inputBg};
        }
        
        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        
        .image-placeholder {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background: ${COLORS.secondaryBg};
          color: ${COLORS.textMuted};
        }
        
        .condition-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          backdrop-filter: blur(4px);
        }
        
        .like-button {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .like-button:hover {
          transform: scale(1.1);
          background: rgba(0, 0, 0, 0.8);
        }
        
        .like-button:active {
          transform: scale(0.95);
        }
        
        /* Content Section */
        .card-content {
          padding: 16px;
        }
        
        .title-price-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        .product-title {
          font-size: 16px;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          margin: 0;
          line-height: 1.4;
          flex: 1;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        .price-tag {
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: ${COLORS.primary};
          padding: 4px 10px;
          border-radius: 12px;
          color: white;
        }
        
        .currency {
          font-size: 12px;
          font-weight: 600;
        }
        
        .price {
          font-size: 16px;
          font-weight: 700;
        }
        
        .product-description {
          font-size: 13px;
          color: ${COLORS.textSecondary};
          line-height: 1.5;
          margin: 8px 0 12px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        
        /* Seller Info */
        .seller-info {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          padding: 8px 0;
          border-top: 0.5px solid ${COLORS.border};
          border-bottom: 0.5px solid ${COLORS.border};
        }
        
        .seller-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .seller-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${COLORS.primary};
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
        
        .seller-details {
          flex: 1;
        }
        
        .seller-name {
          font-size: 14px;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
        }
        
        .seller-location {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: ${COLORS.textMuted};
        }
        
        /* Actions */
        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }
        
        .chat-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: ${COLORS.secondaryBg};
          border: none;
          border-radius: 25px;
          color: ${COLORS.textPrimary};
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .chat-button:hover {
          background: ${COLORS.primary};
          color: white;
          transform: scale(1.05);
        }
        
        .chat-button:active {
          transform: scale(0.98);
        }
        
        .post-time {
          font-size: 11px;
          color: ${COLORS.textMuted};
        }
        
        /* Mobile Responsive */
        @media (max-width: 768px) {
          .product-card {
            border-radius: 16px;
          }
          
          .card-content {
            padding: 12px;
          }
          
          .product-title {
            font-size: 15px;
          }
          
          .price {
            font-size: 15px;
          }
          
          .product-description {
            font-size: 12px;
          }
          
          .chat-button {
            padding: 6px 14px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}