"use client";

import clsx from "clsx";

export default function Button({
  children,
  type = "button",

  variant = "primary",
  size = "md",

  fullWidth = false,
  loading = false,
  disabled = false,

  icon: Icon,
  iconPosition = "left",

  className = "",

  ...props
}) {
  /* =========================
     VARIANTS
  ========================= */

  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20",

    secondary: "bg-[#1A1A1A] text-white border border-[#2A2A2A] hover:bg-[#202020]",

    outline: "border border-[#2A2A2A] bg-transparent text-white hover:bg-[#1A1A1A]",

    ghost: "bg-transparent text-zinc-300 hover:bg-[#1A1A1A] hover:text-white",

    google: "bg-white text-black hover:bg-zinc-200",

    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  /* =========================
     SIZES
  ========================= */

  const sizes = {
    sm: "px-4 py-2.5 text-sm",

    md: "px-5 py-3 sm:py-3.5 text-sm sm:text-base",

    lg: "px-6 py-4 text-base sm:text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl md:rounded-3xl font-medium tracking-wide transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap select-none",

        variants[variant],
        sizes[size],

        fullWidth && "w-full",

        className
      )}
      {...props}
    >
      {/* Loading Spinner */}
      {loading ? (
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        <>
          {/* Left Icon */}
          {Icon && iconPosition === "left" && (
            <Icon
              size={18}
              className="shrink-0"
            />
          )}

          {/* Button Text */}
          <span>{children}</span>

          {/* Right Icon */}
          {Icon && iconPosition === "right" && (
            <Icon
              size={18}
              className="shrink-0"
            />
          )}
        </>
      )}
    </button>
  );
}