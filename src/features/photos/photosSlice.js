import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { photosService } from "../../services/photosService";

export const fetchPhotosByEvent = createAsyncThunk(
  "photos/fetchPhotosByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await photosService.getPhotos(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadPhotos = createAsyncThunk(
  "photos/uploadPhotos",
  async ({ eventId, files, source }, { rejectWithValue }) => {
    try {
      return await photosService.uploadPhotos(eventId, files, source);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deletePhoto = createAsyncThunk(
  "photos/deletePhoto",
  async (photoId, { rejectWithValue }) => {
    try {
      await photosService.deletePhoto(photoId);
      return photoId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUploadBatchesByEvent = createAsyncThunk(
  "photos/fetchUploadBatchesByEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      return await photosService.getUploadBatches(eventId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const photosSlice = createSlice({
  name: "photos",
  initialState: {
    items: [],
    batches: [],
    loading: "idle",
    uploading: false,
    uploadProgress: 0,
    error: null,
    selectedEventId: null,
  },
  reducers: {
    setSelectedEventId: (state, action) => {
      state.selectedEventId = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setUploading: (state, action) => {
      state.uploading = action.payload;
    },
    clearPhotosState: (state) => {
      state.items = [];
      state.batches = [];
      state.loading = "idle";
      state.uploading = false;
      state.uploadProgress = 0;
      state.error = null;
      state.selectedEventId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotosByEvent.pending, (state) => {
        state.loading = "loading";
        state.error = null;
      })
      .addCase(fetchPhotosByEvent.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchPhotosByEvent.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(uploadPhotos.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadPhotos.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = 100;
        state.items = [...action.payload, ...state.items];
      })
      .addCase(uploadPhotos.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.id !== action.payload);
      })
      .addCase(fetchUploadBatchesByEvent.fulfilled, (state, action) => {
        state.batches = action.payload;
      });
  },
});

export const { setSelectedEventId, setUploadProgress, setUploading, clearPhotosState } = photosSlice.actions;
export default photosSlice.reducer;
