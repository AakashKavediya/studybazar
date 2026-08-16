// app/lost-found/page.jsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";

// Global Layout Components
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";

// Local Components
import LostFoundTabs from "@/components/lost-found/LostFoundTabs";
import LostFoundCard from "@/components/lost-found/LostFoundCard";
import LostFoundModal from "@/components/lost-found/LostFoundModal";

// Icons
import { FaPlus } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LostFoundPage() {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("lost");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  // --- Fetch Posts from Backend ---
  const fetchPosts = useCallback(async (reset = false) => {
    if (!accessToken) return;
    if (!reset && (isLoadingMore || !hasMore)) return;

    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const currentPage = reset ? 1 : page;
      const response = await axios.get(
        `${API_URL}/lost-and-found?page=${currentPage}&limit=10&sort_by=created_at&sort_order=desc`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      const newItems = response.data?.data?.items || [];
      
      if (reset) {
        setPosts(newItems);
        setPage(1);
      } else {
        setPosts((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
      
      const totalPages = response.data?.data?.pagination?.total_pages || 1;
      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Failed to fetch lost items:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [accessToken, page, isLoadingMore, hasMore]);

  // --- Initial Load & Tab Change ---
  useEffect(() => {
    setPosts([]);
    setIsLoading(true);
    setPage(1);
    setHasMore(true);
    fetchPosts(true);
  }, [activeTab, accessToken]);

  // --- Infinite Scroll Intersection Observer ---
  const lastElementRef = useCallback((node) => {
    if (isLoading || isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(false);
      }
    }, { threshold: 0.1 });

    if (node) observerRef.current.observe(node);
  }, [isLoading, isLoadingMore, hasMore, fetchPosts]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Lost & Found</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <LostFoundTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#161616] rounded-3xl p-5 h-[300px] animate-pulse">
                <div className="w-full h-full bg-[#2A2A2A] rounded-2xl" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#A0A0A0]">
              <div className="text-6xl mb-4 opacity-20">📭</div>
              <p className="text-sm font-medium">No {activeTab} items yet.</p>
              <p className="text-xs mt-1 text-[#6B6B6B]">Tap the + button to add one.</p>
            </div>
          ) : (
            posts.map((post, index) => {
              if (index === posts.length - 1) {
                return <LostFoundCard key={post._id || post.id} post={post} ref={lastElementRef} />;
              }
              return <LostFoundCard key={post._id || post.id} post={post} />;
            })
          )}
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="fixed bottom-28 right-6 z-40 w-[40px] h-[40px] bg-[#F5A623] text-[#0A0A0A] rounded-full flex items-center justify-center shadow-lg shadow-[#F5A623]/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <FaPlus size={20} />
        </button>

        {/* Modal */}
        <LostFoundModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          activeTab={activeTab} 
          onPostCreated={() => {
            fetchPosts(true);
          }}
        />
      </div>

      <BottomTabNav />
    </div>
  );
}