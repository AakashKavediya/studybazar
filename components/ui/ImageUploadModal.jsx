// components/ui/ImageUploadModal.jsx
"use client";

import { useRef, useState, useCallback } from "react";
import { FaCamera, FaSpinner, FaTimes, FaUpload } from "react-icons/fa";

export default function ImageUploadModal({ isOpen, onClose, onUpload, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image (JPEG, PNG, WEBP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError(null);
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  }, [selectedFile, onUpload]);

  const handleClose = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    onClose();
  }, [previewUrl, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5 animate-fadeIn"
      onClick={handleClose}
    >
      <div 
        className="bg-[#161616] rounded-3xl max-w-[420px] w-full p-6 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-bold text-[#F5F5F5]">Change Profile Picture</h3>
          <button 
            className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors p-1 rounded-lg hover:bg-[#111111]"
            onClick={handleClose}
            disabled={isLoading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#262626] relative bg-[#111111]">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaCamera size={32} className="text-[#333333]" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isLoading}
          />
          
          <button
            className="w-full p-3 rounded-xl border border-[#262626] bg-[#111111] text-[#F5F5F5] font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <FaUpload className="inline mr-2" size={14} />
            Choose Image
          </button>

          {selectedFile && (
            <p className="text-[12px] text-[#A3A3A3]">
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {uploadError && (
            <p className="text-[12px] text-red-500 text-center">{uploadError}</p>
          )}

          <div className="flex gap-3 w-full">
            <button
              className="flex-1 p-3 rounded-xl border border-[#262626] bg-transparent text-[#A3A3A3] font-semibold hover:bg-[#111111] transition-colors disabled:opacity-50"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`flex-1 p-3 rounded-xl border-none font-semibold transition-all flex items-center justify-center gap-2 ${
                selectedFile && !isLoading
                  ? "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90 cursor-pointer"
                  : "bg-[#333333] text-[#666666] cursor-not-allowed opacity-50"
              }`}
              onClick={handleUpload}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
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