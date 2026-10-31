// components/AuthInitializer.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  setAccessToken, 
  setInitialized, 
  clearAccessToken, 
  fetchCurrentUser 
} from "@/features/auth/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isInitialized, accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only run the auth restoration once on app mount
    if (isInitialized) return;

    const restoreSession = async () => {
      try {
        // 1. Try to silently refresh the token using the HttpOnly cookie
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include", // Required for cookies
          headers: { "Content-Type": "application/json" },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.access_token) {
            dispatch(setAccessToken(data.access_token));
            await dispatch(fetchCurrentUser()).unwrap();
            return; // Success, exit early
          }
        }

        // 2. FALLBACK: If refresh fails (e.g., Safari blocked the cookie), 
        // but we have a token in sessionStorage, use it.
        if (accessToken) {
          console.log("⚠️ Cookie refresh failed. Using sessionStorage fallback.");
          await dispatch(fetchCurrentUser()).unwrap();
        } else {
          // No cookie and no session token -> logout
          dispatch(clearAccessToken());
        }

      } catch (error) {
        console.error("❌ Auth Restore Error:", error);
        
        // Even if there's a network error, if we have a token, try to use it
        if (accessToken) {
          try {
            await dispatch(fetchCurrentUser()).unwrap();
          } catch (e) {
            dispatch(clearAccessToken());
          }
        } else {
          dispatch(clearAccessToken());
        }
      } finally {
        // Always mark initialized so ProtectedRoute stops spinning
        dispatch(setInitialized(true));
      }
    };

    restoreSession();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isInitialized]); // Deliberately exclude accessToken so it doesn't re-run

  if (!isInitialized) {
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