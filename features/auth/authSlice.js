// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    user: null,        // Store full user profile
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        clearAccessToken: (state) => {
            state.accessToken = null;
            state.user = null;
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
    },
});

export const { 
    setAccessToken, 
    clearAccessToken, 
    setUser, 
    setLoading, 
    setError,
    clearUser 
} = authSlice.actions;

export default authSlice.reducer;