// app/sell/page.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";

// Icons
import {
  FaImage,
  FaTimes,
  FaUpload,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const CATEGORIES = [
  { value: "notes", label: "Notes" },
  { value: "books", label: "Books" },
  { value: "lab", label: "Lab Reports" },
  { value: "assignments", label: "Assignments" },
  { value: "ppt", label: "Presentations (PPT)" },
  { value: "question_bank", label: "Question Bank" },
  { value: "handwritten_notes", label: "Handwritten Notes" },
  { value: "cheat_sheet", label: "Cheat Sheet" },
  { value: "other", label: "Other" },
];

export default function SellPage() {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    thumbnail: "",
    images: [],
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      router.push("/auth/signin");
    }
  }, [accessToken, router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "study-mart"
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dtdivzyct"
        }/image/upload`,
        uploadFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      const imageUrl = response.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        thumbnail: imageUrl,
      }));

    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error("Title is required");
      }
      if (!formData.category) {
        throw new Error("Category is required");
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error("Valid price is required");
      }
      if (!formData.thumbnail) {
        throw new Error("Thumbnail image is required");
      }

      // Prepare payload - Make sure types match exactly
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null, // Use null instead of undefined
        category: formData.category,
        price: parseFloat(formData.price),
        thumbnail: formData.thumbnail,
        images: formData.images.filter(Boolean).length > 0 ? formData.images.filter(Boolean) : [],
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      console.log("📤 Sending payload:", payload);

      const response = await axios.post(
        `${API_URL}/products/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        setSuccess("✅ Product listed successfully!");
        
        setTimeout(() => {
          setFormData({
            title: "",
            description: "",
            category: "",
            price: "",
            thumbnail: "",
            images: [],
            tags: "",
          });
          setPreview(null);
          setSuccess(null);
          router.push("/");
        }, 2000);
      }

    } catch (err) {
      console.error("Submit error:", err);
      
      // ✅ Proper error handling - extract message from validation errors
      let errorMessage = "Failed to create product. ";
      
      if (err.response?.data?.detail) {
        // Check if it's a validation error array
        if (Array.isArray(err.response.data.detail)) {
          // Extract messages from validation errors
          const messages = err.response.data.detail.map((d) => d.msg || d.message || JSON.stringify(d));
          errorMessage = messages.join(". ");
        } else if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else {
          errorMessage = JSON.stringify(err.response.data.detail);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, accessToken, router]);

  if (!isMounted) {
    return null;
  }

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#A3A3A3]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors mb-6"
        >
          <FaArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">List Your Product</h1>
          <p className="text-[#A3A3A3] text-sm mt-1">
            Sell your study materials and earn
          </p>
        </div>

        {/* ✅ Proper error handling - convert object to string */}
        {error && (
          <div className="mb-4 p-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] rounded-lg text-[#FF3B30] text-sm">
            <span className="font-medium">Error:</span> {String(error)}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-[rgba(52,199,89,0.1)] border border-[rgba(52,199,89,0.2)] rounded-lg text-[#34C759] text-sm flex items-center gap-2">
            <span className="text-lg">✅</span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Title <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Data Structures Complete Notes"
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors"
              required
              maxLength={200}
              disabled={isSubmitting}
            />
            <div className="text-right text-xs text-[#666666] mt-1">
              {formData.title.length}/200
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Description <span className="text-[#666666] text-xs">(optional)</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              rows={4}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Category <span className="text-[#FF3B30]">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white focus:outline-none focus:border-[#F5A623] transition-colors appearance-none"
              required
              disabled={isSubmitting}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Price (₹) <span className="text-[#FF3B30]">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., 299"
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors"
              required
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Thumbnail Image <span className="text-[#FF3B30]">*</span>
            </label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#262626]">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 bg-[#FF3B30] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform"
                    disabled={isSubmitting}
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[#262626] flex items-center justify-center text-[#666666] bg-[#0A0A0A]">
                  <FaImage size={24} />
                </div>
              )}
              <label className="flex-1 px-4 py-2 bg-[#1A1A1A] border border-[#262626] text-white font-medium text-sm rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? (
                  <FaSpinner className="animate-spin mx-auto" size={20} />
                ) : (
                  <>
                    <FaUpload className="inline mr-2" size={14} />
                    Choose Image
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  disabled={isUploading || isSubmitting}
                />
              </label>
            </div>
            {formData.thumbnail && (
              <p className="text-xs text-[#34C759] mt-1">✅ Image uploaded</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
              Tags <span className="text-[#666666] text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., programming, dsa, notes"
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-[#262626] rounded-lg text-white placeholder:text-[#666666] focus:outline-none focus:border-[#F5A623] transition-colors"
              disabled={isSubmitting}
            />
            {formData.tags && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.tags.split(",").map((tag, index) => {
                  const trimmed = tag.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs text-[#A3A3A3]"
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full py-3 bg-[#F5A623] text-[#0A0A0A] font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                Listing Product...
              </>
            ) : (
              <>
                <FaPlus size={16} />
                List Product
              </>
            )}
          </button>

          <p className="text-xs text-[#666666] text-center">
            By listing your product, you agree to our Terms of Service
          </p>
        </form>
      </div>

      <BottomTabNav />
    </div>
  );
}