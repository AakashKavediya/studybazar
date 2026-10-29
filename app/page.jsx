// app/page.jsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import SearchBar from "@/components/ui/SearchBar";
import FilterModal from "@/components/ui/FilterModal";
import ProductListing from "@/components/ui/ProductListing";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL}";

// Chat Icon Component
const ChatHeader = () => {
  const router = useRouter();
  return (
    <div className="flex-1 flex justify-end items-center pr-2">
      <button 
        onClick={() => router.push("/chat")}
        className="p-2 rounded-full hover:bg-[#1A1A1A] transition-colors text-[#A0A0A0] hover:text-white"
        aria-label="Go to messages"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // --- Fetch REAL Products from Backend ---
  const fetchProducts = useCallback(async () => {
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Fetching products from:", `${API_URL}/products`);
      
      const response = await axios.get(`${API_URL}/products-test`, {  
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      console.log("📦 Backend Response:", response.data);
      
      // ✅ Correctly extract products from nested response
      const products = response.data?.data?.products || [];
      console.log(`✅ Loaded ${products.length} products`);
      setAllProducts(products);
      
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        setError(`Server Error: ${error.response.status} - ${error.response.data?.detail || error.response.statusText}`);
      } else if (error.request) {
        console.error("No response received. Is the backend running?");
        setError("Could not reach the server. Please check if backend is running.");
      } else {
        setError(error.message || "Failed to load products");
      }
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Filter Products based on Search Query ---
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    
    const query = searchQuery.toLowerCase().trim();
    return allProducts.filter((product) => 
      product.title?.toLowerCase().includes(query) || 
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  }, [allProducts, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
        
        {/* 1. Global Header with Chat Icon */}
        <div className="relative">
          <Header />
          <div className="fixed top-3 right-0 z-3000 ">
            <ChatHeader />
          </div>
        </div>

        {/* 2. Search Bar */}
        <div className="sticky top-[60px] z-40 bg-[#0A0A0A] border-b border-[#2A2A2A]">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* 3. Filter Modal */}
        <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

        {/* 4. Product Listing */}
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          {error ? (
            <div className="text-center text-[#FF453A] py-12">
              <p className="text-lg font-semibold">⚠️ {error}</p>
              <button 
                onClick={fetchProducts}
                className="mt-4 px-6 py-2 bg-[#F5A623] text-[#0A0A0A] rounded-full font-medium hover:opacity-90 transition-all"
              >
                Retry
              </button>
            </div>
          ) : (
            <ProductListing 
              initialProducts={filteredProducts} 
              isLoading={isLoading}
              itemsPerPage={15}
            />
          )}
        </div>

        {/* 5. Global Bottom Navigation */}
        <BottomTabNav />
      </div>
    </ProtectedRoute>
  );
}