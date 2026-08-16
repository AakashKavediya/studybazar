"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import io from "socket.io-client";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { use } from "react"; // ✅ Import use() from React

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import MessageBubble from "@/components/chat/MessageBubble";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// ✅ This is the correct way to handle async params in Next.js 15+
export default function ChatRoomPage({ params }) {
  // Unwrap the params promise using React.use()
  const { id: roomId } = use(params);

  const router = useRouter();
  const { accessToken, user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const messagesEndRef = useRef(null);

  // Connect WebSocket
  useEffect(() => {
    if (!accessToken || !roomId) return;

    const newSocket = io(API_URL, {
      transports: ["websocket"],
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      newSocket.emit("join_room", { room_id: roomId });
    });

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("message_deleted", (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.message_id ? { ...msg, is_deleted: true } : msg
        )
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken, roomId]);

  // Fetch message history
  const fetchMessages = useCallback(async () => {
    if (!accessToken || !roomId) return;
    try {
      const response = await axios.get(
        `${API_URL}/chat/room/${roomId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, roomId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit("send_message", {
      room_id: roomId,
      content: input.trim(),
      sender_id: user?.id,
    });

    setInput("");
  };

  const handleDelete = (messageId) => {
    if (!socket) return;
    socket.emit("delete_message", {
      message_id: messageId,
      user_id: user?.id,
    });
  };

  if (!roomId) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <p>Invalid room ID</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-20 flex flex-col">
      <Header />

      <div className="max-w-2xl mx-auto w-full px-4 flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="flex items-center gap-4 py-4 border-b border-[#2A2A2A]">
          <button onClick={() => router.back()} className="text-[#A3A3A3] hover:text-white">
            <FaArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold">Chat</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          {isLoading ? (
            <div className="text-center text-[#6B6B6B] py-10">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[#6B6B6B] py-10">
              No messages yet. Say hello!
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.sender_id === user?.id}
                onDelete={handleDelete}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="py-4 border-t border-[#2A2A2A] flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder:text-[#6B6B6B] focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 bg-white text-black rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaPaperPlane size={16} />
          </button>
        </form>
      </div>

      <BottomTabNav />
    </div>
  );
}