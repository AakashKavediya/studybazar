// components/ui/ActionButtons.jsx
"use client";

export default function ActionButtons({
  onCancel,
  onSubmit,
  isSubmitting = false,
  cancelText = "Cancel",
  submitText = "Submit",
  disabled = false,
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onCancel}
        disabled={disabled || isSubmitting}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        disabled={disabled || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
            {submitText === "Update Password" ? "Updating..." : "Submitting..."}
          </>
        ) : (
          submitText
        )}
      </button>
    </div>
  );
}