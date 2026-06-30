// lib/fetchWithAuth.js
import { store } from "@/app/store";
import { setAccessToken, clearAccessToken } from "@/features/auth/authSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function fetchWithAuth(url, options = {}) {
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Important: send cookies
  });

  // If unauthorized, try to refresh
  if (response.status === 401) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include", // Important: send refresh token cookie
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        store.dispatch(setAccessToken(data.access_token));
        
        // Retry the original request with new token
        const retryHeaders = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.access_token}`,
          ...options.headers,
        };

        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
          credentials: "include",
        });
      } else {
        // Refresh failed - logout user
        store.dispatch(clearAccessToken());
        window.location.href = "/auth/signin";
        throw new Error("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("Refresh token error:", error);
      store.dispatch(clearAccessToken());
      window.location.href = "/auth/signin";
      throw error;
    }
  }

  return response;
}