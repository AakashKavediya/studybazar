// app/chat/page.jsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import HomeChatList from "@/components/home/HomeChatList";

export default function ChatListPage() {
  return (
    <ProtectedRoute>
      <HomeChatList />
    </ProtectedRoute>
  );
}