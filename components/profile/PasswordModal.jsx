// app/profile/components/PasswordModal.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import PasswordInput from "@/components/ui/PasswordInput";
import PasswordStrengthIndicator from "@/components/ui/PasswordStrengthIndicator";
import ModalHeader from "@/components/ui/ModalHeader";
import ActionButtons from "@/components/ui/ActionButtons";

// Password strength checks
const passwordChecks = {
  length: (pwd) => pwd.length >= 8,
  uppercase: (pwd) => /[A-Z]/.test(pwd),
  lowercase: (pwd) => /[a-z]/.test(pwd),
  digit: (pwd) => /[0-9]/.test(pwd),
  special: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
};

const strengthMap = {
  1: { score: 1, label: "Weak", color: "#EF4444" },
  2: { score: 2, label: "Fair", color: "#FB923C" },
  3: { score: 3, label: "Good", color: "#FACC15" },
  4: { score: 4, label: "Strong", color: "#22C55E" },
  5: { score: 4, label: "Strong", color: "#22C55E" },
};

export default function PasswordModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const pwd = formData.newPassword;
    if (!pwd) {
      return { score: 0, label: "", color: "", checks: {} };
    }

    const checks = {
      length: passwordChecks.length(pwd),
      uppercase: passwordChecks.uppercase(pwd),
      lowercase: passwordChecks.lowercase(pwd),
      digit: passwordChecks.digit(pwd),
      special: passwordChecks.special(pwd),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    const result = strengthMap[Math.min(Math.max(passed, 1), 5)] || strengthMap[1];
    return { ...result, checks };
  }, [formData.newPassword]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setTouched({});
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    }
  }, [isOpen]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      if (!passwordChecks.length(newPassword)) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!passwordChecks.uppercase(newPassword)) {
        newErrors.newPassword = "Password must contain an uppercase letter";
      } else if (!passwordChecks.digit(newPassword)) {
        newErrors.newPassword = "Password must contain a digit";
      } else if (!passwordChecks.special(newPassword)) {
        newErrors.newPassword = "Password must contain a special character";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) return;

    onConfirm({
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
      confirm_password: formData.confirmPassword,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[1000] p-5 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-[#161616] rounded-3xl max-w-[400px] w-full p-6 animate-scaleIn max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader title="Change Password" onClose={handleClose} disabled={isLoading} />

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-5">
            <PasswordInput
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.currentPassword}
              touched={touched.currentPassword}
              disabled={isLoading}
              autoComplete="current-password"
              showPassword={showPasswords.current}
              onTogglePassword={() => togglePasswordVisibility("current")}
            />

            <PasswordInput
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.newPassword}
              touched={touched.newPassword}
              disabled={isLoading}
              autoComplete="new-password"
              showPassword={showPasswords.new}
              onTogglePassword={() => togglePasswordVisibility("new")}
            />

            <PasswordStrengthIndicator
              password={formData.newPassword}
              strength={passwordStrength}
            />

            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.confirmPassword}
              touched={touched.confirmPassword}
              disabled={isLoading}
              autoComplete="new-password"
              showPassword={showPasswords.confirm}
              onTogglePassword={() => togglePasswordVisibility("confirm")}
            />

            <p className="text-[11px] text-[#666666]">
              Password must be at least 8 characters with an uppercase letter, number, and special character.
            </p>
          </div>

          <ActionButtons
            onCancel={handleClose}
            isSubmitting={isLoading}
            submitText="Update Password"
            disabled={isLoading}
          />
        </form>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
        `}</style>
      </div>
    </div>
  );
}