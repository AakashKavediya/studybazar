"use client";

export default function LostStatsBar({ stats }) {
  const { total, lost, found, resolved, closed } = stats || {};

  if (!stats) return null;

  const statItems = [
    { label: "Total", value: total, color: "text-white" },
    { label: "Lost", value: lost, color: "text-[#EF4444]" },
    { label: "Found", value: found, color: "text-[#34C759]" },
    { label: "Resolved", value: resolved, color: "text-[#22C55E]" },
    { label: "Closed", value: closed, color: "text-[#6B6B6B]" },
  ];

  return (
    <div className="flex items-center gap-6 py-4 border-b border-[#2A2A2A] mb-5 overflow-x-auto scrollbar-hide">
      {statItems.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-1 shrink-0 relative">
          <span className={`text-xl font-bold ${item.color}`}>
            {item.value}
          </span>
          <span className="text-[11px] text-[#6B6B6B] uppercase tracking-wider">
            {item.label}
          </span>
          {index < statItems.length - 1 && (
            <div className="w-px h-7 bg-[#2A2A2A] mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}