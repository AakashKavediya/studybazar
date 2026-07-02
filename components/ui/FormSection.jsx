// components/ui/FormSection.jsx
"use client";

export default function FormSection({ title, children, className = "" }) {
  return (
    <div className={`border-t border-[#262626] pt-3 mt-2 ${className}`}>
      {title && (
        <p className="text-[12px] text-[#A3A3A3] font-medium mb-2">{title}</p>
      )}
      {children}
    </div>
  );
}