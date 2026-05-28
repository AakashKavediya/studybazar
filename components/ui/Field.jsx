// components/Field.jsx
"use client";

import { useState, memo } from "react";
import { COLORS } from "@/constants/colors";
import { EyeIcon, EyeOffIcon, CheckIcon } from "@/components/ui/Icons";

const Field = memo(({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  hint,
  autoComplete,
  inputMode,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const showError = touched && error;
  const isValid = touched && !error && value;

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  let borderColor = COLORS.border;
  if (showError) borderColor = COLORS.error;
  else if (focused) borderColor = COLORS.borderFocus;
  else if (isValid) borderColor = COLORS.success;

  return (
    <div className="field-group">
      <div className="label" style={{ color: focused ? COLORS.textPrimary : COLORS.textSecondary }}>
        {label}
      </div>
      <div className="input-wrapper">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className="input-field"
          style={{
            borderColor: borderColor,
            paddingRight: isPassword ? "44px" : isValid ? "44px" : "16px",
            backgroundColor: COLORS.inputBg,
            color: COLORS.textPrimary,
          }}
        />
        {isValid && !isPassword && (
          <div className="valid-check">
            <CheckIcon size={16} color={COLORS.success} />
          </div>
        )}
        {isPassword && (
          <button
            type="button"
            className="toggle-pw"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      <div className="hint-message">
        {showError ? (
          <span className="error-message">{error}</span>
        ) : hint && focused ? (
          <span style={{ color: COLORS.textMuted }}>{hint}</span>
        ) : null}
      </div>
    </div>
  );
});

Field.displayName = "Field";

export default Field;