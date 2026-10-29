// components/AuthInitializer.jsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAccessToken, setInitialized, clearAccessToken, fetchCurrentUser } from "@/features/auth/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          if (data.access_token) {
            dispatch(setAccessToken(data.access_token));
            // Now fetch user profile using the thunk
            await dispatch(fetchCurrentUser()).unwrap();
          }
        } else {
          dispatch(clearAccessToken());
        }
      } catch (error) {
        console.error("❌ Auth Restore Error:", error);
        dispatch(clearAccessToken());
      } finally {
        dispatch(setInitialized(true));
      }
    };

    if (!isInitialized) {
      restoreSession();
    }
  }, [dispatch, isInitialized]);

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