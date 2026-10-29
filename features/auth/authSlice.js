// features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const STORAGE_KEY = "sm_access_token";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
};

// Thunk to fetch user profile
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;
    if (!accessToken) return rejectWithValue("No access token");

    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      return data.user || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  accessToken: getInitialToken(),
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
      if (typeof window !== "undefined") {
        try {
          if (action.payload) sessionStorage.setItem(STORAGE_KEY, action.payload);
          else sessionStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
      state.user = null;
      if (typeof window !== "undefined") {
        try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setAccessToken, clearAccessToken, setUser, setInitialized } = authSlice.actions;
export default authSlice.reducer;