// app/profile/components/ProfileInfo.jsx
"use client";

import { useMemo } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaGraduationCap, 
  FaBook, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaChevronRight,
  FaUserTag,
  FaCode
} from "react-icons/fa";

// Helper functions moved outside component to prevent recreation
function getOrdinalSuffix(n) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  if (n >= 4 && n <= 20) return "th";
  const lastDigit = n % 10;
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}

function getRole(userData) {
  if (userData?.year && userData?.campus) {
    return `${userData.year}${getOrdinalSuffix(userData.year)} Year Student`;
  }
  if (userData?.campus) {
    return "Student";
  }
  return "Student";
}

function ProfileInfo({ userData }) {
  // Memoize link items to prevent recreation on every render
  const linkItems = useMemo(() => [
    { 
      icon: FaEnvelope, 
      label: "Email", 
      value: userData?.email || "Not provided", 
      href: userData?.email ? `mailto:${userData.email}` : null 
    },
    { 
      icon: FaPhone, 
      label: "Phone", 
      value: userData?.phone || "Not provided", 
      href: userData?.phone ? `tel:${userData.phone}` : null 
    },
    { 
      icon: FaGraduationCap, 
      label: "Campus", 
      value: userData?.campus || "Not specified" 
    },
    { 
      icon: FaBook, 
      label: "Branch", 
      value: userData?.branch || "Not specified" 
    },
    { 
      icon: FaCalendarAlt, 
      label: "Year", 
      value: userData?.year ? `${userData.year}${getOrdinalSuffix(userData.year)} Year` : "Not specified" 
    },
    { 
      icon: FaUserTag, 
      label: "Role", 
      value: getRole(userData) 
    },
  ], [userData]);

  // Memoize filtered items to prevent recreation
  const filteredItems = useMemo(() => {
    return linkItems.filter(item => {
      // Always show email and role
      if (item.label === "Email") return true;
      if (item.label === "Role") return true;
      // Show other items only if they have a value
      return item.value && item.value !== "Not specified" && item.value !== "Not provided";
    });
  }, [linkItems]);

  // Memoize empty state
  const isEmpty = useMemo(() => filteredItems.length === 0, [filteredItems]);

  // Memoize user data for display
  const userEmail = useMemo(() => userData?.email || "", [userData?.email]);

  // If no items to show, display a message
  if (isEmpty) {
    return (
      <div className="bg-[#161616] border border-[#262626] rounded-2xl overflow-hidden mb-4">
        <div className="px-5 sm:px-6 py-4 text-center">
          <p className="text-[13px] text-[#A3A3A3]">No profile information available</p>
        </div>
      </div>
    );
  }

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
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === filteredItems.length - 1;
            const isClickable = !!item.href;
            const isEmptyValue = item.value === "Not provided" || item.value === "Not specified";
            
            const content = (
              <div
                className={`flex items-center justify-between gap-3 py-3 ${
                  !isLast ? "border-b border-[#262626]" : ""
                } ${isClickable ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={14} className="text-[#A3A3A3] shrink-0" />
                  <span className="text-[12px] text-[#A3A3A3] font-light tracking-wide shrink-0">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[13px] font-light truncate text-right ${
                    isEmptyValue ? "text-[#666666]" : "text-[#F5F5F5]"
                  }`}>
                    {item.value}
                  </span>
                  {isClickable && (
                    <FaChevronRight size={10} className="text-[#3A3A3A] shrink-0" />
                  )}
                </div>
              </div>
            );

            // If clickable, wrap in anchor tag
            if (isClickable) {
              const isEmail = item.label === "Email";
              return (
                <a 
                  key={item.label} 
                  href={item.href} 
                  className="block hover:opacity-80 transition-opacity"
                  target={isEmail ? "_blank" : undefined}
                  rel={isEmail ? "noopener noreferrer" : undefined}
                  aria-label={`${item.label}: ${item.value}`}
                >
                  {content}
                </a>
              );
            }

            return <div key={item.label}>{content}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;