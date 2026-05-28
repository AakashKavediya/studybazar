// components/StepIndicator.jsx
import { COLORS } from "@/constants/colors";

export default function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "28px", marginTop: "8px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "3px",
            borderRadius: "20px",
            flex: i === current ? 2.5 : 1,
            backgroundColor: i <= current ? COLORS.primary : COLORS.border,
            opacity: i < current ? 0.5 : 1,
            transition: "all 0.25s cubic-bezier(0.25, 0.1, 0.2, 1)",
          }}
        />
      ))}
    </div>
  );
}