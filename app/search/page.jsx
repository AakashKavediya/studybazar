"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";

// Components
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import SearchBar from "../../components/search/SearchBar";
import SearchHeader from "../../components/search/SearchHeader";
import SearchResults from "../../components/search/SearchResults";

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://diplomatic-mindfulness-production-621b.up.railway.app';

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

  // Perform search
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
      setError(error.response?.data?.detail || 'Failed to search users. Please try again.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [accessToken]);

  // Debounced search
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

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  }, [router]);

  // Handle back
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle follow
  const handleFollow = useCallback(async (userId, isCurrentlyFollowing) => {
    if (!accessToken) {
      router.push('/auth/signin');
      return;
    }
    // TODO: Implement follow/unfollow API
    console.log(`Follow/Unfollow user ${userId}`);
  }, [accessToken, router]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, [searchQuery, performSearch]);

  return (
    <div className="max-w-[700px] mx-auto px-5 pb-5">
      {/* <SearchHeader /> */}
      <SearchBar
        initialValue={searchQuery}
        onSearch={handleSearch}
        placeholder="Search by name or campus..."
        onBack={handleBack}
        isLoading={isLoading || isSearching}
      />
      <SearchResults
        results={results}
        isLoading={isLoading}
        isSearching={isSearching}
        error={error}
        searchQuery={searchQuery}
        onFollow={handleFollow}
        onRetry={handleRetry}
      />
    </div>
  );
}

// Main Page Component
export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#A3A3A3]">
          <div className="w-10 h-10 border-3 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mb-4" />
          <p>Loading search...</p>
        </div>
      }>
        <SearchContent />
      </Suspense>
      <BottomTabNav />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}