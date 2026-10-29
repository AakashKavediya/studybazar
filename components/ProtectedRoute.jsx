"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user, isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) return;             // wait for AuthInitializer

    if (!accessToken) {
      console.log(`🚫 Not authenticated → /auth/signin from ${pathname}`);
      router.replace(`/auth/signin?next=${encodeURIComponent(pathname)}`);
    } else if (user) {
      console.log("✅ User authenticated:", user.name || user.email);
    }
  }, [isInitialized, accessToken, user, router, pathname]);

  if (!isInitialized || !accessToken) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#262626] border-t-[#F5A623] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[#A3A3A3]">Checking authentication…</p>
        </div>
      </div>
    );
  }

  return children;
}