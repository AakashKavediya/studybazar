"use client";

import { X } from "lucide-react";
import clsx from "clsx";

export default function Modal({
  isOpen,
  onClose,
  children,
  title,

  className = "",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4 py-6"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          "relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#262626] bg-[#161616]/95 p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300",
          className
        )}
      >
        {/* Glow Effect */}
          <div
            className={clsx(
              "pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-blue-500/5 via-transparent to-transparent"
            )}
          />

        {/* Header */}
        <div
          className="relative z-10 mb-6 flex items-center justify-between gap-4"
        >
          {/* Title */}
          {title && (
            <h2
              className="text-lg sm:text-xl font-semibold tracking-tight text-white"
            >
              {title}
            </h2>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl p-2 text-zinc-400 transition-all duration-200 hover:bg-[#1E1E1E] hover:text-white active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}