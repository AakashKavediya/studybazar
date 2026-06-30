// AuthInitializer.jsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    setAccessToken,
    clearAccessToken,
} from "@/features/auth/authSlice";
import styles from "./AuthInitializer.module.css";

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
            <div className={styles.loader}>
                <div className={styles.container}>
                    <div className={styles.spinner} />
                    <p className={styles.text}>Loading...</p>
                </div>
            </div>
        );
    }

    return children;
}