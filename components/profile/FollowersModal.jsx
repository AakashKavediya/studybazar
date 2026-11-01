"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { X, Loader2, UserPlus, UserMinus } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
  const [actionUserId, setActionUserId] = useState(null);

  useEffect(() => {
    if (isOpen) setTab(defaultTab);
  }, [isOpen, defaultTab]);

  const fetchLists = useCallback(async () => {
    // ✅ Safety check
    if (!userId || !accessToken) {
      console.log("❌ Modal missing userId or accessToken", { userId, accessToken });
      return;
    }

    setLoading(true);
    try {
      // ✅ Make sure we're calling the API correctly
      const followersUrl = `${API_URL}/users/${userId}/followers`;
      const followingUrl = `${API_URL}/users/${userId}/following`;

      console.log("🔍 Fetching followers from:", followersUrl);
      
      const [followersRes, followingRes] = await Promise.all([
        axios.get(followersUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        axios.get(followingUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      // ✅ Log the actual backend response
      console.log("✅ Followers API response:", followersRes.data);
      console.log("✅ Following API response:", followingRes.data);

      // ✅ Set the lists exactly as they come from the backend
      setFollowers(followersRes.data?.results || []);
      setFollowing(followingRes.data?.results || []);
    } catch (err) {
      console.error("❌ Failed to load lists:", err);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please refresh the page.");
      }
    } finally {
      setLoading(false);
    }
  }, [userId, accessToken]);

  // ✅ Trigger fetch every time the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchLists();
    }
  }, [isOpen, fetchLists]);

  const handleFollowToggle = async (targetId, currentlyFollowing) => {
    setActionUserId(targetId);
    try {
      if (currentlyFollowing) {
        await axios.delete(`${API_URL}/users/${targetId}/follow`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } else {
        await axios.post(`${API_URL}/users/${targetId}/follow`, {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      }
      // Refresh after toggle
      await fetchLists();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update follow status.");
    } finally {
      setActionUserId(null);
    }
  };

  if (!isOpen) return null;

  const list = tab === "followers" ? followers : following;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={onClose}>
      <div className="bg-[#161616] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#262626]">
          <div className="flex items-center gap-6">
            {/* ✅ Show real counts */}
            <button onClick={() => setTab("followers")} className={`text-sm font-semibold pb-1 transition-colors ${tab === "followers" ? "text-white border-b-2 border-[#F5A623]" : "text-white/40"}`}>
              Followers <span className="text-xs ml-1 opacity-60">{followers.length}</span>
            </button>
            <button onClick={() => setTab("following")} className={`text-sm font-semibold pb-1 transition-colors ${tab === "following" ? "text-white border-b-2 border-[#F5A623]" : "text-white/40"}`}>
              Following <span className="text-xs ml-1 opacity-60">{following.length}</span>
            </button>
          </div>
          <button onClick={onClose} className="p-2 text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[#F5A623]" size={24} /></div>
          ) : list.length === 0 ? (
            <div className="text-center py-16 text-white/40 text-sm">
              {tab === "followers" ? "No followers yet." : "Not following anyone yet."}
            </div>
          ) : (
            <ul className="divide-y divide-[#1A1A1A]">
              {list.map((user) => (
                <li key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1A1A1A]">
                  <button onClick={() => { onClose(); router.push(`/search/${user.id}`); }} className="flex-shrink-0">
                    {user.profile_image ? (
                      <img src={user.profile_image} className="w-11 h-11 rounded-full object-cover border border-[#262626]" alt="" />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[#0A0A0A] font-bold">
                        {(user.name || "?")[0].toUpperCase()}
                      </div>
                    )}
                  </button>
                  <div className="flex-1 min-w-0" onClick={() => { onClose(); router.push(`/search/${user.id}`); }}>
                    <p className="text-sm font-medium text-white truncate">{user.name || "Unknown User"}</p>
                    <p className="text-xs text-white/40 truncate">{user.campus || "Student"}</p>
                  </div>

                  {!user.is_self && (
                    <button
                      disabled={actionUserId === user.id}
                      onClick={() => handleFollowToggle(user.id, user.is_following)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        user.is_following
                          ? "bg-[#1A1A1A] text-white/70 hover:bg-[#262626]"
                          : "bg-[#F5A623] text-[#0A0A0A] hover:opacity-90"
                      }`}
                    >
                      {actionUserId === user.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : user.is_following ? (
                        <><UserMinus size={12} /> Following</>
                      ) : (
                        <><UserPlus size={12} /> Follow</>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}