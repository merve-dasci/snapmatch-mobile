import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { messagesService } from "../../services/messagesService";

export const fetchMessages = createAsyncThunk(
    "messages/fetchMessages",
    async (_, { rejectWithValue }) => {
        try {
            return await messagesService.getMessages();
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "messages/sendMessage",
    async ({ senderId, receiverId, text }, { rejectWithValue }) => {
        try {
            return await messagesService.sendMessage(senderId, receiverId, text);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const messagesSlice = createSlice({
    name: "messages",
    initialState: {
        items: [],
        activeContactId: null,
        sending: false,
        loading: "idle",
        error: null,
    },
    reducers: {
        setActiveContact: (state, action) => {
            state.activeContactId = action.payload;
        },
        clearMessagesState: (state) => {
            state.items = [];
            state.activeContactId = null;
            state.sending = false;
            state.loading = "idle";
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = "loading";
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = "failed";
                state.error = action.payload;
            })
            .addCase(sendMessage.pending, (state) => {
                state.sending = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.sending = false;
                if (action.payload) {
                    state.items.push(action.payload);
                }
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.sending = false;
                state.error = action.payload;
            });
    },
});

export const { setActiveContact, clearMessagesState } = messagesSlice.actions;
export default messagesSlice.reducer;