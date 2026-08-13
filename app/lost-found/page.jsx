"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

// Components
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import {
  LostItemCard,
  LostItemSkeleton,
  LostFilterBar,
  LostStatsBar,
  LostEmptyState,
} from "@/components/lost";
import LostCreateModal from "@/components/lost/LostCreateModal";

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Separate the logic into a Content component to handle hydration correctly
function LostFoundContent() {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    category: "",
    campus: "",
  });
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loaderRef = useRef(null);

  // --- Fetch Items ---
  const fetchItems = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        const params = new URLSearchParams({
          page: pageNum,
          limit: 20,
          ...(filters.query && { query: filters.query }),
          ...(filters.status && { status: filters.status }),
          ...(filters.category && { category: filters.category }),
          ...(filters.campus && { campus: filters.campus }),
        });

        // ✅ Safely handle missing token
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

        const response = await axios.get(
          `${API_URL}/lost-and-found/search?${params.toString()}`,
          { headers, withCredentials: true }
        );

        if (response.data?.data) {
          const { items: newItems, pagination } = response.data.data;
          if (reset) setItems(newItems);
          else setItems((prev) => [...prev, ...newItems]);
          setHasMore(pagination.has_next);
        }
      } catch (err) {
        console.error("Error fetching lost items:", err);
        setError(err.response?.data?.detail || "Failed to load items");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [accessToken, filters]
  );

  // --- Fetch Stats ---
  const fetchStats = useCallback(async () => {
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      const response = await axios.get(`${API_URL}/lost-and-found/stats`, {
        headers,
        withCredentials: true,
      });
      if (response.data?.data) setStats(response.data.data);
    } catch (err) {
      // Ignore 400/401 errors silently
      if (err.response?.status !== 400 && err.response?.status !== 401) {
        console.error("Error fetching stats:", err);
      }
    }
  }, [accessToken]);

  // --- Initial Load ---
  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchItems(1, true), fetchStats()]);
    };
    loadInitial();
  }, [fetchItems, fetchStats]);

  // --- Load more on scroll ---
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchItems(nextPage, false);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, page, fetchItems]);

  // --- Handle Create ---
  const handleCreateItem = useCallback(
    async (formData) => {
      try {
        const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
        await axios.post(`${API_URL}/lost-and-found/`, formData, {
          headers,
          withCredentials: true,
        });
        setIsCreateModalOpen(false);
        // Refresh the list
        setIsLoading(true);
        setPage(1);
        fetchItems(1, true);
        fetchStats();
      } catch (err) {
        console.error("Error creating item:", err);
        alert(err.response?.data?.detail || "Failed to create item");
      }
    },
    [accessToken, fetchItems, fetchStats]
  );

  // --- Handlers ---
  const handleSearch = useCallback(
    (query) => {
      setFilters((prev) => ({ ...prev, query }));
      setIsLoading(true);
      setPage(1);
      fetchItems(1, true);
    },
    [fetchItems]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setIsLoading(true);
      setPage(1);
      fetchItems(1, true);
    },
    [fetchItems]
  );

  const handleItemPress = useCallback(
    (item) => {
      router.push(`/lost-found/${item.id}`);
    },
    [router]
  );

  const handleReset = useCallback(() => {
    setFilters({ query: "", status: "", category: "", campus: "" });
    setIsLoading(true);
    setPage(1);
    fetchItems(1, true);
    fetchStats();
  }, [fetchItems, fetchStats]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20 relative">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Lost & Found</h1>
          <p className="text-[#A3A3A3] text-sm mt-1">
            Report lost items or help someone find theirs
          </p>
        </div>

        {stats && <LostStatsBar stats={stats} />}
        <LostFilterBar
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          activeFilters={filters}
        />

        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] rounded-xl p-4 mb-6 text-center">
            <p className="text-[#EF4444] text-sm">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchItems(1, true);
              }}
              className="mt-2 text-[#F5A623] text-sm font-medium hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <LostItemSkeleton key={i} />
              ))}
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <LostItemCard key={item.id} item={item} onPress={handleItemPress} />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <LostEmptyState query={filters.query} onReset={handleReset} />
        )}

        {!isLoading && hasMore && items.length > 0 && (
          <div ref={loaderRef} className="py-6 text-center">
            {isLoadingMore && (
              <div className="inline-block w-6 h-6 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin" />
            )}
          </div>
        )}

        {!isLoading && !hasMore && items.length > 0 && (
          <div className="flex items-center justify-center gap-4 py-8 text-[#666666] text-sm">
            <div className="h-px flex-1 bg-[#262626]" />
            <span>You've seen it all</span>
            <div className="h-px flex-1 bg-[#262626]" />
          </div>
        )}
      </div>

      {/* Floating Action Button to Add Item */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-white text-black rounded-full shadow-lg shadow-white/20 flex items-center justify-center hover:scale-110 transition-transform"
      >
        <FaPlus size={22} />
      </button>

      <BottomTabNav />

      {/* Create Modal */}
      <LostCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateItem}
      />
    </div>
  );
}

// Main exported component with Suspense to handle useRouter hydration
export default function LostFoundPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#A3A3A3]">Loading Lost & Found...</p>
          </div>
        </div>
      }
    >
      <LostFoundContent />
    </Suspense>
  );
}