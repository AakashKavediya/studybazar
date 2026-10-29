// app/profile/page.jsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import BottomTabNav from "@/components/BottomTabNav";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileProducts from "@/components/profile/ProfileProducts";
import SettingsSection from "@/components/profile/SettingsSection";

const EditModal = dynamic(() => import("@/components/profile/EditModal"), { ssr: false });
const DeleteModal = dynamic(() => import("@/components/profile/DeleteModal"), { ssr: false });
const PasswordModal = dynamic(() => import("@/components/profile/PasswordModal"), { ssr: false });
const FollowersModal = dynamic(() => import("@/components/profile/FollowersModal"), { ssr: false });

import { setUser, clearAccessToken } from "@/features/auth/authSlice";
import { updateUserProfile, updatePassword, deleteAccount } from "@/services/profileService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.107.168.22";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { accessToken, user } = useSelector((state) => state.auth);

    // ---------- State ----------
    const [isOwnProfile] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // NEW: followers / following modal
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [followersModalTab, setFollowersModalTab] = useState("followers");

    // NEW: products + lost-found
    const [products, setProducts] = useState([]);
    const [lostFoundItems, setLostFoundItems] = useState([]);
    const [stats, setStats] = useState({
        followers: 0,
        following: 0,
        products: 0,
    });

    const [loadingState, setLoadingState] = useState({
        profile: false,
        password: false,
        delete: false,
        products: true,
        lostFound: true,
        stats: true,
    });

    const [deletingProductId, setDeletingProductId] = useState(null);

    // ---------- userData with defaults ----------
    const userData = useMemo(
        () =>
            user || {
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
        [user]
    );

    // ---------- Fetch my products ----------
    const fetchMyProducts = useCallback(async () => {
        if (!accessToken) return;
        setLoadingState((p) => ({ ...p, products: true }));
        try {
            const res = await axios.get(`${API_URL}/products/my-products`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
                params: { page: 1, limit: 50 },
            });
            const items = res.data?.data?.products || [];
            setProducts(items);
        } catch (e) {
            console.error("Failed to fetch my products:", e);
            setProducts([]);
        } finally {
            setLoadingState((p) => ({ ...p, products: false }));
        }
    }, [accessToken]);

    // ---------- Fetch my lost & found ----------
    const fetchMyLostFound = useCallback(async () => {
        if (!accessToken) return;
        setLoadingState((p) => ({ ...p, lostFound: true }));
        try {
            const res = await axios.get(`${API_URL}/lost-and-found/my-items`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
                params: { page: 1, limit: 50 },
            });
            const items = res.data?.data?.items || [];
            setLostFoundItems(items);
        } catch (e) {
            console.error("Failed to fetch my lost-found items:", e);
            setLostFoundItems([]);
        } finally {
            setLoadingState((p) => ({ ...p, lostFound: false }));
        }
    }, [accessToken]);

    // ---------- Fetch followers/following stats ----------
    const fetchStats = useCallback(async () => {
        if (!accessToken) return;
        setLoadingState((p) => ({ ...p, stats: true }));
        try {
            const res = await axios.get(`${API_URL}/users/stats`, {
                headers: { Authorization: `Bearer ${accessToken}` },
                withCredentials: true,
            });
            // Support both possible response shapes
            const data = res.data?.data || res.data || {};
            setStats({
                followers: data.followers ?? data.followers_count ?? 0,
                following: data.following ?? data.following_count ?? 0,
                products: data.products ?? data.products_count ?? 0,
            });
        } catch (e) {
            console.error("Failed to fetch stats:", e);
        } finally {
            setLoadingState((p) => ({ ...p, stats: false }));
        }
    }, [accessToken]);

    // Load everything on mount
    useEffect(() => {
        if (accessToken) {
            fetchMyProducts();
            fetchMyLostFound();
            fetchStats();
        }
    }, [accessToken, fetchMyProducts, fetchMyLostFound, fetchStats]);

    // ---------- Handlers ----------
    const handleEditProfile = useCallback(() => setShowEditModal(true), []);

    const handleShareProfile = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title: userData.name,
                text: `Check out ${userData.name}'s profile on StudyBazaar!`,
                url: `${window.location.origin}/profile/${userData.id}`,
            });
        } else {
            navigator.clipboard.writeText(
                `${window.location.origin}/profile/${userData.id}`
            );
            alert("Profile link copied to clipboard!");
        }
    }, [userData.id, userData.name]);

    const handleSaveProfile = useCallback(
        async (data) => {
            setLoadingState((prev) => ({ ...prev, profile: true }));
            try {
                const updatedUser = await updateUserProfile(accessToken, data);
                dispatch(setUser(updatedUser));
                setShowEditModal(false);
            } catch (error) {
                console.error("Failed to update profile:", error);
                alert(error.message || "Failed to update profile");
            } finally {
                setLoadingState((prev) => ({ ...prev, profile: false }));
            }
        },
        [accessToken, dispatch]
    );

    const handlePasswordUpdate = useCallback(
        async (passwordData) => {
            setLoadingState((prev) => ({ ...prev, password: true }));
            try {
                await updatePassword(accessToken, passwordData);
                alert("✅ Password updated successfully! Please login again.");
                dispatch(clearAccessToken());
                router.push("/auth/signin");
            } catch (error) {
                alert(error.message || "Failed to update password");
            } finally {
                setLoadingState((prev) => ({ ...prev, password: false }));
                setShowPasswordModal(false);
            }
        },
        [accessToken, dispatch, router]
    );

    const handleDeleteAccount = useCallback(async () => {
        setLoadingState((prev) => ({ ...prev, delete: true }));
        try {
            await deleteAccount(accessToken);
            alert("✅ Account deleted successfully");
            dispatch(clearAccessToken());
            router.push("/auth/signin");
        } catch (error) {
            alert(error.message || "Failed to delete account");
        } finally {
            setLoadingState((prev) => ({ ...prev, delete: false }));
            setShowDeleteModal(false);
        }
    }, [accessToken, dispatch, router]);

    const handleLogout = useCallback(async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.warn("Logout request failed:", e);
        } finally {
            dispatch(clearAccessToken());
            router.push("/auth/signin");
        }
    }, [dispatch, router]);

    // NEW: Delete a product
    const handleDeleteProduct = useCallback(
        async (productId) => {
            if (!productId) return;
            if (!confirm("Delete this listing? This cannot be undone.")) return;

            setDeletingProductId(productId);
            try {
                await axios.delete(`${API_URL}/products/${productId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                });
                setProducts((prev) => prev.filter((p) => (p._id || p.id) !== productId));
            } catch (error) {
                console.error("Delete failed:", error);
                alert(error.response?.data?.detail || "Failed to delete product");
            } finally {
                setDeletingProductId(null);
            }
        },
        [accessToken]
    );

    // NEW: open followers/following modal
    const handleOpenFollowers = useCallback((tab = "followers") => {
        setFollowersModalTab(tab);
        setShowFollowersModal(true);
    }, []);

    // ---------- Loading gate ----------
    if (!user) {
        return (
            <ProtectedRoute>
                <div className="flex justify-center items-center h-screen bg-[#0A0A0A]">
                    <div className="text-center">
                        <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-[#A3A3A3]">Loading profile...</p>
                    </div>
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
                        userData={{ ...userData, ...stats, followers_count: stats.followers, following_count: stats.following }}
                        isOwnProfile={isOwnProfile}
                        isFollowing={isFollowing}
                        setIsFollowing={setIsFollowing}
                        onEditClick={handleEditProfile}
                        onShareClick={handleShareProfile}
                        onFollowersClick={() => handleOpenFollowers("followers")}
                        onFollowingClick={() => handleOpenFollowers("following")}
                    />

                    <ProfileInfo userData={userData} />

                    <ProfileProducts
                        productsListed={products}
                        lostFoundItems={lostFoundItems}
                        isLoadingProducts={loadingState.products}
                        isLoadingLostFound={loadingState.lostFound}
                        isOwnProfile={isOwnProfile}
                        onDeleteProduct={handleDeleteProduct}
                        deletingProductId={deletingProductId}
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

                {/* NEW */}
                {showFollowersModal && (
                    <FollowersModal
                        isOpen={showFollowersModal}
                        onClose={() => setShowFollowersModal(false)}
                        userId={userData.id}
                        defaultTab={followersModalTab}
                        accessToken={accessToken}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}