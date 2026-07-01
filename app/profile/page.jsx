// app/profile/page.jsx (or ProfilePage.jsx)
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Static imports for components that are always needed
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProducts from "@/components/profile/ProfileProducts";
import SettingsSection from "@/components/profile/SettingsSection";

// Dynamic imports for modals (load only when needed)
const EditModal = dynamic(
    () => import("@/components/profile/EditModal"),
    { ssr: false }
);
const DeleteModal = dynamic(
    () => import("@/components/profile/DeleteModal"),
    { ssr: false }
);
const PasswordModal = dynamic(
    () => import("@/components/profile/PasswordModal"),
    { ssr: false }
);

// Redux actions
import { setUser, clearAccessToken } from "@/features/auth/authSlice";
import { updateUserProfile, updatePassword, deleteAccount } from "@/services/profileService";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { accessToken, user } = useSelector((state) => state.auth);
    
    // State
    const [isOwnProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loadingState, setLoadingState] = useState({
        profile: false,
        password: false,
        delete: false,
    });

    // Memoized user data with defaults
    const userData = useMemo(() => user || {
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
        productsListed: [],
        productsSold: [],
        productsPurchased: [],
    }, [user]);

    // Handle Edit Profile - memoized
    const handleEditProfile = useCallback(() => {
        setShowEditModal(true);
    }, []);

    // Handle Share Profile - memoized
    const handleShareProfile = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title: userData.name,
                text: `Check out ${userData.name}'s profile on StudyBazaar!`,
                url: `${window.location.origin}/profile/${userData.id}`,
            });
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/profile/${userData.id}`);
            alert("Profile link copied to clipboard!");
        }
    }, [userData.id, userData.name]);

    // Handle Save Profile - memoized
    const handleSaveProfile = useCallback(async (data) => {
        setLoadingState(prev => ({ ...prev, profile: true }));
        try {
            const updatedUser = await updateUserProfile(accessToken, data);
            dispatch(setUser(updatedUser));
            console.log("✅ Profile updated successfully");
            setShowEditModal(false);
        } catch (error) {
            console.error("❌ Failed to update profile:", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setLoadingState(prev => ({ ...prev, profile: false }));
        }
    }, [accessToken, dispatch]);

    // Handle Password Update - memoized
    const handlePasswordUpdate = useCallback(async (passwordData) => {
        setLoadingState(prev => ({ ...prev, password: true }));
        try {
            await updatePassword(accessToken, passwordData);
            alert("✅ Password updated successfully! Please login again.");
            dispatch(clearAccessToken());
            router.push("/auth/signin");
        } catch (error) {
            console.error("❌ Failed to update password:", error);
            alert(error.message || "Failed to update password");
        } finally {
            setLoadingState(prev => ({ ...prev, password: false }));
            setShowPasswordModal(false);
        }
    }, [accessToken, dispatch, router]);

    // Handle Delete Account - memoized
    const handleDeleteAccount = useCallback(async () => {
        setLoadingState(prev => ({ ...prev, delete: true }));
        try {
            await deleteAccount(accessToken);
            alert("✅ Account deleted successfully");
            dispatch(clearAccessToken());
            router.push("/auth/signin");
        } catch (error) {
            console.error("❌ Failed to delete account:", error);
            alert(error.message || "Failed to delete account");
        } finally {
            setLoadingState(prev => ({ ...prev, delete: false }));
            setShowDeleteModal(false);
        }
    }, [accessToken, dispatch, router]);

    // Handle Logout - memoized
    const handleLogout = useCallback(async () => {
        try {
            const response = await fetch(
                "https://diplomatic-mindfulness-production-621b.up.railway.app/auth/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );
            
            if (response.ok) {
                dispatch(clearAccessToken());
                router.push("/auth/signin");
            }
        } catch (error) {
            console.error("Logout error:", error);
            dispatch(clearAccessToken());
            router.push("/auth/signin");
        }
    }, [dispatch, router]);

    // Show loading if no user data yet
    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0A0A0A]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[#A3A3A3]">Loading profile...</p>
                </div>
            </div>
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
                        setIsFollowing={setIsFollowing}
                        onEditClick={handleEditProfile}
                        onShareClick={handleShareProfile}
                    />

                    <ProfileInfo userData={userData} />

                    <ProfileProducts
                        productsListed={userData.productsListed || []}
                        productsSold={userData.productsSold || []}
                        productsPurchased={userData.productsPurchased || []}
                        isOwnProfile={isOwnProfile}
                    />

                    {isOwnProfile && (
                        <SettingsSection
                            onPasswordClick={() => setShowPasswordModal(true)}
                            onDeleteClick={() => setShowDeleteModal(true)}
                            onLogoutClick={handleLogout}
                        />
                    )}
                </div>

                <BottomTabNav />

                {showEditModal && (
                    <EditModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        userData={userData}
                        onSave={handleSaveProfile}
                        isLoading={loadingState.profile}
                    />
                )}

                {showDeleteModal && (
                    <DeleteModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDeleteAccount}
                        isLoading={loadingState.delete}
                    />
                )}

                {showPasswordModal && (
                    <PasswordModal
                        isOpen={showPasswordModal}
                        onClose={() => setShowPasswordModal(false)}
                        onConfirm={handlePasswordUpdate}
                        isLoading={loadingState.password}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}