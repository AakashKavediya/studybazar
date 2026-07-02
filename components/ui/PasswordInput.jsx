// components/ui/PasswordInput.jsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function PasswordInput({
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled = false,
  autoComplete = "current-password",
  showPassword = false,
  onTogglePassword,
}) {
  return (
    <div className="space-y-1">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          className={`w-full p-3 pr-11 rounded-xl border ${
            error && touched ? "border-red-500" : "border-[#262626]"
          } bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required
          disabled={disabled}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#A3A3A3] cursor-pointer p-1 hover:text-[#F5F5F5] disabled:opacity-50"
          onClick={onTogglePassword}
          disabled={disabled}
          tabIndex="-1"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && touched && (
        <p className="text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}