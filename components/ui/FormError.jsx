"use client";

import { AlertCircle } from "lucide-react";
import clsx from "clsx";

export default function FormError({
  message,
  className = "",
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={clsx(
        "flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 backdrop-blur-md transition-all duration-300",
        className
      )}
    >
      {/* Icon */}
      <div
        className="mt-0.5 shrink-0 text-red-400"
      >
        <AlertCircle size={18} />
      </div>

      {/* Message */}
      <p
        className="text-sm sm:text-[15px] font-medium leading-relaxed text-red-300"
      >
        {message}
      </p>
    </div>
  );
}