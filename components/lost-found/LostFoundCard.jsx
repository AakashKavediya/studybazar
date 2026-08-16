// components/lost-found/LostFoundCard.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaComment, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LostFoundCard({ post }) {
  const router = useRouter();
  const { accessToken, user } = useSelector((state) => state.auth);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // --- Fetch Comments ---
  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      fetchComments();
    }
  }, [isExpanded]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await axios.get(
        `${API_URL}/lost-and-found/${post._id || post.id}/comments`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setComments(response.data?.data?.comments || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  // --- Submit Comment ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/lost-and-found/${post._id || post.id}/comment`,
        { content: comment.trim() },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data) {
        const newComment = {
          _id: Date.now(),
          user_name: user?.name || "You",
          content: comment,
          created_at: new Date().toISOString(),
        };
        setComments((prev) => [newComment, ...prev]);
        setComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  // ============================================================
  // ✅ FIX: Send Product Context to the Seller when Chatting
  // ============================================================
  const handleMessageClick = async () => {
    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }

    try {
      // 1. Create (or get) the chat room linked to this product_id
      const response = await axios.post(
        `${API_URL}/chat/room`,
        {
          participant_id: post.user_id,
          product_id: post._id || post.id,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.data) {
        const roomId = response.data.id || response.data._id;

        // 2. OPTIONAL: Send an automatic "context message" to the seller
        // This ensures the seller immediately sees what this chat is about.
        try {
          const contextMessage = `👋 Hi! I'm contacting you about your post: "${post.title}"`;
          await axios.post(
            `${API_URL}/chat/message`,
            {
              room_id: roomId,
              content: contextMessage,
            },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        } catch (msgErr) {
          // Non-critical: If the context message fails, we just navigate anyway.
          console.warn("Could not send context message:", msgErr);
        }

        // 3. Redirect to the chat room
        router.push(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  // --- Badge Handling ---
  const badgeType = post.type?.toLowerCase() || "unknown";
  let badgeLabel = "UNKNOWN";
  let badgeClasses = "bg-[#6B6B6B]/10 text-[#6B6B6B] border-[#6B6B6B]/20";

  if (badgeType === "lost") {
    badgeLabel = "LOST";
    badgeClasses = "bg-[#FF453A]/10 text-[#FF453A] border-[#FF453A]/20";
  } else if (badgeType === "issue" || badgeType === "complaint") {
    badgeLabel = "ISSUE";
    badgeClasses = "bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20";
  }

  return (
    <div className="bg-[#161616] rounded-3xl p-5 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      
      {/* --- Header: Avatar + Name + Location --- */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[15px] font-bold text-[#0A0A0A] shadow-md shadow-[#F5A623]/20">
          {post.user_name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-semibold text-white tracking-tight">
            {post.user_name || "Anonymous"}
          </span>
          <span className="text-[11px] text-[#6B6B6B]">
            {post.location}
          </span>
        </div>
        
        <div className={`ml-auto px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${badgeClasses}`}>
          {badgeLabel}
        </div>
      </div>

      {/* --- Content: Title + Description --- */}
      <div className="space-y-1">
        <h3 className="text-[15px] font-bold text-white leading-snug tracking-tight">
          {post.title}
        </h3>
        <p className="text-[13px] text-[#A0A0A0] leading-relaxed">
          {post.description || "No description provided."}
        </p>
      </div>

      {/* --- Image (ONLY if present) --- */}
      {post.image && (
        <div className="w-full rounded-2xl overflow-hidden bg-[#1A1A1A] mt-1">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto object-cover max-h-[300px]" 
          />
        </div>
      )}

      {/* --- Expandable Comments Section --- */}
      <div className="mt-1 border-t border-[#2A2A2A]/50 pt-3">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-[13px] text-[#A0A0A0] hover:text-white transition-colors"
        >
          <FaComment size={14} />
          <span>{isExpanded ? "Hide comments" : `View ${comments.length || 0} comments`}</span>
          <span className="text-[10px] ml-auto text-[#6B6B6B]">
            {isExpanded ? '▲' : '▼'}
          </span>
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            {isLoadingComments ? (
              <div className="text-center text-[#6B6B6B] py-4 text-sm">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-[#6B6B6B] py-4 text-sm">No comments yet. Be the first!</div>
            ) : (
              comments.map((c) => (
                <div key={c._id || c.id} className="flex items-start gap-2 text-[14px]">
                  <span className="font-medium text-white flex-shrink-0">
                    {c.user_name || "Anonymous"}
                  </span>
                  <span className="text-[#A0A0A0]">
                    {c.content}
                  </span>
                </div>
              ))
            )}

            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2 pt-2 border-t border-[#2A2A2A]/30">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-[#1A1A1A] rounded-lg px-3 py-1.5 text-[13px] text-white outline-none placeholder:text-[#6B6B6B] focus:ring-1 focus:ring-[#F5A623]"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="px-3 py-1.5 bg-[#F5A623] text-[#0A0A0A] text-[12px] font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- Footer: Message Button --- */}
      <div className="pt-2 mt-1 flex justify-end">
        <button 
          onClick={handleMessageClick}
          className="flex items-center gap-2 px-5 py-2 bg-[#F5A623] text-[#0A0A0A] text-[14px] font-medium rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 shadow-lg shadow-[#F5A623]/20"
        >
          <FaPaperPlane size={14} />
          Message
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </div>
  );
}