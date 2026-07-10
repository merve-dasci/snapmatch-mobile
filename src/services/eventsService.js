import { mockApi } from "./mockApi";
import { eventsApi } from "./eventsApi";

const getWorkspaceId = () => {
  try {
    const saved = localStorage.getItem("snapmatch_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.workspaceId;
    }
  } catch (e) {
    // ignored
  }
  return null;
};

export const eventsService = {
  getEvents: async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return mockApi.getEvents();
    }
    try {
      const data = await eventsApi.getWorkspaceEvents(workspaceId);
      return data.events || [];
    } catch (err) {
      console.error("Failed to fetch workspace events, falling back to mockApi:", err);
      return mockApi.getEvents();
    }
  },
  getEventById: async (id) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return mockApi.getEventById(id);
    }
    try {
      const data = await eventsApi.getEvent(id);
      return data.event || data;
    } catch (err) {
      console.error("Failed to fetch event details, falling back to mockApi:", err);
      return mockApi.getEventById(id);
    }
  },
  createEvent: async (payload) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return mockApi.createEvent(payload);
    }
    try {
      const data = await eventsApi.createWorkspaceEvent(workspaceId, payload);
      return data.event || data;
    } catch (err) {
      console.error("Failed to create event, falling back to mockApi:", err);
      return mockApi.createEvent(payload);
    }
  },
  updateEvent: async (id, payload) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return mockApi.updateEvent(id, payload);
    }
    try {
      if (payload.access_type || payload.access_password) {
        const data = await eventsApi.updateEventAccess(id, {
          access_type: payload.access_type,
          access_password: payload.access_password
        });
        return data.event || data;
      }
      return mockApi.updateEvent(id, payload);
    } catch (err) {
      console.error("Failed to update event access, falling back to mockApi:", err);
      return mockApi.updateEvent(id, payload);
    }
  },
  deleteEvent: async (id) => {
    mockApi.deleteEvent(id);
    return true;
  }
};
