import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customersService } from "../../services/customersService";

export const fetchCustomers = createAsyncThunk(
    "customers/fetchCustomers",
    async (_, { rejectWithValue }) => {
        try {
            return await customersService.getCustomers();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const createCustomer = createAsyncThunk(
    "customers/createCustomer",
    async (payload, { rejectWithValue }) => {
        try {
            return await customersService.createCustomer(payload);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateCustomer = createAsyncThunk(
    "customers/updateCustomer",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await customersService.updateCustomer(id, payload);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const deleteCustomer = createAsyncThunk(
    "customers/deleteCustomer",
    async (id, { rejectWithValue }) => {
        try {
            return await customersService.deleteCustomer(id);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const customersSlice = createSlice({
    name: "customers",
    initialState: {
        items: [],
        selectedCustomer: null,
        saving: false,
        loading: "idle",
        error: null,
    },
    reducers: {
        selectCustomer: (state, action) => {
            state.selectedCustomer = action.payload;
        },
        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = "loading";
                state.error = null;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
            .addCase(createCustomer.pending, (state) => {
                state.saving = true;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.saving = false;
                state.items.push(action.payload);
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload;
            })
            .addCase(updateCustomer.pending, (state) => {
                state.saving = true;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.saving = false;
                const idx = state.items.findIndex((c) => c.id === action.payload.id);
                if (idx !== -1) {
                    state.items[idx] = action.payload;
                }
                if (state.selectedCustomer && state.selectedCustomer.id === action.payload.id) {
                    state.selectedCustomer = action.payload;
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload;
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.items = state.items.filter((c) => c.id !== action.payload);
                if (state.selectedCustomer && state.selectedCustomer.id === action.payload) {
                    state.selectedCustomer = null;
                }
            });
    },
});

export const { selectCustomer, clearSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
