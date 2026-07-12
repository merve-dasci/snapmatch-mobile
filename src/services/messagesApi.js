import { apiRequest } from "./apiClient";

// Gerçek backend uç noktaları. Backend rotaların farklıysa sadece buradaki
// path'leri güncellemen yeterli; service ve slice katmanı değişmez.
export const messagesApi = {
    // Bir workspace altındaki tüm mesajları getirir.
    getMessages(workspaceId) {
        return apiRequest(`/workspaces/${workspaceId}/messages`);
    },

    // Yeni mesaj gönderir.
    sendMessage(workspaceId, data) {
        return apiRequest(`/workspaces/${workspaceId}/messages`, {
            method: "POST",
            body: JSON.stringify(data),
        });
    },
};