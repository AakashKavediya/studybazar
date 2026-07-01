// components/profile/ProfileSocialLinks.jsx
"use client";

export default function ProfileSocialLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="mb-4 pt-3 border-t border-[#262626]">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[9px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
          Connect
        </span>
        <span className="w-6 h-px bg-[#262626]" />
        {links.map((social, index) => {
          const Icon = social.icon;
          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#A3A3A3] hover:text-[#F5F5F5] transition-all duration-300 group"
              aria-label={social.label}
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
  );
}