// components/ui/ProductListing.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "./ProductCard";
import { COLORS } from "@/constants/colors";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-content">
      <div className="skeleton-title" />
      <div className="skeleton-price" />
      <div className="skeleton-description" />
      <div className="skeleton-seller" />
    </div>
    <style jsx>{`
      .skeleton-card {
        background: ${COLORS.card};
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid ${COLORS.border};
        animation: pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-image {
        width: 100%;
        padding-top: 66.66%;
        background: ${COLORS.inputBg};
      }
      
      .skeleton-content {
        padding: 16px;
      }
      
      .skeleton-title {
        height: 20px;
        background: ${COLORS.inputBg};
        border-radius: 8px;
        margin-bottom: 12px;
        width: 70%;
      }
      
      .skeleton-price {
        height: 24px;
        background: ${COLORS.inputBg};
        border-radius: 8px;
        margin-bottom: 12px;
        width: 30%;
      }
      
      .skeleton-description {
        height: 32px;
        background: ${COLORS.inputBg};
        border-radius: 8px;
        margin-bottom: 12px;
        width: 90%;
      }
      
      .skeleton-seller {
        height: 40px;
        background: ${COLORS.inputBg};
        border-radius: 8px;
        width: 60%;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="empty-state">
    <div className="empty-icon">📦</div>
    <h3>No products found</h3>
    <p>Try adjusting your filters or search query</p>
    <style jsx>{`
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: ${COLORS.textSecondary};
      }
      
      .empty-icon {
        font-size: 64px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      .empty-state h3 {
        font-size: 20px;
        font-weight: 600;
        color: ${COLORS.textPrimary};
        margin-bottom: 8px;
      }
      
      .empty-state p {
        font-size: 14px;
      }
    `}</style>
  </div>
);

// End of Results Component
const EndOfResults = () => (
  <div className="end-results">
    <div className="end-line" />
    <span>You've seen it all</span>
    <div className="end-line" />
    <style jsx>{`
      .end-results {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 40px 20px;
        color: ${COLORS.textMuted};
        font-size: 13px;
      }
      
      .end-line {
        flex: 1;
        height: 0.5px;
        background: ${COLORS.border};
      }
    `}</style>
  </div>
);

export default function ProductListing({ 
  initialProducts = [],
  itemsPerPage = 15,
  loadMoreProducts,
  onChat,
  onLike,
  onProductPress
}) {
  const [products, setProducts] = useState(initialProducts);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const loaderRef = useRef(null);
  const observerRef = useRef(null);

  // Calculate total pages based on items per page
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = 0;
  const endIndex = page * itemsPerPage;
  const currentDisplayed = products.slice(startIndex, endIndex);

  // Update displayed products when page changes
  useEffect(() => {
    setDisplayedProducts(currentDisplayed);
    setHasMore(endIndex < products.length);
  }, [page, products]);

  // Load more products function
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    // Simulate network delay or fetch from API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (page < totalPages) {
      setPage(prev => prev + 1);
    } else if (loadMoreProducts) {
      // Fetch more products from backend
      try {
        const newProducts = await loadMoreProducts(page + 1);
        if (newProducts && newProducts.length > 0) {
          setProducts(prev => [...prev, ...newProducts]);
          setPage(prev => prev + 1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading more products:", error);
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
    
    setIsLoading(false);
    setIsInitialLoad(false);
  }, [isLoading, hasMore, page, totalPages, loadMoreProducts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return;
    
    const options = {
      root: null,
      rootMargin: "100px",
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry.isIntersecting && hasMore && !isLoading && !isInitialLoad) {
        loadMore();
      }
    }, options);
    
    observerRef.current.observe(loaderRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore, isInitialLoad]);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Reset pagination when products change
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsInitialLoad(true);
  }, [products.length]);

  // Handle product actions
  const handleChat = (product) => {
    onChat?.(product);
  };

  const handleLike = (productId, liked) => {
    onLike?.(productId, liked);
    // Update local state to reflect like
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, isLiked: liked, likes: liked ? (product.likes || 0) + 1 : (product.likes || 0) - 1 }
        : product
    ));
  };

  const handleProductPress = (product) => {
    onProductPress?.(product);
  };

  // Loading skeleton array
  const skeletonArray = Array(itemsPerPage).fill(null);

  return (
    <div className="product-listing">
      {/* Products Grid */}
      <div className="products-grid">
        {displayedProducts.map((product, index) => (
          <div 
            key={product.id || index} 
            className="product-item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard
              product={product}
              onChat={handleChat}
              onLike={handleLike}
              onPress={handleProductPress}
            />
          </div>
        ))}
        
        {/* Loading Skeletons */}
        {(isLoading || isInitialLoad) && (
          <>
            {skeletonArray.map((_, index) => (
              <div key={`skeleton-${index}`} className="product-item">
                <LoadingSkeleton />
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Empty State */}
      {!isLoading && !isInitialLoad && displayedProducts.length === 0 && (
        <EmptyState />
      )}
      
      {/* Load More Trigger */}
      {hasMore && !isInitialLoad && (
        <div ref={loaderRef} className="loader-trigger">
          {isLoading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}
      
      {/* End of Results */}
      {!hasMore && !isInitialLoad && displayedProducts.length > 0 && (
        <EndOfResults />
      )}
      
      {/* Stats Bar */}
      {!isInitialLoad && displayedProducts.length > 0 && (
        <div className="stats-bar">
          <span>Showing {displayedProducts.length} of {products.length} products</span>
        </div>
      )}

      <style jsx>{`
        .product-listing {
          width: 100%;
          position: relative;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .product-item {
          animation: fadeInUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .loader-trigger {
          display: flex;
          justify-content: center;
          padding: 20px;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px;
          color: ${COLORS.textSecondary};
          font-size: 14px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid ${COLORS.border};
          border-top-color: ${COLORS.primary};
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .stats-bar {
          text-align: center;
          padding: 16px;
          color: ${COLORS.textMuted};
          font-size: 13px;
          border-top: 0.5px solid ${COLORS.border};
          margin-top: 20px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .products-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 16px;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        
        @media (min-width: 1024px) and (max-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1280px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}