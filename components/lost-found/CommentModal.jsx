// components/lost-found/CommentModal.jsx
"use client";

import { useState } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

export default function CommentModal({ isOpen, onClose, post }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "Aakash K.", text: "I think I saw this in the library!", time: "2h" },
    { id: 2, user: "Khushi J.", text: "Check the lost and found desk.", time: "1h" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "You",
      text: comment,
      time: "Just now",
    };
    setComments([newComment, ...comments]);
    setComment("");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#141414] border-t border-[#2A2A2A] rounded-t-3xl w-full max-w-lg max-h-[80vh] flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
          <h3 className="text-lg font-semibold">Comments</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#1A1A1A] text-[#A0A0A0]"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-[#6B6B6B] text-sm py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-xs font-bold text-[#0A0A0A] flex-shrink-0">
                  {c.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.user}</span>
                    <span className="text-[10px] text-[#6B6B6B]">{c.time}</span>
                  </div>
                  <p className="text-sm text-[#A0A0A0]">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#2A2A2A]">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-white text-sm outline-none focus:border-[#F5A623] placeholder:text-[#6B6B6B]"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-4 py-3 bg-[#F5A623] text-[#0A0A0A] rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              <FaPaperPlane size={16} />
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