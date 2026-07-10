import { teamApi } from "./teamApi";
import { mockApi } from "./mockApi";

const getStoredData = (key, fallback) => {
  const val = localStorage.getItem(key);
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
};

const saveStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const defaultUsers = [
  { id: "u_1", name: "Ezgi Çelik", email: "ezgi@snapmatch.me", role: "admin", roleName: "Firma Admini", assigned: "Tüm Etkinlikler", status: "active", active: "Şimdi Aktif", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: "u_2", name: "Kemal Altın", email: "kemal@example.com", role: "uploader", roleName: "Uploader (Asistan)", assigned: "Ece & Mert Düğünü", status: "active", active: "3 saat önce", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  { id: "u_3", name: "Merve Yılmaz", email: "merve@example.com", role: "owner", roleName: "Event Owner", assigned: "Tüm Etkinlikler", status: "active", active: "Dün", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
  { id: "u_4", name: "Hakan Şen", email: "hakan@example.com", role: "viewer", roleName: "Viewer (Müşteri)", assigned: "Ece & Mert Düğünü", status: "invited", active: "Bekliyor", avatar: null }
];

const defaultRoles = [
  {
    id: "platform-admin",
    title: "Platform Admin",
    summary: "SaaS sahibi",
    tag: "Sistem",
    color: "var(--color-blue-dark)",
    permissions: [
      "Tüm tenantları, plan limitlerini ve sistem loglarını izler",
      "Storage kullanımını ve genel konfigürasyonu görüntüler",
      "MVP'de sınırlı panel veya seed admin yeterlidir",
    ],
  },
  {
    id: "business-admin",
    title: "Fotoğrafçı / İşletme Admini",
    summary: "Sistemi satın alan ana müşteri",
    tag: "Ana Müşteri",
    color: "var(--accent-green)",
    permissions: [
      "Etkinlik oluşturur, fotoğraf yükler ve QR paylaşır",
      "Uploader ekler, yüz eşleşmelerini başlatır",
      "Sonuçları inceler ve raporları görüntüler",
    ],
  },
  {
    id: "event-owner",
    title: "Event Owner / Organizatör",
    summary: "Belirli bir etkinliğin operasyon sorumlusu",
    tag: "Operasyon",
    color: "var(--color-blue-medium)",
    permissions: [
      "Atandığı etkinliği yönetir, katılımcı listesini görür",
      "Eşleşmeleri onaylar / reddeder",
      "QR ve erişim ayarlarını düzenler",
    ],
  },
  {
    id: "uploader",
    title: "Uploader / Fotoğrafçı Asistanı",
    summary: "Sadece fotoğraf yükleyen ekip üyesi",
    tag: "Ekip",
    color: "var(--accent-yellow)",
    permissions: [
      "Özel link veya hesapla belirli etkinliğe fotoğraf yükler",
      "Eşleşme ve katılımcı verilerine sınırlı erişir",
    ],
  },
  {
    id: "guest",
    title: "Katılımcı / Misafir",
    summary: "Etkinliğe katılan son kullanıcı",
    tag: "Son Kullanıcı",
    color: "var(--color-blue-soft)",
    permissions: [
      "QR ile etkinlik sayfasına girer, onay metnini kabul eder",
      "Yüz kaydı / selfie yükler",
      "Kendisine eşleşmen fotoğrafları web/mock ekranda görür",
    ],
  },
  {
    id: "ai-service",
    title: "AI Matching Service",
    summary: "Sistem içi servis rolü",
    tag: "Servis",
    color: "var(--color-blue-dark)",
    permissions: [
      "Fotoğrafları işler, yüzleri tespit eder",
      "Katılımcı yüz kayıtlarıyla karşılaştırır, güven skoru üretir",
      "Review kuyruğuna sonuç yazar",
    ],
  }
];

const defaultAccessMatrix = [
  {
    module: "Dashboard",
    cells: [
      { t: "Tüm sistem", l: "limited" },
      { t: "Kendi işletmesi", l: "full" },
      { t: "Atandığı etkinlik", l: "limited" },
      { t: "Yok / sınırlı", l: "limited" },
      { t: "Kendi eşleşmeleri", l: "limited" },
    ],
  },
  {
    module: "Etkinlikler",
    cells: [
      { t: "Tüm etkinlikler", l: "limited" },
      { t: "Oluşturur / düzenler", l: "full" },
      { t: "Atandığını yönetir", l: "full" },
      { t: "Sadece yükleme etkinliği", l: "limited" },
      { t: "QR ile giriş", l: "limited" },
    ],
  },
  {
    module: "Fotoğraf Yükleme",
    cells: [
      { t: "İzleme", l: "limited" },
      { t: "Tam yetki", l: "full" },
      { t: "Tam yetki", l: "full" },
      { t: "Yükleme yetkisi", l: "full" },
      { t: "Düğünde kendi fotoğrafları", l: "limited" },
    ],
  },
  {
    module: "Yüz Kaydı",
    cells: [
      { t: "Sistem logu", l: "limited" },
      { t: "Görüntüleme / silme", l: "full" },
      { t: "Görüntüleme / silme", l: "full" },
      { t: "Yok", l: "none" },
      { t: "Kendi kaydını oluşturur", l: "full" },
    ],
  },
  {
    module: "AI Matching",
    cells: [
      { t: "Servis izleme", l: "limited" },
      { t: "Başlat / durdur / review", l: "full" },
      { t: "Başlat / review", l: "full" },
      { t: "Yok", l: "none" },
      { t: "Yok", l: "none" },
    ],
  },
  {
    module: "Eşleşme Review",
    cells: [
      { t: "İzleme", l: "limited" },
      { t: "Onay / red", l: "full" },
      { t: "Onay / red", l: "full" },
      { t: "Yok", l: "none" },
      { t: "Sadece onaylı kendi sonuçları", l: "limited" },
    ],
  },
  {
    module: "QR & Erişim",
    cells: [
      { t: "Plan limitleri", l: "limited" },
      { t: "Düzenler", l: "full" },
      { t: "Düzenler", l: "full" },
      { t: "Yok", l: "none" },
      { t: "QR ile erişir", l: "limited" },
    ],
  },
  {
    module: "Raporlar",
    cells: [
      { t: "Global / tenant", l: "full" },
      { t: "Tam", l: "full" },
      { t: "Etkinlik bazlı", l: "limited" },
      { t: "Yükleme sayısı", l: "limited" },
      { t: "Yok", l: "none" },
    ],
  },
  {
    module: "Ayarlar",
    cells: [
      { t: "Global", l: "full" },
      { t: "İşletme / ekip", l: "full" },
      { t: "Etkinlik ayarı", l: "limited" },
      { t: "Yok", l: "none" },
      { t: "Gizlilik / onay", l: "limited" },
    ],
  }
];

const getEventId = () => {
  return localStorage.getItem("snapmatch_event_id") || "1f8c751d-79fa-4a6e-b916-da387d98e301";
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

export const teamService = {
  getUsers: async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return getStoredData("sm_team_users", defaultUsers);
    }
    try {
      const eventId = getEventId();
      const response = await teamApi.getMembers(eventId);
      return (response.members || []).map(m => ({
        id: m.user.id,
        name: m.user.name || m.user.email.split("@")[0],
        email: m.user.email,
        role: m.role,
        roleName: m.role === "uploader" ? "Uploader (Asistan)" : m.role === "event_owner" ? "Event Owner" : m.role === "business_admin" ? "Firma Admini" : "Platform Admin",
        assigned: response.event?.title || "Seçili Etkinlik",
        status: m.status,
        active: m.status === "active" ? "Şimdi Aktif" : "Bekliyor",
        avatar: null
      }));
    } catch (err) {
      console.error("Failed to load members from server, falling back:", err);
      return getStoredData("sm_team_users", defaultUsers);
    }
  },
  getUser: async (id) => {
    const users = await teamService.getUsers();
    return users.find(u => u.id === id) || null;
  },
  createUser: async (payload) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const users = getStoredData("sm_team_users", defaultUsers);
      const roleMap = {
        owner: "Event Owner",
        uploader: "Uploader (Fotoğrafçı)",
        viewer: "Viewer (Müşteri)",
        admin: "Firma Admini"
      };
      const newUser = {
        id: `u_${Date.now()}`,
        status: "invited",
        active: "Bekliyor",
        assigned: payload.assigned || "Atanmamış",
        roleName: roleMap[payload.role] || "Ekip Üyesi",
        avatar: null,
        ...payload
      };
      users.push(newUser);
      saveStoredData("sm_team_users", users);
      return newUser;
    }
    try {
      const eventId = getEventId();
      const data = await teamApi.createUploaderLink(eventId, {
        invitedEmail: payload.email,
        name: payload.name || payload.email.split("@")[0],
        role: payload.role || "uploader"
      });
      const inviteUrl = `${window.location.origin}${data.invitePath}`;
      localStorage.setItem("sm_last_invite_link", inviteUrl);
      
      return {
        id: `u_${Date.now()}`,
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        role: payload.role || "uploader",
        roleName: payload.role === "uploader" ? "Uploader (Asistan)" : "Ekip Üyesi",
        assigned: "Davet Oluşturuldu",
        status: "invited",
        active: "Bekliyor",
        avatar: null,
        inviteUrl
      };
    } catch (err) {
      console.error("Failed to invite member via API, using fallback:", err);
      throw err;
    }
  },
  updateUser: async (id, payload) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const users = getStoredData("sm_team_users", defaultUsers);
      const idx = users.findIndex(u => u.id === id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...payload };
        saveStoredData("sm_team_users", users);
        return users[idx];
      }
      throw new Error("User not found");
    }
    try {
      const eventId = getEventId();
      await teamApi.updateMember(eventId, id, payload);
      return {
        id,
        ...payload
      };
    } catch (err) {
      console.error("Failed to update member on server, using fallback:", err);
      throw err;
    }
  },
  deleteUser: async (id) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const users = getStoredData("sm_team_users", defaultUsers);
      const filtered = users.filter(u => u.id !== id);
      saveStoredData("sm_team_users", filtered);
      return id;
    }
    try {
      const eventId = getEventId();
      await teamApi.removeMember(eventId, id);
      return id;
    } catch (err) {
      console.error("Failed to remove member on server, using fallback:", err);
      throw err;
    }
  },
  getRoles: () => {
    return Promise.resolve(getStoredData("sm_team_roles", defaultRoles));
  },
  updateRolePermissions: (roleId, permissions) => {
    const roles = getStoredData("sm_team_roles", defaultRoles);
    const idx = roles.findIndex(r => r.id === roleId);
    if (idx !== -1) {
      roles[idx].permissions = permissions;
      saveStoredData("sm_team_roles", roles);
      return Promise.resolve(roles[idx]);
    }
    return Promise.reject(new Error("Role not found"));
  },
  getAccessMatrix: () => {
    return Promise.resolve(getStoredData("sm_team_access_matrix", defaultAccessMatrix));
  }
};
