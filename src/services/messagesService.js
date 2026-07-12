import { mockApi } from "./mockApi";
import { messagesApi } from "./messagesApi";

// eventsService / teamService ile aynı desen:
// oturumda workspaceId varsa gerçek backend'e gider, yoksa veya hata olursa
// mockApi'ye düşer.
const getWorkspaceId = () => {
    try {
        const saved = localStorage.getItem("snapmatch_auth");
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.workspaceId || parsed.workspace_id;
        }
    } catch (e) {
        // ignored
    }
    return null;
};

export const messagesService = {
    getMessages: async () => {
        const workspaceId = getWorkspaceId();
        if (!workspaceId) {
            return mockApi.getMessages();
        }
        try {
            const data = await messagesApi.getMessages(workspaceId);
            return data.messages || data || [];
        } catch (err) {
            console.error("Mesajlar sunucudan alınamadı, mockApi'ye düşülüyor:", err);
            return mockApi.getMessages();
        }
    },

    sendMessage: async (senderId, receiverId, text) => {
        const workspaceId = getWorkspaceId();
        if (!workspaceId) {
            return mockApi.sendMessage(senderId, receiverId, text);
        }
        try {
            const data = await messagesApi.sendMessage(workspaceId, {
                sender_id: senderId,
                receiver_id: receiverId,
                text,
            });
            return data.message || data;
        } catch (err) {
            console.error("Mesaj sunucuya gönderilemedi, mockApi'ye düşülüyor:", err);
            return mockApi.sendMessage(senderId, receiverId, text);
        }
    },
};