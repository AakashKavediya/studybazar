"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
  const roomId = typeof rawRoomId === 'string' ? rawRoomId.trim() : '';

  // ✅ Get both user AND accessToken from Redux
  const { user, accessToken } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const userId = user?.id || user?._id;

  // ============================================================
  // ✅ LOAD CHAT HISTORY ON PAGE LOAD (With Auth Token)
  // ============================================================
  useEffect(() => {
    if (!roomId || !userId || !accessToken) return;

    const fetchChatHistory = async () => {
      try {
        const url = `${API_URL}/chat/room/${roomId}/messages`;
        console.log(`📜 Fetching chat history from: ${url}`);
        
        // ✅ CRITICAL FIX: Include the Bearer Token
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log("📜 Fetch Response Status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("📜 History Data received:", data);
          
          const historyMessages = data.map(msg => normalizeMessage(msg)).filter(Boolean);
          
          if (historyMessages.length > 0) {
            console.log(`✅ Loaded ${historyMessages.length} past messages.`);
            setMessages(historyMessages);
          }
        } else {
          console.error(`❌ Failed to fetch history. Status: ${response.status}`);
        }
      } catch (error) {
        console.error("❌ Network error fetching chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [roomId, userId, accessToken]); // ✅ Added accessToken as a dependency

  // ============================================================
  // ✅ LIVE SOCKET CONNECTION
  // ============================================================
  useEffect(() => {
    if (!roomId || !userId) return;
    if (socketRef.current) return;

    console.log(`✅ Connecting to room: "${roomId}"`);

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

    const handleReceiveMessage = (payload) => {
      const message = normalizeMessage(payload);
      if (!message) return;

      console.log("📩 FRONTEND RECEIVED MESSAGE:", message);

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === message._id);
        if (exists) return prev;
        return [...prev, message];
      });

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    socket.on("connect", () => {
      console.log("✅ Socket connected");
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
      socket.off("receive_message", handleReceiveMessage);
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, userId]);

  // ============================================================
  // ✅ SEND MESSAGE
  // ============================================================
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || !userId || !socketRef.current || !isConnected) return;

    const messageData = {
      room_id: roomId,
      sender_id: userId,
      content: trimmed,
    };

    console.log("📤 Sending message:", messageData);
    socketRef.current.emit("send_message", messageData);
    setInputMessage("");
  };

  // ============================================================
  // ✅ UI RENDER
  // ============================================================
  if (isLoading || !userId) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0A0A] text-[#F5F5F5]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#A3A3A3]">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white max-w-3xl mx-auto" suppressHydrationWarning>
      
      <div className="flex items-center justify-between p-4 bg-[#141414] border-b border-[#2A2A2A]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-[#A0A0A0] hover:text-white p-2 rounded-lg hover:bg-[#1A1A1A]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-semibold">Chat</span>
        </div>

        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-[#A0A0A0]">{isConnected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#6B6B6B]">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.sender_id === userId;
            const text = msg.content ?? msg.text ?? msg.message ?? "";

            return (
              <div
                key={msg._id || `${msg.created_at}-${index}`}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"} animate-fadeIn`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[75%] break-words text-[15px] ${
                    isMe
                      ? "bg-[#F5A623] text-[#0A0A0A] rounded-br-none"
                      : "bg-[#1A1A1A] text-white rounded-bl-none"
                  }`}
                >
                  {text}
                </div>

                <span className="text-[10px] text-[#6B6B6B] mt-1 px-1">
                  {msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
                </span>
              </div>
            );
          })
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#141414] border-t border-[#2A2A2A]">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1 p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white text-[15px] outline-none focus:border-[#F5A623] transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[#6B6B6B]"
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-6 py-3.5 bg-[#F5A623] text-[#0A0A0A] font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Send
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
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
  );
}