// features/users/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (userId, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("User not found");
      const data = await res.json();
      return data.user || data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFollow = createAsyncThunk(
  "users/toggleFollow",
  async ({ userId, isCurrentlyFollowing }, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;
    if (!accessToken) return rejectWithValue("Not authenticated");

    try {
      const method = isCurrentlyFollowing ? "DELETE" : "POST";
      const res = await fetch(`${API_URL}/users/${userId}/follow`, {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update follow status");
      return { userId, isFollowing: !isCurrentlyFollowing };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    currentUserProfile: null,
    // Cache for profiles viewed in /search/[id]
    profiles: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => { state.loading = true; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserProfile = action.payload;
        state.profiles[action.payload.id] = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        if (state.profiles[userId]) {
          state.profiles[userId].is_following = isFollowing;
        }
        if (state.currentUserProfile?.id === userId) {
          state.currentUserProfile.is_following = isFollowing;
        }
      });
  },
});

export default usersSlice.reducer;