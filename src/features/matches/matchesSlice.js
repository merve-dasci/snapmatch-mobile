import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchesService } from "../../services/matchesService";

export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      return await matchesService.getMatches();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMatchesByEvent = createAsyncThunk(
  "matches/fetchMatchesByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await matchesService.getMatches(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateMatchStatus = createAsyncThunk(
  "matches/updateMatchStatus",
  async ({ matchId, status }, { rejectWithValue }) => {
    try {
      return await matchesService.updateMatchStatus(matchId, status);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createManualMatch = createAsyncThunk(
  "matches/createManualMatch",
  async (payload, { rejectWithValue }) => {
    try {
      return await matchesService.createManualMatch(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    items: [],
    selectedMatch: null,
    loading: false,
    updating: false,
    error: null,
  },
  reducers: {
    setSelectedMatch: (state, action) => {
      state.selectedMatch = action.payload;
    },
    clearSelectedMatch: (state) => {
      state.selectedMatch = null;
    },
    clearMatches: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchMatches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetchMatchesByEvent
      .addCase(fetchMatchesByEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchesByEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMatchesByEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // updateMatchStatus
      .addCase(updateMatchStatus.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateMatchStatus.fulfilled, (state, action) => {
        state.updating = false;
        const idx = state.items.findIndex(m => m.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedMatch && state.selectedMatch.id === action.payload.id) {
          state.selectedMatch = action.payload;
        }
      })
      .addCase(updateMatchStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // createManualMatch
      .addCase(createManualMatch.pending, (state) => {
        state.updating = true;
      })
      .addCase(createManualMatch.fulfilled, (state, action) => {
        state.updating = false;
        state.items.push(action.payload);
      })
      .addCase(createManualMatch.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedMatch, clearSelectedMatch, clearMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
