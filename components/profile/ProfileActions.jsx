"use client";

import { 
  FaEdit, 
  FaShareAlt, 
  FaUserPlus, 
  FaUserCheck, 
  FaComment,
  FaSpinner
} from "react-icons/fa";

export default function ProfileActions({
  isOwnProfile = false,
  isFollowing = false,
  isLoading = false,
  isMessageLoading = false,
  onFollow,
  onMessage,
  onEditClick,
  onShareClick,
}) {
  if (isOwnProfile) {
    return (
      <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626] mt-4">
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 active:scale-95"
        >
          <FaEdit size={14} /> Edit Profile
        </button>
        <button
          onClick={onShareClick}
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#262626] bg-[#111111] text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#262626] hover:text-[#F5F5F5]"
        >
          <FaShareAlt size={14} /> Share
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626] mt-4">
      <button
        onClick={onFollow}
        disabled={isLoading}
        className={`flex items-center gap-1.5 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all disabled:opacity-50 ${
          isFollowing
            ? "bg-[#111111] text-[#A3A3A3] border border-[#262626]"
            : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
        }`}
      >
        {isLoading ? (
          <FaSpinner size={14} className="animate-spin" />
        ) : isFollowing ? (
          <>
            <FaUserCheck size={14} /> Following
          </>
        ) : (
          <>
            <FaUserPlus size={14} /> Follow
          </>
        )}
      </button>

      <button
        onClick={onMessage}
        disabled={isMessageLoading}
        className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#111111] hover:text-[#F5F5F5] disabled:opacity-50"
      >
        {isMessageLoading ? (
          <FaSpinner size={14} className="animate-spin" />
        ) : (
          <FaComment size={14} />
        )}
        Message
      </button>

      <button
        onClick={onShareClick}
        aria-label="Share profile"
        className="flex items-center justify-center px-3.5 py-2 rounded-full border border-[#262626] bg-transparent text-[#A3A3A3] cursor-pointer transition-all hover:bg-[#111111] hover:text-[#F5F5F5]"
      >
        <FaShareAlt size={14} />
      </button>
    </div>
  );
}