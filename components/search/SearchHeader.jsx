"use client";

import { FaSearch } from "react-icons/fa";

export default function SearchHeader() {
  return (
    <div className="py-6 pb-5 border-b border-[#262626]">
      <div className="flex items-center gap-4.5">
        <div className="w-13 h-13 rounded-2xl bg-[#1A1A1A] flex items-center justify-center flex-shrink-0 border border-[#262626]">
          <FaSearch className="text-2xl text-[#F5A623] opacity-80" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Find People</h1>
          <p className="text-[#A3A3A3] text-sm">Search for users by name or campus</p>
        </div>
      </div>
    </div>
  );
}