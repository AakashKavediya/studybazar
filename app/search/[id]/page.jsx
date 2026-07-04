"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";

import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProducts from "@/components/profile/ProfileProducts";
import { ProfileHero, ProfileSkeleton } from "@/components/search_profile";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://diplomatic-mindfulness-production-621b.up.railway.app";

export default function SearchProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const { accessToken, user: currentUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch profile data from API
  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers,
        withCredentials: true,
      });

      if (response.data?.user) {
        const userData = response.data.user;
        setProfile(userData);

        // Check if this is the current user's profile
        const currentUserId = String(currentUser?.id || "");
        const profileId = String(userData.id || "");
        const isOwn = currentUserId !== "" && currentUserId === profileId;

        setIsOwnProfile(isOwn);
        setIsFollowing(userData.is_following || false);

        // If it's own profile, redirect to /profile
        if (isOwn) {
          router.replace("/profile");
        }
      } else {
        setError("User not found");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to load profile. Please try again.");
      }
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, accessToken, currentUser, router]);

  // Fetch user products
  const fetchProducts = useCallback(async () => {
    if (!userId) return;

    try {
      const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
      // You'll need to implement this endpoint later
      const response = await axios.get(`${API_URL}/users/${userId}/products`, {
        headers,
        withCredentials: true,
      });

      if (response.data?.products) {
        setProducts(response.data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      // Don't set error for products - just show empty
      setProducts([]);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchProfile();
    fetchProducts();
  }, [fetchProfile, fetchProducts]);

  // Memoize user data with defaults
  const userData = useMemo(
    () =>
      profile || {
        id: "",
        name: "",
        email: "",
        phone: "",
        campus: "",
        branch: "",
        year: "",
        bio: "",
        profile_image: "",
        social_links: {},
        skills: [],
        created_at: "",
        rating: 0,
        total_reviews: 0,
        products_sold_count: 0,
        active_listings_count: 0,
        followers_count: 0,
        following_count: 0,
        is_verified: false,
      },
    [profile]
  );

  // Handle follow/unfollow
  const handleFollow = useCallback(async () => {
    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }

    setIsFollowLoading(true);
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await axios({
        method: isFollowing ? "DELETE" : "POST",
        url: `${API_URL}/users/${userId}/${endpoint}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      if (response.data?.data) {
        setIsFollowing(!isFollowing);
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                followers_count: response.data.data.followers_count,
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
      alert(err.response?.data?.detail || "Failed to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  }, [userId, isFollowing, accessToken, router]);

  // Handle message
  const handleMessage = useCallback(() => {
    if (!accessToken) {
      router.push("/auth/signin");
      return;
    }
    router.push(`/chat/${userId}`);
  }, [userId, accessToken, router]);

  // Handle share
  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/search/${userId}`;
    if (navigator.share) {
      navigator.share({
        title: userData.name || "User Profile",
        text: `Check out ${userData.name || "this profile"} on StudyBazaar!`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    }
  }, [userData.name, userId]);

  // Handle back
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Handle edit
  const handleEdit = useCallback(() => {
    router.push("/profile/edit");
  }, [router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Header />
        <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10">
          <ProfileSkeleton />
        </div>
        <BottomTabNav />
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-white text-lg font-medium">
              {error === "User not found" ? "User not found" : "Something went wrong"}
            </p>
            <p className="text-[#666666] text-sm mt-1">
              {error === "User not found"
                ? "The user you're looking for doesn't exist"
                : "Please try again later"}
            </p>
            <button
              className="mt-4 text-[#F5A623] hover:underline"
              onClick={handleBack}
            >
              Go back
            </button>
          </div>
        </div>
        <BottomTabNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] pb-20">
      <Header />

      <div className="max-w-[1200px] mx-auto px-5 py-5 pb-10">
        <ProfileHero
          userData={userData}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          onFollow={handleFollow}
          onMessage={handleMessage}
          onEditClick={handleEdit}
          onShareClick={handleShare}
        />

        <ProfileInfo userData={userData} />

        <ProfileProducts
          productsListed={products}
          productsSold={[]}
          productsPurchased={[]}
          isOwnProfile={isOwnProfile}
        />
      </div>

      <BottomTabNav />
    </div>
  );
}