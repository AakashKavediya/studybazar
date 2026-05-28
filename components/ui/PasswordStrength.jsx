// components/PasswordStrength.jsx
import { COLORS } from "@/constants/colors";
import { getPasswordStrength } from "@/utils/validation";

export default function PasswordStrength({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="strength-meter">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="strength-bar"
            style={{ backgroundColor: i <= score ? color : COLORS.border }}
          />
        ))}
      </div>
      <span className="strength-text" style={{ color }}>
        {label} password
      </span>
    </div>
  );
}