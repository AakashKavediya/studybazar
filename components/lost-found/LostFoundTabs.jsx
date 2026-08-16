// components/lost-found/LostFoundTabs.jsx
"use client";

export default function LostFoundTabs({ activeTab, setActiveTab }) {
  return (
    <div className="bg-[#141414] rounded-full p-0.5 mb-4 border border-[#2A2A2A] flex shadow-inner">
      <button
        onClick={() => setActiveTab("lost")}
        className={`flex-1 py-1.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
          activeTab === "lost"
            ? "bg-[#F5A623] text-[#0A0A0A] shadow-md shadow-[#F5A623]/20"
            : "text-[#A0A0A0] hover:text-white"
        }`}
      >
        Lost Items
      </button>
      <button
        onClick={() => setActiveTab("complaint")}
        className={`flex-1 py-1.5 rounded-full text-[14px] font-medium transition-all duration-300 ${
          activeTab === "complaint"
            ? "bg-[#F5A623] text-[#0A0A0A] shadow-md shadow-[#F5A623]/20"
            : "text-[#A0A0A0] hover:text-white"
        }`}
      >
        Complaints
      </button>
    </div>
  );
}