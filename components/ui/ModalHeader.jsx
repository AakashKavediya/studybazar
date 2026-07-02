// components/ui/ModalHeader.jsx
"use client";

import { X } from "lucide-react";

export default function ModalHeader({ title, onClose, disabled = false }) {
  return (
    <div className="flex justify-between items-center mb-5 sticky top-0 bg-[#161616] z-10 pb-2">
      <h3 className="text-[20px] font-bold m-0 text-[#F5F5F5]">{title}</h3>
      <button
        className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5] disabled:opacity-50"
        onClick={onClose}
        disabled={disabled}
      >
        <X size={20} />
      </button>
    </div>
  );
}