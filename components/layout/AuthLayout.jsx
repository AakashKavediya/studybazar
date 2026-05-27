"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

export default function Input({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}

      <div
        className={clsx(
          "relative flex items-center rounded-2xl border bg-[#161616] transition-all duration-300",
          error
            ? "border-red-500 focus-within:ring-2 focus-within:ring-red-500/20"
            : "border-[#262626] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        {Icon && (
          <Icon
            size={18}
            className="ml-4 text-zinc-500"
          />
        )}

        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled}
          className="
            w-full bg-transparent px-4 py-4
            text-sm text-white outline-none
            placeholder:text-zinc-500
          "
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-4 text-zinc-500 transition hover:text-zinc-300"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}