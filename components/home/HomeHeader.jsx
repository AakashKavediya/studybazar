// components/home/HomeHeader.jsx
"use client";

import Link from "next/link";
import { FaInstagram, FaPaperPlane } from "react-icons/fa";

export default function HomeHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#2A2A2A] sticky top-0 z-50">
      
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <FaInstagram size={24} className="text-[#F5A623]" />
        <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">
          StudyBazaar
        </h1>
      </div>

      {/* Right: Chat Icon (Navigates to /chat) */}
      <Link 
        href="/chat" 
        className="relative p-2 rounded-full hover:bg-[#1A1A1A] transition-colors text-[#A0A0A0] hover:text-white"
      >
        <FaPaperPlane size={22} />
        {/* Optional: Unread Badge */}
        {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF453A] rounded-full text-[8px] flex items-center justify-center text-white font-bold">3</span> */}
      </Link>
    </div>
  );
}