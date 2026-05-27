"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

export default function Input({
  label,
  type = "text",
  placeholder = "",
  icon: Icon,
  error,
  disabled = false,
  className = "",
  inputClassName = "",
  required = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {label && (
        <label
          className="block text-sm sm:text-[15px] font-medium tracking-wide text-zinc-300"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      {/* Input Container */}
      <div
        className={clsx(
          "relative flex items-center overflow-hidden rounded-2xl md:rounded-3xl border border-[#262626] bg-[#161616]/90 backdrop-blur-xl transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 hover:border-[#333333]",

          error &&
            "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/10",

          disabled &&
            "cursor-not-allowed opacity-50",

          className
        )}
      >
        {/* Left Icon */}
        {Icon && (
          <div
            className="flex items-center justify-center pl-3 sm:pl-4"
          >
            <Icon
              size={18}
              className="text-zinc-500"
            />
          </div>
        )}

        {/* Input */}
        <input
          type={
            isPassword
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full bg-transparent px-4 py-3.5 sm:px-5 sm:py-4 text-sm sm:text-base text-white outline-none placeholder:text-zinc-500 placeholder:text-sm sm:placeholder:text-base autofill:bg-transparent disabled:cursor-not-allowed",

            inputClassName
          )}
          {...props}
        />

        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="
                mr-3 sm:mr-4 flex items-center justify-center text-zinc-500 transition-colors duration-200 hover:text-zinc-300"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p
          className="text-xs sm:text-sm font-medium text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
}