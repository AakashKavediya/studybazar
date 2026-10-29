// components/home/HomePosts.jsx
"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";

export default function HomePosts({ posts, isLoading }) {
  const [likedPosts, setLikedPosts] = useState({});

  const toggleLike = (id) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#141414] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2A2A2A]" />
              <div className="flex-1 space-y-1">
                <div className="h-3 w-1/3 bg-[#2A2A2A] rounded" />
                <div className="h-2 w-1/4 bg-[#2A2A2A] rounded" />
              </div>
            </div>
            <div className="w-full h-64 bg-[#2A2A2A] rounded-lg" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full bg-[#2A2A2A] rounded" />
              <div className="h-3 w-3/4 bg-[#2A2A2A] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[#A0A0A0]">
        <div className="text-6xl mb-4 opacity-30">📭</div>
        <p className="text-sm font-medium">No posts yet.</p>
        <p className="text-xs mt-1 text-[#6B6B6B]">Follow others to see their posts here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {posts.map((post) => (
        <div key={post._id || post.id} className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden">
          
          {/* Header: User Info */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5A623] to-[#E0961A] flex items-center justify-center text-[10px] font-bold text-[#0A0A0A]">
                {post.user_name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">{post.user_name || "Anonymous"}</p>
                <p className="text-[10px] text-[#6B6B6B]">{post.location || "Unknown"}</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full aspect-square bg-[#1A1A1A]">
            {post.image ? (
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#6B6B6B]">
                <span className="text-4xl opacity-30">📷</span>
              </div>
            )}
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-4 p-4 pb-2">
            <button onClick={() => toggleLike(post._id || post.id)} className="text-[#A0A0A0] hover:text-[#FF453A] transition-colors">
              {likedPosts[post._id || post.id] ? <FaHeart size={22} className="text-[#FF453A]" /> : <FaRegHeart size={22} />}
            </button>
            <button className="text-[#A0A0A0] hover:text-white transition-colors">
              <FaComment size={22} />
            </button>
            <button className="ml-auto text-[#A0A0A0] hover:text-white transition-colors">
              <FaShare size={20} />
            </button>
          </div>

          {/* Likes & Caption */}
          <div className="px-4 pb-3">
            <p className="text-[14px] font-semibold text-white mb-1">
              {likedPosts[post._id || post.id] ? 124 : 123} likes
            </p>
            <div className="flex items-start gap-2">
              <span className="text-[14px] font-semibold text-white flex-shrink-0">
                {post.user_name || "Anonymous"}
              </span>
              <p className="text-[14px] text-[#A0A0A0] leading-relaxed">
                {post.title}
                <span className="ml-1 text-[#6B6B6B] font-normal">— {post.description || ""}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}