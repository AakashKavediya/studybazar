"use client";

import clsx from "clsx";

export default function AuthCard({
  children,
  className = "",
}) {
  return (
    <div
      className={clsx(
        "relative w-full max-w-md overflow-hidden rounded-3xl border border-[#262626] bg-[#161616]/90 backdrop-blur-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/30 transition-all duration-300",

        className
      )}
    >
      {/* Glow Effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 via-transparent to-transparent"
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}   