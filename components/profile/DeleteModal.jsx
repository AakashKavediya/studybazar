// app/profile/components/DeleteModal.jsx
"use client";

import { Trash2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#161616] rounded-3xl max-w-[400px] w-full p-8 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[rgba(255,59,48,0.15)]">
          <Trash2 size={32} style={{ color: "#FF3B30" }} />
        </div>
        <h3 className="text-[20px] font-bold text-center m-0 mb-2 text-[#F5F5F5]">Delete Account</h3>
        <p className="text-[14px] text-[#A3A3A3] text-center leading-relaxed m-0 mb-6">
          Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626]" onClick={onClose}>
            Cancel
          </button>
          <button className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#FF3B30] text-white hover:opacity-90" onClick={onConfirm}>
            Delete Account
          </button>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        `}</style>
      </div>
    </div>
  );
}