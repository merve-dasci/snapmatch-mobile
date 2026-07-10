import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { 
  Palette, 
  ShieldAlert, 
  BadgeCheck, 
  Sliders, 
  Building2, 
  Database, 
  Key, 
  Eye,
  CheckCircle2,
  Lock,
  Globe,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import BottomMobileSheet from "../components/ui/BottomMobileSheet";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../auth/AuthContext";
import {
  fetchWorkspaceSettings,
  updateWorkspaceSettings,
  fetchPrivacySettings,
  updatePrivacySettings,
  fetchStorageSettings,
  fetchApiSettings
} from "../features/settings/settingsSlice";

export default function Settings() {
  const { theme, setTheme } = useOutletContext();
  const { isMobile } = useAdaptive();
  const { showToast } = useToast();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const workspaceSettings = useSelector((state) => state.settings.workspaceSettings) || {};
  const privacySettings = useSelector((state) => state.settings.privacySettings) || {};
  const storageSettings = useSelector((state) => state.settings.storageSettings) || {};
  const apiSettings = useSelector((state) => state.settings.apiSettings) || {};
  const loading = useSelector((state) => state.settings.loading);
  const saving = useSelector((state) => state.settings.saving);

  const [activeSubTab, setActiveSubTab] = useState("theme");
  const [openSection, setOpenSection] = useState(null);

  const [form, setForm] = useState({
    title: "",
    logo: "",
    watermarkEnabled: true,
    defaultConsentText: "",
    retentionPolicy: "6_months",
    storageLimitGB: 100
  });

  useEffect(() => {
    dispatch(fetchWorkspaceSettings());
    dispatch(fetchPrivacySettings());
    dispatch(fetchStorageSettings());
    dispatch(fetchApiSettings());
  }, [dispatch]);

  useEffect(() => {
    setForm({
      title: workspaceSettings.title || "",
      logo: workspaceSettings.logo || "",
      watermarkEnabled: workspaceSettings.watermarkEnabled !== undefined ? workspaceSettings.watermarkEnabled : true,
      defaultConsentText: privacySettings.defaultConsentText || "",
      retentionPolicy: privacySettings.retentionPolicy || "6_months",
      storageLimitGB: storageSettings.storageLimitGB || 100
    });
  }, [workspaceSettings, privacySettings, storageSettings]);

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveWorkspace = () => {
    dispatch(updateWorkspaceSettings({
      title: form.title,
      logo: form.logo,
      watermarkEnabled: form.watermarkEnabled
    })).unwrap().then(() => {
      showToast("Workspace bilgileri başarıyla güncellendi.", "success");
    }).catch((err) => {
      showToast(err || "Workspace bilgileri güncellenemedi.", "error");
    });
  };

  const handleSavePrivacy = () => {
    dispatch(updatePrivacySettings({
      defaultConsentText: form.defaultConsentText,
      retentionPolicy: form.retentionPolicy
    })).unwrap().then(() => {
      showToast("Gizlilik ayarları başarıyla güncellendi.", "success");
    }).catch((err) => {
      showToast(err || "Gizlilik ayarları güncellenemedi.", "error");
    });
  };

  const handleSaveStorage = () => {
    showToast("Depolama limitleri başarıyla kaydedildi.", "success");
  };

  const themes = [
    { id: "soft-light", name: "Soft Light", desc: "Varsayılan açık tema", previewBg: "linear-gradient(135deg, #F7FBFE, #cdd7e6)", accent: "#5c7095" },
    { id: "midnight", name: "Midnight", desc: "Koyu gece mavisi", previewBg: "linear-gradient(135deg, #090d16, #1e1b4b)", accent: "#6366f1" },
    { id: "aurora", name: "Aurora", desc: "Kuzey ışıkları büyüsü", previewBg: "linear-gradient(135deg, #070f1e, #1e3a5f)", accent: "#0ea5e9" },
    { id: "rose-quartz", name: "Rose Quartz / Sunset", desc: "Gün batımı pembe ve mor ışıması", previewBg: "linear-gradient(135deg, #d9006c, #76009f, #0d001e)", accent: "#d9006c" },
    { id: "forest", name: "Forest", desc: "Premium kurumsal yeşil", previewBg: "linear-gradient(135deg, #07120e, #153e2d)", accent: "#10b981" },
    { id: "amoled-black", name: "AMOLED Black", desc: "Saf siyah karanlık mod", previewBg: "linear-gradient(135deg, #000000, #0b0b0d)", accent: "#3b82f6" },
  ];

  const subTabs = [
    { id: "theme", label: "Sistem Teması", icon: Palette },
    { id: "workspace", label: "Branding & Marka", icon: Building2 },
    { id: "privacy", label: "KVKK & Gizlilik", icon: ShieldAlert },
    { id: "storage", label: "Depolama & Kota", icon: Database },
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* iOS-Style Settings App Interface */}
        <div className="glass-panel p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[var(--accent-gradient)] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
            SM
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)] m-0">Snapmatch AI Workspace</h3>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">SaaS Yönetici Hesabı</span>
          </div>
        </div>

        {/* Grouped settings sections */}
        <div className="glass-panel flex flex-col overflow-hidden divide-y divide-white/10 dark:divide-black/20">
          {subTabs.map((tab) => (
            <div 
              key={tab.id}
              onClick={() => setOpenSection(tab.id)}
              className="flex items-center justify-between p-4 cursor-pointer active:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-blue-dark)]/15 text-[var(--color-blue-dark)] flex items-center justify-center">
                  <tab.icon size={16} />
                </div>
                <span className="text-xs font-bold text-[var(--text-main)]">{tab.label}</span>
              </div>
              <ChevronRight size={14} className="text-[var(--text-muted)]" />
            </div>
          ))}
          {/* Add Developer Section Link for Developer Credentials */}
          <div 
            onClick={() => setOpenSection("api")}
            className="flex items-center justify-between p-4 cursor-pointer active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-blue-dark)]/15 text-[var(--color-blue-dark)] flex items-center justify-center">
                <Key size={16} />
              </div>
              <span className="text-xs font-bold text-[var(--text-main)]">Geliştirici Entegrasyonları</span>
            </div>
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
          </div>
        </div>

        {/* Mobile Detail Modal Sheets */}
        <BottomMobileSheet 
          isOpen={openSection !== null} 
          onClose={() => setOpenSection(null)} 
          title={subTabs.find(t => t.id === openSection)?.label || "Geliştirici Entegrasyonları"}
        >
          <div className="py-2">
            {openSection === "theme" && (
              <div className="flex flex-col gap-4">
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      showToast(`Tema "${t.name}" olarak değiştirildi.`, "success");
                    }}
                    className={`glass-subpanel flex items-center gap-3 p-3 w-full text-left border-none relative cursor-pointer ${
                      theme === t.id ? "ring-2 ring-[var(--color-blue-dark)]" : ""
                    }`}
                  >
                    <div style={{ background: t.previewBg }} className="w-12 h-12 rounded-lg shrink-0" />
                    <div>
                      <strong className="text-xs block text-[var(--text-main)]">{t.name}</strong>
                      <small className="text-[10px] text-[var(--text-muted)]">{t.desc}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {openSection === "workspace" && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                  <div>
                    <strong className="text-xs block text-[var(--text-main)]">Görsel Filigranı (Watermark)</strong>
                    <small className="text-[9px] text-[var(--text-muted)]">Fotoğrafların üzerinde filigran ekler.</small>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={form.watermarkEnabled}
                    onChange={(e) => updateField("watermarkEnabled", e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Marka Başlığı</label>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => updateField("title", e.target.value)}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Logo Simgesi</label>
                  <input 
                    type="text" 
                    value={form.logo} 
                    onChange={(e) => updateField("logo", e.target.value)}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  />
                </div>

                <button onClick={handleSaveWorkspace} disabled={saving} className="primary-btn justify-center py-3 rounded-xl font-bold w-full disabled:opacity-60">
                  {saving ? "Kaydediliyor..." : "Workspace Güncelle"}
                </button>
              </div>
            )}

            {openSection === "privacy" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Varsayılan Kayıt Onay Metni</label>
                  <textarea 
                    rows={4} 
                    value={form.defaultConsentText}
                    onChange={(e) => updateField("defaultConsentText", e.target.value)}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] resize-none outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)]">Veri Saklama Politikası</label>
                  <select 
                    value={form.retentionPolicy} 
                    onChange={(e) => updateField("retentionPolicy", e.target.value)}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  >
                    <option value="30_days">Etkinlikten 30 Gün Sonra Sil</option>
                    <option value="6_months">Etkinlikten 6 Ay Sonra Sil</option>
                    <option value="1_year">Etkinlikten 1 Yıl Sonra Sil</option>
                  </select>
                </div>

                <button onClick={handleSavePrivacy} disabled={saving} className="primary-btn justify-center py-3 rounded-xl font-bold w-full disabled:opacity-60">
                  {saving ? "Kaydediliyor..." : "Gizlilik Ayarlarını Kaydet"}
                </button>
              </div>
            )}

            {openSection === "storage" && (
              <div className="flex flex-col gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] flex items-center justify-center mx-auto text-xl font-black">
                  {Math.round((storageSettings.storageUsedGB / storageSettings.storageLimitGB) * 100)}%
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-main)] m-0">Kullanılan Depolama Altyapısı</h4>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{storageSettings.storageUsedGB} GB / {storageSettings.storageLimitGB} GB limitiniz aktif.</p>
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-gradient)]" style={{ width: `${(storageSettings.storageUsedGB / storageSettings.storageLimitGB) * 100}%` }} />
                </div>
                <button onClick={() => setOpenSection(null)} className="primary-btn justify-center py-3 rounded-xl w-full">Kapat</button>
              </div>
            )}

            {openSection === "api" && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] font-mono">Public API Key</label>
                  <input type="text" readOnly value={apiSettings.publicKey} className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/5 text-xs text-[var(--text-muted)] font-mono outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] font-mono">Secret API Key</label>
                  <input type="password" readOnly value={apiSettings.secretKey} className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/5 text-xs text-[var(--text-muted)] font-mono outline-none" />
                </div>
                <button onClick={() => setOpenSection(null)} className="primary-btn justify-center py-3 rounded-xl w-full">Geri Dön</button>
              </div>
            )}
          </div>
        </BottomMobileSheet>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      {/* Sub Tabs Menu Card (Left) */}
      <GlassCard className="w-[260px] p-3 flex flex-col gap-1.5 shrink-0 glass-panel">
        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider p-2">Ayarlar Menüsü</span>
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-3 p-3 text-left border-none rounded-xl cursor-pointer transition-all ${
                isActive 
                  ? "bg-[var(--accent-gradient)] text-white font-bold" 
                  : "bg-transparent text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)]"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[0.82rem]">{tab.label}</span>
            </button>
          );
        })}
        {/* Developer credentials tab */}
        <button
          onClick={() => setActiveSubTab("api")}
          className={`flex items-center gap-3 p-3 text-left border-none rounded-xl cursor-pointer transition-all ${
            activeSubTab === "api" 
              ? "bg-[var(--accent-gradient)] text-white font-bold" 
              : "bg-transparent text-[var(--text-muted)] hover:bg-white/5 hover:text-[var(--text-main)]"
          }`}
        >
          <Key size={18} />
          <span className="text-[0.82rem]">Geliştirici Entegrasyonları</span>
        </button>
      </GlassCard>

      {/* Settings Action forms content area (Right) */}
      <div className="flex-1 min-w-0">
        {/* Sub Tab: Systems theme settings */}
        {activeSubTab === "theme" && (
          <GlassCard title="Sistem Teması ve Görünüm" className="glass-panel">
            <p className="text-[var(--text-muted)] text-[0.85rem] mb-5">
              Snapmatch AI yönetim paneli için kullanmak istediğiniz renk şemasını seçin. Seçtiğiniz tema tarayıcınızda saklanacaktır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {themes.map((item) => {
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setTheme(item.id);
                      showToast(`Tema "${item.name}" başarıyla uygulandı.`, "success");
                    }}
                    className={`glass-subpanel flex flex-col p-4 text-left border-none relative cursor-pointer transition-all hover:scale-[1.01] ${
                      isSelected ? "ring-2 ring-[var(--color-blue-dark)]" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3 w-full">
                      <strong className="text-[0.9rem] font-bold text-[var(--text-main)]">{item.name}</strong>
                      {isSelected && <span className="bg-[var(--color-blue-medium)]/20 text-[var(--color-blue-dark)] text-[0.68rem] font-bold p-[2px_8px] rounded-full">Aktif</span>}
                    </div>

                    <div 
                      style={{ background: item.previewBg }}
                      className="h-[60px] w-full rounded-[10px] border border-white/10 flex items-center px-3 gap-2 mb-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-white/25 border border-white/40" />
                      <div style={{ background: item.accent }} className="w-10 h-2 rounded-[4px]" />
                    </div>

                    <small className="text-[var(--text-muted)] text-[0.8rem]">{item.desc}</small>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* Sub Tab: Branding & Watermarks */}
        {activeSubTab === "workspace" && (
          <GlassCard title="Branding & Fotoğraf Filigranı" className="glass-panel">
            <div className="flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-[0.88rem] block">Görsel Filigranı (Watermark) Ekle</strong>
                  <span className="text-[0.78rem] text-[var(--text-muted)]">Misafirler fotoğrafları satın almadan önce üzerlerinde Snapmatch filigranı gösterilir.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={form.watermarkEnabled} 
                  onChange={(e) => updateField("watermarkEnabled", e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-[var(--glass-border)] pt-4">
                <label className="text-[0.85rem] font-bold">Marka Başlığı (Workspace Name)</label>
                <input 
                  type="text" 
                  value={form.title} 
                  onChange={(e) => updateField("title", e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.9rem] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.85rem] font-bold">Marka Logosu Simge/Görsel URL</label>
                <input 
                  type="text" 
                  value={form.logo} 
                  onChange={(e) => updateField("logo", e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.9rem] outline-none"
                />
              </div>

              <button onClick={handleSaveWorkspace} disabled={saving} className="primary-btn w-fit justify-center disabled:opacity-60">
                {saving ? "Kaydediliyor..." : "Workspace Branding Güncelle"}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Sub Tab: KVKK & GDPR Privacy */}
        {activeSubTab === "privacy" && (
          <GlassCard title="KVKK / GDPR Aydınlatma Beyanları" className="glass-panel">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.85rem] font-bold">Varsayılan Kayıt Onay Metni</label>
                <textarea 
                  rows={4} 
                  value={form.defaultConsentText}
                  onChange={(e) => updateField("defaultConsentText", e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.85rem] resize-none outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-[var(--glass-border)] pt-4">
                <label className="text-[0.85rem] font-bold">Veri Saklama Politikası (Data Retention)</label>
                <select 
                  value={form.retentionPolicy} 
                  onChange={(e) => updateField("retentionPolicy", e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[0.9rem] text-[var(--text-main)] outline-none"
                >
                  <option value="30_days">Etkinlik Bittikten 30 Gün Sonra Biyometrik Verileri Sil</option>
                  <option value="6_months">Etkinlik Bittikten 6 Ay Sonra Biyometrik Verileri Sil</option>
                  <option value="1_year">Etkinlik Bittikten 1 Yıl Sonra Biyometrik Verileri Sil</option>
                </select>
              </div>

              <button onClick={handleSavePrivacy} disabled={saving} className="primary-btn w-fit justify-center disabled:opacity-60">
                {saving ? "Kaydediliyor..." : "Gizlilik Politikalarını Kaydet"}
              </button>
            </div>
          </GlassCard>
        )}

        {/* Sub Tab: Disk storage details */}
        {activeSubTab === "storage" && (
          <GlassCard title="Depolama & Altyapı Kota Limiti" className="glass-panel">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-[0.95rem] font-bold">Toplam Alan: {storageSettings.storageLimitGB} GB</strong>
                  <span className="block text-[0.78rem] text-[var(--text-muted)]">Kullanılan Alan: {storageSettings.storageUsedGB} GB (%{Math.round((storageSettings.storageUsedGB / storageSettings.storageLimitGB) * 100)})</span>
                </div>
                <span className="bg-emerald-500/12 text-emerald-500 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold">Kota Limitleri Normal</span>
              </div>

              <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent-gradient)]" style={{ width: `${(storageSettings.storageUsedGB / storageSettings.storageLimitGB) * 100}%` }} />
              </div>

              <div className="flex flex-col gap-1.5 mt-4">
                <label className="text-[0.85rem] font-bold">Yeni Kota Limit Değeri (GB)</label>
                <input 
                  type="number" 
                  value={form.storageLimitGB} 
                  onChange={(e) => updateField("storageLimitGB", e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.9rem] outline-none"
                />
              </div>

              <button onClick={handleSaveStorage} className="primary-btn w-fit justify-center">Depolama Kotasını Güncelle</button>
            </div>
          </GlassCard>
        )}

        {/* Sub Tab: API Keys Developer */}
        {activeSubTab === "api" && (
          <GlassCard title="Geliştirici Entegrasyonları (API Access)" className="glass-panel">
            <div className="flex flex-col gap-4">
              <p className="text-[var(--text-muted)] text-[0.85rem] m-0">
                Fotoğrafçılık yazılımlarınıza veya Lightroom pluginlerinize Snapmatch AI entegrasyonu yapmak için API anahtarlarını kullanabilirsiniz.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.82rem] font-bold">Public API Key</label>
                <input 
                  type="text" 
                  readOnly 
                  value={apiSettings.publicKey} 
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/5 text-[var(--text-muted)] text-[0.8rem] font-mono outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.82rem] font-bold">Secret API Key</label>
                <input 
                  type="password" 
                  readOnly 
                  value={apiSettings.secretKey} 
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/5 text-[var(--text-muted)] text-[0.8rem] font-mono outline-none"
                />
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
