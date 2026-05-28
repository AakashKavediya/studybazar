// app/page.jsx
"use client";

import { useState, useCallback } from "react";
import { COLORS } from "@/constants/colors";
import { validate, STEPS } from "@/utils/validation";
import Card from "@/components/ui/Card";
import Field from "@/components/ui/Field";
import PasswordStrength from "@/components/ui/PasswordStrength";
import StepIndicator from "@/components/ui/StepIndicator";
import { Button, GoogleButton } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import SuccessScreen from "@/components/ui/SuccessScreen";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", campus: "", year: "", pass: "", confirm: "",
  });
  const [touched, setTouched] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1);
  const [animate, setAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setApiError("");
  }, []);

  const getError = useCallback((field) => {
    const validator = validate[field];
    return validator ? validator(form[field], form) : null;
  }, [form]);

  const isStepValid = STEPS[step].fields.every((f) => !getError(f));

  const touchAllStepFields = () => {
    const updates = {};
    STEPS[step].fields.forEach((f) => (updates[f] = true));
    setTouched((prev) => ({ ...prev, ...updates }));
  };

  
const submitToBackend = async () => {
  setIsLoading(true);
  setApiError("");

  // Safe cleaned values
  const cleanedYear = Number(form.year);
  const cleanedPhone = form.phone.replace(/\D/g, "");

  // Frontend validation before API call
  if (!form.name.trim()) {
    setApiError("Name is required");
    setIsLoading(false);
    return;
  }

  if (!form.email.trim()) {
    setApiError("Email is required");
    setIsLoading(false);
    return;
  }

  if (!form.pass) {
    setApiError("Password is required");
    setIsLoading(false);
    return;
  }

  if (form.pass !== form.confirm) {
    setApiError("Passwords do not match");
    setIsLoading(false);
    return;
  }

  if (!form.campus.trim()) {
    setApiError("Campus is required");
    setIsLoading(false);
    return;
  }

  if (!cleanedPhone) {
    setApiError("Phone number is required");
    setIsLoading(false);
    return;
  }

  if (isNaN(cleanedYear)) {
    setApiError("Please enter a valid academic year");
    setIsLoading(false);
    return;
  }

  // Final payload
  const payload = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.pass.trim(),
    confirm_password: form.confirm.trim(),
    campus: form.campus.trim(),
    phone: cleanedPhone,
    year: cleanedYear,
  };

  console.log("Payload:", payload);

  try {
    const response = await fetch(
      "https://studybazaar.onrender.com/auth/signup",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      }
    );

    // Read raw response first
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
      setIsComplete(true);
    } else {
      // FastAPI validation errors
      if (data.detail && Array.isArray(data.detail)) {
        const firstError = data.detail[0];

        setApiError(
          firstError.msg || "Validation failed"
        );
      } else {
        setApiError(
          data.message ||
          data.error ||
          "Signup failed. Please try again."
        );
      }
    }
  } catch (error) {
    console.error(error);

    setApiError(
      "Network error. Please check your connection and try again."
    );
  } finally {
    setIsLoading(false);
  }
};

  const handleNext = () => {
    touchAllStepFields();
    if (!isStepValid) return;
    
    if (step < STEPS.length - 1) {
      setDirection(1);
      setAnimate(true);
      setTimeout(() => { setStep((s) => s + 1); setAnimate(false); }, 140);
    } else {
      if (!termsAccepted) { setApiError("Please accept the Terms & Conditions"); return; }
      submitToBackend();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setAnimate(true);
      setTimeout(() => { setStep((s) => s - 1); setAnimate(false); }, 140);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", campus: "", year: "", pass: "", confirm: "" });
    setTouched({});
    setTermsAccepted(false);
    setStep(0);
    setIsComplete(false);
    setApiError("");
  };

  if (isComplete) {
    return (
      <Card>
        <SuccessScreen name={form.name} email={form.email} onReset={resetForm} />
      </Card>
    );
  }

  const currentStepData = STEPS[step];
  const formContent = (
    <div style={{ animation: animate ? (direction > 0 ? "slideRight 0.28s ease" : "slideLeft 0.28s ease") : "none" }}>
      {step === 0 && (
        <>
          <Field label="Full Name" placeholder="Aakash Kavediya" value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            error={getError("name")} touched={touched.name} autoComplete="name" />
          
          <Field label="Email" type="email" placeholder="aakash@university.edu" value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            error={getError("email")} touched={touched.email} autoComplete="email" />
          
          <div className="divider">
            <div className="divider-line" style={{ backgroundColor: COLORS.border }} />
            <span className="divider-text" style={{ color: COLORS.textMuted }}>or</span>
            <div className="divider-line" style={{ backgroundColor: COLORS.border }} />
          </div>
          
          <GoogleButton onClick={() => alert("Google sign-up")} />
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Phone number" type="tel" placeholder="9619688218" value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={getError("phone")} touched={touched.phone} autoComplete="tel" inputMode="tel" />
          
          <Field label="Campus" placeholder="KJ Somaiya" value={form.campus}
            onChange={(e) => updateField("campus", e.target.value)}
            error={getError("campus")} touched={touched.campus} autoComplete="organization" />
          
          <Field label="Academic year" type="number" placeholder="1 – 5" value={form.year}
            onChange={(e) => updateField("year", e.target.value)}
            error={getError("year")} touched={touched.year} hint="Enter 1 for freshman, 5 for senior" inputMode="numeric" />
        </>
      )}

      {step === 2 && (
        <>
          <Field label="Password" type="password" placeholder="Min. 8 characters" value={form.pass}
            onChange={(e) => updateField("pass", e.target.value)}
            error={getError("pass")} touched={touched.pass} autoComplete="new-password" hint="Use uppercase, numbers & symbols" />
          
          <PasswordStrength password={form.pass} />
          
          <Field label="Confirm password" type="password" placeholder="Re-enter password" value={form.confirm}
            onChange={(e) => updateField("confirm", e.target.value)}
            error={getError("confirm")} touched={touched.confirm} autoComplete="new-password" />
          
          <div className="terms-row" onClick={() => setTermsAccepted((t) => !t)}>
            <div className={`checkbox-custom ${termsAccepted ? "checked" : ""}`} style={{ 
              borderColor: termsAccepted ? COLORS.primary : COLORS.border, 
              backgroundColor: termsAccepted ? COLORS.primary : COLORS.inputBg 
            }}>
              {termsAccepted && <CheckIcon size={12} color="#141414" />}
            </div>
            <div className="terms-text" style={{ color: COLORS.textSecondary }}>
              I agree to the <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>Terms</a> and <a href="#" className="terms-link" onClick={(e) => e.stopPropagation()}>Privacy</a>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes slideRight { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { background: ${COLORS.background}; font-family: -apple-system, 'SF Pro Text', system-ui, sans-serif; }
        
        .field-group { margin-bottom: 20px; }
        .label { font-size: 13px; font-weight: 500; margin-bottom: 6px; transition: color 0.2s ease; }
        .input-wrapper { position: relative; width: 100%; }
        .input-field { width: 100%; padding: 14px 16px; font-size: 17px; border: 1.5px solid; border-radius: 14px; transition: all 0.2s ease; outline: none; }
        .input-field:focus { box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.08); }
        .toggle-pw { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; color: ${COLORS.textMuted}; cursor: pointer; padding: 6px; }
        .toggle-pw:hover { color: ${COLORS.primary}; }
        .valid-check { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .hint-message { font-size: 12px; margin-top: 6px; margin-left: 6px; display: flex; align-items: center; gap: 5px; }
        .error-message { color: ${COLORS.error}; font-weight: 500; }
        .strength-meter { margin-top: 4px; margin-bottom: 12px; }
        .strength-bars { display: flex; gap: 6px; margin-bottom: 6px; }
        .strength-bar { flex: 1; height: 4px; border-radius: 8px; transition: background 0.2s; }
        .strength-text { font-size: 11px; font-weight: 500; }
        .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0 18px; }
        .divider-line { flex: 1; height: 0.5px; }
        .divider-text { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.3px; }
        .google-btn { width: 100%; background: ${COLORS.inputBg}; border: 1.5px solid ${COLORS.border}; border-radius: 14px; padding: 12px 16px; font-weight: 600; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.2s; color: ${COLORS.textPrimary}; }
        .google-btn:hover { background: ${COLORS.secondaryBg}; border-color: ${COLORS.primary}; }
        .terms-row { display: flex; align-items: flex-start; gap: 12px; margin: 16px 0 12px; cursor: pointer; }
        .checkbox-custom { width: 22px; height: 22px; border: 1.5px solid; border-radius: 7px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; margin-top: -1px; }
        .terms-link { font-weight: 600; text-decoration: none; color: ${COLORS.primary}; }
        .button-group { display: flex; gap: 12px; margin-top: 24px; }
        .spinner { animation: spin 0.8s linear infinite; display: inline-block; }
        .success-screen { text-align: center; padding: 20px 0; animation: fadeUp 0.4s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .success-circle { width: 80px; height: 80px; background: linear-gradient(135deg, ${COLORS.success}, #15803d); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .api-error { background: rgba(239, 68, 68, 0.1); border: 1px solid ${COLORS.error}; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: ${COLORS.error}; text-align: center; }
      `}</style>

      <Card>
        <h1 style={{ fontSize: "34px", fontWeight: "700", letterSpacing: "-0.5px", marginBottom: "6px", color: COLORS.textPrimary }}>
          {currentStepData.title}
        </h1>
        <p style={{ fontSize: "16px", color: COLORS.textSecondary, marginBottom: "20px" }}>
          {currentStepData.subtitle}
        </p>

        <StepIndicator current={step} total={STEPS.length} />
        
        {apiError && <div className="api-error">{apiError}</div>}
        {formContent}

        <div className="button-group">
          {step > 0 && <Button variant="secondary" onClick={handleBack}>← Back</Button>}
          <Button onClick={handleNext} loading={isLoading} disabled={step === 2 && !termsAccepted}>
            {step < STEPS.length - 1 ? "Continue →" : "Create Account"}
          </Button>
        </div>

        <div style={{ textAlign: "center", marginTop: "28px", fontSize: "15px", color: COLORS.textSecondary }}>
          Already have an account? <Link href="/auth/signin" style={{ color: COLORS.primary, fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>Sign In</Link>
        </div>
      </Card>
    </>
  );
}