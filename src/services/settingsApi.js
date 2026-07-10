import { apiRequest } from "./apiClient";

export const settingsApi = {
  getWorkspaceSettings(workspaceId) {
    return apiRequest(`/workspaces/${workspaceId}/settings`);
  },

  updateWorkspaceSettings(workspaceId, data) {
    return apiRequest(`/workspaces/${workspaceId}/settings`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
