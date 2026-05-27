"use client";

import Link from "next/link";
import clsx from "clsx";

export default function Logo({
  className = "",
  textSize = "text-xl sm:text-2xl",
}) {
  return (
    <Link
      href="/"
      className={clsx(
        "inline-flex items-center gap-2 select-none transition-opacity duration-300 hover:opacity-90",
        className
      )}
    >
      {/* Logo Icon */}
      <div
        className="relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-blue-500 shadow-lg shadow-blue-500/20"
      >
        {/* Inner Glow */}
        <div
          className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/20 to-transparent"
        />

        {/* Logo Letter */}
        <span
          className="relative text-lg sm:text-xl font-bold tracking-wide text-white"
        >
          S
        </span>
      </div>

      {/* Brand Name */}
      <div className="flex flex-col leading-none">
        <span
          className={clsx("font-bold tracking-tight text-white", textSize)}
        >
          StudyMart
        </span>

        <span
          className="mt-1 text-[10px] sm:text-xs font-medium tracking-[0.2em] uppercase text-zinc-500"
        >
          Learn Smarter
        </span>
      </div>
    </Link>
  );
}