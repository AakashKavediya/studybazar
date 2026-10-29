"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaComment, FaPaperPlane, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LostFoundCard({ post }) {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const postId = post._id || post.id;

  // Safely parse images
  const displayImage = post.image || (Array.isArray(post.images) ? post.images[0] : null);

  const fetchComments = async () => {
    if (isExpanded && comments.length === 0) {
      setIsLoadingComments(true);
      try {
        // ✅ FIX: Added trailing slash
        const response = await axios.get(`${API_URL}/lost-and-found/${postId}/comments/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setComments(response.data?.data?.comments || response.data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) fetchComments();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      // ✅ FIX: Added trailing slash
      await axios.post(
        `${API_URL}/lost-and-found/${postId}/comment/`,
        { content: comment.trim() },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setComments((prev) => [
        { _id: Date.now(), user_name: "You", content: comment, created_at: new Date().toISOString() },
        ...prev
      ]);
      setComment("");
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleMessageClick = async () => {
    if (!accessToken) return router.push("/auth/signin");
    try {
      const response = await axios.post(
        `${API_URL}/chat/room`,
        { participant_id: post.user_id, product_id: postId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data) {
        const roomId = response.data.id || response.data._id;
        router.push(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const badgeType = post.type?.toLowerCase() || "lost";
  const isLost = badgeType === "lost";

  return (
    <div className="bg-[#161616] rounded-3xl p-5 flex flex-col gap-3 shadow-lg transition-all duration-300 border border-[#262626]">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[15px] font-bold text-[#0A0A0A]">
          {post.user_name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[14px] font-semibold text-white">
            {post.user_name || "Anonymous"}
          </span>
          <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
             <FaMapMarkerAlt size={10} /> {post.location || "Campus"}
          </span>
        </div>
        
        <div className={`ml-auto px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${
          isLost ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        }`}>
          {isLost ? "LOST" : "ISSUE"}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-[15px] font-bold text-white leading-snug">
          {post.title}
        </h3>
        <p className="text-[13px] text-[#A0A0A0] leading-relaxed">
          {post.description || "No description provided."}
        </p>
      </div>

      {/* Image */}
      {displayImage && (
        <div className="w-full rounded-2xl overflow-hidden bg-[#1A1A1A] mt-1">
          <img src={displayImage} alt={post.title} className="w-full h-auto object-cover max-h-[300px]" />
        </div>
      )}

      {/* Comments Expandable */}
      <div className="mt-1 border-t border-[#2A2A2A]/50 pt-3">
        <button onClick={handleToggleExpand} className="flex items-center gap-2 text-[13px] text-[#A0A0A0] hover:text-white transition-colors w-full">
          <FaComment size={14} />
          <span>{isExpanded ? "Hide comments" : "View comments"}</span>
          <span className="text-[10px] ml-auto text-[#6B6B6B]">{isExpanded ? '▲' : '▼'}</span>
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3">
            {isLoadingComments ? (
              <p className="text-center text-[#6B6B6B] py-2 text-xs">Loading...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-[#6B6B6B] py-2 text-xs">No comments yet.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="flex flex-col text-[13px]">
                  <span className="font-medium text-white">{c.user_name || "User"}</span>
                  <span className="text-[#A0A0A0]">{c.content}</span>
                </div>
              ))
            )}

            <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-[#1A1A1A] rounded-lg px-3 py-1.5 text-[13px] text-white outline-none placeholder:text-[#6B6B6B] focus:ring-1 focus:ring-[#F5A623]"
              />
              <button type="submit" disabled={!comment.trim()} className="px-3 py-1.5 bg-[#F5A623] text-[#0A0A0A] font-semibold rounded-lg text-[12px] hover:opacity-90 disabled:opacity-40">
                Post
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-2 mt-1 flex justify-end">
        <button 
          onClick={handleMessageClick}
          className="flex items-center gap-2 px-5 py-2 bg-[#F5A623] text-[#0A0A0A] text-[14px] font-medium rounded-full hover:scale-105 active:scale-95 transition-transform duration-200"
        >
          <FaPaperPlane size={14} /> Message
        </button>
      </div>
    </div>
  );
}