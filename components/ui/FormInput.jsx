// components/ui/FormInput.jsx
"use client";

export default function FormInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}