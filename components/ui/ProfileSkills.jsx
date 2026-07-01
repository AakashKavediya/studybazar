// components/profile/ProfileSkills.jsx
"use client";

export default function ProfileSkills({ skills }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-semibold tracking-[0.2em] text-[#A3A3A3] uppercase">
          Skills
        </span>
        <span className="w-6 h-px bg-[#262626]" />
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 text-[10px] font-medium text-[#A3A3A3] border border-[#262626] rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}