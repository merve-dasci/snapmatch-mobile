import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { teamService } from "../../services/teamService";

export const fetchUsers = createAsyncThunk(
  "team/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getUsers();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "team/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getRoles();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAccessMatrix = createAsyncThunk(
  "team/fetchAccessMatrix",
  async (_, { rejectWithValue }) => {
    try {
      return await teamService.getAccessMatrix();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "team/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      return await teamService.createUser(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "team/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await teamService.updateUser(id, payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "team/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await teamService.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateRolePermissions = createAsyncThunk(
  "team/updateRolePermissions",
  async ({ roleId, permissions }, { rejectWithValue }) => {
    try {
      return await teamService.updateRolePermissions(roleId, permissions);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState: {
    users: [],
    roles: [],
    accessMatrix: [],
    selectedUser: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchAccessMatrix.fulfilled, (state, action) => {
        state.accessMatrix = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.saving = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.saving = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.users.findIndex(u => u.id === action.payload.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.selectedUser && state.selectedUser.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        const idx = state.roles.findIndex(r => r.id === action.payload.id);
        if (idx !== -1) {
          state.roles[idx] = action.payload;
        }
      });
  }
});

export const { setSelectedUser, clearSelectedUser } = teamSlice.actions;
export default teamSlice.reducer;
