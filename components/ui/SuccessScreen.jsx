// components/SuccessScreen.jsx
import { COLORS } from "@/constants/colors";
import { CheckIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

export default function SuccessScreen({ name, email, onReset }) {
  const firstName = name.split(" ")[0] || "there";
  
  return (
    <div className="success-screen">
      <div className="success-circle">
        <CheckIcon size={36} color="#FFFFFF" />
      </div>
      <h1 style={{ fontSize: "32px", marginBottom: "8px", color: COLORS.textPrimary }}>
        Welcome, {firstName}
      </h1>
      <p style={{ fontSize: "17px", color: COLORS.textSecondary, marginBottom: "6px" }}>
        Your account has been created
      </p>
      <p style={{ fontWeight: 600, color: COLORS.primary, fontSize: "17px", marginBottom: "28px" }}>
        {email}
      </p>
      <p style={{ fontSize: "14px", color: COLORS.textMuted }}>Check your email to verify your account</p>
      <Button variant="secondary" onClick={onReset} style={{ marginTop: "36px" }}>
        Create another account
      </Button>
    </div>
  );
}