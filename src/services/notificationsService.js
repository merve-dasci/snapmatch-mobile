import { notificationsApi } from "./notificationsApi";

const NOTIFICATIONS_KEY = "sm_notifications";

const defaultNotifications = [
  {
    id: "not_1",
    title: "Yeni Eşleşme Bulundu!",
    message: "Mezuniyet Töreni 2026 etkinliğinde 3 yeni fotoğrafınız eşleşti.",
    type: "match",
    read: false,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
  },
  {
    id: "not_2",
    title: "Etkinlik QR Kodu Hazır",
    message: "Mezuniyet Töreni 2026 etkinliğine ait giriş QR kodu ve kısa linki üretildi.",
    type: "system",
    read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
  },
  {
    id: "not_3",
    title: "Ekibe Yeni Uploader Eklendi",
    message: "Kemal Altın davet bağlantısını kullanarak ekibinize uploader olarak katıldı.",
    type: "team",
    read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
  },
  {
    id: "not_4",
    title: "Depolama Alanı Uyarısı",
    message: "Workspace depolama alanınız %90 doluluğa ulaştı. Limit yükseltmeyi düşünebilirsiniz.",
    type: "warning",
    read: true,
    created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
  },
];

const getStoredNotifications = () => {
  try {
    const val = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!val) {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
      return defaultNotifications;
    }
    return JSON.parse(val);
  } catch (e) {
    return defaultNotifications;
  }
};

const saveStoredNotifications = (data) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data));
  } catch (e) {
    // ignored
  }
};

const getWorkspaceId = () => {
  try {
    const saved = localStorage.getItem("snapmatch_auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.workspaceId || parsed.workspace_id;
    }
  } catch (e) {}
  return null;
};

export const notificationsService = {
  getNotifications: async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return getStoredNotifications();
    }
    try {
      const data = await notificationsApi.getNotifications(workspaceId);
      return data.notifications || data || [];
    } catch (err) {
      console.warn("Sunucudan bildirimler alınamadı, yerel mock veriye düşülüyor:", err);
      return getStoredNotifications();
    }
  },

  markAsRead: async (id) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const list = getStoredNotifications();
      const idx = list.findIndex((n) => n.id === id);
      if (idx !== -1) {
        list[idx].read = true;
        saveStoredNotifications(list);
        return list[idx];
      }
      throw new Error("Notification not found");
    }
    try {
      const data = await notificationsApi.markAsRead(workspaceId, id);
      return data.notification || data;
    } catch (err) {
      console.warn("Bildirim okundu işaretlenemedi, yerel mock veriye düşülüyor:", err);
      const list = getStoredNotifications();
      const idx = list.findIndex((n) => n.id === id);
      if (idx !== -1) {
        list[idx].read = true;
        saveStoredNotifications(list);
        return list[idx];
      }
      throw err;
    }
  },

  markAllAsRead: async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const list = getStoredNotifications().map((n) => ({ ...n, read: true }));
      saveStoredNotifications(list);
      return list;
    }
    try {
      await notificationsApi.markAllAsRead(workspaceId);
      const list = getStoredNotifications().map((n) => ({ ...n, read: true }));
      saveStoredNotifications(list);
      return list;
    } catch (err) {
      console.warn("Tümünü okundu işaretleme API hatası, yerel mock veriye düşülüyor:", err);
      const list = getStoredNotifications().map((n) => ({ ...n, read: true }));
      saveStoredNotifications(list);
      return list;
    }
  },
};
