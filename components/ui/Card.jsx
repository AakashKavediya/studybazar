// components/Card.jsx
import { COLORS } from "@/constants/colors";
import { LogoIcon } from "@/components/ui/Icons";

export default function Card({ children }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: COLORS.background, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "24px 20px" 
    }}>
      <div style={{ 
        maxWidth: "500px", 
        width: "100%", 
        background: COLORS.card, 
        borderRadius: "44px", 
        boxShadow: "0 8px 28px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.05)", 
        overflow: "hidden" 
      }}>
        <div style={{ padding: "32px 28px 40px" }}>
          <div style={{ 
            width: "52px", 
            height: "52px", 
            background: COLORS.primary, 
            borderRadius: "14px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            marginBottom: "28px", 
            boxShadow: "0 6px 12px rgba(255,255,255,0.1)" 
          }}>
            <LogoIcon />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}