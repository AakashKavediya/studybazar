"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    setAccessToken,
    clearAccessToken,
    setUser,
} from "@/features/auth/authSlice";
import { fetchUserProfile } from "@/services/profileService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const [loading, setLoadingState] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                console.log("🔄 Restoring session...");
                
                const refreshResponse = await fetch(
                    `${API_URL}/auth/refresh`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    }
                );

                console.log("📡 Refresh Status:", refreshResponse.status);

                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    const accessToken = refreshData.access_token;
                    
                    if (accessToken) {
                        dispatch(setAccessToken(accessToken));
                        console.log("🔑 Access token set in Redux");
                        
                        try {
                            const userData = await fetchUserProfile(accessToken);
                            if (userData) {
                                console.log("👤 User profile loaded successfully:", userData.name || "User");
                                dispatch(setUser(userData));
                            } else {
                                console.warn("⚠️ User profile data was empty or invalid.");
                            }
                        } catch (profileError) {
                            console.error("❌ Failed to fetch profile:", profileError);
                        }
                    }
                } else {
                    console.log("❌ Refresh failed, clearing session");
                    dispatch(clearAccessToken());
                }
            } catch (error) {
                console.error("❌ Auth Error:", error);
                dispatch(clearAccessToken());
            } finally {
                setLoadingState(false);
            }
        };

        restoreSession();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0A0A0A] text-[#F5F5F5]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-[#A3A3A3]">Loading...</p>
                </div>
            </div>
        );
    }

    return children;
}