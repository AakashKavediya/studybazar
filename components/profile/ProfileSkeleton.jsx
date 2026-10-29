"use client";

export default function ProfileSkeleton() {
  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4 animate-pulse">
      <div className="p-5 sm:p-7">
        {/* Top row skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-3 w-16 bg-[#1A1A1A] rounded" />
            <div className="w-6 h-px bg-[#1A1A1A]" />
            <div className="h-3 w-12 bg-[#1A1A1A] rounded" />
          </div>
          <div className="w-14 h-14 rounded-xl bg-[#1A1A1A]" />
        </div>

        {/* Name skeleton */}
        <div className="mb-3">
          <div className="h-8 w-32 bg-[#1A1A1A] rounded mb-2" />
          <div className="h-8 w-24 bg-[#1A1A1A] rounded" />
        </div>

        {/* Bio skeleton */}
        <div className="mb-4">
          <div className="h-4 w-full bg-[#1A1A1A] rounded mb-2" />
          <div className="h-4 w-3/4 bg-[#1A1A1A] rounded" />
        </div>

        {/* Skills skeleton */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-[#1A1A1A] rounded-full" />
          ))}
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-8 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-6 w-8 bg-[#1A1A1A] rounded mx-auto" />
              <div className="h-3 w-10 bg-[#1A1A1A] rounded mt-1" />
            </div>
          ))}
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-2 mt-5">
          <div className="flex-1 h-10 bg-[#1A1A1A] rounded-xl" />
          <div className="flex-1 h-10 bg-[#1A1A1A] rounded-xl" />
          <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl" />
        </div>
      </div>
    </div>
  );
}