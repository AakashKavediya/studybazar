// app/chat/[roomId]/page.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";

import ProtectedRoute from "@/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.107.168.22";

const normalizeMessage = (payload) => {
  if (!payload) return null;
  const content = payload.content ?? payload.text ?? payload.message ?? "";
  return {
    _id: payload._id || payload.id || `${Date.now()}-${Math.random()}`,
    room_id: payload.room_id || payload.roomId || null,
    sender_id: payload.sender_id || payload.senderId || null,
    content: typeof content === "string" ? content : String(content),
    created_at: payload.created_at || payload.createdAt || new Date().toISOString(),
    is_deleted: Boolean(payload.is_deleted ?? payload.isDeleted ?? false),
  };
};

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();

  const rawRoomId = params?.roomId;
  const roomId = typeof rawRoomId === "string" ? rawRoomId.trim() : "";

  const { user, accessToken } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = user?.id || user?._id;

  // --- Fetch Chat History ---
  useEffect(() => {
    if (!roomId || !userId || !accessToken) return;

    const fetchChatHistory = async () => {
      try {
        const url = `${API_URL}/chat/room/${roomId}/messages`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const historyMessages = data
            .map((msg) => normalizeMessage(msg))
            .filter(Boolean);
          if (historyMessages.length > 0) {
            setMessages(historyMessages);
          }
        }
      } catch (error) {
        console.error("❌ Network error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [roomId, userId, accessToken]);

  // --- Live Socket Connection ---
  useEffect(() => {
    if (!roomId || !userId) return;
    if (socketRef.current) return;

    const socket = io(API_URL, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      auth: { userId },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socketRef.current = socket;

    socket.on("receive_message", (payload) => {
      const message = normalizeMessage(payload);
      if (!message) return;
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    });

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", { room_id: roomId });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err?.message || err);
      setIsConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔴 Socket disconnected:", reason);
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, userId]);

  // --- Send Message ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || !userId || !socketRef.current || !isConnected) return;

    socketRef.current.emit("send_message", {
      room_id: roomId,
      sender_id: userId,
      content: trimmed,
    });
    setInputMessage("");
  };

  // ============================================================
  // ✅ CRITICAL FIX: Display Raw UTC Time, Do NOT Convert to Local
  // ============================================================
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const timePart = dateString.split("T")[1]?.slice(0, 5);
    if (!timePart) return "";

    const [hourStr, minute] = timePart.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  // ============================================================
  // ✅ UI RENDER
  // ============================================================
  if (isLoading || !userId) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center h-screen bg-[#0A0A0A] text-[#F5F5F5]">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#A3A3A3]">Loading chat...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="flex flex-col h-screen w-screen bg-[#0A0A0A] text-white"
        suppressHydrationWarning
      >
        {/* --- Header --- */}
        <div className="flex items-center justify-between px-4 py-4 bg-[#141414]/80 backdrop-blur-md border-b border-[#2A2A2A] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-[#A0A0A0] hover:text-white p-2 rounded-full hover:bg-[#1A1A1A] transition-all"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-lg font-semibold tracking-tight">Chat</span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-[#A0A0A0] font-medium">
              {isConnected ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* --- Messages Area (Full width) --- */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#6B6B6B]">
              <div className="text-4xl mb-3 opacity-30">💬</div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs text-[#4A4A4A]">
                Say hello to start the conversation
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.sender_id === userId;
              const text = msg.content ?? msg.text ?? msg.message ?? "";

              return (
                <div
                  key={msg._id || `${msg.created_at}-${index}`}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  } animate-fadeIn w-full`}
                >
                  <div
                    className={`p-3.5 rounded-2xl max-w-[75%] break-words text-[15px] leading-relaxed shadow-sm ${
                      isMe
                        ? "bg-[#F5A623] text-[#0A0A0A] rounded-br-none"
                        : "bg-[#1A1A1A] text-white rounded-bl-none border border-[#2A2A2A]"
                    }`}
                  >
                    {text}
                  </div>

                  <span className="text-[10px] text-[#6B6B6B] mt-1 px-1">
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <div className="p-4 bg-[#141414]/80 backdrop-blur-md border-t border-[#2A2A2A]">
          <form
            onSubmit={handleSendMessage}
            className="flex gap-3 w-full max-w-3xl mx-auto"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="flex-1 p-3.5 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] text-white text-[15px] outline-none focus:border-[#F5A623] focus:ring-1 focus:ring-[#F5A623]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#6B6B6B]"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputMessage.trim()}
              className="px-6 py-3.5 bg-[#F5A623] text-[#0A0A0A] font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#F5A623]/20 shrink-0"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out forwards;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}