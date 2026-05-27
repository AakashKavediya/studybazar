"use client";

import clsx from "clsx";

export default function Label({
  children,
  required = false,
  htmlFor,

  size = "md",
  muted = false,

  className = "",
}) {
  const sizes = {
    sm: "text-xs sm:text-sm",

    md: "text-sm sm:text-[15px]",

    lg: "text-base sm:text-lg",
  };

  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium tracking-wide transition-colors duration-200",

        muted
          ? "text-zinc-400"
          : "text-zinc-200",

        sizes[size],

        className
      )}
    >
      {/* Label Text */}
      <span>{children}</span>

      {/* Required Mark */}
      {required && (
        <span
          className="text-red-500"
        >
          *
        </span>
      )}
    </label>
  );
}