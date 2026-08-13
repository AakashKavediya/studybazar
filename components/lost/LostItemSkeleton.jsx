"use client";

export default function LostItemSkeleton() {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full pt-[75%] bg-[#1A1A1A]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#1A1A1A] rounded w-3/4" />
        <div className="h-8 bg-[#1A1A1A] rounded w-full" />
        <div className="h-4 bg-[#1A1A1A] rounded w-1/2" />
        <div className="h-4 bg-[#1A1A1A] rounded w-2/3" />
      </div>
    </div>
  );
}