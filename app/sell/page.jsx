// app/sell/page.jsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProtectedRoute from "@/components/ProtectedRoute";

import {
  FaImage,
  FaTimes,
  FaUpload,
  FaPlus,
  FaSpinner,
  FaArrowLeft,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
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
  const { accessToken, user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", price: "",
    thumbnail: "", images: [], tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationStep, setModerationStep] = useState(0);  // ✅ New: 0=idle, 1=uploading, 2=scanning, 3=verifying, 4=done
  const [moderationError, setModerationError] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showShake, setShowShake] = useState(false);  // ✅ New: trigger shake on block

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    setError(null);
    setModerationError(null);
    setModerationStep(1); // Uploading
    setShowShake(false);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // STEP 1 — Moderate BEFORE uploading to Cloudinary
    setIsModerating(true);
    try {
      const modForm = new FormData();
      modForm.append("file", file);
      modForm.append("user_email", user?.email || "");
      modForm.append("user_name", user?.name || "User");

      // Small delay so user sees "Uploading..." step
      await new Promise((r) => setTimeout(r, 300));
      setModerationStep(2); // Scanning

      const modRes = await axios.post(
        `${API_URL}/moderate-image`,
        modForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 60000,
        }
      );

      setModerationStep(3); // Verifying
      await new Promise((r) => setTimeout(r, 400));

      if (modRes.data?.status !== "safe") {
        throw new Error("Image failed moderation");
      }

      // Success
      setModerationStep(4); // Done
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error("🚫 Moderation error:", err.response?.data || err);

      let reason = "This image violates our community guidelines.";
      if (err.response?.status === 422) {
        const detail = err.response.data?.detail;
        reason =
          detail?.reason ||
          (Array.isArray(detail?.flags) && detail.flags.join(", ")) ||
          reason;
        setModerationError(
          reason + " Repeated violations will result in permanent account deletion."
        );
      } else if (err.response?.status === 503) {
        setModerationError("Image moderation is temporarily unavailable. Please try again.");
      } else if (err.code === "ECONNABORTED") {
        setModerationError("Moderation timed out. Please try again with a smaller image.");
      } else {
        setModerationError("We couldn't verify this image. Please try a different one.");
      }

      // Shake + reset
      setShowShake(true);
      setTimeout(() => setShowShake(false), 600);
      setPreview(null);
      setFormData((prev) => ({ ...prev, thumbnail: "" }));
      setModerationStep(0);
      setIsModerating(false);
      return;
    }
    setIsModerating(false);
    setModerationStep(0);

    // STEP 2 — Upload to Cloudinary (only if moderation passed)
    setIsUploading(true);
    setModerationStep(1);
    try {
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
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 30000 }
      );

      setFormData((prev) => ({ ...prev, thumbnail: response.data.secure_url }));
      setModerationStep(4);
      setTimeout(() => setModerationStep(0), 800);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image. Please try again.");
      setPreview(null);
      setModerationStep(0);
    } finally {
      setIsUploading(false);
    }
  }, [user, accessToken]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, thumbnail: "" }));
    setModerationError(null);
    setModerationStep(0);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (moderationError) {
      setError("Cannot submit — image was blocked by moderation.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.title.trim()) throw new Error("Title is required");
      if (!formData.category) throw new Error("Category is required");
      if (!formData.price || parseFloat(formData.price) <= 0)
        throw new Error("Valid price is required");
      if (!formData.thumbnail) throw new Error("Thumbnail image is required");

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        category: formData.category,
        price: parseFloat(formData.price),
        thumbnail: formData.thumbnail,
        images: formData.images.filter(Boolean),
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      await axios.post(`${API_URL}/products/create`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      setSuccess("✅ Product listed successfully!");
      setTimeout(() => {
        setFormData({
          title: "", description: "", category: "", price: "",
          thumbnail: "", images: [], tags: "",
        });
        setPreview(null);
        setSuccess(null);
        router.push("/");
      }, 2000);
    } catch (err) {
      let errorMessage = "Failed to create product. ";
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail
            .map((d) => d.msg || d.message || JSON.stringify(d))
            .join(". ");
        } else if (typeof err.response.data.detail === "string") {
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
  }, [formData, moderationError, accessToken, router]);

  if (!isMounted) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  const isBlocked = !!moderationError;
  const isBusy = isUploading || isModerating || isSubmitting;
  const showScanner = isModerating || isUploading;

  return (
    <ProtectedRoute>
      {/* ✅ Global keyframe styles */}
      <style jsx global>{`
        @keyframes scanSweep {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0.2; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(245, 166, 35, 0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .animate-scan-sweep { animation: scanSweep 1.4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulseGlow 1.5s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fadeUp { animation: fadeUp 0.3s ease-out; }
        .animate-checkPop { animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>

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

          {error && (
            <div className="mb-4 p-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.2)] rounded-lg text-[#FF3B30] text-sm animate-fadeUp">
              <span className="font-medium">Error:</span> {String(error)}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-[rgba(52,199,89,0.1)] border border-[rgba(52,199,89,0.2)] rounded-lg text-[#34C759] text-sm flex items-center gap-2 animate-fadeUp">
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
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
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

            {/* ✅ Thumbnail Upload with Animated Moderation */}
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-1.5">
                Thumbnail Image <span className="text-[#FF3B30]">*</span>
              </label>

              <div className="flex items-center gap-4">
                {/* Preview + Scanner overlay */}
                <div className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  isBlocked
                    ? "border-[#FF3B30] animate-shake"
                    : showScanner
                    ? "border-[#F5A623] animate-pulse-glow"
                    : formData.thumbnail
                    ? "border-[#34C759]"
                    : "border-[#262626]"
                }`}>
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          showScanner ? "brightness-50" : ""
                        }`}
                      />

                      {/* ✅ Scanning bar sweep */}
                      {showScanner && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F5A623] to-transparent animate-scan-sweep shadow-[0_0_12px_#F5A623]" />
                        </div>
                      )}

                      {/* ✅ Success check pop */}
                      {moderationStep === 4 && (
                        <div className="absolute inset-0 bg-[#34C759]/30 flex items-center justify-center animate-checkPop">
                          <FaCheckCircle size={40} className="text-white drop-shadow-lg" />
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-1 -right-1 bg-[#FF3B30] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:scale-110 transition-transform z-10"
                        disabled={isSubmitting || isModerating}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#666666] bg-[#0A0A0A]">
                      <FaImage size={24} />
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <label
                  className={`flex-1 px-4 py-2 bg-[#1A1A1A] border border-[#262626] text-white font-medium text-sm rounded-lg hover:bg-[#262626] transition-colors cursor-pointer text-center ${
                    isBusy ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isModerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaShieldAlt className="animate-pulse text-[#F5A623]" size={16} />
                      Scanning image...
                    </span>
                  ) : isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" size={16} />
                      Uploading...
                    </span>
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
                    disabled={isBusy}
                  />
                </label>
              </div>

              {/* ✅ Animated step tracker */}
              {showScanner && (
                <div className="mt-4 p-4 bg-[#141414] border border-[#262626] rounded-lg animate-fadeUp">
                  <div className="space-y-2.5">
                    <StepRow
                      active={moderationStep === 1}
                      done={moderationStep > 1}
                      label="Uploading image"
                    />
                    <StepRow
                      active={moderationStep === 2}
                      done={moderationStep > 2}
                      label="Scanning for inappropriate content"
                      icon={<FaShieldAlt size={12} />}
                    />
                    <StepRow
                      active={moderationStep === 3}
                      done={moderationStep > 3}
                      label="Verifying text & content"
                    />
                    <StepRow
                      active={moderationStep === 4}
                      done={false}
                      label="Image verified!"
                      success
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F5A623] to-[#34C759] transition-all duration-500"
                      style={{ width: `${(moderationStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* ✅ Success banner */}
              {formData.thumbnail && !moderationError && !showScanner && (
                <p className="text-xs text-[#34C759] mt-2 flex items-center gap-1 animate-fadeUp">
                  <FaCheckCircle size={10} /> Image verified and uploaded
                </p>
              )}

              {/* ✅ Error banner */}
              {moderationError && (
                <div className="mt-3 p-3 bg-[rgba(255,59,48,0.1)] border border-[rgba(255,59,48,0.3)] rounded-lg flex items-start gap-2 animate-fadeUp">
                  <FaExclamationTriangle className="text-[#FF3B30] mt-0.5 flex-shrink-0" size={14} />
                  <div className="text-xs text-[#FF3B30]">
                    <p className="font-semibold mb-1">🚫 Upload Blocked</p>
                    <p>{moderationError}</p>
                  </div>
                </div>
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isBusy || isBlocked || !formData.thumbnail}
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
    </ProtectedRoute>
  );
}

// ✅ Helper: Animated step row
function StepRow({ active, done, label, icon, success }) {
  return (
    <div className="flex items-center gap-2.5 text-xs">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
          done
            ? "bg-[#34C759] text-white"
            : active
            ? success
              ? "bg-[#34C759] text-white"
              : "bg-[#F5A623] text-[#0A0A0A] animate-pulse"
            : "bg-[#262626] text-[#666666]"
        }`}
      >
        {done || (active && success) ? (
          <FaCheckCircle size={11} className="animate-checkPop" />
        ) : (
          <span className="text-[9px] font-bold">{icon || "•"}</span>
        )}
      </div>
      <span
        className={`transition-colors duration-300 ${
          done
            ? "text-[#34C759]"
            : active
            ? "text-white font-medium"
            : "text-[#666666]"
        }`}
      >
        {label}
      </span>
      {active && !success && (
        <FaSpinner className="animate-spin text-[#F5A623] ml-auto" size={10} />
      )}
      {done && <span className="text-[#34C759] ml-auto text-[10px]">✓</span>}
    </div>
  );
}