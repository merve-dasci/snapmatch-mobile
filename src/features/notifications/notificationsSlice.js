import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { notificationsService } from "../../services/notificationsService";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsService.getNotifications();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      return await notificationsService.markAsRead(id);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationsService.markAllAsRead();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: "idle",
    error: null,
  },
  reducers: {
    // Client-side quick increment or update
    addLocalNotification: (state, action) => {
      const newNot = {
        id: "not_" + Date.now(),
        read: false,
        created_at: new Date().toISOString(),
        ...action.payload,
      };
      state.items.unshift(newNot);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1 && !state.items[idx].read) {
          state.items[idx].read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = 0;
      });
  },
});

export const { addLocalNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;
