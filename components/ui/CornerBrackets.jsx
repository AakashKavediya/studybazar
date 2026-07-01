// components/ui/CornerBrackets.jsx
"use client";

export default function CornerBrackets() {
  return (
    <>
      <span className="hidden sm:block absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#F5A623]/40 rounded-tl-sm" />
      <span className="hidden sm:block absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#F5A623]/40 rounded-tr-sm" />
      <span className="hidden sm:block absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#F5A623]/40 rounded-bl-sm" />
      <span className="hidden sm:block absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#F5A623]/40 rounded-br-sm" />
    </>
  );
}