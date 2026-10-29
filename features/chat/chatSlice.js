// features/chat/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetchChatRooms = createAsyncThunk(
  "chat/fetchRooms",
  async (_, { getState, rejectWithValue }) => {
    const { accessToken } = getState().auth;
    try {
      const res = await fetch(`${API_URL}/chat/rooms`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    isLoading: false,
    activeRoomId: null,
    connected: false,
  },
  reducers: {
    setActiveRoom: (state, action) => {
      state.activeRoomId = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => { state.isLoading = true; })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state) => { state.isLoading = false; });
  },
});

export const { setActiveRoom, setSocketConnected } = chatSlice.actions;
export default chatSlice.reducer;