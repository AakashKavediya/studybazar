// app/profile/components/ProfileInfo.jsx
"use client";

import { 
  FaEnvelope, 
  FaPhone, 
  FaGraduationCap, 
  FaBook, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaChevronRight
} from "react-icons/fa";

export default function ProfileInfo({ userData }) {
  const linkItems = [
    { icon: FaEnvelope, label: "Email", value: userData.email, href: `mailto:${userData.email}` },
    { icon: FaPhone, label: "Phone", value: userData.phone, href: `tel:${userData.phone}` },
    { icon: FaGraduationCap, label: "College", value: userData.college },
    { icon: FaBook, label: "Branch", value: userData.branch },
    { icon: FaCalendarAlt, label: "Year", value: userData.year },
    { icon: FaMapMarkerAlt, label: "City", value: userData.city },
  ];

  return (
    <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
      <div className="flex items-stretch">
        {/* Side rail */}
        <div className="hidden sm:flex flex-col items-center justify-center w-[44px] bg-[#111111] border-r border-[#262626] shrink-0">
          <span
            className="text-[9px] font-medium tracking-[0.25em] text-[#A3A3A3] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Info
          </span>
        </div>

        {/* List */}
        <div className="flex-1 px-4 sm:px-5 py-1">
          {linkItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === linkItems.length - 1;
            const content = (
              <div
                className={`flex items-center justify-between gap-3 py-3 ${
                  !isLast ? "border-b border-[#262626]" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={14} className="text-[#A3A3A3] shrink-0" />
                  <span className="text-[12px] text-[#A3A3A3] font-light tracking-wide shrink-0">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[13px] text-[#F5F5F5] font-light truncate text-right">
                    {item.value}
                  </span>
                  {item.href && <FaChevronRight size={10} className="text-[#3A3A3A] shrink-0" />}
                </div>
              </div>
            );

            return item.href ? (
              <a key={item.label} href={item.href} className="block hover:opacity-80 transition-opacity">
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}