"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-3.5 p-3.5 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-[#1A1A1A] flex-shrink-0" />
      <div className="flex-1">
        <div className="h-4 w-3/5 bg-[#1A1A1A] rounded-lg mb-1.5" />
        <div className="h-3 w-2/5 bg-[#1A1A1A] rounded-lg" />
      </div>
    </div>
  );
}