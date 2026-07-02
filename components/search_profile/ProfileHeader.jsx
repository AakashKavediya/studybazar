"use client";

import { FaArrowLeft } from "react-icons/fa";

export default function ProfileHeader({ username, onBack }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#1A1A1A]">
      <button
        onClick={onBack}
        className="text-white p-1 hover:bg-[#1A1A1A] rounded-full transition-colors"
        aria-label="Go back"
      >
        <FaArrowLeft size={22} />
      </button>
      <h1 className="text-white font-semibold text-lg truncate max-w-[200px]">
        {username || "Profile"}
      </h1>
      <div className="w-8" />
    </div>
  );
}