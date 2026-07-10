import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchingService } from "../../services/matchingService";

export const startMatching = createAsyncThunk(
  "matchingJobs/startMatching",
  async (eventId, { rejectWithValue }) => {
    try {
      return await matchingService.startMatching(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMatchingJobs = createAsyncThunk(
  "matchingJobs/fetchMatchingJobs",
  async (eventId, { rejectWithValue }) => {
    try {
      return await matchingService.getMatchingJobs(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMatchingJob = createAsyncThunk(
  "matchingJobs/fetchMatchingJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await matchingService.getMatchingJob(jobId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const cancelMatching = createAsyncThunk(
  "matchingJobs/cancelMatching",
  async (jobId, { rejectWithValue }) => {
    try {
      return await matchingService.cancelMatching(jobId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const matchingJobsSlice = createSlice({
  name: "matchingJobs",
  initialState: {
    jobs: [],
    activeJob: null,
    loading: false,
    processing: false,
    progress: 0,
    error: null,
    thresholdReview: 0.60,
    thresholdApprove: 0.80,
  },
  reducers: {
    setThresholds: (state, action) => {
      const { review, approve } = action.payload;
      if (review !== undefined) state.thresholdReview = review;
      if (approve !== undefined) state.thresholdApprove = approve;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    setProcessing: (state, action) => {
      state.processing = action.payload;
    },
    setActiveJobLocal: (state, action) => {
      state.activeJob = action.payload;
      if (action.payload) {
        state.progress = action.payload.progress;
      }
    },
    clearActiveJob: (state) => {
      state.activeJob = null;
      state.progress = 0;
      state.processing = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startMatching.pending, (state) => {
        state.loading = true;
        state.processing = true;
        state.progress = 0;
        state.error = null;
      })
      .addCase(startMatching.fulfilled, (state, action) => {
        state.loading = false;
        state.activeJob = action.payload;
        state.jobs.push(action.payload);
      })
      .addCase(startMatching.rejected, (state, action) => {
        state.loading = false;
        state.processing = false;
        state.error = action.payload;
      })
      .addCase(fetchMatchingJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMatchingJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchMatchingJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMatchingJob.fulfilled, (state, action) => {
        state.activeJob = action.payload;
        if (action.payload) {
          state.progress = action.payload.progress;
          if (action.payload.status === "completed" || action.payload.status === "failed" || action.payload.status === "cancelled") {
            state.processing = false;
          } else {
            state.processing = true;
          }
          const idx = state.jobs.findIndex(j => j.id === action.payload.id);
          if (idx !== -1) {
            state.jobs[idx] = action.payload;
          }
        }
      })
      .addCase(cancelMatching.fulfilled, (state, action) => {
        if (state.activeJob && state.activeJob.id === action.payload.id) {
          state.activeJob = action.payload;
          state.processing = false;
          state.progress = 0;
        }
        const idx = state.jobs.findIndex(j => j.id === action.payload.id);
        if (idx !== -1) {
          state.jobs[idx] = action.payload;
        }
      });
  }
});

export const { setThresholds, setProgress, setProcessing, setActiveJobLocal, clearActiveJob } = matchingJobsSlice.actions;
export default matchingJobsSlice.reducer;
