// components/profile/ProfileAvatar.jsx
"use client";

import { FaCamera } from "react-icons/fa";

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23161616'/%3E%3Ccircle cx='50' cy='40' r='25' fill='%23333333'/%3E%3Ccircle cx='50' cy='85' r='30' fill='%23333333'/%3E%3C/svg%3E";

export default function ProfileAvatar({ 
  image, 
  name, 
  isOwnProfile, 
  onImageClick 
}) {
  const avatarSrc = image?.startsWith('http') ? image : DEFAULT_AVATAR;

  return (
    <div className="relative shrink-0">
      <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-xl overflow-hidden border border-[#262626] relative bg-[#111111]">
        <img
          src={avatarSrc}
          alt={name || "Profile"}
          className="w-full h-full object-cover"
        />
      </div>
      {isOwnProfile && (
        <button 
          className="absolute -bottom-1 -right-1 bg-[#F5A623] border-2 border-[#161616] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-[#0A0A0A] transition-transform hover:scale-110"
          onClick={onImageClick}
          aria-label="Change profile picture"
        >
          <FaCamera size={11} />
        </button>
      )}
    </div>
  );
}