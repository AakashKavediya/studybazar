// components/profile/ProfileActions.jsx
"use client";

import { FaEdit, FaShareAlt, FaUserPlus, FaUserCheck, FaComment } from "react-icons/fa";

export default function ProfileActions({ 
  isOwnProfile, 
  isFollowing, 
  setIsFollowing, 
  onEditClick, 
  onShareClick 
}) {
  if (isOwnProfile) {
    return (
      <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 active:scale-95"
          onClick={onEditClick}
          aria-label="Edit profile"
        >
          <FaEdit size={14} />
          Edit Profile
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#262626] bg-[#111111] text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#262626] hover:text-[#F5F5F5]"
          onClick={onShareClick}
          aria-label="Share profile"
        >
          <FaShareAlt size={14} />
          Share
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
      <button
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all ${
          isFollowing
            ? "bg-[#111111] text-[#A3A3A3] border border-[#262626]"
            : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
        }`}
        onClick={() => setIsFollowing(!isFollowing)}
        aria-label={isFollowing ? "Unfollow" : "Follow"}
      >
        {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
        {isFollowing ? "Following" : "Follow"}
      </button>
      <button 
        className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#111111] hover:text-[#F5F5F5]"
        aria-label="Send message"
      >
        <FaComment size={14} />
        Message
      </button>
    </div>
  );
}