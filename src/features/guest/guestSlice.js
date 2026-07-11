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
    
    token: null,
    onboardingStep: "qr",
    activeTab: "photos",
    selectedEventId: null,
    selectedPhoto: null,
    albumViewMode: "grid",
    consent: {
      kvkk: false,
      faceRecognition: false,
      terms: false
    },
    selfie: {
      captured: false,
      url: ""
    },
    matchedPhotosByEvent: {},
    upload: {
      files: [],
      progress: 0,
      status: "idle",
      uploadedCount: 0,
      totalCount: 0,
      error: null
    },
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
      state.token = null;
      state.onboardingStep = "qr";
      state.activeTab = "photos";
      state.selectedEventId = null;
      state.selectedPhoto = null;
      state.albumViewMode = "grid";
      state.consent = {
        kvkk: false,
        faceRecognition: false,
        terms: false
      };
      state.selfie = {
        captured: false,
        url: ""
      };
      state.matchedPhotosByEvent = {};
      state.upload = {
        files: [],
        progress: 0,
        status: "idle",
        uploadedCount: 0,
        totalCount: 0,
        error: null
      };
    },
    setGuestToken: (state, action) => {
      state.token = action.payload;
    },
    setOnboardingStep: (state, action) => {
      state.onboardingStep = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSelectedEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
    setSelectedPhoto: (state, action) => {
      state.selectedPhoto = action.payload;
    },
    setAlbumViewMode: (state, action) => {
      state.albumViewMode = action.payload;
    },
    setConsent: (state, action) => {
      state.consent = { ...state.consent, ...action.payload };
    },
    setSelfie: (state, action) => {
      state.selfie = { ...state.selfie, ...action.payload };
    },
    setUploadFiles: (state, action) => {
      state.upload.files = action.payload;
      state.upload.totalCount = action.payload.length;
    },
    removeUploadFile: (state, action) => {
      if (typeof action.payload === "number") {
        state.upload.files.splice(action.payload, 1);
      } else {
        state.upload.files = state.upload.files.filter(f => f.name !== action.payload);
      }
      state.upload.totalCount = state.upload.files.length;
    },
    clearUploadFiles: (state) => {
      state.upload.files = [];
      state.upload.totalCount = 0;
    },
    setUploadProgress: (state, action) => {
      state.upload.progress = action.payload;
    },
    setUploadStatus: (state, action) => {
      state.upload.status = action.payload;
    },
    resetUploadState: (state) => {
      state.upload = {
        files: [],
        progress: 0,
        status: "idle",
        uploadedCount: 0,
        totalCount: 0,
        error: null
      };
    },
    setMatchedPhotosForEvent: (state, action) => {
      const { eventId, photos } = action.payload;
      state.matchedPhotosByEvent[eventId] = photos;
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

export const {
  toggleFavorite,
  clearGuestSession,
  setGuestToken,
  setOnboardingStep,
  setActiveTab,
  setSelectedEventId,
  setSelectedPhoto,
  setAlbumViewMode,
  setConsent,
  setSelfie,
  setUploadFiles,
  removeUploadFile,
  clearUploadFiles,
  setUploadProgress,
  setUploadStatus,
  resetUploadState,
  setMatchedPhotosForEvent
} = guestSlice.actions;

export default guestSlice.reducer;
