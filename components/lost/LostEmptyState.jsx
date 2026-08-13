"use client";

export default function LostEmptyState({ query, onReset }) {
  return (
    <div className="text-center py-16 px-5 bg-[#141414] rounded-2xl border border-[#2A2A2A]">
      <div className="text-5xl mb-4 opacity-50">🔍</div>
      <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
      {query ? (
        <p className="text-sm text-[#A0A0A0] mb-6 max-w-xs mx-auto">
          We couldn't find any lost items matching "<span className="text-white font-medium">{query}</span>"
        </p>
      ) : (
        <p className="text-sm text-[#A0A0A0] mb-6 max-w-xs mx-auto">
          No lost or found items have been posted yet. Be the first!
        </p>
      )}
      <button
        onClick={onReset}
        className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
      >
        Clear filters
      </button>
    </div>
  );
}