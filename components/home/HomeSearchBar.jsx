// components/home/HomeSearchBar.jsx
"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function HomeSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 bg-[#0A0A0A]">
      <div className="relative flex items-center bg-[#1A1A1A] rounded-full px-4 py-2 border border-[#2A2A2A] focus-within:border-[#F5A623] transition-colors">
        <FaSearch className="text-[#6B6B6B] text-sm flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search StudyBazaar..."
          className="flex-1 bg-transparent border-none outline-none text-white text-[14px] px-3 py-1 placeholder:text-[#6B6B6B]"
        />
      </div>
    </form>
  );
}