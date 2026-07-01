// app/profile/components/DeleteModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function DeleteModal({ 
    isOpen, 
    onClose, 
    onConfirm,
    isLoading = false 
}) {
    const [confirmationText, setConfirmationText] = useState("");
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setConfirmationText("");
            setError("");
            setIsDeleting(false);
        }
    }, [isOpen]);

    // Handle confirmation text change
    const handleConfirmationChange = (e) => {
        const value = e.target.value;
        setConfirmationText(value);
        if (error) setError("");
    };

    // Handle delete confirmation
    const handleConfirm = () => {
        // Check if user typed the confirmation word
        if (confirmationText.toLowerCase() !== "delete") {
            setError('Please type "delete" to confirm');
            return;
        }

        setIsDeleting(true);
        onConfirm();
    };

    // Handle close
    const handleClose = () => {
        if (!isLoading && !isDeleting) {
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
                className="bg-[#161616] rounded-3xl max-w-[420px] w-full p-6 animate-scaleIn max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with close button */}
                <div className="flex justify-end">
                    <button 
                        className="bg-none border-none text-[#A3A3A3] cursor-pointer p-1 rounded-lg transition-all hover:bg-[#111111] hover:text-[#F5F5F5] disabled:opacity-50"
                        onClick={handleClose}
                        disabled={isLoading || isDeleting}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[rgba(255,59,48,0.15)]">
                    <Trash2 size={32} style={{ color: "#FF3B30" }} />
                </div>

                {/* Title */}
                <h3 className="text-[20px] font-bold text-center m-0 mb-2 text-[#F5F5F5]">
                    Delete Account
                </h3>

                {/* Description */}
                <p className="text-[14px] text-[#A3A3A3] text-center leading-relaxed m-0 mb-4">
                    Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                </p>

                {/* Warning Box */}
                <div className="bg-[rgba(255,59,48,0.08)] border border-[rgba(255,59,48,0.2)] rounded-xl p-3 mb-4 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-[#FF3B30] flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#FF3B30] leading-relaxed">
                        This will permanently delete your profile, products, and all associated data.
                    </p>
                </div>

                {/* Confirmation Input */}
                <div className="mb-4">
                    <label className="text-[13px] text-[#A3A3A3] font-medium block mb-2">
                        Type <span className="text-[#FF3B30] font-bold">delete</span> to confirm
                    </label>
                    <input
                        type="text"
                        placeholder="Type 'delete' here..."
                        className={`w-full p-3 rounded-xl border ${
                            error ? "border-red-500" : "border-[#262626]"
                        } bg-[#111111] text-[#F5F5F5] text-[14px] outline-none transition-all focus:border-[#F5A623] disabled:opacity-50`}
                        value={confirmationText}
                        onChange={handleConfirmationChange}
                        disabled={isLoading || isDeleting}
                        autoFocus
                    />
                    {error && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            {error}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        className="flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all bg-[#111111] text-[#A3A3A3] hover:bg-[#262626] disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleClose}
                        disabled={isLoading || isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        type="button"
                        className={`flex-1 p-3 rounded-xl border-none font-semibold text-[15px] cursor-pointer transition-all flex items-center justify-center gap-2 ${
                            confirmationText.toLowerCase() === "delete" && !isLoading && !isDeleting
                                ? "bg-[#FF3B30] text-white hover:opacity-90"
                                : "bg-[#333333] text-[#666666] cursor-not-allowed opacity-50"
                        }`}
                        onClick={handleConfirm}
                        disabled={confirmationText.toLowerCase() !== "delete" || isLoading || isDeleting}
                    >
                        {isDeleting || isLoading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Account"
                        )}
                    </button>
                </div>

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