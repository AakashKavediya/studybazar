"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaArrowLeft, FaUser, FaClock, FaMapMarkerAlt, FaEllipsisH, FaCheckCircle, FaPaperPlane } from "react-icons/fa";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function LostItemDetailPage({ params }) {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { id } = params;

  // --- Fetch Item Details + Comments ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
      // Fetch Item
      const itemRes = await axios.get(`${API_URL}/lost-and-found/${id}`, {
        headers, withCredentials: true
      });
      setItem(itemRes.data.data);

      // Fetch Comments
      const commentRes = await axios.get(`${API_URL}/lost-and-found/${id}/comments`, {
        headers, withCredentials: true
      });
      setComments(commentRes.data.data.comments || []);
    } catch (err) {
      console.error("Error loading details:", err);
      router.push("/lost-found");
    } finally {
      setIsLoading(false);
    }
  }, [id, accessToken, router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- Add Comment ---
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !accessToken) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/lost-and-found/${id}/comment`,
        { content: commentText.trim() },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      );
      setCommentText("");
      fetchData(); // Refresh
    } catch (err) {
      alert("Failed to post comment");
    } finally { setIsSubmitting(false); }
  };

  // --- Submit Claim / Complaint ---
  const handleClaimSubmit = async () => {
    if (!accessToken) return router.push("/auth/signin");
    const proof = prompt("Please describe your proof of ownership (e.g., 'I have a photo of myself with this item'):");
    if (!proof) return;

    try {
      await axios.post(
        `${API_URL}/lost-and-found/${id}/claim`,
        { item_id: id, proof_description: proof, contact_info: "" },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      );
      alert("Claim submitted successfully! The owner will be notified.");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit claim");
    }
  };

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin" />
      </div>
    );
  }

  const { title, description, location, campus, user_name, status, is_resolved, images = [], created_at } = item;
  const mainImage = images && images.length > 0 ? images[0] : null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#A3A3A3] hover:text-white mb-4 transition-colors">
          <FaArrowLeft size={16} /> Back
        </button>

        {/* Item Image */}
        <div className="bg-[#141414] rounded-2xl border border-[#2A2A2A] overflow-hidden mb-6 relative pt-[60%]">
          {!imageError && mainImage ? (
            <img src={mainImage} alt={title} className="absolute inset-0 w-full h-full object-cover" onError={() => setImageError(true)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl bg-[#1E1E1E]">🎒</div>
          )}
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase backdrop-blur-sm z-10 ${status === 'lost' ? 'bg-[#EF4444]' : status === 'found' ? 'bg-[#34C759]' : 'bg-[#6B6B6B]'}`}>
            {is_resolved ? "✅ Resolved" : status}
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 mb-6">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-[#A3A3A3] leading-relaxed mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-[#A3A3A3] border-t border-[#2A2A2A] pt-4">
            <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-white" /> {location}</span>
            <span className="flex items-center gap-2">• {campus}</span>
            <span className="flex items-center gap-2"><FaUser /> {user_name || "Anonymous"}</span>
            <span className="flex items-center gap-2"><FaClock /> {new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons - Complaint / Claim */}
        {!is_resolved && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleClaimSubmit}
              className="flex-1 py-3 bg-[#F5A623] text-black font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#F5A623]/20"
            >
              🗣️ Report if you found this
            </button>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5">
          <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
            Comments
            <span className="text-sm font-normal text-[#A3A3A3]">{comments.length}</span>
          </h3>

          {/* Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="px-4 bg-white text-black rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FaPaperPlane size={16} />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {comments.length === 0 && (
              <p className="text-center text-[#6B6B6B] text-sm py-4">No comments yet. Be the first!</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="border-b border-[#2A2A2A] pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{c.user_name || "Anonymous"}</span>
                  <span className="text-xs text-[#6B6B6B]">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-[#A3A3A3]">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomTabNav />
    </div>
  );
}