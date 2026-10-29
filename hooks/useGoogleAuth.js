// hooks/useGoogleAuth.js
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAccessToken, setUser } from "@/features/auth/authSlice";
import { fetchUserProfile } from "@/services/profileService";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://3.107.168.22";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// ---------------------------------------------------------------------------
// Module-level singleton state — shared across all hook instances.
// This prevents "initialize() called multiple times" warnings.
// ---------------------------------------------------------------------------
let gsiInitialized = false;
let gsiCallback = null;   // current callback function (updated on each mount)
let gsiPromptCallback = null;

function ensureGsiInitialized() {
  if (typeof window === "undefined") return false;
  if (!window.google?.accounts?.id) return false;
  if (!GOOGLE_CLIENT_ID) return false;

  if (!gsiInitialized) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        // Forward to whichever hook is currently mounted
        if (gsiCallback) gsiCallback(response);
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    gsiInitialized = true;
    console.log("✅ Google Identity Services initialized (once)");
  }
  return true;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useGoogleAuth({ redirectTo = "/" } = {}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ------ Exchange ID token with our backend ------
  const exchangeGoogleToken = useCallback(
    async (idToken) => {
      if (!mountedRef.current) return;
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/auth/google`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const msg = Array.isArray(data.detail)
            ? data.detail[0]?.msg
            : data.detail || "Google sign-in failed";
          if (mountedRef.current) setError(msg);
          return;
        }

        if (!data.access_token) {
          if (mountedRef.current) setError("No access token returned");
          return;
        }

        dispatch(setAccessToken(data.access_token));

        try {
          const profile = await fetchUserProfile(data.access_token);
          if (profile) dispatch(setUser(profile));
        } catch (e) {
          console.warn("Could not fetch profile after Google login:", e);
        }

        router.push(redirectTo);
      } catch (err) {
        console.error("Google login error:", err);
        if (mountedRef.current) setError("Network error. Please try again.");
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [dispatch, router, redirectTo]
  );

  // ------ Register this hook's callback with the singleton ------
  useEffect(() => {
    gsiCallback = (response) => {
      if (!response?.credential) {
        if (mountedRef.current) setError("Google did not return a credential");
        return;
      }
      exchangeGoogleToken(response.credential);
    };

    // Try to init; if script isn't ready, retry a few times
    let attempts = 0;
    const tryInit = () => {
      if (ensureGsiInitialized()) return;
      attempts += 1;
      if (attempts < 25) setTimeout(tryInit, 200); // ~5s max
    };
    tryInit();

    return () => {
      // Don't reset gsiInitialized — keep it global
      gsiCallback = null;
    };
  }, [exchangeGoogleToken]);

  // ------ Render the official Google button ------
  const renderGoogleButton = useCallback((element) => {
    if (!element || typeof window === "undefined") return;
    if (!window.google?.accounts?.id) return;

    // Clear any previous render in this element
    element.innerHTML = "";

    window.google.accounts.id.renderButton(element, {
      theme: "filled_black",
      size: "large",
      text: "continue_with",
      shape: "pill",
      logo_alignment: "left",
      width: element.offsetWidth || 320,
    });
  }, []);

  // ------ Programmatic prompt (fallback for custom button) ------
  const signInWithGoogle = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!window.google?.accounts?.id) {
      setError("Google is still loading. Please try again in a moment.");
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        setError("Google popup was blocked. Please use the button below.");
      }
    });
  }, []);

  return {
    signInWithGoogle,
    renderGoogleButton,
    exchangeGoogleToken,
    isLoading,
    error,
  };
}