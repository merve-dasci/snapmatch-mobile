import { mockApi } from "./mockApi";
import { settingsApi } from "./settingsApi";

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

const defaultWorkspaceSettings = {
  watermarkEnabled: true,
  title: "Okano Photography Studio",
  logo: "📷"
};

const defaultPrivacySettings = {
  retentionPolicy: "6_months",
  defaultConsentText: "Snapmatch AI arama motoruna selfie yükleyerek biyometrik yüz haritamın çıkartılmasına ve bu etkinlikteki fotoğraflarımla eşleştirilerek tarafıma gösterilmesine özgür iradem ile onay veriyorum."
};

const defaultStorageSettings = {
  storageLimitGB: 100,
  storageUsedGB: 32.4
};

const defaultApiSettings = {
  publicKey: "pk_test_mock_public_key_value_12345",
  secretKey: "sk_test_mock_secret_key_value_12345"
};

export const settingsService = {
  getWorkspaceSettings: async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      return getStoredData("sm_settings_workspace", defaultWorkspaceSettings);
    }
    try {
      const serverSettings = await settingsApi.getWorkspaceSettings(workspaceId);
      return {
        title: serverSettings.workspaceName || defaultWorkspaceSettings.title,
        watermarkEnabled: serverSettings.watermarkEnabled !== undefined ? serverSettings.watermarkEnabled : defaultWorkspaceSettings.watermarkEnabled,
        logo: serverSettings.logoUrl || defaultWorkspaceSettings.logo
      };
    } catch (err) {
      console.error("Failed to load workspace settings from API, using fallback:", err);
      return getStoredData("sm_settings_workspace", defaultWorkspaceSettings);
    }
  },
  updateWorkspaceSettings: async (payload) => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      const data = getStoredData("sm_settings_workspace", defaultWorkspaceSettings);
      const updated = { ...data, ...payload };
      saveStoredData("sm_settings_workspace", updated);
      return updated;
    }
    try {
      const data = await settingsApi.updateWorkspaceSettings(workspaceId, {
        workspaceName: payload.title,
        watermarkEnabled: payload.watermarkEnabled,
        logoUrl: payload.logo
      });
      return {
        title: data.workspaceName || payload.title,
        watermarkEnabled: data.watermarkEnabled !== undefined ? data.watermarkEnabled : payload.watermarkEnabled,
        logo: data.logoUrl || payload.logo
      };
    } catch (err) {
      console.error("Failed to update workspace settings via API, using fallback:", err);
      const data = getStoredData("sm_settings_workspace", defaultWorkspaceSettings);
      const updated = { ...data, ...payload };
      saveStoredData("sm_settings_workspace", updated);
      return updated;
    }
  },
  getPrivacySettings: async () => {
    return getStoredData("sm_settings_privacy", defaultPrivacySettings);
  },
  updatePrivacySettings: async (payload) => {
    const data = getStoredData("sm_settings_privacy", defaultPrivacySettings);
    const updated = { ...data, ...payload };
    saveStoredData("sm_settings_privacy", updated);
    return updated;
  },
  getStorageSettings: async () => {
    return getStoredData("sm_settings_storage", defaultStorageSettings);
  },
  getApiSettings: async () => {
    return getStoredData("sm_settings_api", defaultApiSettings);
  }
};
