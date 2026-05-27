"use client";

export default function Divider({
  text = "OR",
}) {
  return (
    <div
      className="flex items-center gap-4 py-2"
    >
      {/* Left Line */}
      <div
        className="h-px flex-1 bg-[#2A2A2A]"
      />

      {/* Text */}
      <span
        className="text-xs sm:text-sm font-medium tracking-wider uppercase text-zinc-500"
      >
        {text}
      </span>

      {/* Right Line */}
      <div
        className="h-px flex-1 bg-[#2A2A2A]"
      />
    </div>
  );
}