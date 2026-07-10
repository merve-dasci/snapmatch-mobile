import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { participantsService } from "../../services/participantsService";

export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (_, { rejectWithValue }) => {
    try {
      return await participantsService.getParticipants();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchParticipantsByEvent = createAsyncThunk(
  "participants/fetchParticipantsByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await participantsService.getParticipants(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createParticipant = createAsyncThunk(
  "participants/createParticipant",
  async (payload, { rejectWithValue }) => {
    try {
      return await participantsService.createParticipant(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteParticipantFaceData = createAsyncThunk(
  "participants/deleteParticipantFaceData",
  async (participantId, { rejectWithValue }) => {
    try {
      await participantsService.deleteParticipantFaceData(participantId);
      return participantId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  "participants/deleteParticipant",
  async (participantId, { rejectWithValue }) => {
    try {
      await participantsService.deleteParticipant(participantId);
      return participantId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState: {
    items: [],
    selectedParticipant: null,
    loading: "idle",
    error: null,
  },
  reducers: {
    setSelectedParticipant: (state, action) => {
      state.selectedParticipant = action.payload;
    },
    clearSelectedParticipant: (state) => {
      state.selectedParticipant = null;
    },
    clearParticipants: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchParticipants
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      // fetchParticipantsByEvent
      .addCase(fetchParticipantsByEvent.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchParticipantsByEvent.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchParticipantsByEvent.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      // createParticipant
      .addCase(createParticipant.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // deleteParticipantFaceData
      .addCase(deleteParticipantFaceData.fulfilled, (state, action) => {
        const idx = state.items.findIndex(p => p.id === action.payload);
        if (idx !== -1) {
          state.items[idx].selfie_url = null;
          state.items[idx].status = "inactive";
        }
        if (state.selectedParticipant && state.selectedParticipant.id === action.payload) {
          state.selectedParticipant.selfie_url = null;
          state.selectedParticipant.status = "inactive";
        }
      })
      // deleteParticipant
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
        if (state.selectedParticipant && state.selectedParticipant.id === action.payload) {
          state.selectedParticipant = null;
        }
      });
  },
});

export const { setSelectedParticipant, clearSelectedParticipant, clearParticipants } = participantsSlice.actions;
export default participantsSlice.reducer;
