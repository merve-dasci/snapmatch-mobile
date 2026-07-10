import { apiRequest } from "./apiClient";

export const teamApi = {
  getMembers(eventId) {
    return apiRequest(`/events/${eventId}/members`);
  },

  createUploaderLink(eventId, data) {
    return apiRequest(`/events/${eventId}/uploader-link`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateMember(eventId, userId, data) {
    return apiRequest(`/events/${eventId}/members/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  removeMember(eventId, userId) {
    return apiRequest(`/events/${eventId}/members/${userId}`, {
      method: "DELETE",
    });
  },
};
