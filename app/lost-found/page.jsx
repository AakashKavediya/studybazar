"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

// Components
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import LostFoundTabs from "@/components/lost-found/LostFoundTabs";
import LostFoundCard from "@/components/lost-found/LostFoundCard";
import LostFoundModal from "@/components/lost-found/LostFoundModal";
import { FaPlus } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LostFoundPage() {
  const { accessToken } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("lost");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const observerRef = useRef(null);

  const fetchPosts = useCallback(
    async (reset = false) => {
      if (!accessToken) return;
      if (!reset && (isLoadingMore || !hasMore)) return;

      if (reset) setIsLoading(true);
      else setIsLoadingMore(true);

      setError(null);

      try {
        const currentPage = reset ? 1 : page;
        
        // ✅ FIX: Added trailing slash after /lost-and-found/
        const response = await axios.get(
          `${API_URL}/lost-and-found/?page=${currentPage}&limit=10&type=${activeTab}&sort_by=created_at&sort_order=desc`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        // Safely extract items regardless of backend wrapper
        let newItems = [];
        if (Array.isArray(response.data)) {
          newItems = response.data;
        } else if (Array.isArray(response.data?.data?.items)) {
          newItems = response.data.data.items;
        } else if (Array.isArray(response.data?.items)) {
          newItems = response.data.items;
        }

        if (reset) {
          setPosts(newItems);
          setPage(1);
        } else {
          setPosts((prev) => [...prev, ...newItems]);
          setPage((prev) => prev + 1);
        }

        // Safely check for pagination
        const pagination = response.data?.data?.pagination || response.data?.pagination;
        const totalPages = pagination?.total_pages || 1;
        setHasMore(currentPage < totalPages);

      } catch (err) {
        console.error("Failed to fetch lost items:", err);
        setError(err.response?.data?.detail || "Failed to load items. Please try again.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [accessToken, page, isLoadingMore, hasMore, activeTab]
  );

  // Reset and fetch when tab changes
  useEffect(() => {
    setPosts([]);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(true);
  }, [activeTab, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll logic
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            fetchPosts(false);
          }
        },
        { threshold: 0.1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore, fetchPosts]
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
        <Header />

        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Lost & Found</h1>
          </div>

          <div className="mb-8">
            <LostFoundTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#161616] rounded-3xl p-5 h-[300px] animate-pulse">
                  <div className="w-full h-full bg-[#2A2A2A] rounded-2xl" />
                </div>
              ))
            ) : posts.length === 0 ? (
              // Empty state
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#A0A0A0]">
                <div className="text-6xl mb-4 opacity-20">📭</div>
                <p className="text-sm font-medium">No {activeTab} items yet.</p>
                <p className="text-xs mt-1 text-[#6B6B6B]">Tap the + button to add one.</p>
              </div>
            ) : (
              // Render posts
              posts.map((post, index) => {
                const isLast = index === posts.length - 1;
                return (
                  <div key={post._id || post.id} ref={isLast ? lastElementRef : null}>
                    <LostFoundCard post={post} />
                  </div>
                );
              })
            )}
          </div>

          {/* Loading More Spinner */}
          {isLoadingMore && (
            <div className="flex justify-center pb-10">
               <div className="w-8 h-8 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin" />
            </div>
          )}

          {/* Floating Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-28 right-6 z-40 w-[48px] h-[48px] bg-[#F5A623] text-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg shadow-[#F5A623]/20 hover:scale-105 active:scale-95 transition-all duration-200"
          >
            <FaPlus size={20} />
          </button>

          <LostFoundModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            activeTab={activeTab}
            onPostCreated={() => fetchPosts(true)}
          />
        </div>

        <BottomTabNav />
      </div>
    </ProtectedRoute>
  );
}