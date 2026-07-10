import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  CalendarRange, 
  Clock, 
  Camera, 
  Users, 
  AlertCircle, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare,
  ArrowUpRight,
  TrendingUp,
  Image as ImageIcon,
  Cpu,
  Zap,
  Activity,
  ListOrdered,
  Plus,
  UploadCloud
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useAdaptive } from "../context/AdaptiveContext";
import { fetchDashboardAnalytics } from "../features/analytics/analyticsSlice";
import { fetchEvents } from "../features/events/eventsSlice";
import TiltedCard from "../components/ui/TiltedCard";
import TiltedCarousel from "../components/ui/TiltedCarousel";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.items) || [];
  const workspaceStats = useSelector((state) => state.analytics.workspaceStats) || {};
  const recentActivities = useSelector((state) => state.analytics.recentActivities) || [];
  const weeklyUploadActivity = useSelector((state) => state.analytics.weeklyUploadActivity) || [];
  const loading = useSelector((state) => state.analytics.loading);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchEvents());
  }, [dispatch]);

  const hasLoaded = recentActivities.length > 0;

  if (!hasLoaded && loading) {
    return (
      <div className="skeleton-page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <Cpu size={40} className="animate-spin" style={{ color: "var(--color-blue-dark)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>İstatistikler Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Calendar rendering helper for July 2026 (matching time metadata)
  const renderCalendar = () => {
    const daysInJuly = 31;
    const startDayOfWeek = 3; // July 1st, 2026 is Wednesday
    const days = [];

    // Empty cells for alignment before Wednesday
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-num other-month" />);
    }

    // July Days
    for (let day = 1; day <= daysInJuly; day++) {
      const isActive = day === selectedDate;
      const isToday = day === 8; // Current mock date is 2026-07-08
      
      // Mock event days: let's highlight some days with tiny dots
      const hasEvent = [4, 8, 11, 15, 22, 28].includes(day);

      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day-num ${isActive ? "active" : ""} ${isToday ? "today" : ""}`}
          onClick={() => setSelectedDate(day)}
          style={{ position: "relative" }}
        >
          {day}
          {hasEvent && (
            <span style={{ 
              position: "absolute", 
              bottom: "4px", 
              width: "4px", 
              height: "4px", 
              borderRadius: "50%", 
              background: "var(--color-blue-dark)" 
              }} 
            />
          )}
        </div>
      );
    }
    return days;
  };

  // SVG math for circular progress in AI Matching Rate
  const aiRadius = 60;
  const aiCircumference = 2 * Math.PI * aiRadius;
  const aiOffset = aiCircumference - (workspaceStats.overallMatchRate / 100) * aiCircumference;

  // Sort and get the most recent 4 uploaded photos for data flow
  const allPhotos = mockApi.getPhotos() || [];
  const recentPhotos = [...allPhotos]
    .sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at))
    .slice(0, 4);

  if (isMobile) {
    return (
      <div className="flex flex-col gap-5 pt-3">
        {/* iOS-Style Wallet Stack for KPIs */}
        <div className="flex flex-col gap-3">
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Aktif Etkinlikler</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{workspaceStats.activeEvents}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-blue-dark)]/15 text-[var(--color-blue-dark)] flex items-center justify-center shrink-0">
              <CalendarRange size={18} />
            </div>
          </div>
          
          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">AI Eşleşme Oranı</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--accent-green)] mt-1">%{workspaceStats.overallMatchRate}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-green)]/15 text-[var(--accent-green)] flex items-center justify-center shrink-0">
              <Zap size={18} />
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold block uppercase tracking-wider">Toplam Fotoğraf</span>
              <h2 className="text-xl font-extrabold m-0 text-[var(--text-main)] mt-1">{workspaceStats.totalPhotos}</h2>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-blue-medium)]/15 text-[var(--color-blue-medium)] flex items-center justify-center shrink-0">
              <Camera size={18} />
            </div>
          </div>
        </div>

        {/* Carousel of Events (Horizontal Swipe UI) */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1">Etkinlikler</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
            {events.slice(0, 4).map(event => (
              <div 
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="glass-panel flex-shrink-0 w-[200px] rounded-2xl overflow-hidden snap-start active:scale-[0.98] transition-transform"
              >
                <img src={event.cover_image} alt={event.title} className="w-full h-24 object-cover" />
                <div className="p-3">
                  <h4 className="text-xs font-bold text-[var(--text-main)] m-0 truncate">{event.title}</h4>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1 m-0 truncate">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linear Storage Widget (iOS Indicator style) */}
        <div className="glass-panel p-4">
          <h4 className="text-xs font-bold text-[var(--text-main)] m-0">Depolama Durumu</h4>
          <div className="w-full bg-white/10 dark:bg-black/20 h-2.5 rounded-full mt-3 overflow-hidden border border-[var(--glass-border)]">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
              style={{ width: `${(workspaceStats.storageUsedGB / workspaceStats.storageLimitGB) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-[10px] text-[var(--text-muted)] font-semibold">
            <span>{workspaceStats.storageUsedGB} GB Kullanılan</span>
            <span>{workspaceStats.storageLimitGB} GB Limit</span>
          </div>
        </div>

        {/* Recent Activities Feed */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1">Son Etkinlik Akışı</h3>
          <div className="flex flex-col gap-2.5">
            {recentActivities.slice(0, 4).map((activity) => (
              <div key={activity.id} className="glass-panel p-3 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-blue-dark)]/15 text-[var(--color-blue-dark)] flex items-center justify-center shrink-0 text-sm mt-0.5">
                  ⚡
                </div>
                <div className="flex-grow min-w-0">
                  <strong className="text-xs font-semibold block text-[var(--text-main)] leading-snug">{activity.message}</strong>
                  <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Üst Bölüm: Workspace adı, tarih filtresi ve Yeni Etkinlik butonu */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 pt-1 mb-6">
        <div className="flex flex-col flex-grow">
          <h1 className="page-title">Snapmatch Workspace</h1>
          <p className="text-[var(--text-muted)] text-[12px] font-medium m-0 mt-1">Yönetim ve Etkinlik Takip Paneli</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tarih Filtresi */}
          <div className="glass-btn flex items-center gap-2 cursor-default select-none shadow-[var(--glass-shadow-soft)] hover:translate-y-0">
            <span className="text-[12px] font-semibold text-[var(--text-main)]">Temmuz 2026</span>
          </div>
          {/* Yeni Etkinlik Butonu */}
          <button 
            onClick={() => navigate("/events")}
            className="primary-btn flex items-center gap-2 hover:scale-[1.02] transition-all duration-150 shadow-[var(--glass-shadow-soft)] cursor-pointer"
          >
            <Plus size={16} />
            <span>Yeni Etkinlik</span>
          </button>
        </div>
      </div>
      
      {/* 4-Column Responsive Grid for 7 KPI Cards (Tailwind layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Toplam Etkinlik */}
        <GlassCard 
          onClick={() => navigate("/events")}
          className="p-5 flex flex-col justify-between min-h-[150px] cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">Toplam Etkinlik</p>
              <h3 className="kpi-value">{workspaceStats.totalEvents}</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] flex items-center justify-center shrink-0">
              <CalendarRange size={20} />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-medium">Arşivlendi: {workspaceStats.totalEvents - workspaceStats.activeEvents}</span>
            <svg className="w-[65px] h-[30px] stroke-[var(--color-blue-dark)] stroke-2 fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,22 Q10,14 20,26 T40,8 T60,18" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 2: Aktif Etkinlik */}
        <GlassCard 
          onClick={() => navigate("/events")}
          className="p-5 flex flex-col justify-between min-h-[150px] cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">Aktif Etkinlik</p>
              <h3 className="kpi-value">{workspaceStats.activeEvents}</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-green)]/10 text-[var(--accent-green)] flex items-center justify-center shrink-0">
              <Activity size={20} />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-medium">Canlı Yayınlanıyor</span>
            <svg className="w-[65px] h-[30px] stroke-[var(--accent-green)] stroke-2 fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,15 Q10,24 20,5 T40,20 T60,10" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 3: Yüklenen Fotoğraf */}
        <GlassCard 
          onClick={() => navigate("/upload")}
          className="p-5 flex flex-col justify-between min-h-[150px] cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">Yüklenen Fotoğraf</p>
              <h3 className="kpi-value">{workspaceStats.totalPhotos}</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-blue-medium)]/10 text-[var(--color-blue-medium)] flex items-center justify-center shrink-0">
              <Camera size={20} />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-medium">Son 7 gün: +320</span>
            <svg className="w-[65px] h-[30px] stroke-[var(--color-blue-medium)] stroke-2 fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,25 Q10,10 20,20 T40,8 T60,14" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 4: Kayıtlı Katılımcı */}
        <GlassCard 
          onClick={() => navigate("/participants")}
          className="p-5 flex flex-col justify-between min-h-[150px] cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">Kayıtlı Katılımcı</p>
              <h3 className="kpi-value">{workspaceStats.totalParticipants}</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-medium">Yüz Profilleri Kayıtlı</span>
            <svg className="w-[65px] h-[30px] stroke-[var(--accent-yellow)] stroke-2 fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,18 Q10,27 20,13 T40,25 T60,8" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 5: AI Eşleşme Oranı (ÖZEL VURGU - Öne Çıkarılmış) */}
        <GlassCard 
          onClick={() => navigate("/matching")}
          className="p-5 flex flex-col justify-between min-h-[150px] border-[2px] border-[var(--color-blue-medium)]/30 shadow-[0_8px_32px_rgba(99,102,241,0.06)] relative overflow-hidden bg-gradient-to-br from-[var(--color-blue-medium)]/5 to-transparent cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">AI Eşleşme Oranı</p>
              <h3 className="kpi-value">{workspaceStats.overallMatchRate}%</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-blue-medium)] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles size={20} className="animate-pulse" />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-semibold">Genel AI Performansı</span>
            <svg className="w-[75px] h-[30px] stroke-[var(--color-blue-medium)] stroke-[3px] fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,18 Q15,4 30,23 T60,8" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 6: Review Bekleyen (ÖZEL VURGU - Öne Çıkarılmış) */}
        <GlassCard 
          onClick={() => navigate("/review")}
          className="p-5 flex flex-col justify-between min-h-[150px] border-[2px] border-[var(--accent-red)]/30 shadow-[0_8px_32px_rgba(244,63,94,0.06)] relative overflow-hidden bg-gradient-to-br from-[var(--accent-red)]/5 to-transparent cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="kpi-label">Review Bekleyen</p>
              <h3 className="kpi-value">{workspaceStats.pendingReviews}</h3>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-red)] text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertCircle size={20} className={workspaceStats.pendingReviews > 0 ? "animate-bounce" : ""} />
            </div>
          </div>
          <div className="flex justify-between items-end gap-3 mt-3">
            <span className="text-[12px] text-[var(--text-muted)] opacity-70 font-semibold">Onay bekleyen yüzler</span>
            <svg className="w-[75px] h-[30px] stroke-[var(--accent-red)] stroke-[3px] fill-none overflow-visible" viewBox="-2 -2 64 34">
              <path d="M0,23 Q15,8 30,25 T60,4" />
            </svg>
          </div>
        </GlassCard>

        {/* Card 7: Storage Kullanımı (Çift Sütun Kaplayan, Progress Bar) */}
        <GlassCard 
          onClick={() => navigate("/upload")}
          className="p-5 md:col-span-2 flex flex-col justify-between min-h-[150px] cursor-pointer theme-card-hover"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow flex flex-col gap-2">
              <p className="kpi-label">Depolama ve SaaS Limitleri</p>
              <div className="w-full pr-2">
                <div className="flex justify-between items-center mb-1.5 text-[12px] font-semibold">
                  <span className="text-[var(--text-muted)]">Kullanılan Alan</span>
                  <span className="text-[var(--text-main)]">
                    {workspaceStats.storageUsedGB} GB / {workspaceStats.storageLimitGB} GB (%{((workspaceStats.storageUsedGB / workspaceStats.storageLimitGB) * 100).toFixed(0)})
                  </span>
                </div>
                <div className="w-full h-2.5 bg-white/20 dark:bg-black/20 rounded-full overflow-hidden border border-[var(--glass-border)]">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${(workspaceStats.storageUsedGB / workspaceStats.storageLimitGB * 100).toFixed(0)}%` }} 
                  />
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-[12px] bg-[var(--color-blue-medium)]/10 text-[var(--color-blue-medium)] flex items-center justify-center shrink-0">
              <UploadCloud size={20} />
            </div>
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--glass-border)]/50 text-[12px] text-[var(--text-muted)] opacity-70 font-medium">
            <span>Abonelik Planı: Premium Enterprise</span>
            <span>Maksimum Sınır: {workspaceStats.storageLimitGB} GB</span>
          </div>
        </GlassCard>
      </div>

      {/* Middle Layout Grid */}
      <div className="middle-grid">
        {/* Left Column (Main Stats / Activities / Data Flows) */}
        <div className="flex flex-col gap-6">
          
          {/* Aktif Etkinlikler (3D Tilted Karusel Görünümü) */}
          <TiltedCarousel
            title="Aktif Etkinlikler"
            action={
              <span className="text-[12px] bg-[var(--color-blue-light)] text-[var(--color-blue-dark)] font-bold px-2.5 py-0.5 rounded-[12px]">
                {events.filter(e => e.status === "live").length} Canlı
              </span>
            }
          >
            {events.filter(e => e.status === "live").map(evt => {
              const evtPhotos = mockApi.getPhotos(evt.id);
              const evtParticipants = mockApi.getParticipants(evt.id);
              return (
                <TiltedCard
                  key={evt.id}
                  onClick={() => navigate(`/events/${evt.id}`)}
                  className="w-[290px] h-[255px]"
                  maxTilt={8}
                  scale={1.03}
                >
                  <GlassCard 
                    className="relative overflow-hidden flex flex-col gap-3 p-0 border border-[var(--glass-border)] h-full w-full"
                  >
                    {/* Cover Image */}
                    <div className="h-28 w-full overflow-hidden relative">
                      <img src={evt.cover_url} alt={evt.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-[var(--accent-red)] text-white text-[10px] font-bold px-2 py-0.5 rounded-[12px] uppercase tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span> Canlı
                      </span>
                      <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-[12px] capitalize">
                        {evt.category === "wedding" ? "💍 Düğün" : (evt.category === "graduation" ? "🎓 Mezuniyet" : "💼 Toplantı")}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col gap-2">
                      <h4 className="m-0 text-[14px] font-semibold text-[var(--text-main)] truncate">{evt.title}</h4>
                      <p className="m-0 text-[12px] text-[var(--text-muted)] opacity-70 truncate">{evt.location}</p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-[var(--glass-border)]/50 text-[12px]">
                        <span className="text-[var(--text-muted)] opacity-70 font-medium">Tarih: {evt.date}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[var(--color-blue-dark)]">{evtPhotos.length} Foto</span>
                          <span className="font-semibold text-[var(--accent-green)]">{evtParticipants.length} Katılımcı</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </TiltedCard>
              );
            })}
          </TiltedCarousel>

          {/* Son Uploadlar (3D Tilted Karusel Görünümü) */}
          <TiltedCarousel
            title="Son Yüklenen Fotoğraflar"
            action={
              <span className="text-[12px] bg-[var(--color-blue-light)] text-[var(--color-blue-dark)] font-bold px-2.5 py-0.5 rounded-[12px]">
                {recentPhotos.length} Son Yükleme
              </span>
            }
          >
            {recentPhotos.map(photo => {
              const event = events.find(e => e.id === photo.event_id) || {};
              const fileSizeMB = (photo.original_size_bytes / (1024 * 1024)).toFixed(1);
              return (
                <TiltedCard
                  key={photo.id}
                  onClick={() => navigate(`/events/${photo.event_id}`)}
                  className="w-[190px] h-[190px] rounded-[20px] overflow-hidden group shadow-md"
                  maxTilt={12}
                  scale={1.04}
                >
                  <div className="relative w-full h-full">
                    <img 
                      src={photo.thumbnail_url} 
                      alt={photo.filename} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    {/* Glow and photo details overlay */}
                    <div className="absolute bottom-0 inset-x-0 p-3 bg-black/50 backdrop-blur-md text-white flex flex-col gap-0.5 z-10">
                      <span className="text-[11px] font-bold truncate">{photo.filename}</span>
                      <span className="text-[9px] opacity-80 truncate">{event.title || "Etkinlik"}</span>
                      <div className="flex justify-between items-center mt-1 text-[8px] opacity-70 font-semibold">
                        <span>{fileSizeMB} MB</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-white/10">{photo.status === "matched" ? "Eşleşti ✨" : "İşleniyor ⚙️"}</span>
                      </div>
                    </div>
                  </div>
                </TiltedCard>
              );
            })}
          </TiltedCarousel>

          {/* Curved double area chart */}
          <GlassCard 
            title="Haftalık Fotoğraf Yükleme Analizi"
            onClick={() => navigate("/analytics")}
            className="cursor-pointer theme-card-hover"
          >
            <div className="area-chart-wrapper">
              <div className="area-chart-head">
                <div className="area-chart-legend">
                  <div className="legend-item text-[12px] text-[var(--text-muted)] opacity-70 flex items-center gap-1.5">
                    <span className="legend-dot bg-[var(--color-blue-dark)] w-2.5 h-2.5 rounded-full inline-block" />
                    <span>Fotoğrafçı Fotoğrafları</span>
                  </div>
                  <div className="legend-item text-[12px] text-[var(--text-muted)] opacity-70 flex items-center gap-1.5">
                    <span className="legend-dot bg-[var(--color-blue-soft)] w-2.5 h-2.5 rounded-full inline-block" />
                    <span>Misafir Fotoğrafları (Düğün)</span>
                  </div>
                </div>
                <div className="legend-item flex items-center text-[12px] text-[var(--accent-green)] font-semibold">
                  <TrendingUp size={16} className="mr-1" />
                  <span>+12.4% Artış</span>
                </div>
              </div>

              {/* Chart curves */}
              <div className="chart-svg-container mt-4">
                <div className="chart-grid-line top-0 text-[11px] text-[var(--text-muted)] opacity-70">250</div>
                <div className="chart-grid-line top-[33%] text-[11px] text-[var(--text-muted)] opacity-70">150</div>
                <div className="chart-grid-line top-[66%] text-[11px] text-[var(--text-muted)] opacity-70">50</div>
                
                <svg width="100%" height="100%" viewBox="0 0 450 170" preserveAspectRatio="none" className="absolute z-[1]">
                  <defs>
                    <linearGradient id="photographerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-blue-dark)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-blue-dark)" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="guestGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-blue-soft)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--color-blue-soft)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Photographer Area Fill */}
                  <path 
                    d="M0,120 C30,105 60,115 90,75 C120,35 150,95 180,50 C210,15 240,65 270,95 C300,125 330,75 360,85 C390,95 420,45 450,105 L450,170 L0,170 Z" 
                    fill="url(#photographerGrad)" 
                  />
                  {/* Photographer Stroke */}
                  <path 
                    d="M0,120 C30,105 60,115 90,75 C120,35 150,95 180,50 C210,15 240,65 270,95 C300,125 330,75 360,85 C390,95 420,45 450,105" 
                    fill="none" 
                    stroke="var(--color-blue-dark)" 
                    strokeWidth="3" 
                  />

                  {/* Guest Area Fill */}
                  <path 
                    d="M0,140 C30,130 60,115 90,95 C120,75 150,55 180,85 C210,115 240,105 270,75 C300,45 330,55 360,105 C390,155 420,110 450,130 L450,170 L0,170 Z" 
                    fill="url(#guestGrad)" 
                  />
                  {/* Guest Stroke */}
                  <path 
                    d="M0,140 C30,130 60,115 90,95 C120,75 150,55 180,85 C210,115 240,105 270,75 C300,45 330,55 360,105 C390,155 420,110 450,130" 
                    fill="none" 
                    stroke="var(--color-blue-soft)" 
                    strokeWidth="2.5" 
                  />
                </svg>
              </div>
              <div className="chart-labels-x text-[11px] text-[var(--text-muted)] opacity-70 mt-2">
                {weeklyUploadActivity.map((d, index) => (
                  <span key={index}>{d.day}</span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Redesigned Premium Timeline Activities */}
          <GlassCard title="Sistem Aktiviteleri">
            <div className="flex flex-col gap-4 py-2.5 px-[5px] relative">
              {/* Vertical timeline connector */}
              <div className="absolute left-[21px] top-[15px] bottom-[15px] w-[2px] bg-[var(--glass-border)] z-0" />
              
              {recentActivities.slice(0, 4).map((act, index) => (
                <div key={index} className="flex gap-4 items-start relative z-10">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-blue-dark)] border-4 border-[var(--glass-bg-strong)] shadow-[0_0_0_4px_var(--glass-border)] mt-1.5 ml-[15px]" />
                  <div className="bg-white/3 border border-[var(--glass-border)] rounded-[14px] p-3.5 flex-grow flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <strong className="text-[14px] font-semibold text-[var(--text-main)]">{act.user}</strong>
                      <small className="text-[var(--text-muted)] opacity-70 text-[12px]">
                        {new Date(act.time).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      </small>
                    </div>
                    <p className="m-0 text-[12px] text-[var(--text-muted)] opacity-70 leading-[1.35]">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column (AI Widget, Calendar, Categories) */}
        <div className="flex flex-col gap-6">
          
          {/* AI Matching Özeti (AI Eşleştirme Motoru Durumu) */}
          <GlassCard 
            title="AI Eşleştirme Motoru Durumu (Özet)"
            onClick={() => navigate("/matching")}
            className="cursor-pointer theme-card-hover"
          >
            <div className="flex flex-col gap-5">
              
              {/* Circular accuracy and main rates */}
              <div className="flex items-center justify-between">
                <div className="ai-ring-wrap !m-0">
                  <div className="ai-center">
                    <div className="progress-wave-bg" />
                    <div className="progress-wave-bg-secondary" />
                    <div className="z-10 flex flex-col items-center">
                      <strong className="text-[30px] font-semibold text-[var(--text-main)] leading-none">{workspaceStats.overallMatchRate}%</strong>
                      <span className="text-[12px] font-semibold text-[var(--text-muted)] opacity-70 mt-1">Doğruluk</span>
                    </div>
                  </div>
                  <svg viewBox="0 0 140 140" className="ai-ring">
                    <circle cx="70" cy="70" r={aiRadius} className="ring-track" strokeWidth="8" />
                    <circle 
                      cx="70" cy="70" r={aiRadius} className="ring-progress stroke-[var(--color-blue-dark)]" strokeWidth="8" 
                      strokeDasharray={aiCircumference} strokeDashoffset={aiOffset}
                    />
                  </svg>
                </div>
                
                <div className="flex flex-col gap-3 flex-grow ml-6">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[var(--text-muted)] font-medium">GPU Kuyruğu</span>
                    <span className="bg-[var(--accent-green)]/15 text-[var(--accent-green)] py-0.5 px-2 rounded-[12px] font-bold">Aktif (v2.4)</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[var(--text-muted)] font-medium">Kuyruk Boyutu</span>
                    <strong className="text-[13px] font-semibold text-[var(--text-main)]">12 dosya</strong>
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[var(--text-muted)] font-medium">Başarı Oranı</span>
                    <strong className="text-[13px] font-semibold text-[var(--accent-green)]">%99.8</strong>
                  </div>
                </div>
              </div>

              {/* Progress Bar for photo processing queue */}
              <div className="bg-white/3 border border-[var(--glass-border)] p-4 rounded-[16px] flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Zap size={14} className="text-[var(--color-blue-dark)]" />
                    <span className="text-[13px] font-semibold text-[var(--text-main)]">Aktif Eşleştirme</span>
                  </div>
                  <small className="text-[var(--text-muted)] opacity-70 font-semibold text-[12px]">42 fotoğraf işleniyor</small>
                </div>
                <div className="h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div className="h-full w-[70%] bg-[var(--accent-gradient)] rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[12px] text-[var(--text-muted)] opacity-70">
                  <span>Kalan Süre: ~2 dk 15 sn</span>
                  <span>GPU Yükü: %68</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Redesigned Modern Notion/Apple Calendar */}
          <GlassCard>
            <div className="calendar-widget">
              <div className="calendar-head flex flex-col gap-1.5">
                <h4 className="text-[14px] font-semibold text-[var(--text-main)] m-0">Temmuz 2026</h4>
                <p className="text-[12px] text-[var(--text-muted)] opacity-70 m-0">Etkinlik Takvimi</p>
                <div className="calendar-nav-arrows mt-1">
                  <span className="calendar-arrow"><ChevronLeft size={16} /></span>
                  <span className="calendar-arrow"><ChevronRight size={16} /></span>
                </div>
              </div>

              <div className="calendar-grid mt-3">
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Pt</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Sa</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Ça</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Pe</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Cu</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Ct</span>
                <span className="calendar-day-label text-[11px] text-[var(--text-muted)] opacity-70">Pa</span>
                {renderCalendar()}
              </div>
            </div>
          </GlassCard>

          {/* Category / Project Card */}
          <GlassCard 
            title="Etkinlik Kategorileri"
            onClick={() => navigate("/events")}
            className="cursor-pointer theme-card-hover"
          >
            <div className="flex flex-col gap-3">
              <div className="category-row flex items-center justify-between p-3.5 bg-white/20 border border-[var(--glass-border)] rounded-[14px] hover:bg-white/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-[20px] w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">💍</div>
                  <div className="flex flex-col">
                    <strong className="text-[14px] font-semibold text-[var(--text-main)]">Düğün & Nişan</strong>
                    <span className="text-[12px] text-[var(--text-muted)] opacity-70">Misafir fotoğraf yüklemesi açık</span>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--text-muted)] opacity-70" />
              </div>
              <div className="category-row flex items-center justify-between p-3.5 bg-white/20 border border-[var(--glass-border)] rounded-[14px] hover:bg-white/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-[20px] w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">🎓</div>
                  <div className="flex flex-col">
                    <strong className="text-[14px] font-semibold text-[var(--text-main)]">Mezuniyet Töreni</strong>
                    <span className="text-[12px] text-[var(--text-muted)] opacity-70">AI Yüz eşleştirme öncelikli</span>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--text-muted)] opacity-70" />
              </div>
              <div className="category-row flex items-center justify-between p-3.5 bg-white/20 border border-[var(--glass-border)] rounded-[14px] hover:bg-white/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-[20px] w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">💼</div>
                  <div className="flex flex-col">
                    <strong className="text-[14px] font-semibold text-[var(--text-main)]">Kurumsal Toplantı</strong>
                    <span className="text-[12px] text-[var(--text-muted)] opacity-70">QR kod giriş yetkilendirmesi</span>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-[var(--text-muted)] opacity-70" />
              </div>
            </div>
          </GlassCard>

          {/* Message / Notification List */}
          <GlassCard 
            title="Son Bildirimler & Mesajlar"
            onClick={() => navigate("/messages")}
            className="cursor-pointer theme-card-hover"
          >
            <div className="messages-list flex flex-col gap-3">
              <div className="message-row flex items-center gap-3 p-2.5 rounded-[12px] bg-white/10 border border-[var(--glass-border)]/30 hover:bg-white/20 transition-all">
                <img 
                  className="w-9 h-9 object-cover rounded-full border border-white/40" 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" 
                  alt="Ekin" 
                />
                <div className="flex flex-col">
                  <strong className="text-[14px] font-semibold text-[var(--text-main)]">Ekin Soylu</strong>
                  <span className="text-[12px] text-[var(--text-muted)] opacity-70 truncate max-w-[200px]">Yüklediğim selfie ile 4 fotoğrafım eşleşti!</span>
                </div>
              </div>
              <div className="message-row flex items-center gap-3 p-2.5 rounded-[12px] bg-white/10 border border-[var(--glass-border)]/30 hover:bg-white/20 transition-all">
                <img 
                  className="w-9 h-9 object-cover rounded-full border border-white/40" 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" 
                  alt="Can" 
                />
                <div className="flex flex-col">
                  <strong className="text-[14px] font-semibold text-[var(--text-main)]">Can Arslan</strong>
                  <span className="text-[12px] text-[var(--text-muted)] opacity-70 truncate max-w-[200px]">Düğünden çektiğim fotoğrafları galeriye ekledim.</span>
                </div>
              </div>
              <div className="message-row flex items-center gap-3 p-2.5 rounded-[12px] bg-white/10 border border-[var(--glass-border)]/30 hover:bg-white/20 transition-all">
                <div className="avatar w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px] bg-[var(--accent-gradient)]">S</div>
                <div className="flex flex-col">
                  <strong className="text-[14px] font-semibold text-[var(--text-main)]">Sistem Uyarısı</strong>
                  <span className="text-[12px] text-[var(--text-muted)] opacity-70 truncate max-w-[200px]">Yüksek çözünürlüklü 12 dosya otomatik sıkıştırıldı.</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
