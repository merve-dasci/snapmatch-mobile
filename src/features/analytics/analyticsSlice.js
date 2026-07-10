import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { analyticsService } from "../../services/analyticsService";

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/fetchDashboardAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.getDashboardAnalytics();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEventAnalytics = createAsyncThunk(
  "analytics/fetchEventAnalytics",
  async (eventId, { rejectWithValue }) => {
    try {
      return await analyticsService.getEventAnalytics(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const recalculateAnalytics = createAsyncThunk(
  "analytics/recalculateAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      return await analyticsService.recalculateAnalytics();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    workspaceStats: {
      totalEvents: 0,
      activeEvents: 0,
      totalPhotos: 0,
      totalParticipants: 0,
      overallMatchRate: 0,
      pendingReviews: 0,
      storageUsedGB: 0,
      storageLimitGB: 100,
    },
    eventStats: {},
    weeklyUploadActivity: [],
    recentActivities: [],
    selectedEventAnalytics: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAnalyticsState: (state) => {
      state.workspaceStats = {
        totalEvents: 0,
        activeEvents: 0,
        totalPhotos: 0,
        totalParticipants: 0,
        overallMatchRate: 0,
        pendingReviews: 0,
        storageUsedGB: 0,
        storageLimitGB: 100,
      };
      state.eventStats = {};
      state.weeklyUploadActivity = [];
      state.recentActivities = [];
      state.selectedEventAnalytics = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.workspaceStats = action.payload.workspaceStats || state.workspaceStats;
          state.weeklyUploadActivity = action.payload.weeklyUploadActivity || [];
          state.recentActivities = action.payload.recentActivities || [];
        }
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEventAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEventAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEventAnalytics = action.payload;
      })
      .addCase(fetchEventAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(recalculateAnalytics.fulfilled, (state, action) => {
        if (action.payload) {
          state.workspaceStats = action.payload.workspaceStats || state.workspaceStats;
          state.weeklyUploadActivity = action.payload.weeklyUploadActivity || [];
          state.recentActivities = action.payload.recentActivities || [];
        }
      });
  },
});

export const { clearAnalyticsState } = analyticsSlice.actions;
export default analyticsSlice.reducer;
