import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { guestService } from "../../services/guestService";

export const fetchGuestEvent = createAsyncThunk(
  "guest/fetchGuestEvent",
  async (token, { rejectWithValue }) => {
    try {
      return await guestService.getGuestEventByToken(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const submitConsent = createAsyncThunk(
  "guest/submitConsent",
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      return await guestService.submitGuestConsent(token, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadSelfie = createAsyncThunk(
  "guest/uploadSelfie",
  async ({ token, payload }, { rejectWithValue }) => {
    try {
      return await guestService.uploadGuestSelfie(token, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGuestAlbums = createAsyncThunk(
  "guest/fetchGuestAlbums",
  async (token, { rejectWithValue }) => {
    try {
      return await guestService.getGuestAlbums(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGuestEventPhotos = createAsyncThunk(
  "guest/fetchGuestEventPhotos",
  async ({ token, eventId }, { rejectWithValue }) => {
    try {
      return await guestService.getGuestEventPhotos(token, eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteGuestFaceData = createAsyncThunk(
  "guest/deleteGuestFaceData",
  async (token, { rejectWithValue }) => {
    try {
      return await guestService.deleteGuestFaceData(token);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const guestSlice = createSlice({
  name: "guest",
  initialState: {
    event: null,
    participant: null,
    albums: [],
    photos: [],
    favorites: [],
    loading: "idle",
    error: null,
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const photo = action.payload;
      const idx = state.favorites.findIndex(p => p.id === photo.id);
      if (idx !== -1) {
        state.favorites = state.favorites.filter(p => p.id !== photo.id);
      } else {
        state.favorites.push(photo);
      }
    },
    clearGuestSession: (state) => {
      state.event = null;
      state.participant = null;
      state.albums = [];
      state.photos = [];
      state.favorites = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuestEvent.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchGuestEvent.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.event = action.payload;
      })
      .addCase(fetchGuestEvent.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(uploadSelfie.fulfilled, (state, action) => {
        state.participant = action.payload;
      })
      .addCase(fetchGuestAlbums.fulfilled, (state, action) => {
        state.albums = action.payload;
      })
      .addCase(fetchGuestEventPhotos.fulfilled, (state, action) => {
        state.photos = action.payload;
      })
      .addCase(deleteGuestFaceData.fulfilled, (state) => {
        state.participant = null;
        state.photos = [];
        state.favorites = [];
      });
  },
});

export const { toggleFavorite, clearGuestSession } = guestSlice.actions;
export default guestSlice.reducer;
