"use client"

import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import SearchBar from "@/components/ui/SearchBar";
import FilterModal from "@/components/ui/FilterModal";
import ProductListing from "@/components/ui/ProductListing";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Provider } from "react-redux";
import {store} from "../redux/store";
import { useSelector } from "react-redux";


const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authState = useSelector((state) => state.auth);

  

  return(
    <div>
      <ProtectedRoute>
        <Header />
        <SearchBar />
        <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
          <div>
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", padding: "12px", borderRadius: "12px", background: "#1c1c1c", fontSize: "14px", color: "#f5f5f5", margin: "12px 0" }}>
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>
        <ProductListing products={allProducts} isLoading={isLoading} />
        <BottomTabNav />
      </ProtectedRoute>
    </div>
  )
}

export default HomePage;