// app/auth/forgot-password/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { COLORS } from "@/constants/colors";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://studybazaar.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || data.detail || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Check your email
          </h2>
          <p style={{ color: COLORS.textSecondary, marginBottom: "8px" }}>
            We sent a password reset link to
          </p>
          <p style={{ color: COLORS.primary, fontWeight: "600", marginBottom: "28px" }}>
            {email}
          </p>
          <Link href="/auth/signin">
            <Button variant="secondary">Back to Sign In</Button>
          </Link>
        </div>
      </Card>
    );
  }

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
        
        .field-group { margin-bottom: 24px; }
        .label { font-size: 13px; font-weight: 500; margin-bottom: 6px; color: ${COLORS.textSecondary}; }
        .input-field { width: 100%; padding: 14px 16px; font-size: 17px; border: 1.5px solid ${COLORS.border}; border-radius: 14px; background: ${COLORS.inputBg}; color: ${COLORS.textPrimary}; outline: none; transition: all 0.2s; }
        .input-field:focus { border-color: ${COLORS.borderFocus}; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08); }
        .input-field.error { border-color: ${COLORS.error}; }
        .error-message { font-size: 12px; color: ${COLORS.error}; margin-top: 6px; margin-left: 6px; }
        .btn-primary { width: 100%; background: ${COLORS.primary}; border: none; border-radius: 14px; padding: 14px 20px; font-weight: 600; font-size: 17px; color: ${COLORS.background}; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
        .footer-text { text-align: center; margin-top: 28px; font-size: 15px; color: ${COLORS.textSecondary}; }
        .footer-link { color: ${COLORS.primary}; font-weight: 600; text-decoration: none; }
      `}</style>

      <Card>
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "8px", color: COLORS.textPrimary }}>
              Reset password
            </h1>
            <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
              Enter your email to receive a reset link
            </p>
          </div>

          {error && (
            <div style={{ 
              background: "rgba(239, 68, 68, 0.1)", 
              border: `1px solid ${COLORS.error}`, 
              borderRadius: "12px", 
              padding: "12px 16px", 
              marginBottom: "20px", 
              fontSize: "13px", 
              color: COLORS.error, 
              textAlign: "center" 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <div className="label">Email address</div>
              <input
                type="email"
                placeholder="hello@university.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="input-field"
                autoComplete="email"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="spinner">⌛</span> Sending...
                </span>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <div className="footer-text">
            Remember your password?{" "}
            <Link href="/auth/signin" className="footer-link">
              Sign in
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}