import { apiRequest } from "./apiClient";

export const notificationsApi = {
  // Get all notifications for the workspace
  getNotifications(workspaceId) {
    return apiRequest(`/workspaces/${workspaceId}/notifications`);
  },

  // Mark a single notification as read
  markAsRead(workspaceId, id) {
    return apiRequest(`/workspaces/${workspaceId}/notifications/${id}/read`, {
      method: "PATCH",
    });
  },

  // Mark all notifications as read
  markAllAsRead(workspaceId) {
    return apiRequest(`/workspaces/${workspaceId}/notifications/read-all`, {
      method: "POST",
    });
  },
};
