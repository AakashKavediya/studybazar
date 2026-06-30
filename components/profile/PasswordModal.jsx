// app/profile/components/PasswordModal.jsx
"use client";

import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export default function PasswordModal({ isOpen, onClose, onConfirm }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm?.(formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const PasswordInput = ({ name, placeholder, show, setShow, value }) => (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        className="w-full p-3 pr-11 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623]"
        value={value}
        onChange={handleChange}
        required
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#A3A3A3] cursor-pointer p-1 hover:text-[#F5F5F5]"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#161616] rounded-3xl max-w-[400px] w-full p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[20px] font-bold m-0 text-[#F5F5F5]">Change Password</h3>
          <button className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5]" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 mb-5">
            <PasswordInput
              name="currentPassword"
              placeholder="Current Password"
              show={showCurrentPassword}
              setShow={setShowCurrentPassword}
              value={formData.currentPassword}
            />
            <PasswordInput
              name="newPassword"
              placeholder="New Password"
              show={showNewPassword}
              setShow={setShowNewPassword}
              value={formData.newPassword}
            />
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm New Password"
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              value={formData.confirmPassword}
            />
            <p className="text-[12px] text-[#A3A3A3] m-0">
              Password must be at least 8 characters with a number and symbol.
            </p>
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626]" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90">
              Update Password
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