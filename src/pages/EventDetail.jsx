import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext, useLocation } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { mockApi } from "../services/mockApi";
import { eventsApi } from "../services/eventsApi";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
  Calendar, 
  MapPin, 
  Camera, 
  Users, 
  Zap, 
  AlertCircle, 
  QrCode, 
  ArrowLeft,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Activity,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Shield,
  Trash2,
  Lock,
  Unlock,
  Plus,
  Sliders,
  Copy,
  Download,
  Share2,
  Check,
  X,
  Play,
  Square,
  Eye,
  EyeOff,
  Copy as CopyIcon,
  Sparkles,
  Loader2,
  CheckSquare,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import BottomMobileSheet from "../components/ui/BottomMobileSheet";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const { user } = useAuth();
  const isOrganizer = user?.role === "event_owner";
  const isPhotographer = user?.role === "business_admin" || user?.role === "platform_admin";

  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumSearchQuery, setAlbumSearchQuery] = useState("");

  // Tab 2 Photos - Infinite Scroll Simulation State
  const [visiblePhotosCount, setVisiblePhotosCount] = useState(12);
  const [loadingMorePhotos, setLoadingMorePhotos] = useState(false);

  // Tab 3 Participants - PII mask state
  const [maskPII, setMaskPII] = useState(true);

  // Tab 4 Matching - AI Matching control states
  const [matchingActive, setMatchingActive] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.80);
  const [aiLogs, setAiLogs] = useState([
    "[10:30:15] AI Engine: Başlatma sinyali bekleniyor...",
    "[10:30:18] AI Engine: Gerekli yüz kütüphaneleri yüklendi.",
    "[10:30:20] AI Engine: Eşleştirme motoru hazır."
  ]);
  const [logIntervalId, setLogIntervalId] = useState(null);

  // Tab 6 QR & Access - custom token editing state
  const [qrToken, setQrToken] = useState("");
  const [accessType, setAccessType] = useState("public");
  const [accessPassword, setAccessPassword] = useState("");
  const [showAccessPassword, setShowAccessPassword] = useState(false);
  const [savingAccessSettings, setSavingAccessSettings] = useState(false);

  // Tab 7 Settings - form and delete confirmation modal states
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDate, setEditDate] = useState("");
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");

  // Gallery and Bulk Actions States
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [confirmBulkDeleteText, setConfirmBulkDeleteText] = useState("");

  useEffect(() => {
    if (activeTab === "photos") {
      setIsLoadingPhotos(true);
      setSelectedPhotoIds([]); // reset selection
      setVisiblePhotosCount(12); // Reset count on tab switch
      const timer = setTimeout(() => setIsLoadingPhotos(false), 500);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "photos") return;
    
    const handleScroll = () => {
      if (visiblePhotosCount >= photos.length || loadingMorePhotos) return;

      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      if (scrolledToBottom) {
        setLoadingMorePhotos(true);
        setTimeout(() => {
          setVisiblePhotosCount(prev => prev + 12);
          setLoadingMorePhotos(false);
        }, 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab, visiblePhotosCount, photos.length, loadingMorePhotos]);

  const refreshData = async () => {
    const ev = mockApi.getEventById(id);
    if (ev) {
      setEvent(ev);
      setPhotos(mockApi.getPhotos(ev.id));
      setParticipants(mockApi.getParticipants(ev.id));
      setMatches(mockApi.getMatches(ev.id));
      setQrToken(ev.qr_token || "");
      setAccessType(ev.access_type || "public");
      setAccessPassword(ev.access_password || "");
      setShowAccessPassword(false);
      setEditTitle(ev.title || "");
      setEditLocation(ev.location || "");
      setEditDate(ev.date || "");
      setEventLoading(false);
      return;
    }

    try {
      setEventLoading(true);
      const data = await eventsApi.getEvent(id);
      const apiEvent = data.event;
      setEvent(apiEvent);
      setPhotos([]);
      setParticipants([]);
      setMatches([]);
      setQrToken(apiEvent.qr_token || "");
      setAccessType(apiEvent.access_type || "public");
      setAccessPassword(apiEvent.access_password || "");
      setShowAccessPassword(false);
      setEditTitle(apiEvent.title || "");
      setEditLocation(apiEvent.location || "");
      setEditDate(apiEvent.date || "");
    } catch {
      setEvent(null);
    } finally {
      setEventLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [id]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tabList.some((item) => item.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Calculate metrics
  const totalPhotos = photos.length;
  const totalParticipants = participants.length;
  const matchedPhotos = new Set(matches.filter(m => m.status === 'approved' || m.status === 'auto_approved').map(m => m.photo_id)).size;
  const matchRate = totalPhotos > 0 ? Math.round((matchedPhotos / totalPhotos) * 100) : 0;
  const pendingReviewsList = matches.filter(m => m.status === 'pending_review');
  const pendingReviewsCount = pendingReviewsList.length;

  const tabList = [
    { id: "overview", label: "Genel Bakış" },
    { id: "photos", label: "Fotoğraflar" },
    { id: "participants", label: "Katılımcılar" },
    { id: "matching", label: "AI Eşleştirme" },
    { id: "review", label: `Match Review (${pendingReviewsCount})` },
    { id: "qr", label: "QR & Erişim" },
    { id: "analytics", label: "Analiz" },
    { id: "settings", label: "Ayarlar" }
  ];

  // Helper PII Masking functions
  const maskEmail = (email) => {
    if (!email) return "";
    const [user, domain] = email.split("@");
    if (user.length <= 2) return `${user[0]}*@${domain}`;
    return `${user[0]}${"*".repeat(user.length - 2)}${user[user.length - 1]}@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    const clean = phone.replace(/\s+/g, "");
    if (clean.length < 8) return phone;
    return `${clean.slice(0, 4)} *** *** ${clean.slice(-2)}`;
  };

  // Duplicate / Template helper
  const handleCopyTemplate = () => {
    mockApi.createEvent({
      title: `${event.title} (Şablon Kopya)`,
      location: event.location,
      category: event.category,
      date: event.date,
      access_type: event.access_type || "public",
      cover_image: event.cover_image || event.cover_url,
      consent_text: event.consent_text
    });
    showToast("Etkinlik şablonu başarıyla kopyalandı!");
  };

  // Tab 3 Revoke Participant Consent & Face Data
  const handleRevokeParticipant = (participantId, displayName) => {
    // Delete face profile simulation
    const dbParticipants = JSON.parse(localStorage.getItem("sm_participants") || "[]");
    const filteredParticipants = dbParticipants.filter(p => p.id !== participantId);
    localStorage.setItem("sm_participants", JSON.stringify(filteredParticipants));

    const dbMatches = JSON.parse(localStorage.getItem("sm_matches") || "[]");
    const filteredMatches = dbMatches.filter(m => m.participant_id !== participantId);
    localStorage.setItem("sm_matches", JSON.stringify(filteredMatches));

    mockApi.recalculateAnalytics();
    refreshData();
    showToast(`"${displayName}" adlı katılımcının tüm yüz verileri ve eşleşmeleri silindi.`, "info");
  };

  // Tab 4 Simulation intervals
  const handleToggleAiMatching = () => {
    if (matchingActive) {
      // Stop AI
      setMatchingActive(false);
      if (logIntervalId) {
        clearInterval(logIntervalId);
        setLogIntervalId(null);
      }
      setAiLogs(prev => [...prev, `[${new Date().toLocaleTimeString("tr-TR")}] AI Engine: Eşleştirme işlemi durduruldu.`]);
      showToast("Eşleştirme işlemi durduruldu.", "warning");
    } else {
      // Start AI
      setMatchingActive(true);
      setAiLogs(prev => [...prev, `[${new Date().toLocaleTimeString("tr-TR")}] AI Engine: Yüz tarama başlatılıyor... (Güven Eşiği: %${(confidenceThreshold * 100).toFixed(0)})`]);
      
      const interval = setInterval(() => {
        const timestamp = new Date().toLocaleTimeString("tr-TR");
        const logTemplates = [
          `[${timestamp}] AI Engine: Fotoğraflarda yüz geometrileri algılanıyor...`,
          `[${timestamp}] AI Engine: 4 yeni yüz profili karşılaştırıldı.`,
          `[${timestamp}] AI Engine: Eşleşme bulundu - Katılımcı: Can A. (Skor: 0.94)`,
          `[${timestamp}] AI Engine: Düşük güvenli eşleşme review kuyruğuna gönderildi (Skor: 0.72)`,
          `[${timestamp}] AI Engine: Eşleme motoru kuyruğu başarıyla tamamladı.`
        ];
        
        const nextLog = logTemplates[Math.floor(Math.random() * logTemplates.length)];
        setAiLogs(prev => [...prev, nextLog].slice(-20)); // Limit to last 20 logs

        // Randomly simulate processing some pending matches to live matches
        if (Math.random() > 0.6 && event) {
          const localMatches = JSON.parse(localStorage.getItem("sm_matches") || "[]");
          const pending = localMatches.find(m => m.event_id === event.id && m.status === "pending_review");
          if (pending) {
            pending.status = Math.random() > 0.5 ? "auto_approved" : "approved";
            localStorage.setItem("sm_matches", JSON.stringify(localMatches));
            mockApi.recalculateAnalytics();
            refreshData();
          }
        }
      }, 1500);

      setLogIntervalId(interval);
      showToast("Eşleştirme motoru arka planda başlatıldı.", "success");
    }
  };

  useEffect(() => {
    return () => {
      if (logIntervalId) clearInterval(logIntervalId);
    };
  }, [logIntervalId]);

  if (eventLoading) {
    return (
      <div className="skeleton-page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "16px" }}>
        <h3>Etkinlik yukleniyor...</h3>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="skeleton-page-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", gap: "16px" }}>
        <AlertCircle size={48} style={{ color: "var(--text-muted)" }} />
        <h3>Etkinlik Bulunamadı</h3>
        <p style={{ color: "var(--text-muted)" }}>Aradığınız etkinlik bulunamadı veya silinmiş olabilir.</p>
        <button className="primary-btn" onClick={() => navigate("/events")}>
          <ArrowLeft size={16} />
          <span>Etkinliklere Dön</span>
        </button>
      </div>
    );
  }

  // Tab 5 Review actions
  const handleReviewDecision = (matchId, decision) => {
    const status = decision === "approve" ? "approved" : "rejected";
    mockApi.updateMatchStatus(matchId, status);
    
    // Log Activity
    mockApi.logActivity(
      "Ezgi Çelik", 
      `match_review_${decision}`, 
      `Eşleşme ${matchId} manuel olarak ${decision === "approve" ? "onaylandı" : "reddedildi"}.`, 
      event.id
    );

    refreshData();
    showToast(`Eşleşme ${decision === "approve" ? "onaylandı" : "reddedildi"}.`, "success");
  };

  // Tab 6 Access save
  const handleSaveAccessSettings = async () => {
    if (user) {
      try {
        setSavingAccessSettings(true);
        const data = await eventsApi.updateEventAccess(event.id, {
          qr_token: qrToken,
          access_type: accessType,
          access_password: accessType === "closed" ? accessPassword : ""
        });
        const updatedEvent = data.event;
        setEvent((current) => ({ ...current, ...updatedEvent }));
        setQrToken(updatedEvent.qr_token || "");
        setAccessType(updatedEvent.access_type || "public");
        setAccessPassword(updatedEvent.access_password || "");
        setShowAccessPassword(false);
        showToast("Erişim ve QR kod ayarları kaydedildi.", "success");
      } catch (err) {
        showToast(err.message || "Erişim ayarları güncellenemedi.", "error");
      } finally {
        setSavingAccessSettings(false);
      }
      return;
    }

    mockApi.updateEvent(event.id, {
      qr_token: qrToken,
      access_type: accessType
    });
    refreshData();
    showToast("Erişim ve QR kod ayarları kaydedildi.", "success");
  };

  // Tab 8 Update details
  const handleUpdateSettings = () => {
    mockApi.updateEvent(event.id, {
      title: editTitle,
      location: editLocation,
      date: editDate
    });
    refreshData();
    showToast("Etkinlik bilgileri başarıyla güncellendi.", "success");
  };

  // Tab 8 Archive event
  const handleArchiveEvent = () => {
    mockApi.updateEvent(event.id, { status: "archived" });
    refreshData();
    showToast("Etkinlik arşivlendi. Fotoğraf yüklemeleri ve eşleşmeler durduruldu.", "warning");
  };

  // Tab 8 Delete event
  const handleDeleteEventSubmit = () => {
    if (confirmTitle !== event.title) {
      showToast("Girdiğiniz isim etkinlik adı ile eşleşmiyor.", "error");
      return;
    }
    mockApi.deleteEvent(event.id);
    showToast("Etkinlik kalıcı olarak sistemden silindi.", "info");
    navigate("/events");
  };

  // Bulk Actions
  const handleBulkReprocess = () => {
    showToast(`${selectedPhotoIds.length} fotoğraf yeniden işlem sırasına gönderildi.`, "success");
    setSelectedPhotoIds([]);
    mockApi.simulateAiMatching(event.id, selectedPhotoIds);
    setTimeout(() => {
      refreshData();
    }, 1500);
  };

  const handleBulkRemoveFromEvent = () => {
    selectedPhotoIds.forEach(id => {
      mockApi.deletePhoto(id);
    });
    showToast(`${selectedPhotoIds.length} fotoğraf etkinlikten çıkarıldı.`, "success");
    setSelectedPhotoIds([]);
    refreshData();
  };

  const handleBulkDeleteSubmit = () => {
    if (confirmBulkDeleteText !== "TOPLU SİL") {
      showToast("Lütfen doğrulamak için 'TOPLU SİL' yazın.", "error");
      return;
    }
    selectedPhotoIds.forEach(id => {
      mockApi.deletePhoto(id);
    });
    showToast(`${selectedPhotoIds.length} fotoğraf sistemden kalıcı olarak silindi.`, "success");
    setSelectedPhotoIds([]);
    setShowBulkDeleteModal(false);
    setConfirmBulkDeleteText("");
    refreshData();
  };

  // Tab 2 Photos infinite scroll slicing
  const visiblePhotos = photos.slice(0, visiblePhotosCount);

  if (isMobile) {
    if (!event) return <div className="p-10 text-center text-xs">Yükleniyor...</div>;
    
    // Custom mobile active tab logic (defaults to photos)
    const mobileTabs = [
      { id: "photos", label: "Fotoğraflar" },
      { id: "participants", label: "Katılımcılar" },
      { id: "qr", label: "QR Kod" }
    ];
    
    // Ensure mobileActiveTab maps to one of the 3 tabs
    const currentMobileTab = ["photos", "participants", "qr"].includes(activeTab) ? activeTab : "photos";
    
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Hero Card Banner */}
        <div className="relative h-40 rounded-3xl overflow-hidden shadow-md">
          <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover brightness-75" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-lg font-black m-0 leading-tight">{event.title}</h1>
            <p className="text-[10px] opacity-90 m-0 mt-1 flex items-center gap-1">
              <MapPin size={10} /> {event.location} &bull; {event.date}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab("settings")}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 text-white border-none flex items-center justify-center cursor-pointer"
          >
            <SettingsIcon size={16} />
          </button>
        </div>

        {/* iOS Segmented Control */}
        <div className="flex bg-white/10 dark:bg-black/20 p-1 rounded-2xl border border-[var(--glass-border)]">
          {mobileTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border-none transition-all cursor-pointer ${
                currentMobileTab === tab.id 
                  ? "bg-[var(--glass-bg-strong)] text-[var(--color-blue-dark)] shadow-sm" 
                  : "bg-transparent text-[var(--text-muted)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEGMENT CONTENTS */}
        
        {/* Photos Segment */}
        {currentMobileTab === "photos" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-[var(--text-muted)]">{photos.length} Görsel</span>
              <button 
                onClick={() => showToast("Tüm fotoğraflar zip olarak hazırlanıyor...", "info")}
                className="text-[10px] font-bold text-[var(--color-blue-dark)] bg-transparent border-none cursor-pointer"
              >
                Tümünü İndir
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {photos.map(p => (
                <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--glass-border)]">
                  <img src={p.thumbnail_url} alt="event photo" className="w-full h-full object-cover" />
                  <button
                    onClick={() => showToast("Fotoğraf indiriliyor...", "info")}
                    className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white border-none flex items-center justify-center cursor-pointer"
                  >
                    <Download size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participants Segment */}
        {currentMobileTab === "participants" && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-[var(--text-muted)]">{participants.length} Katılımcı</span>
              <button 
                onClick={() => {
                  showToast("Lütfen yeni katılımcıyı eklemek için selfie yükleyin.", "info");
                  setActiveTab("settings");
                }}
                className="text-[10px] font-bold text-[var(--color-blue-dark)] bg-transparent border-none cursor-pointer"
              >
                Yeni Ekle
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {participants.map(p => (
                <div key={p.id} className="glass-panel p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.face_url} alt={p.display_name} className="w-10 h-10 rounded-full object-cover border border-[var(--glass-border)]" />
                    <div>
                      <strong className="text-xs font-bold text-[var(--text-main)] block">{p.display_name}</strong>
                      <span className="text-[9px] text-[var(--text-muted)] mt-0.5 block">{p.consent_status === "given" ? "KVKK Açık Rıza Verildi" : "Onay Bekliyor"}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeParticipant(p.id, p.display_name)}
                    className="px-2 py-1 rounded-lg bg-red-500/10 text-red-500 border-none text-[9px] font-bold cursor-pointer"
                  >
                    Kaldır
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QR Access Segment */}
        {currentMobileTab === "qr" && (
          <div className="flex flex-col gap-4 items-center">
            {/* Apple Wallet Style QR Card */}
            <div className="glass-panel p-5 w-full max-w-[280px] flex flex-col items-center text-center shadow-lg border border-[var(--glass-border)] rounded-3xl bg-[var(--glass-bg-strong)]">
              <span className="text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider mb-3">Misafir QR Giriş Kartı</span>
              <div className="bg-white p-3.5 rounded-2xl shadow-inner border border-black/5">
                <QrCode size={160} className="text-black" />
              </div>
              <strong className="text-xs font-extrabold text-[var(--text-main)] mt-4">{event.title}</strong>
              <span className="text-[10px] text-[var(--text-muted)] mt-1">{event.location}</span>
              
              <div className="flex gap-2 w-full mt-5">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/guest/${event.qr_token}`);
                    showToast("Misafir erişim bağlantısı kopyalandı!");
                  }}
                  className="primary-btn flex-1 py-2 text-[10px] font-bold rounded-xl justify-center"
                >
                  Link Kopyala
                </button>
                <button 
                  onClick={() => navigate(`/guest/${event.qr_token}`)}
                  className="secondary-btn flex-1 py-2 text-[10px] font-bold rounded-xl justify-center"
                >
                  Önizle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Sheet (Settings, AI matching, metadata edit) */}
        <BottomMobileSheet 
          isOpen={activeTab === "settings"} 
          onClose={() => setActiveTab("photos")}
          title="Etkinlik İşlemleri & AI Ayarları"
        >
          <div className="flex flex-col gap-4 py-2">
            
            {/* AI Settings Section */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider m-0">AI Yüz Eşleştirme Motoru</h4>
              <div className="glass-panel p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-[var(--text-muted)]">Minimum Güven Eşiği</span>
                  <span className="text-[var(--color-blue-dark)]">%{(confidenceThreshold * 100).toFixed(0)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.50" 
                  max="0.95" 
                  step="0.05" 
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                  disabled={matchingActive}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                
                <button 
                  onClick={handleToggleAiMatching}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                    matchingActive
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                  }`}
                >
                  {matchingActive ? "AI Eşleştirmeyi Durdur" : "AI Eşleştirmeyi Başlat"}
                </button>
              </div>
            </div>

            {/* Quick Actions (Archive / Delete) */}
            <div className="flex flex-col gap-2.5 mt-3 pt-3 border-t border-[var(--glass-border)]/30">
              <h4 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider m-0 mb-1">Yönetimsel İşlemler</h4>
              {event.status !== "archived" ? (
                <button
                  onClick={() => {
                    handleArchiveEvent();
                    setActiveTab("photos");
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-transparent cursor-pointer text-left px-4 flex items-center justify-between"
                >
                  <span>Etkinliği Arşivle</span>
                  <Lock size={14} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    mockApi.updateEventStatus(event.id, "live");
                    setEvent({...event, status: "live"});
                    showToast("Etkinlik tekrar yayına alındı.", "success");
                    setActiveTab("photos");
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs border border-transparent cursor-pointer text-left px-4 flex items-center justify-between"
                >
                  <span>Arşivi Kaldır (Yayına Al)</span>
                  <Unlock size={14} />
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm(`"${event.title}" etkinliğini kalıcı olarak silmek istediğinize emin misiniz?`)) {
                    mockApi.deleteEvent(event.id);
                    showToast("Etkinlik silindi.");
                    navigate("/events");
                  }
                }}
                className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 font-bold text-xs border border-transparent cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Etkinliği Kalıcı Olarak Sil</span>
                <Trash2 size={14} />
              </button>
            </div>
            
          </div>
        </BottomMobileSheet>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)] relative">
      
      {/* Back to Events Nav Header */}
      <div className="flex justify-between items-center flex-wrap gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button 
            className="icon-btn w-8 h-8 cursor-pointer" 
            onClick={() => navigate("/events")}
          >
            <ArrowLeft size={16} className="text-[var(--text-main)]" />
          </button>
          <span className="text-[0.85rem] text-[var(--text-muted)] font-semibold">Etkinlikler / {event.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {isOrganizer && (
            <button 
              onClick={() => navigate("/messages")} 
              className="primary-btn gap-1.5 py-1.5 px-3.5 text-[0.8rem] font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md shadow-blue-500/10 cursor-pointer flex items-center"
            >
              <MessageSquare size={14} />
              <span>Fotoğrafçı ile Mesajlaş</span>
            </button>
          )}
          {isPhotographer && (
            <button 
              onClick={() => navigate("/messages")} 
              className="primary-btn gap-1.5 py-1.5 px-3.5 text-[0.8rem] font-bold rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md shadow-blue-500/10 cursor-pointer flex items-center"
            >
              <MessageSquare size={14} />
              <span>Organizatör ile Mesajlaş</span>
            </button>
          )}
          <button 
            onClick={handleCopyTemplate} 
            className="secondary-btn"
          >
            <Copy size={14} />
            <span>Şablon Olarak Kopyala</span>
          </button>
        </div>
      </div>

      {/* Hero Event Card Header */}
      <GlassCard className="glass-panel p-0 overflow-hidden relative">
        <div className="h-[180px] w-full relative">
          <img 
            src={event.cover_image || event.cover_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1000&auto=format&fit=crop&q=80"} 
            alt={event.title} 
            className="w-full h-full object-cover brightness-[0.7]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5 text-white">
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white p-[3px_10px] rounded-[10px] text-[0.7rem] font-extrabold uppercase tracking-wider">
                    {event.category === "wedding" ? "💍 Düğün & Nişan" : (event.category === "graduation" ? "🎓 Mezuniyet" : "💼 Kurumsal")}
                  </span>
                  <span className={`p-[3px_10px] rounded-[10px] text-[0.7rem] font-extrabold uppercase tracking-wider ${
                    event.status === "live" ? "bg-emerald-500/80 text-white" : "bg-amber-500/80 text-white"
                  }`}>
                    {event.status === "live" ? "Yayında" : (event.status === "archived" ? "Arşivlendi" : "Taslak")}
                  </span>
                </div>
                <h2 className="m-0 text-[1.6rem] font-black tracking-tight">{event.title}</h2>
                <div className="flex gap-4 flex-wrap text-[0.82rem] opacity-90 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="bg-black/45 backdrop-blur-[6px] border border-white/20 p-[8px_14px] rounded-[12px] text-[0.8rem] font-bold flex items-center gap-2 select-none">
                  <QrCode size={15} />
                  <span>snapmatch.me/{event.qr_token || "guest"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tab Pills */}
      <div className="flex border-b border-[var(--glass-border)]/60 gap-1 overflow-x-auto pb-[1px] select-none">
        {tabList.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-[10px_16px] text-[0.86rem] font-extrabold border-none border-b-[3px] cursor-pointer transition-all duration-150 whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-white/10 dark:bg-white/5 border-[var(--color-blue-dark)] text-[var(--text-main)]" 
                : "bg-transparent border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      
      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-[var(--space-lg)] animate-fade-in">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-md)]">
            <GlassCard className="p-4 flex gap-3.5 items-center">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-blue-500/12 text-blue-500 grid place-items-center shrink-0">
                <Camera size={22} />
              </div>
              <div>
                <small className="text-[var(--text-muted)] block text-[0.76rem] font-bold uppercase tracking-wider">Toplam Fotoğraf</small>
                <strong className="text-[1.25rem] font-black">{totalPhotos}</strong>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4 flex gap-3.5 items-center">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-purple-500/12 text-purple-500 grid place-items-center shrink-0">
                <Users size={22} />
              </div>
              <div>
                <small className="text-[var(--text-muted)] block text-[0.76rem] font-bold uppercase tracking-wider">Katılımcı Kaydı</small>
                <strong className="text-[1.25rem] font-black">{totalParticipants}</strong>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4 flex gap-3.5 items-center">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-emerald-500/12 text-emerald-500 grid place-items-center shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <small className="text-[var(--text-muted)] block text-[0.76rem] font-bold uppercase tracking-wider">AI Eşleşme Oranı</small>
                <strong className="text-[1.25rem] font-black text-[var(--accent-green)]">%{matchRate}</strong>
              </div>
            </GlassCard>
            
            <GlassCard className="p-4 flex gap-3.5 items-center">
              <div className="w-[44px] h-[44px] rounded-[12px] bg-rose-500/12 text-rose-500 grid place-items-center shrink-0">
                <AlertCircle size={22} />
              </div>
              <div>
                <small className="text-[var(--text-muted)] block text-[0.76rem] font-bold uppercase tracking-wider">Review Bekleyen</small>
                <strong className="text-[1.25rem] font-black text-rose-500">{pendingReviewsCount}</strong>
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
            {/* Gallery Preview Grid */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold m-0 text-[1rem]">Galeri Önizleme</h4>
                <button className="primary-btn p-[6px_14px] text-[0.78rem]" onClick={() => setActiveTab("photos")}>
                  Tümünü Gör ({totalPhotos})
                </button>
              </div>
              
              <GlassCard className="glass-panel p-4 h-full flex flex-col justify-center">
                {photos.length === 0 ? (
                  <div className="text-center py-10 text-[var(--text-muted)] text-[0.85rem] font-semibold">Henüz hiç fotoğraf yüklenmedi.</div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {photos.slice(0, 8).map((ph) => (
                      <div key={ph.id} className="rounded-[12px] overflow-hidden h-[95px] border border-white/20 relative group">
                        <img src={ph.thumbnail_url} alt="event preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <span className={`absolute bottom-1 right-1 text-[9px] font-bold p-[1px_4px] rounded-[4px] uppercase ${
                          ph.status === "matched" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                        }`}>
                          {ph.status === "matched" ? "Eşleşti" : "Yeni"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Quick QR Card & Shared details */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold m-0 text-[1rem]">QR Kod Paylaşımı</h4>
              <GlassCard className="glass-panel p-5 flex flex-col items-center justify-between gap-4 text-center">
                <div className="bg-white p-3.5 rounded-[20px] shadow-sm">
                  <QrCode size={135} className="text-black" />
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  <strong className="text-[0.92rem]">snapmatch.me/{event.qr_token}</strong>
                  <p className="m-0 text-[0.76rem] text-[var(--text-muted)]">Misafirlerinizin kendi fotoğraflarını bulabilmesi için bu QR kodu posterlere veya ekranlara yansıtabilirsiniz.</p>
                </div>
                <div className="flex gap-2 w-full">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://snapmatch.me/${event.qr_token}`);
                      showToast("Link başarıyla kopyalandı.", "success");
                    }}
                    className="primary-btn flex-grow text-[0.8rem] justify-center gap-1"
                  >
                    <Share2 size={13} /> Copy Link
                  </button>
                  <button 
                    onClick={() => setActiveTab("qr")}
                    className="icon-btn w-9 h-9"
                  >
                    <ExternalLink size={14} className="text-[var(--text-main)]" />
                  </button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* 2. PHOTOS TAB */}
      {activeTab === "photos" && (() => {
        const getParticipantPhotos = (participantId) => {
          const pMatches = matches.filter(m => m.participant_id === participantId);
          return photos.filter(ph => pMatches.some(m => m.photo_id === ph.id));
        };

        const filteredParticipants = participants.filter(p => 
          p.display_name.toLowerCase().includes(albumSearchQuery.toLowerCase())
        );

        if (selectedAlbum) {
          const matchedPhotos = getParticipantPhotos(selectedAlbum.id);
          const confidence = 94 + (selectedAlbum.id.toString().charCodeAt(0) % 6);
          return (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Header */}
              <GlassCard className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Back button */}
                  <button 
                    onClick={() => setSelectedAlbum(null)}
                    className="w-9 h-9 rounded-full bg-white/10 dark:bg-black/20 border-none flex items-center justify-center cursor-pointer text-[var(--text-main)] hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="flex flex-col">
                    <h3 className="m-0 text-[1.25rem] font-extrabold text-[var(--text-main)]">
                      {selectedAlbum.display_name}
                    </h3>
                    <p className="m-0 text-[0.8rem] text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                      <span>{matchedPhotos.length} Fotoğraf</span>
                      <span>&bull;</span>
                      <span className="text-emerald-500 font-bold">AI Match Güven Skoru: %{confidence}</span>
                    </p>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => showToast("Koleksiyon dışa aktarılıyor...", "info")}
                    className="secondary-btn"
                  >
                    <Share2 size={14} />
                    <span>Export</span>
                  </button>
                  <button 
                    onClick={() => showToast("Fotoğraflar indiriliyor...", "info")}
                    className="secondary-btn"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  <button 
                    onClick={() => showToast("Manuel onay modu aktif.", "info")}
                    className="primary-btn"
                  >
                    <CheckSquare size={14} />
                    <span>Review</span>
                  </button>
                </div>
              </GlassCard>

              {/* Album Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                {/* Photo Grid */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-extrabold m-0 text-[1rem]">Kişi Fotoğrafları</h4>
                  {matchedPhotos.length === 0 ? (
                    <GlassCard className="p-12 text-center text-[var(--text-muted)] text-[0.85rem] font-medium">
                      Bu kişi için henüz eşleşmiş fotoğraf bulunmuyor.
                    </GlassCard>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {matchedPhotos.map(ph => (
                        <div key={ph.id} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group shadow-sm hover:shadow-md transition-all">
                          <img src={ph.thumbnail_url} alt="matched" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <button 
                            onClick={() => showToast("Görsel indiriliyor...", "info")}
                            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white border-none flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Actions / Metadata Sidebar */}
                <div className="flex flex-col gap-4">
                  {/* Timeline */}
                  <GlassCard className="glass-panel p-4 flex flex-col gap-3">
                    <h5 className="m-0 font-extrabold text-[0.88rem]">Timeline</h5>
                    <div className="flex flex-col gap-3.5 mt-1">
                      <div className="flex gap-2.5 items-start">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[0.76rem] font-bold">Selfie Eşleşmesi Kuruldu</span>
                          <span className="text-[9px] text-[var(--text-muted)]">Bugün, 14:15 &bull; AI Engine</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[0.76rem] font-bold">Yeni Fotoğraflar Algılandı</span>
                          <span className="text-[9px] text-[var(--text-muted)]">Bugün, 11:30 &bull; Fotoğrafçı</span>
                        </div>
                      </div>
                      <div className="flex gap-2.5 items-start opacity-70">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-500 mt-1 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[0.76rem] font-bold">Katılımcı KVKK Onayı Alındı</span>
                          <span className="text-[9px] text-[var(--text-muted)]">{event.date} &bull; Web Form</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* AI Match & Metadata */}
                  <GlassCard className="glass-panel p-4 flex flex-col gap-2">
                    <h5 className="m-0 font-extrabold text-[0.88rem]">AI Match & Metadata</h5>
                    <div className="flex flex-col gap-2 mt-1 text-[0.76rem]">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[var(--text-muted)]">Threshold Seviyesi:</span>
                        <span className="font-bold">%{confidenceThreshold * 100}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[var(--text-muted)]">Algılanan Yüzler:</span>
                        <span className="font-bold">1 Yüz / Profil</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[var(--text-muted)]">Feature Vector:</span>
                        <span className="font-mono text-[9px] text-emerald-500">512-dim Array</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)]">KVKK Statü:</span>
                        <span className="text-emerald-500 font-bold">Approved</span>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Manual Review Control */}
                  <GlassCard className="glass-panel p-4 flex flex-col gap-3">
                    <h5 className="m-0 font-extrabold text-[0.88rem]">Manual Review</h5>
                    <p className="m-0 text-[0.7rem] text-[var(--text-muted)] leading-relaxed">
                      AI'nin bu kişi için yaptığı eşleşmeleri onaylamak veya iptal etmek için aşağıdaki butonları kullanabilirsiniz.
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button 
                        onClick={() => showToast("Tüm eşleşmeler onaylandı.", "success")}
                        className="primary-btn flex-grow text-[0.76rem] justify-center p-[6px_10px]"
                      >
                        Tümünü Onayla
                      </button>
                      <button 
                        onClick={() => showToast("Eşleşmeler temizlendi.", "warning")}
                        className="secondary-btn text-[0.76rem] justify-center p-[6px_10px]"
                      >
                        Reddet
                      </button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* Header Album list control */}
            <GlassCard className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <h3 className="m-0 text-[1.1rem] font-extrabold text-[var(--text-main)]">AI Kişi Albümleri</h3>
                <p className="m-0 text-[0.8rem] text-[var(--text-muted)] mt-0.5">Yapay zeka tarafından yüz geometrisi eşleşmelerine göre gruplanan albümler.</p>
              </div>
              
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Kişi adı ara..." 
                  value={albumSearchQuery} 
                  onChange={(e) => setAlbumSearchQuery(e.target.value)}
                  className="p-[6px_12px] rounded-lg border border-[var(--glass-border)] bg-white/5 text-[0.8rem] text-[var(--text-main)] outline-none w-[180px]"
                />
                <button className="primary-btn flex items-center gap-1.5" onClick={() => navigate("/upload")}>
                  <Plus size={16} /> 
                  <span>Fotoğraf Yükle</span>
                </button>
              </div>
            </GlassCard>

            {filteredParticipants.length === 0 ? (
              <GlassCard className="p-10 text-center text-[var(--text-muted)] text-[0.85rem] font-medium">
                Aranan kritere uygun kişi albümü bulunamadı.
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredParticipants.map((p) => {
                  const matchedPhotos = getParticipantPhotos(p.id);
                  const coverPhoto = matchedPhotos.length > 0 ? matchedPhotos[0].thumbnail_url : p.selfie_url;
                  const middlePhoto = matchedPhotos.length > 1 ? matchedPhotos[1].thumbnail_url : p.selfie_url;
                  const backPhoto = matchedPhotos.length > 2 ? matchedPhotos[2].thumbnail_url : p.selfie_url;
                  const pendingReviews = matches.filter(m => m.participant_id === p.id && m.status === "pending_review").length;
                  const confidence = 94 + (p.id.toString().charCodeAt(0) % 6);

                  return (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedAlbum(p)}
                      className="glass-panel p-4 flex flex-col gap-4 cursor-pointer hover:-translate-y-1.5 transition-all duration-300 border border-white/10 group relative"
                    >
                      {/* Apple Photos Stack */}
                      <div className="relative aspect-[4/3] w-full shrink-0 select-none">
                        {/* Back Photo */}
                        <div 
                          className="absolute inset-[0_12px_12px_12px] rounded-2xl bg-cover bg-center opacity-40 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-95 border border-white/10"
                          style={{ backgroundImage: `url(${backPhoto})` }}
                        />
                        {/* Middle Photo */}
                        <div 
                          className="absolute inset-[0_6px_6px_6px] rounded-2xl bg-cover bg-center opacity-75 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-98 border border-white/15"
                          style={{ backgroundImage: `url(${middlePhoto})` }}
                        />
                        {/* Front Cover Photo */}
                        <div 
                          className="absolute inset-0 rounded-2xl bg-cover bg-center shadow-lg transition-transform duration-300 group-hover:scale-[1.01] border border-white/20"
                          style={{ backgroundImage: `url(${coverPhoto})` }}
                        />
                        {/* Pending indicator */}
                        {pendingReviews > 0 && (
                          <span className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse z-10">
                            {pendingReviews} Review
                          </span>
                        )}
                      </div>

                      {/* Album Text Info */}
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <strong className="text-[0.95rem] text-[var(--text-main)] group-hover:text-[var(--color-blue-dark)] transition-colors truncate">
                            {p.display_name}
                          </strong>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                            %{confidence} Match
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-1">
                          <span>{matchedPhotos.length} Fotoğraf</span>
                          <span>Güncelleme: {event.date}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* 3. PARTICIPANTS TAB */}
      {activeTab === "participants" && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <GlassCard className="glass-panel p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col">
              <h3 className="m-0 text-[1.1rem] font-extrabold text-[var(--text-main)]">Kayıtlı Katılımcı Listesi</h3>
              <p className="m-0 text-[0.8rem] text-[var(--text-muted)] mt-0.5">Misafirlerin yüz profili onay durumları ve PII veri kontrolü.</p>
            </div>
            
            {/* PII Masking Toggle Button */}
            <button 
              onClick={() => {
                setMaskPII(!maskPII);
                showToast(maskPII ? "Kişisel veriler görünür yapıldı." : "Kişisel veriler maskelendi.", "info");
              }}
              className="secondary-btn"
            >
              {maskPII ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{maskPII ? "Kişisel Verileri Göster" : "Verileri Maskele (KVKK)"}</span>
            </button>
          </GlassCard>

          {participants.length === 0 ? (
            <GlassCard className="p-10 text-center text-[var(--text-muted)]">
              <Users size={32} className="mx-auto mb-2 opacity-50" />
              <span>Henüz hiç katılımcı kaydı yok.</span>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3">
              {participants.map((p) => {
                const matchedCount = matches.filter(m => m.participant_id === p.id && (m.status === "approved" || m.status === "auto_approved")).length;
                return (
                  <GlassCard key={p.id} className="flex items-center justify-between p-4 flex-wrap gap-4 hover:translate-y-[-1px] transition-all border border-[var(--glass-border)]/50">
                    <div className="flex items-center gap-3">
                      <img src={p.selfie_url} alt="selfie" className="w-11 h-11 rounded-full object-cover border border-white/40 shadow-sm" />
                      <div className="flex flex-col">
                        <strong className="text-[0.92rem] text-[var(--text-main)]">{p.display_name}</strong>
                        <span className="text-[0.78rem] text-[var(--text-muted)] font-medium mt-0.5">
                          {maskPII ? maskEmail(p.email) : p.email} | {maskPII ? maskPhone(p.phone) : p.phone}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col items-end">
                        <span className="text-[0.82rem] font-extrabold text-[var(--color-blue-dark)]">{matchedCount} Eşleşme</span>
                        <small className="text-[var(--text-muted)] text-[0.72rem] mt-0.5 font-medium">KVKK Onaylandı: {new Date(event.date).toLocaleDateString("tr-TR")}</small>
                      </div>

                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 p-[3px_8px] rounded-[8px] text-[0.75rem] font-bold flex items-center gap-1 select-none">
                        <Check size={12} /> Onaylı
                      </span>

                      {/* Revoke Consent button */}
                      <button 
                        onClick={() => handleRevokeParticipant(p.id, p.display_name)}
                        className="p-[6px_10px] rounded-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-[0.75rem] font-bold cursor-pointer transition-colors"
                        title="Verileri ve Onayı Sil"
                      >
                        Kaldır
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MATCHING TAB */}
      {activeTab === "matching" && (
        <div className="flex flex-col gap-[var(--space-lg)] animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-[var(--space-lg)]">
            {/* AI Control Parameters */}
            <div className="flex flex-col gap-4">
              <h4 className="font-extrabold m-0 text-[1rem]">Eşleştirme Motoru Ayarları</h4>
              <GlassCard className="glass-panel p-5 flex flex-col gap-5">
                
                {/* Confidence threshold slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[0.85rem] font-bold">
                    <span className="text-[var(--text-muted)]">Minimum Güven Eşiği (Threshold)</span>
                    <span className="text-[var(--color-blue-dark)]">%{(confidenceThreshold * 100).toFixed(0)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.50" 
                    max="0.95" 
                    step="0.05" 
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    disabled={matchingActive}
                    className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">
                    <span>%50 (Daha fazla eşleşme, hata payı yüksek)</span>
                    <span>%95 (Kesin eşleşme)</span>
                  </div>
                </div>

                {/* Start / Stop Toggle Button */}
                <div className="flex flex-col gap-2.5 pt-2 border-t border-[var(--glass-border)]/40">
                  <label className="text-[0.8rem] font-bold text-[var(--text-muted)]">Motor Çalışma Durumu</label>
                  <button 
                    onClick={handleToggleAiMatching}
                    className={`p-3.5 rounded-[16px] font-black text-[0.9rem] flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                      matchingActive
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {matchingActive ? (
                      <>
                        <Square size={16} />
                        <span>Eşleştirmeyi Durdur</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        <span>Yüz Eşleştirmeyi Başlat</span>
                      </>
                    )}
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* AI Log Output console queue */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold m-0 text-[1rem]">Canlı AI Log Çıktıları</h4>
              <GlassCard className="glass-panel p-4 bg-black/80 font-mono text-[0.8rem] text-emerald-400 rounded-[20px] shadow-inner h-[280px] overflow-y-auto flex flex-col gap-1.5 border border-emerald-500/20">
                {aiLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    <span className="text-gray-500">{log.slice(0, 10)}</span>
                    <span className="ml-1">{log.slice(10)}</span>
                  </div>
                ))}
                {matchingActive && (
                  <div className="flex items-center gap-2 mt-1 text-white">
                    <Loader2 size={12} className="animate-spin text-emerald-400" />
                    <span className="text-[0.72rem] text-emerald-400/80 italic">Yeni görüntüler analiz ediliyor...</span>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* 5. REVIEW TAB */}
      {activeTab === "review" && (
        <div className="flex flex-col gap-4 animate-fade-in">
          <GlassCard className="glass-panel p-4">
            <h3 className="m-0 text-[1.1rem] font-extrabold text-[var(--text-main)]">Onay Bekleyen Eşleşmeler</h3>
            <p className="m-0 text-[0.8rem] text-[var(--text-muted)] mt-0.5">Güven skoru belirlenen eşiğin altında kalan yüzlerin manuel insan doğrulaması (Human-in-the-loop).</p>
          </GlassCard>

          {pendingReviewsCount === 0 ? (
            <GlassCard className="p-10 text-center text-[var(--text-muted)]">
              <CheckSquare size={32} className="mx-auto mb-2 opacity-50 text-[var(--accent-green)]" />
              <strong className="block text-[0.92rem]">İşlem Bekleyen Kayıt Yok</strong>
              <p className="text-[0.8rem] max-w-[280px] mx-auto mt-1">İncelenmesi gereken tüm düşük güvenli yüzler başarıyla onaylandı veya elendi.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReviewsList.map((m) => {
                const participant = participants.find(p => p.id === m.participant_id) || {};
                const photo = photos.find(ph => ph.id === m.photo_id) || {};
                
                return (
                  <GlassCard key={m.id} className="p-4 border border-[var(--glass-border)]/60 flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-[var(--glass-border)]/40 pb-3">
                      <span className="text-[0.75rem] font-bold bg-white/20 dark:bg-black/20 p-[2px_8px] rounded-[6px] text-[var(--text-muted)]">Eşleşme ID: {m.id}</span>
                      <span className="text-[0.8rem] font-bold text-amber-500 bg-amber-500/10 p-[2px_8px] rounded-[6px]">
                        Güven Skoru: %{(m.confidence * 100).toFixed(0)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 items-center justify-center text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[0.74rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">Selfie / Referans</span>
                        <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-white/30 shadow-md">
                          <img src={participant.selfie_url} alt="selfie" className="w-full h-full object-cover" />
                        </div>
                        <strong className="text-[0.85rem] mt-1 line-clamp-1">{participant.display_name}</strong>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[0.74rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">Eşleşen Yüz</span>
                        <div className="w-[100px] h-[100px] rounded-[16px] overflow-hidden border-2 border-white/30 shadow-md relative">
                          <img src={photo.thumbnail_url} alt="detected face" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[0.72rem] text-[var(--text-muted)] mt-1 line-clamp-1">{photo.filename}</span>
                      </div>
                    </div>

                    {/* Action approvals */}
                    <div className="flex gap-3 mt-2 border-t border-[var(--glass-border)]/40 pt-3">
                      <button 
                        onClick={() => handleReviewDecision(m.id, "reject")}
                        className="flex-1 bg-red-500/15 hover:bg-red-500/25 text-red-500 border border-red-500/30 rounded-[12px] p-2.5 font-bold text-[0.82rem] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <X size={14} /> Reddet
                      </button>
                      <button 
                        onClick={() => handleReviewDecision(m.id, "approve")}
                        className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-500 border border-emerald-500/30 rounded-[12px] p-2.5 font-bold text-[0.82rem] flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check size={14} /> Onayla
                      </button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. QR & ACCESS TAB */}
      {activeTab === "qr" && (
        <div className="flex flex-col gap-[var(--space-lg)] animate-fade-in">
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-[var(--space-lg)]">
            {/* Visual QR presentation card */}
            <GlassCard className="p-6 flex flex-col items-center text-center justify-between gap-5">
              <div className="bg-white p-5 rounded-[24px] border border-[var(--glass-border)] shadow-md">
                <QrCode size={160} className="text-black" />
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[0.8rem] text-[var(--text-muted)] font-semibold">Aktif Link</span>
                <strong className="text-[1.05rem] text-[var(--color-blue-dark)]">https://snapmatch.me/{event.qr_token}</strong>
              </div>

              {/* SVG / PNG downloads */}
              <div className="flex flex-col gap-2 w-full pt-3 border-t border-[var(--glass-border)]/40">
                <button 
                  onClick={() => showToast("SVG formatında QR kod indiriliyor...", "info")}
                  className="secondary-btn w-full"
                >
                  <Download size={14} /> SVG Olarak İndir
                </button>
                <button 
                  onClick={() => showToast("PNG formatında QR kod yüksek çözünürlükle indiriliyor...", "info")}
                  className="secondary-btn w-full"
                >
                  <Download size={14} /> PNG Olarak İndir
                </button>
              </div>
            </GlassCard>

            {/* Access control settings token */}
            <div className="flex flex-col gap-3">
              <h4 className="font-extrabold m-0 text-[1rem]">Erişim ve Token Ayarları</h4>
              <GlassCard className="glass-panel p-5 flex flex-col gap-5 h-full justify-between">
                <div className="flex flex-col gap-4">
                  {/* Access Level Selector */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[0.85rem] font-bold text-[var(--text-muted)]">Erişim Tipi</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label 
                        onClick={() => setAccessType("public")}
                        className={`p-3.5 rounded-[16px] border cursor-pointer flex flex-col gap-1 transition-all ${
                          accessType === "public"
                            ? "border-emerald-500/50 bg-emerald-500/10"
                            : "border-[var(--glass-border)] bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        <strong className="text-[0.85rem]">Açık QR (Public)</strong>
                        <span className="text-[0.7rem] text-[var(--text-muted)]">Tüm misafirler serbestçe yüz arayabilir.</span>
                      </label>
                      <label 
                        onClick={() => setAccessType("closed")}
                        className={`p-3.5 rounded-[16px] border cursor-pointer flex flex-col gap-1 transition-all ${
                          accessType === "closed"
                            ? "border-indigo-500/50 bg-indigo-500/10"
                            : "border-[var(--glass-border)] bg-white/10 hover:bg-white/20"
                        }`}
                      >
                        <strong className="text-[0.85rem]">Şifreli (Closed)</strong>
                        <span className="text-[0.7rem] text-[var(--text-muted)]">Girişte davet kodu veya parola istenir.</span>
                      </label>
                    </div>
                  </div>

                  {/* Token edit */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[0.85rem] font-bold text-[var(--text-muted)]">QR Slug / Token</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={qrToken}
                        onChange={(e) => setQrToken(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                        className="flex-grow p-3 rounded-[12px] border border-[var(--glass-border)] bg-white/15 outline-none font-semibold text-[0.88rem]"
                      />
                    </div>
                    <small className="text-[var(--text-muted)] text-[0.72rem]">Sadece harf, rakam ve tire içerebilir. Örn: zeynep-can-dugun</small>
                  </div>

                  <div className="flex flex-col gap-1.5">
                      <label className="text-[0.85rem] font-bold text-[var(--text-muted)]">Etkinlik Şifresi</label>
                      <div className="flex gap-2">
                        <input
                          type={showAccessPassword ? "text" : "password"}
                          value={accessPassword}
                          onChange={(e) => setAccessPassword(e.target.value)}
                          placeholder="Etkinlik erişim şifresi"
                          className="flex-grow p-3 rounded-[12px] border border-[var(--glass-border)] bg-white/15 outline-none font-semibold text-[0.88rem]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowAccessPassword((current) => !current)}
                          className="icon-btn w-11 h-11 shrink-0"
                          title={showAccessPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                        >
                          {showAccessPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {!accessPassword && event.hasAccessPassword && (
                        <small className="text-amber-500 text-[0.72rem]">
                          Eski şifre hash olarak saklandığı için görüntülenemez. Yeni şifre girip kaydederseniz bundan sonra panelde gösterilebilir.
                        </small>
                      )}
                    <small className="text-[var(--text-muted)] text-[0.72rem]">
                      Public olarak kaydederseniz mevcut etkinlik şifresi temizlenir. Şifreli seçerseniz bu alan guest erişiminde kullanılır.
                    </small>
                  </div>
                </div>

                <button 
                  onClick={handleSaveAccessSettings}
                  disabled={savingAccessSettings}
                  className="primary-btn w-full justify-center p-3 mt-4 disabled:opacity-60"
                >
                  Erişim Ayarlarını Güncelle
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      )}

      {/* 7. ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="flex flex-col gap-[var(--space-lg)] animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)]">
            <GlassCard className="p-4 text-center">
              <strong className="text-[1.8rem] block text-[var(--color-blue-dark)]">1,240</strong>
              <small className="text-[var(--text-muted)] text-[0.78rem] font-bold uppercase tracking-wider block mt-1">Galeri Görüntülenme</small>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <strong className="text-[1.8rem] block text-[var(--accent-green)]">312</strong>
              <small className="text-[var(--text-muted)] text-[0.78rem] font-bold uppercase tracking-wider block mt-1">Toplam Eşleşen Yüz</small>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <strong className="text-[1.8rem] block text-purple-500">89</strong>
              <small className="text-[var(--text-muted)] text-[0.78rem] font-bold uppercase tracking-wider block mt-1">İndirilen Fotoğraf</small>
            </GlassCard>
          </div>

          <GlassCard title="Saatlik Misafir Yoğunluğu (İndirme & Arama)" className="glass-panel">
            <div className="flex flex-col gap-4 py-2">
              <p className="text-[var(--text-muted)] text-[0.8rem] m-0">Etkinlik günü saat bazında misafirlerin arama ve indirme yoğunluğu.</p>
              
              <div className="flex flex-col gap-3 mt-2 pr-4">
                {[
                  { time: "18:00 - 19:00 (Karşılama)", percent: 15, color: "bg-indigo-500" },
                  { time: "19:00 - 20:00 (Nikah)", percent: 45, color: "bg-indigo-500" },
                  { time: "20:00 - 21:00 (Yemek)", percent: 90, color: "bg-gradient-to-r from-purple-500 to-indigo-500" },
                  { time: "21:00 - 22:00 (Eğlence)", percent: 70, color: "bg-indigo-500" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[0.76rem] font-bold">
                      <span>{item.time}</span>
                      <span>%{item.percent} Trafik</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 8. SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="flex flex-col gap-[var(--space-lg)] animate-fade-in">
          
          {/* General Metadata form */}
          <GlassCard title="Genel Etkinlik Bilgileri" className="glass-panel">
            <div className="flex flex-col gap-4 max-w-[600px] py-2">
              <div className="flex flex-col gap-1">
                <label className="text-[0.8rem] font-bold text-[var(--text-muted)]">Etkinlik Başlığı</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-3 rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] outline-none font-semibold text-[0.88rem]" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[0.8rem] font-bold text-[var(--text-muted)]">Tarih</label>
                  <input 
                    type="date" 
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="p-3 rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] outline-none font-semibold text-[0.88rem]" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[0.8rem] font-bold text-[var(--text-muted)]">Mekan / Konum</label>
                  <input 
                    type="text" 
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="p-3 rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] outline-none font-semibold text-[0.88rem]" 
                  />
                </div>
              </div>

              <button 
                onClick={handleUpdateSettings}
                className="primary-btn w-fit p-[10px_24px] mt-2"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </GlassCard>

          {/* Danger Zone panel */}
          <GlassCard className="glass-panel p-5 border-[2px] border-red-500/25">
                     <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-[var(--glass-border)]/40">
              {event.status !== "archived" && (
                <button 
                  onClick={handleArchiveEvent}
                  className="p-[10px_18px] text-[0.8rem] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-[12px] cursor-pointer transition-colors"
                >
                  Etkinliği Arşivle
                </button>
              )}
              <button 
                onClick={() => {
                  setConfirmTitle("");
                  setShowDeleteModal(true);
                }}
                className="p-[10px_18px] text-[0.8rem] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-[12px] cursor-pointer transition-colors flex items-center gap-1"
              >
                <Trash2 size={14} /> Etkinliği Kalıcı Olarak Sil
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab 8: Delete Double Confirmation Modal */}
      <GlassModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Etkinliği Kalıcı Olarak Sil?"
        subtitle="Bu işlem geri alınamaz. Lütfen dikkatli olun."
        icon={AlertCircle}
        width="max-w-[460px]"
        footer={
          <div className="flex justify-end gap-2.5">
            <button 
              onClick={() => setShowDeleteModal(false)}
              className="glass-btn p-[8px_16px] text-[0.82rem] font-bold"
            >
              Vazgeç
            </button>
            <button 
              onClick={handleDeleteEventSubmit}
              disabled={confirmTitle !== event.title}
              className="primary-btn bg-red-600 hover:bg-red-700 border-red-600 text-white p-[8px_18px] text-[0.82rem] font-semibold rounded-[12px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Kalıcı Olarak Sil
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <p className="m-0 text-[0.82rem] text-slate-300 leading-[1.4]">
            Bu etkinlik klasörünü, yüklenmiş olan <strong>{totalPhotos} fotoğrafı</strong>, 
            kayıtlı <strong>{totalParticipants} katılımcı profilini</strong> ve AI eşleşmelerini kalıcı olarak silmek üzeresiniz.
          </p>
          
          <div className="flex flex-col gap-1.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-[14px]">
            <label className="text-[0.76rem] font-extrabold text-red-400">Onaylamak için lütfen etkinlik adını yazın:</label>
            <strong className="text-[0.85rem] text-white select-all mb-1.5">{event.title}</strong>
            <input 
              type="text" 
              value={confirmTitle}
              onChange={(e) => setConfirmTitle(e.target.value)}
              placeholder="Etkinlik adını buraya yazın..."
              className="w-full bg-slate-950/40 border border-red-500/30 rounded-[12px] p-2.5 text-[0.82rem] outline-none text-white focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </GlassModal>

      {/* FLOATING BULK ACTIONS BAR */}
      {selectedPhotoIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[50] flex items-center justify-between gap-5 bg-[var(--glass-bg-strong)] backdrop-blur-xl border border-[var(--glass-border)] p-[12px_24px] rounded-[24px] shadow-[var(--glass-shadow-soft)] w-[90%] max-w-[650px] animate-fade-in text-[var(--text-main)]">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-blue-500 animate-pulse" />
            <span className="text-[0.85rem] font-bold tracking-wide">
              {selectedPhotoIds.length} Görsel Seçildi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleBulkReprocess}
              className="p-[6px_14px] text-[0.75rem] font-semibold tracking-wide rounded-[10px] bg-blue-600 hover:bg-blue-700 text-white border-none transition-all cursor-pointer shadow-[0_4px_12px_rgba(59,130,246,0.3)]"
            >
              Yeniden İşle
            </button>
            <button 
              onClick={handleBulkRemoveFromEvent}
              className="p-[6px_14px] text-[0.75rem] font-semibold tracking-wide rounded-[10px] bg-amber-500 hover:bg-amber-600 text-white border-none transition-all cursor-pointer shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
            >
              Etkinlikten Çıkar
            </button>
            <button 
              onClick={() => setShowBulkDeleteModal(true)}
              className="p-[6px_14px] text-[0.75rem] font-semibold tracking-wide rounded-[10px] bg-red-600 hover:bg-red-700 text-white border-none transition-all cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
            >
              Kalıcı Sil
            </button>
            <span className="text-[var(--text-muted)] opacity-35 px-1">|</span>
            <button 
              onClick={() => setSelectedPhotoIds([])}
              className="p-[6px_12px] text-[0.72rem] font-semibold tracking-wide rounded-[10px] bg-white/10 dark:bg-black/20 text-[var(--text-main)] hover:bg-white/15 border border-[var(--glass-border)] transition-all cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {/* BULK DELETE CONFIRMATION MODAL */}
      <GlassModal
        open={showBulkDeleteModal}
        onClose={() => {
          setShowBulkDeleteModal(false);
          setConfirmBulkDeleteText("");
        }}
        title="Toplu Silme İşlemini Onayla"
        subtitle="Bu işlem geri alınamaz. Lütfen dikkatli olun."
        icon={AlertCircle}
        width="max-w-[460px]"
        footer={
          <div className="flex justify-end gap-2.5">
            <button 
              onClick={() => {
                setShowBulkDeleteModal(false);
                setConfirmBulkDeleteText("");
              }}
              className="glass-btn p-[8px_16px] text-[0.82rem] font-bold"
            >
              Vazgeç
            </button>
            <button 
              onClick={handleBulkDeleteSubmit}
              disabled={confirmBulkDeleteText !== "TOPLU SİL"}
              className="primary-btn bg-red-600 hover:bg-red-700 border-red-600 text-white p-[8px_18px] text-[0.82rem] font-semibold rounded-[12px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
            >
              Seçilenleri Sil
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <p className="m-0 text-[0.82rem] text-slate-300 leading-[1.4]">
            Seçilen <strong>{selectedPhotoIds.length}</strong> fotoğrafı sistemden ve bunlarla ilişkili tüm AI eşleşmelerinden kalıcı olarak silmek istediğinizden emin misiniz?
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.75rem] font-bold text-slate-300">Onaylamak için <strong>TOPLU SİL</strong> yazın:</label>
            <input 
              type="text" 
              value={confirmBulkDeleteText}
              onChange={(e) => setConfirmBulkDeleteText(e.target.value)}
              placeholder="TOPLU SİL"
              className="w-full bg-slate-950/40 border border-white/10 rounded-[12px] p-2.5 text-[0.85rem] outline-none text-white focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </GlassModal>

      {/* METADATA LIGHTBOX MODAL */}
      {activeLightboxPhoto && (() => {
        const photo = activeLightboxPhoto;
        let camera = "Canon EOS R5";
        let lens = "50mm f/1.2 L USM";
        let time = new Date(photo.uploaded_at).toLocaleString("tr-TR");
        
        if (photo.metadata_json) {
          try {
            const meta = JSON.parse(photo.metadata_json);
            camera = meta.camera || camera;
            lens = meta.lens || lens;
            time = meta.time ? new Date(meta.time).toLocaleString("tr-TR") : time;
          } catch (e) {}
        }

        const sizeMB = ((photo.original_size_bytes || 3500000) / (1024 * 1024)).toFixed(2);
        const step = photo.status === "matched" ? 4 : (photo.status === "needs_review" ? 3 : 2);

        return (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 sm:p-8 animate-fade-in">
            <button 
              onClick={() => setActiveLightboxPhoto(null)}
              className="absolute top-4 right-4 bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-full border border-white/10 transition-all cursor-pointer z-[110] shadow-lg"
            >
              <X size={20} className="text-white" />
            </button>

            <div className="relative grid grid-cols-1 md:grid-cols-[1.7fr_1fr] h-full max-h-[85vh] w-full max-w-[1050px] bg-slate-950/40 backdrop-blur-3xl border border-white/20 rounded-[24px] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_24px_60px_rgba(0,0,0,0.8)] text-white">
              {/* Glowing atmospheric lights in background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-0">
                <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[var(--color-blue-medium)]/25 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-violet-500/22 blur-3xl" />
              </div>
              
              {/* Image Preview Left */}
              <div className="relative z-10 flex items-center justify-center bg-black/15 dark:bg-black/45 p-4 overflow-hidden h-[40vh] md:h-auto">
                <img 
                  src={photo.original_url} 
                  alt={photo.filename} 
                  className="max-h-full max-w-full object-contain rounded-[12px] shadow-2xl" 
                />
              </div>

              {/* Sidebar Info Right */}
              <div className="relative z-10 border-t md:border-t-0 md:border-l border-white/20 p-6 flex flex-col gap-5 overflow-y-auto text-left bg-slate-950/30 backdrop-blur-md text-white">
                <div>
                  <h3 className="m-0 text-[1.15rem] font-bold tracking-tight w-full text-white flex items-center justify-between" title={photo.filename}>
                    <span className="truncate pr-2">{photo.filename}</span>
                    <ChevronDown size={18} className="text-slate-400 shrink-0 opacity-70" />
                  </h3>
                  <span className="text-[0.7rem] text-slate-300 block mt-1 font-semibold">Fotoğraf Detayları & EXIF Metadata</span>
                </div>

                {/* Metadata Items */}
                <div className="flex flex-col gap-3 text-[0.8rem] bg-white/[0.04] border border-white/15 p-4 rounded-[16px]">
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Dosya Boyutu:</span>
                    <span className="font-bold text-white">{sizeMB} MB</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Çözünürlük:</span>
                    <span className="font-bold text-white">4200 x 2800 (Optimize)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Yüklenme Zamanı:</span>
                    <span className="font-bold text-white">{time}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Kamera Gövdesi:</span>
                    <span className="font-bold text-white truncate max-w-[160px]">{camera}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Lens Modeli:</span>
                    <span className="font-bold text-white truncate max-w-[160px]">{lens}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">Yükleyen Rolü:</span>
                    <span className="font-bold bg-white/10 p-[2px_8px] rounded-[6px] text-[0.7rem] text-white border border-white/20">
                      {photo.source === "photographer" ? "Fotoğrafçı" : "Katılımcı"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-300">AI Yüz Durumu:</span>
                    <span className="font-bold text-purple-400">2 Yüz Algılandı</span>
                  </div>
                </div>

                {/* Status Stepper Tracker */}
                <div className="flex flex-col gap-3">
                  <span className="text-[0.72rem] text-slate-300 font-bold uppercase tracking-wider block">İşlem Durum Stepper</span>
                  
                  <div className="flex flex-col gap-4 pl-1">
                    
                    {/* Step 1 */}
                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        <Check size={11} className="stroke-[3px]" />
                      </div>
                      <div className="flex flex-col text-[0.78rem]">
                        <span className="font-bold text-white">1. Fotoğraf Sunucuya Yüklendi</span>
                        <span className="text-slate-300 text-[0.68rem]">Bulut depolamaya yazma başarılı</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        <Check size={11} className="stroke-[3px]" />
                      </div>
                      <div className="flex flex-col text-[0.78rem]">
                        <span className="font-bold text-white">2. EXIF Okuma & Optimizasyon</span>
                        <span className="text-slate-300 text-[0.68rem]">Sharp ile sıkıştırma ve metadata ayrıştırma</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-3 items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${
                        step >= 3 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-blue-500 animate-pulse animate-duration-1000"
                      }`}>
                        {step >= 3 ? <Check size={11} className="stroke-[3px]" /> : <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div className="flex flex-col text-[0.78rem]">
                        <span className="font-bold text-white">3. Yapay Zeka Yüz Tanımlama</span>
                        <span className="text-slate-300 text-[0.68rem]">Geometri vektör analizi ve profilleme</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-3 items-start">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        step >= 4 ? "bg-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-slate-900 border border-white/20 text-slate-400"
                      }`}>
                        {step >= 4 ? <Check size={11} className="text-white stroke-[3px]" /> : <span className="text-[9px]">4</span>}
                      </div>
                      <div className="flex flex-col text-[0.78rem]">
                        <span className={`font-bold ${step >= 4 ? "text-white" : "text-slate-400 opacity-60"}`}>4. Katılımcılarla Eşleştirildi</span>
                        <span className="text-slate-300 text-[0.68rem]">Yüz profili eşleşmesiyle dağıtım hazır</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
