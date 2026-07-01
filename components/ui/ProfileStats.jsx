// components/profile/ProfileStats.jsx
"use client";

export default function ProfileStats({ stats }) {
  return (
    <div className="flex items-center gap-6 sm:gap-8 mb-4 flex-wrap">
      {stats.map((s, i, arr) => (
        <div key={s.label} className="flex items-center gap-6 sm:gap-8">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold text-[#F5F5F5]">{s.value}</span>
            <span className="text-[9px] text-[#A3A3A3] font-medium uppercase tracking-[0.3px]">
              {s.label}
            </span>
          </div>
          {i < arr.length - 1 && <div className="w-px h-6 bg-[#262626]" />}
        </div>
      ))}
    </div>
  );
}