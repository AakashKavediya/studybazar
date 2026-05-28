"use client"

import { useState, useEffect } from "react";
import { COLORS } from "@/constants/colors";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import SearchBar from "@/components/ui/SearchBar";
import FilterModal from "@/components/ui/FilterModal";
import ProductListing from "@/components/ui/ProductListing";

const HomePage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  

  return(
    <div>
      <Header />
      <SearchBar />
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      <ProductListing products={allProducts} isLoading={isLoading} />
      <BottomTabNav />
        
    </div>
  )
}

export default HomePage;