"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {

    const router = useRouter();

    const accessToken = useSelector(
        (state) => state.auth.accessToken
    );

    useEffect(() => {

        if (!accessToken) {
            router.replace("/auth/signin");
        }

    }, [accessToken, router]);

    if (!accessToken) {
        return null;
    }

    return children;
}