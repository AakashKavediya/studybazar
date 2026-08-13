"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { COLORS } from "@/constants/colors";

const CATEGORIES = [
  "electronics", "books", "clothing", "id_card", "bag",
  "water_bottle", "umbrella", "keys", "jewelry", "other"
];

export default function LostCreateModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    campus: "",
    contact_info: "",
    images: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(form);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[2000] p-5">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold text-white">Report Item</h3>
          <button onClick={onClose} className="text-[#A3A3A3] hover:text-white p-1 rounded-lg hover:bg-[#1A1A1A]">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Title</label>
            <input 
              type="text" 
              required 
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
              placeholder="e.g., Lost Blue Backpack"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Category</label>
            <select
              required
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white appearance-none"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white resize-none"
              placeholder="Describe the item and where you lost it..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Location</label>
              <input 
                type="text" 
                required 
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
                placeholder="Library 2nd floor"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Campus</label>
              <input 
                type="text" 
                required 
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
                placeholder="Main Campus"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-1">Contact Info (Optional)</label>
            <input 
              type="text" 
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
              placeholder="Email or phone number"
              value={form.contact_info}
              onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:opacity-90 transition-all mt-4 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Item"}
          </button>
        </form>
      </div>
    </div>
  );
}