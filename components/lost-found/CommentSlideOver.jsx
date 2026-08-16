// components/lost-found/CommentSlideOver.jsx
"use client";

import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function CommentSlideOver({ isOpen, onClose, post }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "aakash.k", text: "Saw this near the library!" },
    { id: 2, user: "khushi.j", text: "Check with the security desk." },
    { id: 3, user: "rahu.l", text: "I'll keep an eye out." },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id: Date.now(), user: "You", text: comment }]);
    setComment("");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#141414] w-full max-w-lg rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl border-t border-[#2A2A2A] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-[#2A2A2A]">
          <h3 className="text-[18px] font-bold tracking-tight text-white">Comments</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0] transition-colors">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[11px] font-bold text-[#0A0A0A] flex-shrink-0">
                {c.user.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-white">{c.user}</span>
                </div>
                <p className="text-[14px] text-[#A0A0A0] leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-5 pt-3 border-t border-[#2A2A2A]">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F5A623] transition-colors placeholder:text-[#6B6B6B]"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-5 py-3 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              Post
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
      `}</style>
    </div>
  );
}