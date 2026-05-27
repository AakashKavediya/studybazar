"use client";

import clsx from "clsx";

export default function SocialButton({
  children,
  icon: Icon,

  fullWidth = true,
  disabled = false,
  loading = false,

  className = "",

  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        "relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl md:rounded-3xl border border-[#2A2A2A] bg-[#161616] px-5 py-3.5 text-sm sm:text-base font-medium tracking-wide text-white transition-all duration-300 hover:border-[#3A3A3A] hover:bg-[#1B1B1B] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 shadow-lg shadow-black/20 backdrop-blur-xl",

        fullWidth && "w-full",

        className
      )}
      {...props}
    >
      {/* Glow Effect */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/2 via-transparent to-transparent"
      />

      {/* Loading Spinner */}
      {loading ? (
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
        />
      ) : (
        <>
          {/* Icon */}
          {Icon && (
            <Icon
              size={20}
              className="shrink-0"
            />
          )}

          {/* Text */}
          <span className="relative z-10">
            {children}
          </span>
        </>
      )}
    </button>
  );
}