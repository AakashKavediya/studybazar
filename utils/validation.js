// utils/validation.js
export const validate = {
  name: (v) => v?.trim().length >= 2 ? null : "Enter your full name",
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email",
  phone: (v) => v?.replace(/\D/g, "").length >= 10 ? null : "Enter a valid phone number (10+ digits)",
  campus: (v) => v?.trim().length >= 2 ? null : "Enter your campus name",
  year: (v) => {
    const num = parseInt(v);
    return !isNaN(num) && num >= 1 && num <= 5 ? null : "Enter year (1–5)";
  },
  pass: (v) => v?.length >= 8 ? null : "Minimum 8 characters",
  confirm: (v, form) => v === form.pass ? null : "Passwords don't match",
};

export const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "#2A2A2A" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const normalized = Math.min(4, Math.floor(score / 1.2) + (score >= 4 ? 1 : 0));
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#EF4444", "#FB923C", "#FACC15", "#22C55E"];
  return { score: normalized, label: labels[normalized], color: colors[normalized] };
};

export const STEPS = [
  { id: 0, title: "Create account", subtitle: "Start with your name and email.", fields: ["name", "email"] },
  { id: 1, title: "Your details", subtitle: "Tell us about your campus.", fields: ["phone", "campus", "year"] },
  { id: 2, title: "Secure access", subtitle: "Choose a strong password.", fields: ["pass", "confirm"] },
];