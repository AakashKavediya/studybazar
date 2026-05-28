"use client";

// components/Button.jsx
import { COLORS } from "@/constants/colors";
import { GoogleIcon } from "@/components/ui/Icons";

export const Button = ({ 
  children, 
  onClick, 
  variant = "primary", 
  disabled = false,
  loading = false,
  type = "button",
  className = ""
}) => {
  const isPrimary = variant === "primary";
  
  const baseStyles = {
    padding: "14px 20px",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "17px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.2s",
    border: "none",
    flex: isPrimary ? 2 : 1,
  };
  
  const variantStyles = isPrimary 
    ? {
        background: COLORS.primary,
        color: COLORS.background,
        opacity: disabled || loading ? 0.5 : 1,
      }
    : {
        background: COLORS.secondaryBg,
        border: `1.5px solid ${COLORS.border}`,
        color: COLORS.textSecondary,
      };
  
  const handleClick = () => {
    if (!disabled && !loading && onClick) onClick();
  };
  
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`btn-${variant} ${className}`}
      style={{ ...baseStyles, ...variantStyles }}
      disabled={disabled || loading}
    >
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <span className="spinner">⌛</span> Creating...
        </span>
      ) : children}
    </button>
  );
};

export const GoogleButton = ({ onClick }) => (
  <button onClick={onClick} className="google-btn">
    <GoogleIcon /> Continue with Google
  </button>
);