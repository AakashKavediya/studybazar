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
                const response = await fetch(
                    "https://diplomatic-mindfulness-production-621b.up.railway.app/auth/refresh",
                    {
                        method: "POST",
                        credentials: "include",
                    }
                );

                console.log("Refresh Status:", response.status);

                const data = await response.json();

                console.log("Refresh Response:", data);

                if (response.ok) {
                    dispatch(setAccessToken(data.access_token));
                } else {
                    dispatch(clearAccessToken());
                }
            } catch (error) {
                console.error("Refresh Error:", error);
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
                }}
            >
                Loading...
            </div>
        );
    }

    return children;
}