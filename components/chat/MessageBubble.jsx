"use client";

import { useState, useRef, useEffect } from "react";
import { FaTrash, FaEllipsisH } from "react-icons/fa";

export default function MessageBubble({ message, isOwn, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isDeleted = message.is_deleted;
  const createdAt = new Date(message.created_at);
  const now = new Date();
  const ageInMinutes = (now - createdAt) / (1000 * 60);
  const canDelete = isOwn && !isDeleted && ageInMinutes < 30;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isDeleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className="max-w-[70%] px-4 py-2 rounded-2xl bg-[#1A1A1A] text-[#6B6B6B] text-sm italic">
          This message was deleted
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwn ? "bg-white text-black" : "bg-[#1A1A1A] text-white"
        }`}
      >
        <p className="break-words">{message.content}</p>
        <div className="flex justify-end items-center gap-2 mt-1">
          <span className="text-[10px] opacity-60">{formatTime(createdAt)}</span>
          {isOwn && canDelete && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="text-[10px] opacity-60 hover:opacity-100 transition-opacity"
              >
                <FaEllipsisH size={12} />
              </button>
              {showMenu && (
                <div className="absolute bottom-6 right-0 bg-[#141414] border border-[#2A2A2A] rounded-lg p-1 shadow-xl z-10 w-28">
                  <button
                    onClick={() => {
                      onDelete(message._id);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#EF4444] hover:bg-[#1A1A1A] rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}