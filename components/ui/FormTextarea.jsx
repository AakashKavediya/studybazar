// components/ui/FormTextarea.jsx
"use client";

export default function FormTextarea({
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  rows = 3,
  className = "",
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      rows={rows}
      className={`p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] resize-y font-inherit disabled:opacity-50 ${className}`}
    />
  );
}