// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "sm_access_token";

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

const initialState = {
  accessToken: getInitialToken(),   // ← hydrate on first render
  user: null,
  isInitialized: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      // persist to sessionStorage (survives navigations & reloads within the tab)
      if (typeof window !== "undefined") {
        try {
          if (action.payload) {
            sessionStorage.setItem(STORAGE_KEY, action.payload);
          } else {
            sessionStorage.removeItem(STORAGE_KEY);
          }
        } catch {}
      }
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.user = null;
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
  },
});

export const {
  setAccessToken,
  clearAccessToken,
  setUser,
  setLoading,
  setError,
  clearUser,
  setInitialized,
} = authSlice.actions;

export default authSlice.reducer;