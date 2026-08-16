"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaComment } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ChatButton({ targetUserId, productId, className = "" }) {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);

  const handleChat = async (e) => {
    e.stopPropagation(); // Prevent parent card click

    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }

    try {
      // ✅ Correct endpoint: POST /chat/room
      const response = await axios.post(
        `${API_URL}/chat/room`,
        {
          participant_id: targetUserId,
          product_id: productId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      const roomId = response.data._id;
      // ✅ Redirect to /chat/[id] (Dynamic route)
      router.push(`/chat/${roomId}`);

    } catch (err) {
      console.error("Failed to create/join chat:", err);
      alert("Could not start chat. Please try again.");
    }
  };

  return (
    <button
      onClick={handleChat}
      className={`flex items-center justify-center gap-2 bg-white text-black font-medium rounded-xl px-4 py-2 hover:opacity-90 transition-all active:scale-95 ${className}`}
    >
      <FaComment size={16} />
      <span className="text-sm">Chat</span>
    </button>
  );
}