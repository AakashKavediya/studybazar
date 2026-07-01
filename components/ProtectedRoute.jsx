// components/ProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { accessToken, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!accessToken) {
            console.log("🚫 No access token, redirecting to login");
            router.replace("/auth/signin");
        } else if (user) {
            console.log("✅ User authenticated:", user.name);
        }
    }, [accessToken, user, router]);

    if (!accessToken) {
        return null;
    }

    return children;
}