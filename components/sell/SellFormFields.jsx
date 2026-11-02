// components/sell/SellFormFields.jsx
"use client";

import { FaImage, FaTimes, FaUpload, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const CATEGORIES = [
  { value: "notes", label: "Notes" },
  { value: "books", label: "Books" },
  { value: "lab", label: "Lab Reports" },
  { value: "assignments", label: "Assignments" },
  { value: "ppt", label: "Presentations" },
  { value: "question_bank", label: "Question Bank" },
  { value: "handwritten_notes", label: "Handwritten Notes" },
  { value: "cheat_sheet", label: "Cheat Sheet" },
  { value: "other", label: "Other" },
];

export default function SellFormFields({
  formData, setFormData, preview,
  isUploading, isSubmitting,
  isModerating, moderationError,       // ✅ these are needed
  handleImageUpload, handleRemoveImage,
  onChange,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Title <span className="text-[#FF3B30]">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Data Structures Complete Notes"
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[15px] text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#F5A623] transition-colors"
          required
          maxLength={200}
          disabled={isSubmitting}
        />
        <div className="text-right text-xs text-[#6B6B6B] mt-1">
          {formData.title.length}/200
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Description <span className="text-[#6B6B6B] text-xs">(optional)</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your product in detail..."
          rows={4}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[15px] text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#F5A623] transition-colors resize-none"
          disabled={isSubmitting}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Category <span className="text-[#FF3B30]">*</span>
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[15px] text-white focus:outline-none focus:border-[#F5A623] transition-colors appearance-none"
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
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Price (₹) <span className="text-[#FF3B30]">*</span>
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g., 299"
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[15px] text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#F5A623] transition-colors"
          required
          min="0"
          step="0.01"
          disabled={isSubmitting}
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Thumbnail Image <span className="text-[#FF3B30]">*</span>
        </label>
        <div className="flex items-center gap-4">
          {preview ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-[#2A2A2A]">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-1.5 -right-1.5 bg-[#FF3B30] text-white rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                disabled={isSubmitting || isModerating}
              >
                <FaTimes size={12} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-[#2A2A2A] flex items-center justify-center text-[#6B6B6B] bg-[#0A0A0A]">
              <FaImage size={24} />
            </div>
          )}
          
          <label className={`flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] text-white font-medium text-sm rounded-xl hover:bg-[#2A2A2A] transition-colors cursor-pointer text-center ${(isUploading || isModerating) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {isUploading || isModerating ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" size={16} />
                {isModerating ? "Scanning image..." : "Uploading..."}
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
              disabled={isUploading || isSubmitting || isModerating}
            />
          </label>
        </div>

        {/* ✅ Success Message */}
        {formData.thumbnail && !moderationError && (
          <p className="text-xs text-[#34C759] mt-2 flex items-center gap-1">
            ✅ Image uploaded and verified successfully
          </p>
        )}

        {/* ✅ Moderation Error Message */}
        {moderationError && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <FaExclamationTriangle className="text-[#FF3B30] mt-0.5 flex-shrink-0" size={14} />
            <div className="text-xs text-[#FF3B30]">
              <p className="font-semibold mb-1">Upload Blocked</p>
              <p>{moderationError}</p>
              <p className="mt-1 opacity-80">Repeated violations will result in account deletion.</p>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-[13px] font-medium text-[#A0A0A0] mb-1.5">
          Tags <span className="text-[#6B6B6B] text-xs">(comma separated)</span>
        </label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., programming, dsa, notes"
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[15px] text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#F5A623] transition-colors"
          disabled={isSubmitting}
        />
        {formData.tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.split(",").map((tag, index) => {
              const trimmed = tag.trim();
              if (!trimmed) return null;
              return (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-xs text-[#A0A0A0]"
                >
                  #{trimmed}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}