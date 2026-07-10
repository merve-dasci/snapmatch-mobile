import { apiRequest } from "./apiClient";

export const eventsApi = {
  getWorkspaceEvents(workspaceId) {
    return apiRequest(`/workspaces/${workspaceId}/events`);
  },

  createWorkspaceEvent(workspaceId, data) {
    return apiRequest(`/workspaces/${workspaceId}/events`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getEvent(eventId) {
    return apiRequest(`/events/${eventId}`);
  },

  updateEventAccess(eventId, data) {
    return apiRequest(`/events/${eventId}/access`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
