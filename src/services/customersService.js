import { customersApi } from "./customersApi";

const CUSTOMERS_KEY = "sm_customers";

const defaultCustomers = [
  { id: "ws_1", name: "Kadraj Kolektif", sector: "Düğün & Etkinlik", plan: "Pro", used: 68, limit: 100, events: 12, status: "Aktif", joined: "2025-11-02" },
  { id: "ws_2", name: "Momento Wedding", sector: "Düğün Fotoğrafçılığı", plan: "Enterprise", used: 240, limit: 500, events: 34, status: "Aktif", joined: "2025-08-14" },
  { id: "ws_3", name: "Işık Fotoğraf Stüdyosu", sector: "Stüdyo & Portre", plan: "Pro", used: 41, limit: 100, events: 8, status: "Aktif", joined: "2026-01-20" },
  { id: "ws_4", name: "EventPro Ajans", sector: "Kurumsal Etkinlik", plan: "Enterprise", used: 380, limit: 500, events: 51, status: "Aktif", joined: "2025-06-03" },
  { id: "ws_5", name: "Anı Yakala Prodüksiyon", sector: "Mezuniyet & Tören", plan: "Free", used: 4.2, limit: 5, events: 2, status: "Deneme", joined: "2026-06-28" },
  { id: "ws_6", name: "Piksel Düğün Hikayeleri", sector: "Düğün Fotoğrafçılığı", plan: "Pro", used: 92, limit: 100, events: 15, status: "Aktif", joined: "2025-12-11" },
  { id: "ws_7", name: "Festival Lens", sector: "Festival & Konser", plan: "Enterprise", used: 460, limit: 500, events: 40, status: "Askıda", joined: "2025-09-19" },
  { id: "ws_8", name: "Genç Kare Fotoğraf", sector: "Stüdyo & Portre", plan: "Free", used: 1.1, limit: 5, events: 1, status: "Deneme", joined: "2026-07-01" },
];

const getStoredCustomers = () => {
  try {
    const val = localStorage.getItem(CUSTOMERS_KEY);
    if (!val) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(defaultCustomers));
      return defaultCustomers;
    }
    return JSON.parse(val);
  } catch (e) {
    return defaultCustomers;
  }
};

const saveStoredCustomers = (data) => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(data));
  } catch (e) {
    // ignore
  }
};

export const customersService = {
  getCustomers: async () => {
    try {
      // Backend api /workspaces endpoints'lerini deneyelim
      return await customersApi.getCustomers();
    } catch (err) {
      console.warn("Müşteriler sunucudan alınamadı, yerel mock veriye düşülüyor:", err);
      return getStoredCustomers();
    }
  },

  createCustomer: async (payload) => {
    try {
      return await customersApi.createCustomer(payload);
    } catch (err) {
      console.warn("Müşteri sunucuda oluşturulamadı, yerel mock veriye düşülüyor:", err);
      const list = getStoredCustomers();
      const newCust = {
        id: "ws_" + Date.now(),
        name: payload.name || "Yeni Müşteri",
        sector: payload.sector || "Genel",
        plan: payload.plan || "Free",
        used: 0,
        limit: payload.plan === "Enterprise" ? 500 : payload.plan === "Pro" ? 100 : 5,
        events: 0,
        status: "Deneme",
        joined: new Date().toISOString().split("T")[0],
      };
      list.push(newCust);
      saveStoredCustomers(list);
      return newCust;
    }
  },

  updateCustomer: async (id, payload) => {
    try {
      return await customersApi.updateCustomer(id, payload);
    } catch (err) {
      console.warn("Müşteri sunucuda güncellenemedi, yerel mock veriye düşülüyor:", err);
      const list = getStoredCustomers();
      const idx = list.findIndex((c) => c.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...payload };
        saveStoredCustomers(list);
        return list[idx];
      }
      throw new Error("Müşteri bulunamadı");
    }
  },

  deleteCustomer: async (id) => {
    try {
      await customersApi.deleteCustomer(id);
      return id;
    } catch (err) {
      console.warn("Müşteri sunucudan silinemedi, yerel mock veriye düşülüyor:", err);
      const list = getStoredCustomers();
      const filtered = list.filter((c) => c.id !== id);
      saveStoredCustomers(filtered);
      return id;
    }
  },
};
