"use client";

import { FaSearch } from "react-icons/fa";

export default function EmptyState({ query }) {
  return (
    <div className="text-center py-20 px-5 bg-[#161616] border border-[#262626] rounded-2xl">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1A1A1A] flex items-center justify-center text-[#666666]">
        <FaSearch size={40} />
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">No results found</h3>
      {query ? (
        <p className="text-[#A3A3A3] text-sm max-w-xs mx-auto">
          We couldn't find anyone matching "<span className="text-[#F5A623] font-medium">{query}</span>"
        </p>
      ) : (
        <p className="text-[#A3A3A3] text-sm max-w-xs mx-auto">
          Search for people by name or campus
        </p>
      )}
    </div>
  );
}