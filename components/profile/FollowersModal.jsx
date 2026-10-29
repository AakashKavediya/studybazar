// app/profile/components/FollowersModal.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { X, Loader2, UserPlus, UserMinus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${process.env.NEXT_PUBLIC_API_URL}";

export default function FollowersModal({
  isOpen,
  onClose,
  userId,
  defaultTab = "followers",
  accessToken,
}) {
  const router = useRouter();
  const [tab, setTab] = useState(defaultTab);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionUserId, setActionUserId] = useState(null);

  // Reset tab when modal opens
  useEffect(() => {
    if (isOpen) setTab(defaultTab);
  }, [isOpen, defaultTab]);

  const fetchList = useCallback(
    async (kind) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const url = `${API_URL}/users/${userId}/${kind}`;
        const res = await axios.get(url, {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
          withCredentials: true,
        });

        // Backend may return either:
        //  - { status, results: [...] }
        //  - { data: [...] }
        //  - { followers: [...] } / { following: [...] }
        const list =
          res.data?.results ||
          res.data?.data ||
          res.data?.[kind] ||
          [];

        if (kind === "followers") setFollowers(list);
        else setFollowing(list);
      } catch (err) {
        console.error(`Failed to load ${kind}:`, err);
        setError(
          err.response?.data?.detail || `Failed to load ${kind}.`
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, accessToken]
  );

  useEffect(() => {
    if (!isOpen) return;
    // Fetch both so switching tabs is instant
    fetchList("followers");
    fetchList("following");
  }, [isOpen, fetchList]);

  const handleFollowToggle = useCallback(
    async (targetId, currentlyFollowing) => {
      if (!accessToken) return;
      setActionUserId(targetId);
      try {
        const url = `${API_URL}/users/${targetId}/follow`;
        await axios({
          method: currentlyFollowing ? "DELETE" : "POST",
          url,
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        // Optimistically update both lists
        const updater = (list) =>
          list.map((u) =>
            (u.id || u._id) === targetId
              ? { ...u, is_following: !currentlyFollowing }
              : u
          );
        setFollowers(updater);
        setFollowing(updater);
      } catch (err) {
        console.error("Follow toggle failed:", err);
        alert(err.response?.data?.detail || "Failed to update follow status");
      } finally {
        setActionUserId(null);
      }
    },
    [accessToken]
  );

  const navigateToProfile = useCallback(
    (id) => {
      onClose();
      router.push(`/search/${id}`);
    },
    [onClose, router]
  );

  if (!isOpen) return null;

  const list = tab === "followers" ? followers : following;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#161616] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTab("followers")}
              className={`text-sm font-semibold pb-1 transition-colors ${
                tab === "followers"
                  ? "text-white border-b-2 border-[#F5A623]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Followers
              <span className="ml-1 text-xs text-white/40">
                {followers.length}
              </span>
            </button>
            <button
              onClick={() => setTab("following")}
              className={`text-sm font-semibold pb-1 transition-colors ${
                tab === "following"
                  ? "text-white border-b-2 border-[#F5A623]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              Following
              <span className="ml-1 text-xs text-white/40">
                {following.length}
              </span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#1A1A1A] text-white/60 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && list.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-[#F5A623]" />
            </div>
          ) : error && list.length === 0 ? (
            <div className="text-center py-16 text-[#FF3B30] text-sm">
              {error}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-white/40 text-sm">
              {tab === "followers"
                ? "No followers yet."
                : "Not following anyone yet."}
            </div>
          ) : (
            <ul className="divide-y divide-[#1A1A1A]">
              {list.map((user) => {
                const id = user.id || user._id;
                const isFollowing = user.is_following ?? (tab === "following");
                const isSelf = user.is_self ?? false;

                return (
                  <li
                    key={id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#1A1A1A] transition-colors"
                  >
                    {/* Avatar */}
                    <button
                      onClick={() => navigateToProfile(id)}
                      className="flex-shrink-0"
                    >
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt={user.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#262626]"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[#0A0A0A] font-bold text-base">
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* Name + campus */}
                    <button
                      onClick={() => navigateToProfile(id)}
                      className="flex-1 min-w-0 text-left"
                    >
                      <p className="text-sm font-medium text-white truncate">
                        {user.name || "Unknown"}
                      </p>
                      {user.campus && (
                        <p className="text-xs text-white/40 truncate">
                          {user.campus}
                        </p>
                      )}
                    </button>

                    {/* Follow / Unfollow */}
                    {!isSelf && (
                      <button
                        disabled={actionUserId === id}
                        onClick={() => handleFollowToggle(id, isFollowing)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isFollowing
                            ? "bg-[#1A1A1A] text-white/70 hover:bg-[#262626]"
                            : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
                        }`}
                      >
                        {actionUserId === id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : isFollowing ? (
                          <>
                            <UserMinus size={12} /> Following
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} /> Follow
                          </>
                        )}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}