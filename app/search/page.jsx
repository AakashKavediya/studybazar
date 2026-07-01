// app/search/page.jsx
"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import axios from "axios";
import { useSelector } from "react-redux";
import Link from "next/link";

// Components
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import { Button } from "@/components/ui/Button";

// Icons
import { 
  FaUser, 
  FaSearch, 
  FaSpinner, 
  FaUserPlus, 
  FaUserCheck,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaTimes,
  FaArrowLeft
} from "react-icons/fa";

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diplomatic-mindfulness-production-621b.up.railway.app';

// Enhanced Search Bar Component with Search Button
const EnhancedSearchBar = ({ initialValue = "", onSearch, placeholder = "Search users...", onBack }) => {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-bar-inner">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Go back">
          <FaArrowLeft size={18} />
        </button>
        
        <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
          <FaSearch size={18} className="search-icon" />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
            autoFocus
          />
          {query && (
            <button type="button" className="clear-btn" onClick={handleClear}>
              <FaTimes size={14} />
            </button>
          )}
          <button type="submit" className="search-btn">
            <FaSearch size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>

      <style jsx>{`
        .search-bar {
          width: 100%;
          padding: 4px 0;
        }
        
        .search-bar-inner {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .back-btn {
          background: none;
          border: none;
          color: ${COLORS.textPrimary};
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .back-btn:hover {
          background: ${COLORS.secondaryBg};
        }
        
        .search-wrapper {
          display: flex;
          align-items: center;
          flex: 1;
          gap: 8px;
          background: ${COLORS.inputBg};
          border: 1.5px solid ${COLORS.border};
          border-radius: 14px;
          padding: 6px 6px 6px 14px;
          transition: all 0.25s ease;
        }
        
        .search-wrapper.focused {
          border-color: ${COLORS.primary};
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.08);
          background: ${COLORS.card};
        }
        
        .search-icon {
          color: ${COLORS.textMuted};
          flex-shrink: 0;
        }
        
        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 15px;
          color: ${COLORS.textPrimary};
          padding: 8px 0;
          min-width: 0;
        }
        
        .search-input::placeholder {
          color: ${COLORS.textMuted};
        }
        
        .clear-btn {
          background: ${COLORS.secondaryBg};
          border: none;
          color: ${COLORS.textMuted};
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
        }
        
        .clear-btn:hover {
          color: ${COLORS.textPrimary};
          background: ${COLORS.border};
        }
        
        .search-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 10px;
          background: ${COLORS.primary};
          color: ${COLORS.background};
          border: none;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }
        
        .search-btn:hover {
          opacity: 0.9;
          transform: scale(0.97);
        }
        
        .search-btn:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          .search-bar {
            padding: 2px 0;
          }
          
          .search-bar-inner {
            gap: 8px;
          }
          
          .search-wrapper {
            padding: 4px 4px 4px 12px;
            border-radius: 12px;
          }
          
          .search-input {
            font-size: 14px;
            padding: 6px 0;
          }
          
          .search-btn {
            padding: 6px 14px;
            font-size: 12px;
          }
          
          .search-btn span {
            display: none;
          }
          
          .search-btn {
            padding: 8px 12px;
          }
          
          .clear-btn {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </form>
  );
};

// User Card Component
const UserCard = ({ user, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onFollow(user.id, isFollowing);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link href={`/profile/${user.id}`} className="user-card-link">
      <div className="user-card">
        <div className="user-card-content">
          <div className="user-avatar">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                alt={user.name}
                className="avatar-img"
                loading="lazy"
              />
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={22} />
              </div>
            )}
          </div>

          <div className="user-info">
            <div className="user-name">
              {user.name}
              {user.is_verified && (
                <span className="verified-badge">✓ Verified</span>
              )}
            </div>
            <div className="user-details">
              {user.campus && (
                <span className="user-campus">
                  <FaGraduationCap size={11} />
                  {user.campus}
                </span>
              )}
              {user.location && (
                <span className="user-location">
                  <FaMapMarkerAlt size={11} />
                  {user.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
          onClick={handleFollow}
          disabled={isLoading}
          aria-label={isFollowing ? 'Unfollow' : 'Follow'}
        >
          {isLoading ? (
            <FaSpinner size={14} className="spinner" />
          ) : isFollowing ? (
            <FaUserCheck size={14} />
          ) : (
            <FaUserPlus size={14} />
          )}
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>

        <style jsx>{`
          .user-card-link {
            text-decoration: none;
            display: block;
            animation: fadeIn 0.3s ease;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .user-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px;
            background: ${COLORS.card};
            border: 1px solid ${COLORS.border};
            border-radius: 14px;
            transition: all 0.2s ease;
            cursor: pointer;
            margin-bottom: 6px;
          }
          
          .user-card:hover {
            background: ${COLORS.secondaryBg};
            border-color: ${COLORS.primary};
            transform: translateX(4px);
          }
          
          .user-card-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
          }
          
          .user-avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;
            background: ${COLORS.inputBg};
            flex-shrink: 0;
            border: 2px solid ${COLORS.border};
          }
          
          .avatar-img {
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
            background: ${COLORS.secondaryBg};
            color: ${COLORS.textMuted};
          }
          
          .user-info {
            flex: 1;
            min-width: 0;
          }
          
          .user-name {
            font-size: 15px;
            font-weight: 600;
            color: ${COLORS.textPrimary};
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 3px;
            flex-wrap: wrap;
          }
          
          .verified-badge {
            font-size: 9px;
            padding: 2px 10px;
            border-radius: 12px;
            background: ${COLORS.primary};
            color: ${COLORS.background};
            font-weight: 600;
            letter-spacing: 0.3px;
          }
          
          .user-details {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 12px;
            color: ${COLORS.textMuted};
            flex-wrap: wrap;
          }
          
          .user-campus,
          .user-location {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .follow-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            background: ${COLORS.primary};
            color: ${COLORS.background};
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            flex-shrink: 0;
            white-space: nowrap;
          }
          
          .follow-btn:hover:not(:disabled) {
            opacity: 0.9;
            transform: scale(0.97);
          }
          
          .follow-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .follow-btn.following {
            background: ${COLORS.secondaryBg};
            color: ${COLORS.textSecondary};
            border: 1px solid ${COLORS.border};
          }
          
          .follow-btn.following:hover:not(:disabled) {
            background: rgba(255, 59, 48, 0.1);
            color: ${COLORS.error};
            border-color: ${COLORS.error};
          }
          
          .spinner {
            animation: spin 0.8s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .user-card {
              padding: 12px 14px;
            }
            
            .user-avatar {
              width: 42px;
              height: 42px;
            }
            
            .user-name {
              font-size: 14px;
            }
            
            .user-details {
              font-size: 11px;
              gap: 8px;
            }
            
            .follow-btn {
              padding: 5px 12px;
              font-size: 11px;
            }
            
            .follow-btn span {
              display: none;
            }
            
            .follow-btn {
              padding: 6px 10px;
            }
          }
        `}</style>
      </div>
    </Link>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="skeleton">
    <div className="skeleton-avatar" />
    <div className="skeleton-content">
      <div className="skeleton-name" />
      <div className="skeleton-detail" />
    </div>
    <div className="skeleton-btn" />
    
    <style jsx>{`
      .skeleton {
        display: flex;
        align-items: center;
        padding: 14px 16px;
        background: ${COLORS.card};
        border: 1px solid ${COLORS.border};
        border-radius: 14px;
        margin-bottom: 6px;
        gap: 12px;
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: ${COLORS.inputBg};
        flex-shrink: 0;
      }
      
      .skeleton-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .skeleton-name {
        height: 16px;
        width: 55%;
        background: ${COLORS.inputBg};
        border-radius: 8px;
      }
      
      .skeleton-detail {
        height: 12px;
        width: 40%;
        background: ${COLORS.inputBg};
        border-radius: 8px;
      }
      
      .skeleton-btn {
        width: 70px;
        height: 30px;
        background: ${COLORS.inputBg};
        border-radius: 20px;
        flex-shrink: 0;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

// Empty State
const EmptyState = ({ query }) => (
  <div className="empty">
    <div className="empty-icon">
      <FaSearch size={36} />
    </div>
    <h3 className="empty-title">No results found</h3>
    {query ? (
      <p className="empty-desc">
        We couldn't find anyone matching "<span className="query">{query}</span>"
      </p>
    ) : (
      <p className="empty-desc">Search for people by name or campus</p>
    )}
    
    <style jsx>{`
      .empty {
        text-align: center;
        padding: 60px 20px;
        background: ${COLORS.card};
        border: 1px solid ${COLORS.border};
        border-radius: 16px;
      }
      
      .empty-icon {
        width: 72px;
        height: 72px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: ${COLORS.secondaryBg};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${COLORS.textMuted};
      }
      
      .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: ${COLORS.textPrimary};
        margin-bottom: 6px;
      }
      
      .empty-desc {
        font-size: 14px;
        color: ${COLORS.textSecondary};
        max-width: 300px;
        margin: 0 auto;
      }
      
      .query {
        color: ${COLORS.primary};
        font-weight: 500;
      }
    `}</style>
  </div>
);

// Main Search Component
function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useSelector((state) => state.auth);
  
  const initialQuery = searchParams?.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/users/search?query=${encodeURIComponent(query.trim())}`,
        {
          headers: {
            'Authorization': accessToken ? `Bearer ${accessToken}` : '',
          },
          withCredentials: true,
          timeout: 10000,
        }
      );

      if (response.data?.results) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.response?.data?.detail || 'Failed to search users');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery && searchQuery.trim().length >= 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
        setIsLoading(false);
      }, 500);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFollow = useCallback(async (userId, isCurrentlyFollowing) => {
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }
    console.log(`Follow/Unfollow user ${userId}`);
  }, [accessToken, router]);

  const renderResults = () => {
    if (isLoading || isSearching) {
      return (
        <div className="results-list">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <Button variant="secondary" onClick={() => performSearch(searchQuery)}>
            Try Again
          </Button>
        </div>
      );
    }

    if (results.length === 0 && searchQuery) {
      return <EmptyState query={searchQuery} />;
    }

    if (results.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-icon">
            <FaSearch size={36} />
          </div>
          <h3 className="empty-title">Find people</h3>
          <p className="empty-desc">Search for users by name or campus</p>
        </div>
      );
    }

    return (
      <>
        <div className="results-header">
          <span className="results-count">
            {results.length} {results.length === 1 ? 'person' : 'people'} found
          </span>
        </div>
        <div className="results-list">
          {results.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onFollow={handleFollow}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="search-content">
      <div className="search-header-section">
        <div className="search-header-content">
          <div className="search-icon-large">
            <FaSearch size={24} className="search-icon-glow" />
          </div>
          <div className="search-header-text">
            <h1 className="search-title">Find People</h1>
            <p className="search-subtitle">Search for users by name or campus</p>
          </div>
        </div>
      </div>

      <EnhancedSearchBar
        initialValue={searchQuery}
        onSearch={handleSearch}
        placeholder="Search users..."
        onBack={handleBack}
      />

      <div className="results-container">
        {renderResults()}
      </div>

      <style jsx>{`
        .search-content {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 20px 20px;
        }
        
        .search-header-section {
          padding: 20px 0 16px;
          border-bottom: 1px solid ${COLORS.border};
        }
        
        .search-header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .search-icon-large {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: ${COLORS.secondaryBg};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid ${COLORS.border};
        }
        
        .search-icon-glow {
          color: ${COLORS.primary};
          opacity: 0.8;
        }
        
        .search-header-text {
          flex: 1;
        }
        
        .search-title {
          font-size: 22px;
          font-weight: 700;
          color: ${COLORS.textPrimary};
          margin: 0 0 2px 0;
          letter-spacing: -0.3px;
        }
        
        .search-subtitle {
          font-size: 14px;
          color: ${COLORS.textSecondary};
          margin: 0;
        }
        
        .results-container {
          min-height: 200px;
          margin-top: 4px;
        }
        
        .results-header {
          padding: 16px 4px 12px;
          border-bottom: 1px solid ${COLORS.border};
          margin-bottom: 8px;
        }
        
        .results-count {
          font-size: 13px;
          font-weight: 500;
          color: ${COLORS.textSecondary};
          letter-spacing: 0.3px;
        }
        
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: ${COLORS.card};
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
        }
        
        .empty-icon {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          border-radius: 50%;
          background: ${COLORS.secondaryBg};
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${COLORS.textMuted};
        }
        
        .empty-title {
          font-size: 18px;
          font-weight: 600;
          color: ${COLORS.textPrimary};
          margin-bottom: 4px;
        }
        
        .empty-desc {
          font-size: 14px;
          color: ${COLORS.textSecondary};
        }
        
        .error-state {
          text-align: center;
          padding: 60px 20px;
          background: ${COLORS.card};
          border: 1px solid ${COLORS.border};
          border-radius: 16px;
        }
        
        .error-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }
        
        .error-text {
          color: ${COLORS.error};
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        @media (max-width: 768px) {
          .search-content {
            padding: 0 16px 16px;
          }
          
          .search-header-section {
            padding: 16px 0 12px;
          }
          
          .search-header-content {
            gap: 12px;
          }
          
          .search-icon-large {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }
          
          .search-icon-glow {
            font-size: 18px;
          }
          
          .search-title {
            font-size: 19px;
          }
          
          .search-subtitle {
            font-size: 13px;
          }
          
          .results-header {
            padding: 12px 4px 10px;
          }
        }
      `}</style>
    </div>
  );
}

// Main Page Component
export default function SearchPage() {
  return (
    <div className="search-page">
      <Header />
      <Suspense fallback={
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading search...</p>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <BottomTabNav />

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          background: ${COLORS.background};
          padding-bottom: 80px;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          color: ${COLORS.textSecondary};
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${COLORS.border};
          border-top-color: ${COLORS.primary};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 16px;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .search-page {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </div>
  );
}