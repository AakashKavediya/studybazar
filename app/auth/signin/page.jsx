
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { COLORS } from "@/constants/colors";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import { Button, GoogleButton } from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons";

export default function SigninPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setApiError("");
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    return null;
  };

  const getError = (field) => {
    if (field === "email") return validateEmail(form.email);
    if (field === "password") return validatePassword(form.password);
    return null;
  };

  const isFormValid = () => {
    return !validateEmail(form.email) && !validatePassword(form.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Touch all fields
    setTouched({ email: true, password: true });
    
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setApiError("");

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    console.log("Login payload:", payload);

    try {
      const response = await fetch("https://studybazaar.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Raw Response:", responseText);

      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("JSON Parse Error:", err);
      }

      console.log("Parsed Response:", data);

      if (response.ok) {
        // Store token if returned
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          if (rememberMe) {
            localStorage.setItem("remember_me", "true");
          }
        }
        
        // Store user info
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        
        // Redirect to dashboard or home
        router.push("/");
      } else {
        if (data.detail) {
          if (Array.isArray(data.detail)) {
            const firstError = data.detail[0];
            setApiError(firstError.msg || "Login failed");
          } else if (typeof data.detail === "string") {
            setApiError(data.detail);
          } else {
            setApiError("Invalid email or password");
          }
        } else {
          setApiError(data.message || data.error || "Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google OAuth
    window.location.href = "https://studybazaar.onrender.com/auth/google";
  };

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
        .label { font-size: 13px; font-weight: 500; margin-bottom: 6px; transition: color 0.2s ease; color: ${COLORS.textSecondary}; }
        .input-wrapper { position: relative; width: 100%; }
        .input-field { width: 100%; padding: 14px 16px; font-size: 17px; border: 1.5px solid ${COLORS.border}; border-radius: 14px; transition: all 0.2s ease; outline: none; background: ${COLORS.inputBg}; color: ${COLORS.textPrimary}; }
        .input-field:focus { border-color: ${COLORS.borderFocus}; box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08); }
        .input-field.error { border-color: ${COLORS.error}; }
        .toggle-pw { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: ${COLORS.textMuted}; cursor: pointer; padding: 6px; }
        .toggle-pw:hover { color: ${COLORS.primary}; }
        .hint-message { font-size: 12px; margin-top: 6px; margin-left: 6px; display: flex; align-items: center; gap: 5px; }
        .error-message { color: ${COLORS.error}; font-weight: 500; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 20px; }
        .divider-line { flex: 1; height: 0.5px; background: ${COLORS.border}; }
        .divider-text { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; color: ${COLORS.textMuted}; }
        .google-btn { width: 100%; background: ${COLORS.inputBg}; border: 1.5px solid ${COLORS.border}; border-radius: 14px; padding: 12px 16px; font-weight: 600; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; color: ${COLORS.textPrimary}; }
        .google-btn:hover { background: ${COLORS.secondaryBg}; border-color: ${COLORS.primary}; }
        .checkbox-row { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 24px; }
        .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; color: ${COLORS.textSecondary}; }
        .checkbox-custom { width: 18px; height: 18px; border: 1.5px solid ${COLORS.border}; border-radius: 5px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; background: ${COLORS.inputBg}; }
        .checkbox-custom.checked { background: ${COLORS.primary}; border-color: ${COLORS.primary}; }
        .forgot-link { font-size: 14px; color: ${COLORS.primary}; text-decoration: none; font-weight: 500; }
        .forgot-link:hover { text-decoration: underline; }
        .button-group { margin-top: 8px; }
        .btn-primary { width: 100%; background: ${COLORS.primary}; border: none; border-radius: 14px; padding: 14px 20px; font-weight: 600; font-size: 17px; color: ${COLORS.background}; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: scale(0.98); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
        .api-error { background: rgba(239, 68, 68, 0.1); border: 1px solid ${COLORS.error}; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: ${COLORS.error}; text-align: center; animation: fadeIn 0.3s ease; }
        .footer-text { text-align: center; margin-top: 28px; font-size: 15px; color: ${COLORS.textSecondary}; }
        .footer-link { color: ${COLORS.primary}; font-weight: 600; text-decoration: none; }
        .footer-link:hover { text-decoration: underline; }
      `}</style>

      <Card>
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "8px", color: COLORS.textPrimary }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "16px", color: COLORS.textSecondary }}>
              Sign in to your account
            </p>
          </div>

          {apiError && <div className="api-error">{apiError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <div className="label">Email</div>
              <div className="input-wrapper">
                <input
                  type="email"
                  placeholder="hello@university.edu"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  className={`input-field ${touched.email && getError("email") ? "error" : ""}`}
                  autoComplete="email"
                />
              </div>
              <div className="hint-message">
                {touched.email && getError("email") && (
                  <span className="error-message">{getError("email")}</span>
                )}
              </div>
            </div>

            <div className="field-group">
              <div className="label">Password</div>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  className={`input-field ${touched.password && getError("password") ? "error" : ""}`}
                  autoComplete="current-password"
                  style={{ paddingRight: "44px" }}
                />
                <button
                  type="button"
                  className="toggle-pw"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <div className="hint-message">
                {touched.password && getError("password") && (
                  <span className="error-message">{getError("password")}</span>
                )}
              </div>
            </div>

            <div className="checkbox-row">
              <label className="checkbox-label" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`checkbox-custom ${rememberMe ? "checked" : ""}`}>
                  {rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#141414" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span>Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <div className="button-group">
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <span className="spinner">⌛</span> Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <GoogleButton onClick={handleGoogleLogin} />

          <div className="footer-text">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="footer-link">
              Sign up
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}