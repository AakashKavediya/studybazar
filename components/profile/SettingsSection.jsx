// app/profile/components/SettingsSection.jsx
"use client";

import { 
  FaLock, 
  FaBell, 
  FaShieldAlt, 
  FaQuestionCircle, 
  FaSignOutAlt, 
  FaTrashAlt,
  FaChevronRight
} from "react-icons/fa";

export default function SettingsSection({ onPasswordClick, onDeleteClick, onLogoutClick }) {
  const settingsItems = [
    { id: "password", icon: FaLock, label: "Change Password", onClick: onPasswordClick },
    { id: "notifications", icon: FaBell, label: "Notifications", onClick: () => {} },
    { id: "privacy", icon: FaShieldAlt, label: "Privacy", onClick: () => {} },
    { id: "help", icon: FaQuestionCircle, label: "Help & Support", onClick: () => {} },
  ];

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
      <div className="px-5 sm:px-6 py-3 bg-[#111111] border-b border-[#262626]">
        <span className="text-[10px] font-medium tracking-[0.2em] text-[#A3A3A3] uppercase">
          Settings
        </span>
      </div>

      <div className="px-2 py-1">
        {settingsItems.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === settingsItems.length - 1;
          return (
            <button
              key={item.id}
              className={`flex items-center justify-between w-full px-3 py-3 text-left transition-all duration-200 hover:bg-[#1a1a1a] rounded-lg ${
                !isLast ? 'border-b border-[#262626]' : ''
              }`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <Icon size={15} className="text-[#A3A3A3]" />
                <span className="text-[13px] text-[#F5F5F5] font-light tracking-wide">
                  {item.label}
                </span>
              </div>
              <FaChevronRight size={11} className="text-[#3A3A3A]" />
            </button>
          );
        })}

        {/* Divider */}
        <div className="h-px bg-[#262626] my-1" />

        <button
          className="flex items-center justify-between w-full px-3 py-3 text-left transition-all duration-200 hover:bg-[#1a1a1a] rounded-lg"
          onClick={onLogoutClick}
        >
          <div className="flex items-center gap-3">
            <FaSignOutAlt size={15} className="text-[#FF3B30]" />
            <span className="text-[13px] font-light tracking-wide text-[#FF3B30]">Log Out</span>
          </div>
        </button>

        <button
          className="flex items-center justify-between w-full px-3 py-3 text-left transition-all duration-200 hover:bg-[#1a1a1a] rounded-lg"
          onClick={onDeleteClick}
        >
          <div className="flex items-center gap-3">
            <FaTrashAlt size={15} className="text-[#FF3B30]" />
            <span className="text-[13px] font-light tracking-wide text-[#FF3B30]">Delete Account</span>
          </div>
        </button>
      </div>
    </div>
  );
}