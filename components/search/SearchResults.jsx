"use client";

import { useEffect, useRef } from "react";
import UserCard from "./UserCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { FaSearch } from "react-icons/fa";

export default function SearchResults({
  results,
  isLoading,
  searchQuery,
  hasSearched,
}) {
  const resultsRef = useRef(null);

  // Scroll to top when results change
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = 0;
    }
  }, [results]);

  // Loading state
  if (isLoading && searchQuery) {
    return (
      <div className="py-2" ref={resultsRef}>
        {[1, 2, 3, 4, 5].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // No results
  if (hasSearched && results.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5">
        <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
          <FaSearch size={28} className="text-[#666666]" />
        </div>
        <p className="text-white text-base font-medium mb-1">No results found</p>
        <p className="text-[#666666] text-sm text-center max-w-xs">
          We couldn't find anyone matching "<span className="text-[#F5A623]">{searchQuery}</span>"
        </p>
      </div>
    );
  }

  // Results
  if (results.length > 0) {
    return (
      <div className="py-2" ref={resultsRef}>
        {results.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    );
  }

  // Initial empty state
  return (
    <div className="flex flex-col items-center justify-center py-20 px-5">
      <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
        <FaSearch size={28} className="text-[#666666]" />
      </div>
      <p className="text-white text-base font-medium mb-1">Search for people</p>
      <p className="text-[#666666] text-sm text-center max-w-xs">
        Find users by name, campus, or location
      </p>
    </div>
  );
}