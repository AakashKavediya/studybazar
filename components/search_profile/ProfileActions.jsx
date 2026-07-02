"use client";

import {
  FaEdit,
  FaShareAlt,
  FaUserPlus,
  FaUserCheck,
  FaComment,
} from "react-icons/fa";

export default function ProfileActions({
  isOwnProfile = false,
  isFollowing = false,
  isLoading = false,
  onFollow,
  onMessage,
  onEditClick,
  onShareClick,
}) {
  if (isOwnProfile) {
    return (
      <div className="flex gap-2 mt-5">
        <button
          onClick={onEditClick}
          className="flex-1 py-2.5 px-4 bg-[#1A1A1A] border border-[#262626] text-white font-medium text-sm rounded-xl hover:bg-[#262626] hover:border-[#333333] transition-all flex items-center justify-center gap-2"
        >
          <FaEdit size={14} />
          Edit Profile
        </button>
        <button
          onClick={onShareClick}
          className="flex-1 py-2.5 px-4 bg-[#1A1A1A] border border-[#262626] text-white font-medium text-sm rounded-xl hover:bg-[#262626] hover:border-[#333333] transition-all flex items-center justify-center gap-2"
        >
          <FaShareAlt size={14} />
          Share
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-5">
      <button
        onClick={onFollow}
        disabled={isLoading}
        className={`flex-1 py-2.5 px-4 font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          isFollowing
            ? "bg-[#1A1A1A] border border-[#262626] text-white hover:bg-[#262626] hover:border-[#333333]"
            : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
        }`}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
            {isFollowing ? "Following" : "Follow"}
          </>
        )}
      </button>

      <button
        onClick={onMessage}
        className="flex-1 py-2.5 px-4 bg-[#1A1A1A] border border-[#262626] text-white font-medium text-sm rounded-xl hover:bg-[#262626] hover:border-[#333333] transition-all flex items-center justify-center gap-2"
      >
        <FaComment size={14} />
        <span className="hidden sm:inline">Message</span>
      </button>

      <button
        onClick={onShareClick}
        aria-label="Share profile"
        className="py-2.5 px-3.5 bg-[#1A1A1A] border border-[#262626] text-white rounded-xl hover:bg-[#262626] hover:border-[#333333] transition-all"
      >
        <FaShareAlt size={14} />
      </button>
    </div>
  );
}