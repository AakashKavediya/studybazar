// app/search/[id]/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "@/features/auth/authSlice";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProducts from "@/components/profile/ProfileProducts";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SearchProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const dispatch = useDispatch();
  const { accessToken, user: currentUser, isInitialized } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // ✅ FIX: Only fetch when we have a valid token AND auth is initialized
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    if (!isInitialized) return;
    if (!accessToken) {
      setError("Please sign in to view profiles.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/users/public/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
        timeout: 10000,
      });

      if (response.data?.user) {
        const userData = response.data.user;
        setProfile(userData);

        const isOwn = String(currentUser?.id) === String(userData.id);
        setIsOwnProfile(isOwn);
        setIsFollowing(userData.is_following || false);

        if (isOwn) router.replace("/profile");
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      // ✅ Handle 401/404 more gracefully
      if (err.response?.status === 401) {
        setError("Your session has expired. Please sign in again.");
      } else if (err.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, accessToken, currentUser, isInitialized, router]);

  const fetchProducts = useCallback(async () => {
    if (!userId || !accessToken || !isInitialized) return;
    try {
      const response = await axios.get(`${API_URL}/products/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
        timeout: 10000,
      });
      if (response.data?.data?.products) setProducts(response.data.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      // Don't fail the page if products fail
    }
  }, [userId, accessToken, isInitialized]);

  // ✅ FIX: Wait for auth to be initialized before firing
  useEffect(() => {
    if (!isInitialized) return;
    fetchProfile();
    fetchProducts();
  }, [isInitialized, fetchProfile, fetchProducts]);

  const userData = useMemo(
    () => profile || {
      id: "", name: "", email: "", phone: "", campus: "", branch: "", year: "",
      bio: "", profile_image: "", social_links: {}, skills: [], created_at: "",
      rating: 0, total_reviews: 0, products_sold_count: 0, active_listings_count: 0,
      followers_count: 0, following_count: 0, is_verified: false,
    },
    [profile]
  );

  const handleFollow = useCallback(async () => {
    if (!accessToken) return router.push("/auth/signin");
    setIsFollowLoading(true);
    try {
      const url = `${API_URL}/users/${userId}/follow`;
      if (isFollowing) {
        await axios.delete(url, { headers: { Authorization: `Bearer ${accessToken}` } });
      } else {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${accessToken}` } });
      }

      setIsFollowing(!isFollowing);
      setProfile((prev) => prev ? {
        ...prev,
        followers_count: isFollowing ? prev.followers_count - 1 : prev.followers_count + 1
      } : prev);

      if (currentUser) {
        dispatch(setUser({
          ...currentUser,
          following_count: isFollowing
            ? Math.max(0, (currentUser.following_count || 0) - 1)
            : (currentUser.following_count || 0) + 1
        }));
      }
    } catch (err) {
      console.error("Follow Error:", err.response?.data || err);
      alert(err.response?.data?.detail || "Failed to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  }, [userId, isFollowing, accessToken, router, currentUser, dispatch]);

  const handleMessage = useCallback(async () => {
    if (!accessToken) return router.push("/auth/signin");
    setIsMessageLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/chat/room`,
        { participant_id: userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const roomId = response.data._id || response.data.id;
      if (roomId) router.push(`/chat/${roomId}`);
    } catch (err) {
      console.error("Chat Error:", err);
      alert("Failed to open chat.");
    } finally {
      setIsMessageLoading(false);
    }
  }, [userId, accessToken, router]);

  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/search/${userId}`;
    if (navigator.share) navigator.share({ title: userData.name || "User Profile", url });
    else { navigator.clipboard.writeText(url); alert("Profile link copied!"); }
  }, [userData.name, userId]);

  // ✅ Loading while auth initializes OR while fetching profile
  if (!isInitialized || isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Header />
          <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10"><ProfileSkeleton /></div>
          <BottomTabNav />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0A0A0A]">
          <Header />
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <p className="text-white text-lg font-medium">{error || "User not found"}</p>
              <button className="mt-4 text-[#F5A623] hover:underline" onClick={() => router.back()}>Go back</button>
            </div>
          </div>
          <BottomTabNav />
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
            userData={userData}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            isFollowLoading={isFollowLoading}
            isMessageLoading={isMessageLoading}
            onFollow={handleFollow}
            onMessage={handleMessage}
            onShareClick={handleShare}
          />
          <ProfileInfo userData={userData} />
          <ProfileProducts productsListed={products} isOwnProfile={isOwnProfile} />
        </div>
        <BottomTabNav />
      </div>
    </ProtectedRoute>
  );
}