import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import { fetchEvents } from "../features/events/eventsSlice";
import { fetchDashboardAnalytics, fetchEventAnalytics } from "../features/analytics/analyticsSlice";
import { 
  TrendingUp, 
  Download, 
  Eye, 
  Users, 
  Camera, 
  Zap, 
  Clock, 
  HardDrive,
  BarChart3,
  Calendar,
  Share2
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

export default function Analytics() {
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.items) || [];
  const workspaceStats = useSelector((state) => state.analytics.workspaceStats);
  const selectedEventAnalytics = useSelector((state) => state.analytics.selectedEventAnalytics);
  const loading = useSelector((state) => state.analytics.loading);

  const [selectedEventId, setSelectedEventId] = useState("all");

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (selectedEventId === "all") {
      dispatch(fetchDashboardAnalytics());
    } else {
      dispatch(fetchEventAnalytics(selectedEventId));
    }
  }, [selectedEventId, dispatch]);

  const stats = selectedEventId === "all" ? workspaceStats : (selectedEventAnalytics || workspaceStats);

  if (!stats) return <div className="p-10 text-center">Yükleniyor...</div>;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Event Selector Dropdown */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Etkinlik Seçin</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-3 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none cursor-pointer"
          >
            <option value="all" className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">Tüm Etkinlikler (Genel)</option>
            {events.map(e => (
              <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
            ))}
          </select>
        </div>

        {/* KPI metrics list */}
        <div className="flex flex-col gap-3">
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Toplam Fotoğraf</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{stats.totalPhotos}</h2>
            </div>
            <Camera size={18} className="text-[var(--color-blue-dark)]" />
          </div>

          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Toplam Katılımcı</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{stats.totalParticipants}</h2>
            </div>
            <Users size={18} className="text-[var(--color-blue-dark)]" />
          </div>

          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">AI Başarı Oranı</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--accent-green)] mt-1">%{stats.overallMatchRate}</h2>
            </div>
            <Zap size={18} className="text-[var(--accent-green)]" />
          </div>
        </div>

        {/* Simplified custom chart representation */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-[var(--text-main)] m-0">Haftalık Yükleme Dağılımı</h4>
          <div className="flex items-end justify-between h-32 pt-4 px-2">
            {[45, 62, 85, 55, 90, 70, 110].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <div 
                  className="w-4 rounded-t-md bg-gradient-to-t from-blue-500 to-indigo-600"
                  style={{ height: `${(val / 120) * 100}%` }}
                />
                <span className="text-[9px] text-[var(--text-muted)] font-bold">G{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Download Actions */}
        <div className="glass-panel p-4 flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-[var(--text-main)] m-0 mb-1">Rapor Çıktıları</h4>
          <button 
            className="primary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
            onClick={() => showToast("Excel Raporu indiriliyor...", "info")}
          >
            <Download size={14} />
            <span>Excel Raporu İndir</span>
          </button>
          
          <button 
            className="secondary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
            onClick={() => showToast("PDF Raporu indiriliyor...", "info")}
          >
            <Download size={14} />
            <span>PDF Raporu İndir</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* Header */}
      <div className="flex justify-end items-center mb-1">
        
        <div className="flex gap-2 items-center">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="p-[10px_14px] rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[0.88rem] font-semibold text-[var(--text-main)] outline-none cursor-pointer"
          >
            <option value="all" className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">Tüm Etkinlikler (Genel)</option>
            {events.map(e => (
              <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
            ))}
          </select>

          <button className="primary-btn p-[10px_16px] gap-1.5" onClick={() => showToast("Excel Raporu hazırlanıyor ve indiriliyor...", "info")}>
            <Download size={14} /> Excel Raporu
          </button>
          <button className="primary-btn p-[10px_16px] gap-1.5 !bg-transparent text-[var(--text-main)] border border-[var(--glass-border)]" onClick={() => showToast("PDF Raporu hazırlanıyor ve indiriliyor...", "info")}>
            <Download size={14} /> PDF Raporu
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[var(--space-lg)]">
        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Toplam Fotoğraf</small>
              <strong className="kpi-value text-[1.4rem]">{stats.totalPhotos}</strong>
            </div>
            <Camera size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Toplam Katılımcı</small>
              <strong className="kpi-value text-[1.4rem]">{stats.totalParticipants}</strong>
            </div>
            <Users size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">AI Eşleşme Oranı</small>
              <strong className="kpi-value text-[1.4rem] text-[var(--accent-green)]">%{stats.overallMatchRate}</strong>
            </div>
            <Zap size={20} className="text-[var(--accent-green)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Misafir Görüntüleme</small>
              <strong className="kpi-value text-[1.4rem]">1,482</strong>
            </div>
            <Eye size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Fotoğraf İndirme</small>
              <strong className="kpi-value text-[1.4rem]">862</strong>
            </div>
            <Download size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <small className="kpi-label block">Disk Kullanımı</small>
              <strong className="kpi-value text-[1.4rem]">{stats.storageUsedGB} GB</strong>
            </div>
            <HardDrive size={20} className="text-[var(--color-blue-dark)]" />
          </div>
        </GlassCard>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr] gap-[var(--space-lg)]">
        
        {/* Weekly View Performance (SVG chart mockup) */}
        <GlassCard title="Haftalık Erişim ve Etkileşim Trafiği" className="glass-panel">
          <div className="py-2.5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-4 text-[0.82rem]">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-blue-dark)]" />
                  Sayfa Ziyareti
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-blue-soft)]" />
                  Selfie Kaydı
                </span>
              </div>
              <span className="text-[0.78rem] text-[var(--accent-green)] font-bold">+28% geçen haftaya göre</span>
            </div>

            {/* Bar chart — heights normalized to max value */}
            {(() => {
              const chartData = [
                { label: "Pzt", visit: 60, selfie: 30 },
                { label: "Sal", visit: 80, selfie: 45 },
                { label: "Çar", visit: 110, selfie: 70 },
                { label: "Per", visit: 90, selfie: 55 },
                { label: "Cum", visit: 140, selfie: 95 },
                { label: "Cmt", visit: 210, selfie: 150 },
                { label: "Paz", visit: 180, selfie: 120 }
              ];
              const maxVal = Math.max(...chartData.map(d => Math.max(d.visit, d.selfie)));
              return (
                <div className="flex items-end gap-3 border-b border-[var(--glass-border)] pb-3" style={{ height: 180 }}>
                  {chartData.map((day, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-0 h-full">
                      <div className="w-full flex-1 flex items-end justify-center gap-[3px]">
                        <div
                          style={{ height: `${(day.visit / maxVal) * 100}%` }}
                          className="flex-1 max-w-[18px] bg-[var(--color-blue-dark)] rounded-t-[4px] transition-all duration-300"
                        />
                        <div
                          style={{ height: `${(day.selfie / maxVal) * 100}%` }}
                          className="flex-1 max-w-[18px] bg-[var(--color-blue-soft)] rounded-t-[4px] transition-all duration-300"
                        />
                      </div>
                      <span className="text-[0.72rem] text-[var(--text-muted)] font-semibold mt-2 leading-none">{day.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </GlassCard>

        {/* AI Classifier breakdown card */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          <GlassCard title="AI Eşleşme Başarım Analizi" className="glass-panel">
            <div className="flex flex-col gap-4.5">
              <div className="flex justify-between items-center">
                <span className="text-[0.85rem] text-[var(--text-muted)]">Otomatik Karar Doğruluğu</span>
                <strong className="text-[1.1rem] text-[var(--accent-green)]">%99.8</strong>
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Otomatik Onaylanan (Auto Approved)</span>
                  <strong>%72</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[72%] bg-[var(--accent-gradient)]" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Manuel İncelemeye Giden (Pending Review)</span>
                  <strong>%24</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[24%] bg-amber-500" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[0.8rem]">
                  <span>Hatalı / Reddedilen (Rejected)</span>
                  <strong>%4</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[4%] bg-red-500" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Social shares and engagement metrics */}
          <GlassCard title="Katılımcı Etkileşim Oranları" className="glass-panel">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[0.85rem]">
                <div className="flex items-center gap-2">
                  <Share2 size={16} className="text-[var(--color-blue-dark)]" />
                  <span>Ortalama İndirme/Misafir:</span>
                </div>
                <strong>3.4 adet</strong>
              </div>
              
              <div className="flex items-center justify-between text-[0.85rem] border-t border-[var(--glass-border)] pt-2.5">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[var(--color-blue-dark)]" />
                  <span>Sitede Kalma Süresi:</span>
                </div>
                <strong>4 dk 12 sn</strong>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
