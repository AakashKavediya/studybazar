"use client";

import clsx from "clsx";

export default function Loader({
  size = "md",
  fullScreen = false,
  text,
  className = "",
}) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  const loader = (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4",
        className
      )}
    >
      {/* Spinner */}
      <div
        className={clsx(
          "animate-spin rounded-full border-blue-500 border-t-transparent shadow-lg shadow-blue-500/10",
          sizes[size]
        )}
      />

      {/* Optional Text */}
      {text && (
        <p
          className="
            text-sm
            sm:text-base

            font-medium

            tracking-wide

            text-zinc-400
          "
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/90 backdrop-blur-md px-4"
      >
        {loader}
      </div>
    );
  }

  return loader;
}