"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

export default function Checkbox({
  label,
  checked = false,
  onChange,

  disabled = false,
  required = false,

  className = "",
}) {
  return (
    <label
      className={clsx(
        "flex items-start gap-3 cursor-pointer select-none transition-opacity duration-300",

        disabled &&
          "cursor-not-allowed opacity-50",

        className
      )}
    >
      {/* Hidden Native Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => {
          if (!disabled && onChange) {
            onChange(e);
          }
        }}
        className="hidden"
      />

      {/* Custom Checkbox UI */}
      <div
        className={clsx(
          "relative mt-0.5 flex items-center justify-center h-5 w-5 shrink-0 rounded-md border transition-all duration-300",

          checked
            ? `
              border-blue-500
              bg-blue-500

              shadow-md
              shadow-blue-500/20
            `
            : `
              border-[#3A3A3A]
              bg-[#161616]
            `
        )}
      >
        {/* Check Icon */}
        <Check
          size={14}
          className={clsx(
            "text-white transition-all duration-200",

            checked
              ? "scale-100 opacity-100"
              : "scale-50 opacity-0"
          )}
        />
      </div>

      {/* Label */}
      {label && (
        <p
          className="text-sm sm:text-[15px] leading-relaxed text-zinc-400"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </p>
      )}
    </label>
  );
}