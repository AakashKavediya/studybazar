"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    setAccessToken,
    clearAccessToken,
} from "@/features/auth/authSlice";

export default function AuthInitializer({ children }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                console.log("🔄 Restoring session...");
                
                const response = await fetch(
                    "https://diplomatic-mindfulness-production-621b.up.railway.app/auth/refresh",
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                console.log("📡 Refresh Status:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("✅ Refresh Success:", data);
                    if (data.access_token) {
                        dispatch(setAccessToken(data.access_token));
                        console.log("🔑 Access token set in Redux");
                    }
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.log("❌ Refresh failed:", response.status, errorData);
                    dispatch(clearAccessToken());
                }
            } catch (error) {
                console.error("❌ Refresh Error:", error);
                dispatch(clearAccessToken());
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, [dispatch]);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    backgroundColor: "#0A0A0A",
                    color: "#F5F5F5",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ 
                        width: "40px", 
                        height: "40px", 
                        border: "2px solid #262626",
                        borderTop: "2px solid #F5A623",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 16px"
                    }} />
                    <p style={{ fontSize: "14px", color: "#A3A3A3" }}>Loading...</p>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return children;
}