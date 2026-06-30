// app/profile/components/EditModal.jsx
"use client";

import { X } from "lucide-react";

export default function EditModal({ isOpen, onClose, userData, onSave }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#161616] rounded-3xl max-w-[480px] w-full p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[20px] font-bold m-0 text-[#F5F5F5]">Edit Profile</h3>
          <button className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5]" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 mb-5">
            <input type="text" placeholder="Full Name" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.name} />
            <input type="email" placeholder="Email" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.email} />
            <input type="tel" placeholder="Phone" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.phone} />
            <input type="text" placeholder="College" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.college} />
            <input type="text" placeholder="Branch" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.branch} />
            <input type="text" placeholder="Year" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.year} />
            <input type="text" placeholder="City" className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]" defaultValue={userData.city} />
            <textarea 
              placeholder="Bio" 
              className="p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] resize-y font-inherit" 
              defaultValue={userData.bio} 
              rows="3" 
            />
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626]" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90">
              Save Changes
            </button>
          </div>
        </form>

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