// app/profile/components/PasswordModal.jsx
"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { X, Eye, EyeOff, Check, AlertCircle } from "lucide-react";

export default function PasswordModal({ 
    isOpen, 
    onClose, 
    onConfirm,
    isLoading = false 
}) {
    // State
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

    // Password strength checks
    const passwordChecks = useMemo(() => ({
        length: (pwd) => pwd.length >= 8,
        uppercase: (pwd) => /[A-Z]/.test(pwd),
        lowercase: (pwd) => /[a-z]/.test(pwd),
        digit: (pwd) => /[0-9]/.test(pwd),
        special: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    }), []);

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
        
        const strengthMap = {
            1: { score: 1, label: "Weak", color: "#EF4444" },
            2: { score: 2, label: "Fair", color: "#FB923C" },
            3: { score: 3, label: "Good", color: "#FACC15" },
            4: { score: 4, label: "Strong", color: "#22C55E" },
            5: { score: 4, label: "Strong", color: "#22C55E" },
        };

        const result = strengthMap[Math.min(Math.max(passed, 1), 5)] || strengthMap[1];
        return { ...result, checks };
    }, [formData.newPassword, passwordChecks]);

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

        // Current password
        if (!currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        // New password
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

        // Confirm password
        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, passwordChecks]);

    // Handle field change - FIXED: No useCallback to prevent focus issues
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle field blur
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Mark all as touched
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

    // Handle close
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
                {/* Header */}
                <div className="flex justify-between items-center mb-5 sticky top-0 bg-[#161616] z-10 pb-2">
                    <h3 className="text-[20px] font-bold m-0 text-[#F5F5F5]">Change Password</h3>
                    <button 
                        className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5] disabled:opacity-50"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mb-5">
                        {/* Current Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? "text" : "password"}
                                    name="currentPassword"
                                    placeholder="Current Password"
                                    className={`w-full p-3 pr-11 rounded-xl border ${
                                        errors.currentPassword && touched.currentPassword ? "border-red-500" : "border-[#262626]"
                                    } bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50`}
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#A3A3A3] cursor-pointer p-1 hover:text-[#F5F5F5] disabled:opacity-50"
                                    onClick={() => togglePasswordVisibility('current')}
                                    disabled={isLoading}
                                    tabIndex="-1"
                                >
                                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.currentPassword && touched.currentPassword && (
                                <p className="text-[11px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.currentPassword}
                                </p>
                            )}
                        </div>
                        
                        {/* New Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="New Password"
                                    className={`w-full p-3 pr-11 rounded-xl border ${
                                        errors.newPassword && touched.newPassword ? "border-red-500" : "border-[#262626]"
                                    } bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50`}
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#A3A3A3] cursor-pointer p-1 hover:text-[#F5F5F5] disabled:opacity-50"
                                    onClick={() => togglePasswordVisibility('new')}
                                    disabled={isLoading}
                                    tabIndex="-1"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.newPassword && touched.newPassword && (
                                <p className="text-[11px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1 bg-[#262626] rounded-full overflow-hidden flex gap-0.5">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 h-full rounded-full transition-all duration-300 ${
                                                    level <= passwordStrength.score 
                                                        ? "opacity-100" 
                                                        : "opacity-20"
                                                }`}
                                                style={{
                                                    backgroundColor: level <= passwordStrength.score 
                                                        ? passwordStrength.color 
                                                        : "#262626"
                                                }}
                                            />
                                        ))}
                                    </div>
                                    {passwordStrength.label && (
                                        <span 
                                            className="text-[11px] font-medium whitespace-nowrap"
                                            style={{ color: passwordStrength.color }}
                                        >
                                            {passwordStrength.label}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Password Requirements */}
                                <div className="grid grid-cols-2 gap-1">
                                    {[
                                        { key: 'length', label: '8+ characters' },
                                        { key: 'uppercase', label: 'Uppercase' },
                                        { key: 'lowercase', label: 'Lowercase' },
                                        { key: 'digit', label: 'Number' },
                                        { key: 'special', label: 'Special char' },
                                    ].map((req) => (
                                        <div 
                                            key={req.key}
                                            className="flex items-center gap-1.5 text-[10px]"
                                        >
                                            {passwordStrength.checks[req.key] ? (
                                                <Check size={12} className="text-green-500 flex-shrink-0" />
                                            ) : (
                                                <div className="w-3 h-3 border border-[#262626] rounded-full flex-shrink-0" />
                                            )}
                                            <span className={passwordStrength.checks[req.key] ? "text-[#A3A3A3]" : "text-[#666666]"}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    className={`w-full p-3 pr-11 rounded-xl border ${
                                        errors.confirmPassword && touched.confirmPassword ? "border-red-500" : "border-[#262626]"
                                    } bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-none border-none text-[#A3A3A3] cursor-pointer p-1 hover:text-[#F5F5F5] disabled:opacity-50"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    disabled={isLoading}
                                    tabIndex="-1"
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                                <p className="text-[11px] text-red-500 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Hint */}
                        <p className="text-[11px] text-[#666666]">
                            Password must be at least 8 characters with an uppercase letter, number, and special character.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="inline-block w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </div>
                </form>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
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
                    .animate-spin {
                        animation: spin 0.8s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}