// hooks/usePagination.js
"use client";

import { useState, useCallback, useMemo } from "react";

export function usePagination(items, itemsPerPage = 15) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination values using DSA principles
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Get current page items using slicing (O(1) operation)
  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);
  
  // Check if there are more items
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  
  // Navigation functions
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasNextPage]);
  
  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hasPrevPage]);
  
  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);
  
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);
  
  // Get page numbers for pagination UI (DSA optimized)
  const getPageNumbers = useCallback(() => {
    const delta = 2; // Number of pages to show on each side
    const range = [];
    const rangeWithDots = [];
    let l;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }
    
    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });
    
    return rangeWithDots;
  }, [currentPage, totalPages]);
  
  return {
    currentItems,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    goToPage,
    resetPagination,
    getPageNumbers
  };
}