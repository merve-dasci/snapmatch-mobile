import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { settingsService } from "../../services/settingsService";

export const fetchWorkspaceSettings = createAsyncThunk(
  "settings/fetchWorkspaceSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getWorkspaceSettings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateWorkspaceSettings = createAsyncThunk(
  "settings/updateWorkspaceSettings",
  async (payload, { rejectWithValue }) => {
    try {
      return await settingsService.updateWorkspaceSettings(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPrivacySettings = createAsyncThunk(
  "settings/fetchPrivacySettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getPrivacySettings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updatePrivacySettings = createAsyncThunk(
  "settings/updatePrivacySettings",
  async (payload, { rejectWithValue }) => {
    try {
      return await settingsService.updatePrivacySettings(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchStorageSettings = createAsyncThunk(
  "settings/fetchStorageSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getStorageSettings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchApiSettings = createAsyncThunk(
  "settings/fetchApiSettings",
  async (_, { rejectWithValue }) => {
    try {
      return await settingsService.getApiSettings();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    workspaceSettings: {
      watermarkEnabled: true,
      title: "Okano Photography Studio",
      logo: "📷"
    },
    privacySettings: {
      retentionPolicy: "6_months",
      defaultConsentText: ""
    },
    storageSettings: {
      storageLimitGB: 100,
      storageUsedGB: 32.4
    },
    apiSettings: {
      publicKey: "pk_test_mock_public_key_value_12345",
      secretKey: "sk_test_mock_secret_key_value_12345"
    },
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearSettingsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaceSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaceSettings = action.payload;
      })
      .addCase(fetchWorkspaceSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWorkspaceSettings.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateWorkspaceSettings.fulfilled, (state, action) => {
        state.saving = false;
        state.workspaceSettings = action.payload;
      })
      .addCase(fetchPrivacySettings.fulfilled, (state, action) => {
        state.privacySettings = action.payload;
      })
      .addCase(updatePrivacySettings.pending, (state) => {
        state.saving = true;
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.saving = false;
        state.privacySettings = action.payload;
      })
      .addCase(fetchStorageSettings.fulfilled, (state, action) => {
        state.storageSettings = action.payload;
      })
      .addCase(fetchApiSettings.fulfilled, (state, action) => {
        state.apiSettings = action.payload;
      });
  }
});

export const { clearSettingsError } = settingsSlice.actions;
export default settingsSlice.reducer;
