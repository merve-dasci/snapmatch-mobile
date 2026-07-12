import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: localStorage.getItem("theme") || "soft-light",
    sidebarCollapsed: false,
    layoutMode: "standard",
    activeModal: null,
    globalLoading: false,
    error: null,
    toasts: [],
    globalSearchQuery: "",
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setLayoutMode: (state, action) => {
      state.layoutMode = action.payload;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: `t_${Date.now()}`,
        message: action.payload.message,
        type: action.payload.type || "success"
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    setGlobalSearchQuery: (state, action) => {
      state.globalSearchQuery = action.payload;
    }
  }
});

export const { 
  toggleSidebar, 
  setSidebarCollapsed, 
  setTheme, 
  setLayoutMode, 
  setActiveModal, 
  setGlobalLoading, 
  setError,
  addToast,
  removeToast,
  setGlobalSearchQuery
} = uiSlice.actions;
export default uiSlice.reducer;
