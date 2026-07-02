"use client";

import Link from "next/link";
import { FaUser, FaCheckCircle } from "react-icons/fa";

export default function UserCard({ user }) {
  return (
    <Link href={`/search/${user.id}`} className="block no-underline">
      <div className="flex items-center gap-3.5 p-3.5 hover:bg-[#1A1A1A] transition-colors cursor-pointer rounded-lg">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#1A1A1A] flex-shrink-0 border-2 border-[#262626]">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A] text-[#666666]">
              <FaUser size={18} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-white font-medium text-sm truncate">
              {user.name}
            </span>
            {user.is_verified && (
              <FaCheckCircle size={12} className="text-[#F5A623] flex-shrink-0" />
            )}
          </div>
          <div className="text-xs text-[#666666] truncate">
            {user.campus || user.location || "Student"}
          </div>
        </div>
      </div>
    </Link>
  );
}