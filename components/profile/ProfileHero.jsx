// app/profile/components/ProfileHero.jsx
"use client";

import { 
  FaUserPlus, 
  FaUserCheck, 
  FaComment, 
  FaCamera, 
  FaEdit, 
  FaShareAlt,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe
} from "react-icons/fa";

export default function ProfileHero({
  userData,
  isOwnProfile,
  isFollowing,
  setIsFollowing,
  onEditClick,
  onShareClick,
}) {
  const socialLinks = [
    { icon: FaGlobe, label: "Website", url: userData.socialLinks?.website || "#" },
    { icon: FaTwitter, label: "Twitter", url: userData.socialLinks?.twitter || "#" },
    { icon: FaLinkedin, label: "LinkedIn", url: userData.socialLinks?.linkedin || "#" },
    { icon: FaGithub, label: "GitHub", url: userData.socialLinks?.github || "#" },
  ];

  return (
    <div className="relative bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
      {/* Corner brackets */}
      <span className="hidden sm:block absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#F5A623]/40 rounded-tl-sm" />
      <span className="hidden sm:block absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#F5A623]/40 rounded-tr-sm" />
      <span className="hidden sm:block absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#F5A623]/40 rounded-bl-sm" />
      <span className="hidden sm:block absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#F5A623]/40 rounded-br-sm" />

      <div className="p-5 sm:p-7">
        {/* Top row: label + avatar */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
              {userData.role || "Student"}
            </span>
            <span className="w-6 h-px bg-[#262626]" />
            <span className="text-[9px] text-[#A3A3A3] font-medium">
              {userData.location || "Mumbai, India"}
            </span>
          </div>

          <div className="relative shrink-0">
            <div className="w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] rounded-xl overflow-hidden border border-[#262626]">
              <img
                src={userData.profilePicture}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isOwnProfile && (
              <button className="absolute -bottom-1 -right-1 bg-[#F5A623] border-2 border-[#161616] rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-[#0A0A0A] transition-transform hover:scale-110">
                <FaCamera size={11} />
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <h1 className="text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight text-[#F5F5F5] m-0">
            {userData.name.split(" ")[0]}
            <br />
            {userData.name.split(" ").slice(1).join(" ")}
          </h1>
        </div>

        {/* Bio */}
        {userData.bio && (
          <p className="text-[13px] sm:text-[14px] text-[#A3A3A3] leading-relaxed max-w-[500px] m-0 mb-4">
            {userData.bio}
          </p>
        )}

        {/* Stats - Minimal */}
        <div className="flex items-center gap-6 sm:gap-8 mb-4 flex-wrap">
          {[
            { label: "Products", value: userData.stats?.products || 0 },
            { label: "Sold", value: userData.stats?.sold || 0 },
            { label: "Followers", value: userData.stats?.followers || 0 },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center gap-6 sm:gap-8">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-semibold text-[#F5F5F5]">{s.value}</span>
                <span className="text-[9px] text-[#A3A3A3] font-medium uppercase tracking-[0.3px]">
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 && <div className="w-px h-6 bg-[#262626]" />}
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mb-4 pt-3 border-t border-[#262626]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[9px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
              Connect
            </span>
            <span className="w-6 h-px bg-[#262626]" />
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#A3A3A3] hover:text-[#F5F5F5] transition-all duration-300 group"
                >
                  <Icon size={14} className="group-hover:text-[#F5A623] transition-colors" />
                  <span className="text-[11px] font-medium hidden sm:inline">
                    {social.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        {isOwnProfile ? (
          <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 active:scale-95"
              onClick={onEditClick}
            >
              <FaEdit size={14} />
              Edit Profile
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#262626] bg-[#111111] text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#262626] hover:text-[#F5F5F5]"
              onClick={onShareClick}
            >
              <FaShareAlt size={14} />
              Share
            </button>
          </div>
        ) : (
          <div className="flex gap-2.5 flex-wrap pt-1 border-t border-[#262626]">
            <button
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full border-none font-semibold text-[12px] cursor-pointer transition-all ${
                isFollowing
                  ? "bg-[#111111] text-[#A3A3A3] border border-[#262626]"
                  : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
              }`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? <FaUserCheck size={14} /> : <FaUserPlus size={14} />}
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2 rounded-full border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold text-[12px] cursor-pointer transition-all hover:bg-[#111111] hover:text-[#F5F5F5]">
              <FaComment size={14} />
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}