// components/ui/PasswordStrengthIndicator.jsx
"use client";

import { Check } from "lucide-react";

const requirements = [
  { key: 'length', label: '8+ characters' },
  { key: 'uppercase', label: 'Uppercase' },
  { key: 'lowercase', label: 'Lowercase' },
  { key: 'digit', label: 'Number' },
  { key: 'special', label: 'Special char' },
];

export default function PasswordStrengthIndicator({ password, strength }) {
  if (!password) return null;

  const { score, label, color, checks } = strength;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-[#262626] rounded-full overflow-hidden flex gap-0.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`flex-1 h-full rounded-full transition-all duration-300 ${
                level <= score ? "opacity-100" : "opacity-20"
              }`}
              style={{
                backgroundColor: level <= score ? color : "#262626",
              }}
            />
          ))}
        </div>
        {label && (
          <span className="text-[11px] font-medium whitespace-nowrap" style={{ color }}>
            {label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-1.5 text-[10px]">
            {checks[req.key] ? (
              <Check size={12} className="text-green-500 flex-shrink-0" />
            ) : (
              <div className="w-3 h-3 border border-[#262626] rounded-full flex-shrink-0" />
            )}
            <span className={checks[req.key] ? "text-[#A3A3A3]" : "text-[#666666]"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}