// Create this file: app/chat/[roomId]/page.jsx

"use client";

import { useParams } from "next/navigation";
import ChatComponent from "@/components/chat";

export default function ChatPage() {
  const params = useParams();
  const roomId = params.roomId;

  if (!roomId) {
    return <div>Loading chat...</div>;
  }

  return <ChatComponent roomId={roomId} />;
}