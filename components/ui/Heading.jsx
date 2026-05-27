"use client";

import clsx from "clsx";

export default function Heading({
  title,
  subtitle,

  align = "left",
  size = "md",

  className = "",
}) {
  const alignments = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const sizes = {
    sm: {
      title: "text-2xl sm:text-3xl",
      subtitle: "text-sm sm:text-base",
    },

    md: {
      title: "text-3xl sm:text-4xl",
      subtitle: "text-sm sm:text-base",
    },

    lg: {
      title: "text-4xl sm:text-5xl",
      subtitle: "text-base sm:text-lg",
    },
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-3",

        alignments[align],

        className
      )}
    >
      {/* Title */}
      <h1
        className={clsx(
          "font-bold tracking-tight text-white leading-tight",

          sizes[size].title
        )}
      >
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={clsx(
            "max-w-md leading-relaxed text-zinc-400",

            sizes[size].subtitle
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}