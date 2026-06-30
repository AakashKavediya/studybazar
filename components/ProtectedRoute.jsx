"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const accessToken = useSelector((state) => state.auth.accessToken);

    useEffect(() => {
        if (!accessToken) {
            console.log("🚫 No access token, redirecting to login");
            router.replace("/auth/signin");
        } else {
            console.log("✅ Access token present, showing protected content");
        }
    }, [accessToken, router]);

    if (!accessToken) {
        return null;
    }

    return children;
}