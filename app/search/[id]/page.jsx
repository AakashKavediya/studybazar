// app/search/[id]/page.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { fetchUserById, toggleFollow } from "@/features/users/usersSlice";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProducts from "@/components/profile/ProfileProducts";

export default function SearchProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const { user: currentUser } = useSelector((state) => state.auth);
  const { profiles, currentUserProfile, loading } = useSelector((state) => state.users);

  const profile = profiles[userId] || currentUserProfile;
  const isOwnProfile = String(currentUser?.id) === String(userId);

  useEffect(() => {
    if (userId) dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (isOwnProfile) router.replace("/profile");
  }, [isOwnProfile, router]);

  const handleFollow = () => {
    dispatch(toggleFollow({ userId, isCurrentlyFollowing: profile?.is_following }));
  };

  const handleMessage = () => {
    router.push(`/chat/${userId}`);
  };

  if (loading && !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Header />
          <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10">
            <ProfileSkeleton />
          </div>
          <BottomTabNav />
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
         <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
            <p className="text-white">User not found</p>
         </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
        <Header />
        <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10">
          <ProfileHero
            userData={profile}
            isOwnProfile={isOwnProfile}
            isFollowing={profile.is_following}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onShareClick={() => {}}
          />
          <ProfileInfo userData={profile} />
          <ProfileProducts
            productsListed={profile.products || []}
            isOwnProfile={isOwnProfile}
          />
        </div>
        <BottomTabNav />
      </div>
    </ProtectedRoute>
  );
}