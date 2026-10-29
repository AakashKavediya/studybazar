// components/home/HomeChatList.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL}";

export default function HomeChatList() {
  const router = useRouter();
  const { accessToken, user } = useSelector((state) => state.auth);
  
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCache, setUserCache] = useState({}); // ✅ Cache for user names

  const currentUserId = user?.id || user?._id;

  // --- Fetch Chat Rooms ---
  useEffect(() => {
    const fetchRooms = async () => {
      if (!accessToken) return;
      try {
        const response = await axios.get(`${API_URL}/chat/rooms`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setRooms(response.data || []);
      } catch (error) {
        console.error("Failed to fetch chat rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRooms();
  }, [accessToken]);

  // --- Fetch Real User Names for Room Participants ---
  const fetchUserName = useCallback(async (userId) => {
    // If already cached, return it
    if (userCache[userId]) return userCache[userId];
    // If it's the current user, return their name
    if (userId === currentUserId) return user?.name || "You";
    
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const name = response.data?.user?.name || response.data?.name || "User";
      setUserCache((prev) => ({ ...prev, [userId]: name }));
      return name;
    } catch (error) {
      console.warn(`Could not fetch user ${userId}`, error);
      return "User";
    }
  }, [accessToken, currentUserId, userCache, user?.name]);

  // --- Process Rooms and Populate Names ---
  useEffect(() => {
    if (!rooms.length) return;
    
    rooms.forEach((room) => {
      const otherUserId = room.participants?.find((id) => id !== currentUserId);
      if (otherUserId && !userCache[otherUserId]) {
        fetchUserName(otherUserId);
      }
    });
  }, [rooms, currentUserId, userCache, fetchUserName]);

  // --- Helper to get the displayed name ---
  const getDisplayName = (room) => {
    const otherUserId = room.participants?.find((id) => id !== currentUserId);
    if (!otherUserId) return "Unknown";
    return userCache[otherUserId] || `User ${otherUserId.slice(0, 6)}`;
  };

  // --- Helper to get the avatar initial ---
  const getAvatarInitial = (room) => {
    const name = getDisplayName(room);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20">
      {/* Custom Header for Chat List */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-[#2A2A2A] bg-[#0A0A0A] sticky top-0 z-50">
        <button onClick={() => router.back()} className="text-[#A0A0A0] hover:text-white">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
      </div>

      <div className="px-4 py-4 space-y-2">
        {isLoading ? (
          <p className="text-center text-[#6B6B6B] py-10">Loading chats...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-[#6B6B6B] py-10">No messages yet.</p>
        ) : (
          rooms.map((room) => {
            const otherUserId = room.participants?.find((id) => id !== currentUserId);
            const displayName = getDisplayName(room);

            return (
              <div
                key={room._id}
                onClick={() => router.push(`/chat/${room._id}`)}
                className="flex items-center gap-3 p-3 bg-[#141414] hover:bg-[#1A1A1A] rounded-xl cursor-pointer transition-colors border border-[#2A2A2A] hover:border-[#F5A623]/30"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[16px] font-bold text-[#0A0A0A] flex-shrink-0">
                  {getAvatarInitial(room)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[15px] font-semibold truncate">
                      {displayName}
                    </h4>
                    {room.last_message_at && (
                      <span className="text-[10px] text-[#6B6B6B] flex-shrink-0 ml-2">
                        {new Date(room.last_message_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#A0A0A0] truncate">
                    {room.last_message_text || "Start chatting..."}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}