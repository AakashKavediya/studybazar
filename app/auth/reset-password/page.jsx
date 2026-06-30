// app/auth/reset-password/page.jsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import PasswordStrength from "@/components/ui/PasswordStrength";
import { Button } from "@/components/ui/Button";

// Main component with the logic
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== form.password) return "Passwords don't match";
    return null;
  };

  const getError = (field) => {
    if (field === "password") return validatePassword(form.password);
    if (field === "confirmPassword") return validateConfirmPassword(form.confirmPassword);
    return null;
  };

  const isFormValid = () => {
    return !validatePassword(form.password) && !validateConfirmPassword(form.confirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setTouched({ password: true, confirmPassword: true });
    
    if (!isFormValid() || !token) return;
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://diplomatic-mindfulness-production-621b.up.railway.app/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        setError(data.message || data.detail || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid token screen
  if (!isTokenValid) {
    return (
      <Card>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: COLORS.error, 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px" 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: COLORS.textPrimary }}>
            Invalid link
          </h2>
          <p style={{ color: COLORS.textSecondary, marginBottom: "28px" }}>
            This password reset link is invalid or has expired.
          </p>
          <Link href="/auth/forgot-password">
            <Button variant="secondary">Request new link</Button>
          </Link>
        </div>
      </Card>
    );
  }

  // Success screen
  if (isSubmitted) {
    return (
      <Card>
        <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease", padding: "20px 0" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            background: COLORS.success, 
            borderRadius: "50%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 24px" 
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "12px", color: COLORS.textPrimary }}>
            Password reset!
          </h2>
          <p style={{ color: COLORS.textSecondary, marginBottom: "8px" }}>
            Your password has been successfully reset.
          </p>
          <p style={{ color: COLORS.textMuted, fontSize: "14px" }}>
            Redirecting to sign in...
          </p>
        </div>
      </Card>
    );
  }

  // Main form
  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .field-group { margin-bottom: 20px; }
        .btn-primary { 
          width: 100%; 
          background: ${COLORS.primary}; 
          border: none; 
          border-radius: 14px; 
          padding: 14px 20px; 
          font-weight: 600; 
          font-size: 17px; 
          color: ${COLORS.background}; 
          cursor: pointer; 
          transition: all 0.2s; 
          margin-top: 8px; 
        }
        .btn-primary:hover:not(:disabled) { 
          opacity: 0.9; 
          transform: scale(0.98); 
        }
        .btn-primary:disabled { 
          opacity: 0.5; 
          cursor: not-allowed; 
        }
        .spinner { 
          animation: spin 0.8s linear infinite; 
          display: inline-block; 
        }
        .api-error { 
          background: rgba(239, 68, 68, 0.1); 
          border: 1px solid ${COLORS.error}; 
          border-radius: 12px; 
          padding: 12px 16px; 
          margin-bottom: 20px; 
          font-size: 13px; 
          color: ${COLORS.error}; 
          text-align: center; 
        }
      `}</style>

      <Card>
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "8px", color: COLORS.textPrimary }}>
              Create new password
            </h1>
            <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
              Your new password must be different from previous ones
            </p>
          </div>

          {error && <div className="api-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <Field
              label="New password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              error={getError("password")}
              touched={touched.password}
              autoComplete="new-password"
              hint="Use uppercase, numbers & symbols"
            />
            
            <PasswordStrength password={form.password} />
            
            <Field
              label="Confirm new password"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              onBlur={() => setTouched((p) => ({ ...p, confirmPassword: true }))}
              error={getError("confirmPassword")}
              touched={touched.confirmPassword}
              autoComplete="new-password"
            />

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="spinner">⌛</span> Resetting...
                </span>
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "28px", fontSize: "15px", color: COLORS.textSecondary }}>
            <Link href="/auth/signin" style={{ color: COLORS.primary, fontWeight: "600", textDecoration: "none" }}>
              Back to sign in
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}

// Main exported component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        background: COLORS.background, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        color: COLORS.textPrimary,
        fontSize: "16px"
      }}>
        Loading...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}