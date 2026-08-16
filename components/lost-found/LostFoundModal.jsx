// components/lost-found/LostFoundModal.jsx
"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaTimes, FaCamera, FaSpinner, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LostFoundModal({ isOpen, onClose, activeTab, onPostCreated }) {
  const { user, accessToken } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    description: "",
    image: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  // --- Cloudinary Upload ---
  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "study-mart"
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtdivzyct"}/image/upload`,
        formDataUpload,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 }
      );

      setFormData((prev) => ({ ...prev, image: response.data.secure_url }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  // --- Submit to Backend ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        type: activeTab,
        description: formData.description.trim() || null,
        image: formData.image || null,
      };

      const response = await axios.post(
        `${API_URL}/lost-and-found`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        alert("✅ Post created successfully!");
        onPostCreated();
        setFormData({ title: "", location: "", description: "", image: null });
        setPreview(null);
        onClose();
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert(error.response?.data?.detail || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] animate-fadeIn flex flex-col">
      
      {/* --- 1. Modal Header --- */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors"
          >
            <FaArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h2 className="text-xl font-bold text-white">
            {activeTab === "lost" ? "Report Lost Item" : "Submit Complaint"}
          </h2>
        </div>

        {/* Close (X) Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[#A0A0A0] hover:text-white hover:border-[#F5A623] transition-all duration-200"
        >
          <FaTimes size={18} />
        </button>
      </div>

      {/* --- 2. Form Area --- */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
              Title <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-white outline-none focus:border-[#F5A623] placeholder:text-[#6B6B6B]"
              placeholder="e.g. Lost Blue Backpack"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
              Location <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-white outline-none focus:border-[#F5A623] placeholder:text-[#6B6B6B]"
              placeholder="Where was it lost?"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
              Description <span className="text-[#6B6B6B]">(Optional)</span>
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-white outline-none focus:border-[#F5A623] placeholder:text-[#6B6B6B] resize-none"
              placeholder="Describe the item or issue..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
              Image <span className="text-[#6B6B6B]">(Optional)</span>
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-white hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
              >
                <FaCamera size={16} />
                {isUploading ? "Uploading..." : "Add Photo"}
              </button>
              {formData.image && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F5A623]/50 group">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#F5A623] text-[#0A0A0A] font-semibold text-[16px] rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? <FaSpinner className="animate-spin mx-auto" size={20} /> : "Post"}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}