// components/chat/Chat.jsx (or index.jsx)
"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

export default function Chat({ roomId }) { // ✅ Receive roomId as prop
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const socketRef = useRef(null);

  // ✅ Fix: Wait for user data properly
  useEffect(() => {
    // Check if user is loaded
    const userId = user?.id || user?._id;
    if (userId) {
      setIsUserLoaded(true);
      console.log("✅ User ID loaded:", userId);
    } else {
      // If not loaded, wait a bit and check again
      const interval = setInterval(() => {
        const newUserId = user?.id || user?._id;
        if (newUserId) {
          setIsUserLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [user]);

  // ✅ Fix: Only connect socket when both roomId and user are ready
  useEffect(() => {
    if (!roomId || !isUserLoaded || !user) {
      console.log("⏳ Waiting for roomId or user...");
      return;
    }

    const userId = user.id || user._id;
    
    console.log("🔌 Connecting socket for room:", roomId, "user:", userId);

    const socket = io("http://localhost:3000", {
      path: "/api/socket.io",
      auth: { userId: userId },
      transports: ["websocket", "polling"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected!");
      setIsConnected(true);
      socket.emit("join_room", { room_id: roomId });
    });

    socket.on("receive_message", (message) => {
      console.log("📩 Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, isUserLoaded, user]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // ✅ Critical: Double-check user ID before sending
    const userId = user?.id || user?._id;
    if (!userId) {
      console.error("❌ Cannot send message: User ID missing");
      alert("Please wait, user data is still loading...");
      return;
    }

    if (!socketRef.current || !isConnected) {
      console.error("❌ Socket not connected");
      return;
    }

    const messageData = {
      room_id: roomId,
      sender_id: userId,
      content: inputMessage
    };

    console.log("📤 Sending message:", messageData);
    socketRef.current.emit("send_message", messageData);
    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 p-3 bg-[#141414] rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-[#A0A0A0]">{isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 px-2">
        {messages.length === 0 ? (
          <div className="text-center text-[#6B6B6B] py-10">
            No messages yet. Say hello!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="flex flex-col">
              <div className={`p-3 rounded-xl max-w-[70%] ${
                msg.sender_id === (user?.id || user?._id)
                  ? "bg-[#F5A623] text-[#0A0A0A] self-end"
                  : "bg-[#1A1A1A] text-white self-start"
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-[#6B6B6B] mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          disabled={!isConnected || !isUserLoaded}
          className="flex-1 p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white outline-none focus:border-[#F5A623] disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={!isConnected || !isUserLoaded || !inputMessage.trim()}
          className="px-6 py-3 bg-[#F5A623] text-[#0A0A0A] font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}