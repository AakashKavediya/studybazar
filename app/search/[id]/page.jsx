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

// Placeholder Data
const PLACEHOLDER_DATA = {
  id: "6a458390d5a2855d3db64645",
  name: "Aakash Kavediya",
  email: "aakash@example.com",
  phone: "+91 98765 43210",
  campus: "KJ Somaiya College of Engineering",
  branch: "Computer Science Engineering",
  year: 3,
  bio: "Passionate about learning and sharing knowledge. I create study notes and resources for engineering students. Currently exploring AI and ML.",
  profile_image: "https://res.cloudinary.com/dtdivzyct/image/upload/v1782945334/dqq3vkaulll7k3cbssti.jpg",
  social_links: {
    github: "https://github.com/aakash",
    twitter: "https://twitter.com/aakash",
    linkedin: "https://linkedin.com/in/aakash",
    website: "https://aakash.dev",
  },
  skills: ["React", "Python", "Machine Learning", "FastAPI", "MongoDB", "Next.js"],
  created_at: "2024-06-01T00:00:00.000Z",
  rating: 4.8,
  total_reviews: 12,
  products_sold_count: 24,
  active_listings_count: 12,
  followers_count: 156,
  following_count: 45,
  is_verified: true,
  productsListed: [
    { id: 1, title: "Data Structures Notes", price: "₹299", category: "notes", image: "https://i.pinimg.com/736x/e7/e5/44/e7e5446faff0d3dec1349dbf4806fe50.jpg" },
    { id: 2, title: "Algorithm Cheat Sheet", price: "₹199", category: "notes", image: "https://i.pinimg.com/736x/93/49/3e/93493e9666cd1a600cd214986e18c256.jpg" },
    { id: 3, title: "Python Programming Guide", price: "₹399", category: "books", image: "https://i.pinimg.com/736x/bc/b1/d1/bcb1d1f579fb6a9ebde33e365ceed123.jpg" },
    { id: 4, title: "Machine Learning Basics", price: "₹499", category: "books", image: "https://i.pinimg.com/1200x/98/13/74/98137436a171703977c5e9321dc2bac4.jpg" },
    { id: 5, title: "Database Management Notes", price: "₹349", category: "notes", image: "https://i.pinimg.com/736x/bf/23/db/bf23db07df26095a83cc081f77d94f2b.jpg" },
    { id: 6, title: "Web Development Course", price: "₹599", category: "lab", image: "https://i.pinimg.com/736x/3c/ef/0b/3cef0b0a61baa4210b33afc13b2a381e.jpg" },
  ],
};

export default function SearchProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const { accessToken, user: currentUser } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // Load placeholder data on mount
  useEffect(() => {
    // Check if the ID matches the placeholder ID
    if (userId === PLACEHOLDER_DATA.id) {
      const currentUserId = String(currentUser?.id || "");
      const placeholderId = String(PLACEHOLDER_DATA.id || "");
      const isOwn = currentUserId !== "" && currentUserId === placeholderId;

      setIsOwnProfile(isOwn);
      setProfile(PLACEHOLDER_DATA);
      setProducts(PLACEHOLDER_DATA.productsListed || []);
      setIsLoading(false);

      if (isOwn) {
        router.replace("/profile");
      }
    } else {
      // If different ID, you would fetch from API here
      // For now, show a message
      setProfile(null);
      setIsLoading(false);
    }
  }, [userId, currentUser, router]);

  // Memoize user data
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsFollowing((prev) => !prev);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              followers_count: isFollowing
                ? Math.max((prev.followers_count || 1) - 1, 0)
                : (prev.followers_count || 0) + 1,
            }
          : prev
      );
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    } finally {
      setIsFollowLoading(false);
    }
  }, [isFollowing, accessToken, router]);

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A]">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-white text-lg font-medium">User not found</p>
            <p className="text-[#666666] text-sm mt-1">The user you're looking for doesn't exist</p>
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