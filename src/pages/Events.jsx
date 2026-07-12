import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { mockApi } from "../services/mockApi";
import { eventsApi } from "../services/eventsApi";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { fetchEvents, createEvent } from "../features/events/eventsSlice";
import { 
  Calendar, 
  MapPin, 
  Camera, 
  Users, 
  Zap, 
  Search, 
  Filter, 
  Plus, 
  QrCode,
  Tag,
  Grid,
  List,
  Copy,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Lock,
  Unlock,
  AlertCircle,
  Copy as CopyIcon,
  Info,
  FileText,
  ChevronDown
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import BottomMobileSheet from "../components/ui/BottomMobileSheet";

export default function Events() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const events = useSelector((state) => state.events.items) || [];
  const loading = useSelector((state) => state.events.loading);
  const isLoadingEvents = loading === "loading";
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewType, setViewType] = useState("grid"); // "grid" or "table"
  
  // Wizard states
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    category: "wedding",
    access_type: "public",
    access_password: "",
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    consent_text: "Yüz verilerimin bu etkinlik fotoğraflarında eşleştirme amacıyla KVKK kapsamında işlenmesini onaylıyorum.",
    consent_approved: true,
    access_password: ""
  });

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ23456789";
    let pass = "";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const unsplashCovers = [
    { name: "Düğün 1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80" },
    { name: "Düğün 2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80" },
    { name: "Mezuniyet", url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80" },
    { name: "Kurumsal", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80" },
    { name: "Parti", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80" }
  ];

  const defaultWizardData = () => ({
    title: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    category: "wedding",
    access_type: "public",
    access_password: "",
    cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    consent_text: "Yuz verilerimin bu etkinlik fotograflarinda eslestirme amaciyla KVKK kapsaminda islenmesini onayliyorum."
  });


  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch, user]);

  const categories = [
    { value: "all", label: "Tüm Kategoriler" },
    { value: "wedding", label: "Düğün & Nişan" },
    { value: "graduation", label: "Mezuniyet" },
    { value: "corporate", label: "Kurumsal" },
    { value: "party", label: "Parti & Lansman" }
  ];

  const statusList = [
    { value: "all", label: "Tüm Durumlar" },
    { value: "live", label: "Yayında" },
    { value: "draft", label: "Taslak" },
    { value: "completed", label: "Tamamlandı" },
    { value: "processing", label: "AI Eşleşiyor" },
    { value: "archived", label: "Arşivlendi" }
  ];

  const globalSearch = useSelector((state) => state.ui.globalSearchQuery) || "";
  const activeSearchQuery = searchQuery || globalSearch;

  const filteredEvents = events.filter(e => {
    const searchLower = activeSearchQuery.toLocaleLowerCase("tr-TR");
    const matchesSearch = 
      (e.title || "").toLocaleLowerCase("tr-TR").includes(searchLower) || 
      (e.location || "").toLocaleLowerCase("tr-TR").includes(searchLower);
    const matchesCategory = selectedCategory === "all" || e.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || e.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "live":
        return (
          <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
            Yayında
          </span>
        );
      case "processing":
        return (
          <span className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block animate-spin" />
            Eşleşiyor
          </span>
        );
      case "completed":
        return (
          <span className="bg-blue-500/15 text-blue-600 dark:text-blue-400 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Tamamlandı
          </span>
        );
      case "archived":
        return (
          <span className="bg-gray-500/15 text-gray-600 dark:text-gray-400 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block" />
            Arşivlendi
          </span>
        );
      default:
        return (
          <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 p-[4px_10px] rounded-[20px] text-[0.75rem] font-bold inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Taslak
          </span>
        );
    }
  };

  const getCategoryName = (cat) => {
    const category = categories.find(c => c.value === cat);
    return category ? category.label : cat;
  };

  // Duplicate / Template action
  const handleDuplicate = async (event, e) => {
    e.stopPropagation();
    dispatch(createEvent({
      title: `${event.title} (Kopya)`,
      location: event.location,
      category: event.category,
      date: event.date,
      access_type: event.access_type || "public",
      cover_image: event.cover_image || event.cover_url,
      consent_text: event.consent_text
    })).unwrap().then(() => {
      showToast(`"${event.title}" şablon olarak başarıyla kopyalandı.`, "success");
    }).catch((err) => {
      showToast("Etkinlik kopyalanamadı: " + err, "error");
    });
  };

  // Submit and redirect to details page
  const handleCreateEventSubmit = async () => {
    try {
      setIsCreatingEvent(true);
      const newEv = await dispatch(createEvent({
        title: wizardData.title || "Yeni Etkinlik",
        location: wizardData.location || "İstanbul, Türkiye",
        category: wizardData.category,
        date: wizardData.date,
        access_type: wizardData.access_type,
        access_password: wizardData.access_type === "closed" ? wizardData.access_password : "",
        cover_image: wizardData.cover_image,
        consent_text: wizardData.consent_text
      })).unwrap();
      
      showToast("Etkinlik başarıyla oluşturuldu. QR kodunuz hazır!", "success");
      setShowWizard(false);
      setWizardStep(1);
      setWizardData({
        title: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        category: "wedding",
        access_type: "public",
        cover_image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        consent_text: "Yüz verilerimin bu etkinlik fotoğraflarında eşleştirme amacıyla KVKK kapsamında işlenmesini onaylıyorum.",
        consent_approved: true,
        access_password: ""
      });
      navigate(`/events/${newEv.id}`);
    } catch (err) {
      showToast("Etkinlik oluşturulamadı: " + err, "error");
    } finally {
      setIsCreatingEvent(false);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16 relative">
        {/* Search & Simple Filters */}
        <div className="flex flex-col gap-2.5">
          <div className="search-pill bg-white/20">
            <Search size={16} className="text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Etkinlik veya konum ara..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(c => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border-none whitespace-nowrap transition-all ${
                  selectedCategory === c.value 
                    ? "bg-[var(--color-blue-dark)] text-white" 
                    : "bg-white/10 text-[var(--text-muted)]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable iOS-Style Event Card Stack */}
        <div className="flex flex-col gap-4">
          {filteredEvents.map(event => {
            const eventPhotos = mockApi.getPhotos(event.id) || [];
            const eventParticipants = mockApi.getParticipants(event.id) || [];
            return (
              <div 
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="glass-panel overflow-hidden rounded-2xl active:scale-[0.98] transition-transform"
              >
                <div className="h-28 relative">
                  <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(event.status)}
                  </div>
                </div>
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)] m-0 leading-tight">{event.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] mt-1.5 font-medium">
                      <MapPin size={10} />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-bold">
                    <span className="flex items-center gap-1">
                      <Camera size={11} /> {eventPhotos.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={11} /> {eventParticipants.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="text-center py-10 text-xs text-[var(--text-muted)]">
              Arama kriterlerine uygun etkinlik bulunamadı.
            </div>
          )}
        </div>

        {/* Floating Action Button (FAB) for iOS Create Event */}
        <button
          onClick={() => {
            setWizardStep(1);
            setShowWizard(true);
          }}
          className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[var(--accent-gradient)] text-white border-none flex items-center justify-center shadow-lg active:scale-95 transition-transform z-40 cursor-pointer"
        >
          <Plus size={24} />
        </button>

        {/* Create Event Wizard inside Bottom Sheet */}
        <BottomMobileSheet 
          isOpen={showWizard} 
          onClose={() => setShowWizard(false)}
          title={`Yeni Etkinlik (Adım ${wizardStep}/5)`}
        >
          <div className="flex flex-col gap-4 py-2">
            {/* Step 1 */}
            {wizardStep === 1 && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Etkinlik Başlığı</label>
                  <input 
                    type="text" 
                    placeholder="Düğün, Mezuniyet, Lansman..."
                    value={wizardData.title}
                    onChange={(e) => setWizardData({...wizardData, title: e.target.value})}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Tarih</label>
                  <input 
                    type="date"
                    value={wizardData.date}
                    onChange={(e) => setWizardData({...wizardData, date: e.target.value})}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-[var(--text-muted)]">Konum / Mekan</label>
                  <input 
                    type="text" 
                    placeholder="Çırağan Sarayı, İstanbul"
                    value={wizardData.location}
                    onChange={(e) => setWizardData({...wizardData, location: e.target.value})}
                    className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {wizardStep === 2 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-[var(--text-muted)] mb-1">Kategori Seçimi</label>
                {categories.filter(c => c.value !== "all").map(c => (
                  <button
                    key={c.value}
                    onClick={() => setWizardData({...wizardData, category: c.value})}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                      wizardData.category === c.value 
                        ? "bg-[var(--color-blue-dark)] border-[var(--color-blue-dark)] text-white" 
                        : "bg-white/10 border-[var(--glass-border)] text-[var(--text-main)]"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Step 3 */}
            {wizardStep === 3 && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[var(--text-muted)]">Kapak Görseli</label>
                <div className="grid grid-cols-2 gap-2">
                  {unsplashCovers.map((cover, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setWizardData({...wizardData, cover_image: cover.url})}
                      className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${
                        wizardData.cover_image === cover.url ? "border-[var(--color-blue-dark)]" : "border-transparent"
                      }`}
                    >
                      <img src={cover.url} alt={cover.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-end p-1">
                        <span className="text-[9px] text-white font-bold">{cover.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 */}
            {wizardStep === 4 && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-[var(--text-muted)]">KVKK Onay Metni</label>
                <textarea 
                  rows={4}
                  value={wizardData.consent_text}
                  onChange={(e) => setWizardData({...wizardData, consent_text: e.target.value})}
                  className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-xs text-[var(--text-main)] outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Step 5 */}
            {wizardStep === 5 && (
              <div className="flex flex-col gap-3 items-center text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
                  <Check size={24} />
                </div>
                <h4 className="text-sm font-bold text-[var(--text-main)] m-0">Etkinlik Hazır!</h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Lütfen bilgileri kontrol edip kaydedin.
                </p>
                <div className="w-full bg-white/5 border border-[var(--glass-border)] rounded-xl p-3 text-left flex flex-col gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Başlık:</span>
                    <strong className="text-[var(--text-main)]">{wizardData.title}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Tarih:</span>
                    <strong className="text-[var(--text-main)]">{wizardData.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Konum:</span>
                    <strong className="text-[var(--text-main)]">{wizardData.location}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons inside Bottom Sheet */}
            <div className="flex justify-between items-center gap-2 mt-4 pt-3 border-t border-[var(--glass-border)]/30">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(wizardStep - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 text-[var(--text-main)] border-none cursor-pointer flex-1"
                >
                  Geri
                </button>
              ) : (
                <div className="flex-1" />
              )}
              {wizardStep < 5 ? (
                <button
                  onClick={() => {
                    if (wizardStep === 1 && !wizardData.title.trim()) {
                      showToast("Etkinlik Başlığı boş bırakılamaz.", "warning");
                      return;
                    }
                    setWizardStep(wizardStep + 1);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-blue-dark)] text-white border-none cursor-pointer flex-1"
                >
                  İleri
                </button>
              ) : (
                <button
                  onClick={handleCreateEventSubmit}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white border-none cursor-pointer flex-1"
                >
                  Kaydet
                </button>
              )}
            </div>
          </div>
        </BottomMobileSheet>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)] relative">
      
      {/* Header Area */}
      <div className="flex justify-end items-center mb-1">
        <button 
          className="primary-btn flex items-center gap-2" 
          onClick={() => setShowWizard(true)}
        >
          <Plus size={18} />
          <span>Yeni Etkinlik Oluştur</span>
        </button>
      </div>

      {/* Filter, Search, and View Type Toggle Bar */}
      <GlassCard className="glass-panel p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-grow">
            {/* Search */}
            <div className="search-pill w-full max-w-[320px] bg-white/20">
              <Search size={18} className="text-[var(--text-muted)]" />
              <input 
                type="text" 
                placeholder="Etkinlik adı veya konum ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 bg-white/25 border border-[var(--glass-border)] p-[8px_12px] rounded-[14px]">
              <Tag size={16} className="text-[var(--text-muted)]" />
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-[0.88rem] font-semibold bg-transparent border-none outline-none cursor-pointer text-[var(--text-main)]"
              >
                {categories.map(c => <option key={c.value} value={c.value} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{c.label}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-white/25 border border-[var(--glass-border)] p-[8px_12px] rounded-[14px]">
              <Filter size={16} className="text-[var(--text-muted)]" />
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-[0.88rem] font-semibold bg-transparent border-none outline-none cursor-pointer text-[var(--text-main)]"
              >
                {statusList.map(s => <option key={s.value} value={s.value} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Grid vs Table Toggle */}
          <div className="flex items-center bg-white/20 border border-[var(--glass-border)] rounded-[14px] p-1">
            <button 
              onClick={() => setViewType("grid")}
              className={`p-[8px_12px] rounded-[10px] border-none cursor-pointer flex items-center gap-1 text-[0.82rem] font-bold transition-all ${
                viewType === "grid" 
                  ? "bg-white/80 dark:bg-white/10 text-[var(--text-main)] shadow-sm" 
                  : "bg-transparent text-[var(--text-muted)]"
              }`}
            >
              <Grid size={15} />
              <span>Kartlar</span>
            </button>
            <button 
              onClick={() => setViewType("table")}
              className={`p-[8px_12px] rounded-[10px] border-none cursor-pointer flex items-center gap-1 text-[0.82rem] font-bold transition-all ${
                viewType === "table" 
                  ? "bg-white/80 dark:bg-white/10 text-[var(--text-main)] shadow-sm" 
                  : "bg-transparent text-[var(--text-muted)]"
              }`}
            >
              <List size={15} />
              <span>Tablo</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {isLoadingEvents && (
        <GlassCard className="glass-panel p-4">
          <p className="m-0 text-[0.9rem] text-[var(--text-muted)]">Etkinlikler yukleniyor...</p>
        </GlassCard>
      )}

      {/* Grid View */}
      {viewType === "grid" && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[var(--space-lg)]">
          {filteredEvents.map((event) => {
            const eventPhotos = mockApi.getPhotos(event.id);
            const eventParticipants = mockApi.getParticipants(event.id);
            const eventMatches = mockApi.getMatches(event.id);
            
            const photoCount = event.metrics?.photoCount ?? eventPhotos.length;
            const participantCount = event.metrics?.participantCount ?? eventParticipants.length;
            const matchedPhotoIds = new Set(eventMatches.filter(m => m.status === 'approved' || m.status === 'auto_approved').map(m => m.photo_id));
            const matchRate = event.metrics?.matchRate ?? (eventPhotos.length > 0 ? Math.round((matchedPhotoIds.size / eventPhotos.length) * 100) : 0);

            const isLocked = event.status === "archived";

            return (
              <GlassCard 
                key={event.id} 
                className="glass-panel theme-card-hover p-0 overflow-hidden flex flex-col min-h-[380px]"
              >
                {/* Event Cover Photo */}
                <div className="h-[160px] w-full relative">
                  <img 
                    src={event.cover_image || event.cover_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=60"} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(event.status)}
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="bg-black/60 backdrop-blur-[4px] text-white p-[3px_8px] rounded-[10px] text-[0.7rem] font-bold">
                      {getCategoryName(event.category)}
                    </span>
                  </div>
                </div>

                {/* Event Meta Details */}
                <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                  <div>
                    <h3 
                      className="m-0 mb-2.5 text-[1.1rem] font-extrabold cursor-pointer line-clamp-2 hover:text-[var(--color-blue-dark)] transition-colors"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      {event.title}
                    </h3>
                    
                    <div className="flex flex-col gap-2 my-2.5">
                      <div className="flex items-center gap-1.5 text-[0.82rem] text-[var(--text-muted)]">
                        <Calendar size={14} />
                        <span>{new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[0.82rem] text-[var(--text-muted)]">
                        <MapPin size={14} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Event Metric Foot */}
                  <div className="border-t border-[var(--glass-border)]/60 pt-3">
                    <div className="grid grid-cols-3 gap-2 text-center mb-3">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[0.9rem] font-extrabold">
                          <Camera size={14} className="text-[var(--color-blue-dark)]" />
                          {photoCount}
                        </div>
                        <small className="text-[var(--text-muted)] text-[0.72rem]">Fotoğraf</small>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[0.9rem] font-extrabold">
                          <Users size={14} className="text-[var(--color-blue-dark)]" />
                          {participantCount}
                        </div>
                        <small className="text-[var(--text-muted)] text-[0.72rem]">Katılımcı</small>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-[0.9rem] font-extrabold text-[var(--accent-green)]">
                          <Zap size={14} />
                          %{matchRate}
                        </div>
                        <small className="text-[var(--text-muted)] text-[0.72rem]">Eşleşme</small>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        className="primary-btn flex-grow p-2 text-[0.82rem] justify-center"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        Detayları Yönet
                      </button>
                      <button 
                        className="icon-btn w-9 h-9 shrink-0" 
                        title="Şablon Olarak Kopyala"
                        onClick={(e) => handleDuplicate(event, e)}
                      >
                        <Copy size={15} className="text-[var(--text-muted)]" />
                      </button>
                      <button 
                        className="icon-btn w-9 h-9 shrink-0" 
                        title="QR Kod"
                        onClick={() => navigate(`/events/${event.id}?tab=qr`)}
                      >
                        <QrCode size={15} className="text-[var(--text-muted)]" />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}

          {/* Dotted Create Card Placeholder */}
          <div 
            onClick={() => setShowWizard(true)}
            className="border-2 border-dashed border-[var(--glass-border)] rounded-[var(--radius-xl)] bg-white/15 dark:bg-black/10 flex flex-col items-center justify-center cursor-pointer min-h-[380px] gap-4 transition-all duration-200 ease-in-out theme-card-hover"
          >
            <div className="w-[50px] h-[50px] rounded-full bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] grid place-items-center">
              <Plus size={24} className="text-[var(--color-blue-dark)]" />
            </div>
            <div className="text-center">
              <strong className="block text-[1rem] text-[var(--text-main)] font-bold">Yeni Etkinlik Kur</strong>
              <span className="text-[0.8rem] text-[var(--text-muted)]">5 adımlı sihirbaz ile hızlıca ekle</span>
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewType === "table" && (
        <GlassCard className="glass-panel p-0 overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-[var(--text-main)]">
              <thead>
                <tr className="border-b border-[var(--glass-border)] bg-white/10 dark:bg-black/10">
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider">Etkinlik</th>
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider">Tarih / Konum</th>
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider">Kategori</th>
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider">Metrikler</th>
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider">Durum</th>
                  <th className="p-4 font-bold text-[0.85rem] text-[var(--text-muted)] uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--glass-border)]/50">
                {filteredEvents.map((event) => {
                  const eventPhotos = mockApi.getPhotos(event.id);
                  const eventParticipants = mockApi.getParticipants(event.id);
                  const photoCount = event.metrics?.photoCount ?? eventPhotos.length;
                  const participantCount = event.metrics?.participantCount ?? eventParticipants.length;
                  return (
                    <tr 
                      key={event.id} 
                      className="hover:bg-white/15 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={event.cover_image || event.cover_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=100&auto=format&fit=crop&q=80"} 
                          alt={event.title} 
                          className="w-12 h-12 object-cover rounded-[10px] border border-white/20"
                        />
                        <div className="flex flex-col">
                          <strong className="text-[0.95rem] font-bold text-[var(--text-main)] line-clamp-1">{event.title}</strong>
                          <span className="text-[0.72rem] text-[var(--text-muted)] font-medium mt-0.5">ID: {event.id}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[0.85rem]">{new Date(event.date).toLocaleDateString("tr-TR")}</span>
                          <span className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">{event.location}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-white/30 dark:bg-black/20 border border-[var(--glass-border)] text-[0.78rem] font-bold p-[4px_10px] rounded-[10px]">
                          {getCategoryName(event.category)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-4 text-[0.8rem] font-bold">
                          <span className="flex items-center gap-1" title="Fotoğraflar"><Camera size={14} className="text-[var(--text-muted)]" /> {photoCount}</span>
                          <span className="flex items-center gap-1" title="Katılımcılar"><Users size={14} className="text-[var(--text-muted)]" /> {participantCount}</span>
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(event.status)}</td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex gap-2 justify-end">
                          <button 
                            className="primary-btn p-[6px_14px] text-[0.8rem]"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            Detaylar
                          </button>
                          <button 
                            className="icon-btn w-8 h-8"
                            title="Kopyala"
                            onClick={(e) => handleDuplicate(event, e)}
                          >
                            <Copy size={14} className="text-[var(--text-muted)]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* 5-Step Create Event Wizard Modal */}
      <GlassModal
        open={showWizard}
        onClose={() => setShowWizard(false)}
        title="Yeni Etkinlik Sihirbazı"
        subtitle="Etkinliğinizi 5 adımda kolayca oluşturun"
        icon={Calendar}
        width="max-w-[620px]"
        footer={
          <div className="flex justify-between items-center gap-3">
            {wizardStep > 1 ? (
              <button 
                onClick={() => setWizardStep(wizardStep - 1)}
                className="glass-btn flex items-center gap-1.5 p-[10px_20px] text-[0.85rem] font-bold rounded-[14px] border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Geri</span>
              </button>
            ) : (
              <button 
                onClick={() => setShowWizard(false)}
                className="glass-btn flex items-center gap-1.5 p-[10px_20px] text-[0.85rem] font-bold rounded-[14px] border border-white/10 hover:bg-white/10 text-white cursor-pointer"
              >
                <X size={16} />
                <span>İptal</span>
              </button>
            )}

            {wizardStep < 5 ? (
              <button 
                onClick={() => {
                  if (wizardStep === 1 && !wizardData.title.trim()) {
                    showToast("Etkinlik Adı boş bırakılamaz.", "warning");
                    return;
                  }
                  if (wizardStep === 2 && wizardData.access_type === "closed" && !wizardData.access_password?.trim()) {
                    showToast("Lütfen korumalı etkinlik için geçerli bir şifre girin veya üretin.", "warning");
                    return;
                  }
                  if (wizardStep === 4 && wizardData.consent_approved === false) {
                    showToast("Etkinlik oluşturmak için KVKK onay kutusunu işaretlemeniz gerekmektedir.", "warning");
                    return;
                  }
                  setWizardStep(wizardStep + 1);
                }}
                className="primary-btn flex items-center gap-1.5 p-[10px_24px] text-[0.85rem] font-bold rounded-[14px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none cursor-pointer shadow-md"
              >
                <span>İleri</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleCreateEventSubmit}
                className="primary-btn flex items-center gap-1.5 p-[10px_24px] text-[0.85rem] font-bold rounded-[14px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none cursor-pointer shadow-md"
              >
                <span>Kaydet ve QR Oluştur</span>
                <QrCode size={16} />
              </button>
            )}
          </div>
        }
      >
        {/* Step Indicators */}
        <div className="mb-6 bg-white/[0.03] glass-border-distinct p-5 rounded-[18px] select-none relative z-10">
          <div className="flex justify-between items-center relative px-4">
            {/* Connecting line */}
            <div className="absolute top-[14px] left-10 right-10 h-[2px] bg-white/10 z-0">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(wizardStep - 1) * 25}%` }}
              />
            </div>
            
            {[1, 2, 3, 4, 5].map((s) => {
              const labels = ["Temel Bilgiler", "Fotoğraflar", "Ayarlar", "Erişim", "Özet"];
              const isActive = wizardStep === s;
              const isCompleted = wizardStep > s;
              return (
                <div key={s} className="flex flex-col items-center gap-2.5 z-10 flex-1 relative">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.8rem] font-bold transition-all relative border ${
                      isActive 
                        ? "border-[var(--color-blue-medium)] bg-blue-500/10 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)] scale-110" 
                        : (isCompleted 
                          ? "border-[var(--color-blue-medium)]/80 bg-blue-500/5 text-white/90" 
                          : "border-[var(--glass-border)] bg-slate-950/20 text-slate-400")
                    }`}
                  >
                    {s}
                  </div>
                  <span 
                    className={`text-[0.72rem] font-bold transition-colors ${
                      isActive ? "text-[var(--color-blue-medium)]" : "text-slate-400"
                    }`}
                  >
                    {labels[s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content Area */}
        <div className="flex flex-col gap-4 relative z-10">
          
          {/* Step 1: Temel Bilgiler */}
          {wizardStep === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] glass-border-distinct p-5 rounded-[18px]">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-[var(--color-blue-medium)]">
                  <FileText size={16} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[0.9rem] font-bold text-white flex items-center gap-1.5">
                    <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 1:</span>
                    <span className="text-white font-bold">Temel Bilgiler</span>
                  </div>
                  <span className="text-[0.72rem] text-slate-400">Etkinliğinizin temel bilgilerini girin.</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.8rem] font-bold text-slate-200 flex items-center gap-1">
                  <span>Etkinlik Adı</span>
                  <Info size={13} className="text-slate-400 cursor-pointer hover:text-white" title="Etkinliğinize benzersiz bir isim verin." />
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Örn: Zeynep & Can Düğünü" 
                    value={wizardData.title}
                    onChange={(e) => setWizardData({...wizardData, title: e.target.value})}
                    className="w-full glass-input-distinct rounded-[14px] p-[12px_16px_12px_42px] text-[0.88rem] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold text-slate-200">Tarih</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <input 
                      type="date" 
                      value={wizardData.date}
                      onChange={(e) => setWizardData({...wizardData, date: e.target.value})}
                      className="w-full glass-input-distinct rounded-[14px] p-[12px_42px_12px_42px] text-[0.88rem] outline-none"
                    />
                    <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.8rem] font-bold text-slate-200">Kategori</label>
                  <div className="relative">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                    <select 
                      value={wizardData.category}
                      onChange={(e) => setWizardData({...wizardData, category: e.target.value})}
                      className="w-full glass-input-distinct rounded-[14px] p-[12px_42px_12px_42px] text-[0.88rem] outline-none appearance-none cursor-pointer"
                    >
                      <option value="wedding" className="bg-[#151c2c] text-white">Düğün & Nişan</option>
                      <option value="graduation" className="bg-[#151c2c] text-white">Mezuniyet</option>
                      <option value="corporate" className="bg-[#151c2c] text-white">Kurumsal</option>
                      <option value="party" className="bg-[#151c2c] text-white">Parti & Lansman</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[0.8rem] font-bold text-slate-200">Lokasyon / Mekan</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Örn: Sait Halim Paşa Yalısı, İstanbul" 
                    value={wizardData.location}
                    onChange={(e) => setWizardData({...wizardData, location: e.target.value})}
                    className="w-full glass-input-distinct rounded-[14px] p-[12px_16px_12px_42px] text-[0.88rem] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Erişim Tipi */}
          {wizardStep === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] glass-border-distinct p-5 rounded-[18px]">
              <h4 className="m-0 text-[0.95rem] font-bold text-white flex items-center gap-1.5 mb-2">
                <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 2:</span> Erişim ve Yükleme Ayarları
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <label 
                  onClick={() => setWizardData({...wizardData, access_type: "public"})}
                  className={`flex flex-col p-4 rounded-[16px] border cursor-pointer transition-all ${
                    wizardData.access_type === "public"
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "border-[var(--glass-border)] bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-[0.9rem] text-white">Herkese Açık (Public)</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${wizardData.access_type === "public" ? "border-emerald-500 bg-emerald-500" : "border-[var(--glass-border)]"}`}>
                      {wizardData.access_type === "public" && <Check size={10} className="text-white" />}
                    </div>
                  </div>
                  <p className="m-0 text-[0.75rem] text-slate-300 leading-[1.3]">QR kodu tarayan tüm misafirler onay vererek yüz kayıtlarını oluşturabilir.</p>
                </label>

                <label 
                  onClick={() => {
                    const pass = wizardData.access_password || generateRandomPassword();
                    setWizardData({...wizardData, access_type: "closed", access_password: pass});
                  }}
                  className={`flex flex-col p-4 rounded-[16px] border cursor-pointer transition-all ${
                    wizardData.access_type === "closed"
                      ? "border-indigo-500 bg-indigo-500/10 shadow-sm"
                      : "border-[var(--glass-border)] bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-[0.9rem] text-white">Korumalı (Closed)</strong>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${wizardData.access_type === "closed" ? "border-indigo-500 bg-indigo-500" : "border-slate-400"}`}>
                      {wizardData.access_type === "closed" && <Check size={10} className="text-white" />}
                    </div>
                  </div>
                  <p className="m-0 text-[0.75rem] text-slate-300 leading-[1.3]">Misafirler sadece davet kodu veya şifre ile giriş yapabilir.</p>
                </label>
              </div>

              {wizardData.access_type === "closed" && (
                <div className="flex flex-col gap-1.5 mt-2 animate-fade-in text-left">
                  <label className="text-[0.8rem] font-bold text-slate-200 flex justify-between items-center">
                    <span>Etkinlik Şifresi / Davet Kodu</span>
                    <button 
                      type="button" 
                      onClick={() => setWizardData({...wizardData, access_password: generateRandomPassword()})}
                      className="text-[0.72rem] text-[var(--color-blue-medium)] hover:underline font-bold bg-transparent border-none cursor-pointer p-0"
                    >
                      Yeni Şifre Üret
                    </button>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Şifre üretin veya girin..." 
                      value={wizardData.access_password}
                      onChange={(e) => setWizardData({...wizardData, access_password: e.target.value})}
                      className="w-full glass-input-distinct rounded-[14px] p-[12px_16px_12px_42px] text-[0.88rem] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Branding & Kapak */}
          {wizardStep === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] glass-border-distinct p-5 rounded-[18px]">
              <h4 className="m-0 text-[0.95rem] font-bold text-white flex items-center gap-1.5 mb-2">
                <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 3:</span> Markalama & Kapak Görseli
              </h4>
              <div className="flex flex-col gap-3">
                <label className="text-[0.8rem] font-semibold text-slate-200">Kapak Görseli Seçin</label>
                <div className="grid grid-cols-5 gap-2.5">
                  {unsplashCovers.map((cov, idx) => {
                    const isSelected = wizardData.cover_image === cov.url;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setWizardData({...wizardData, cover_image: cov.url})}
                        className={`h-12 rounded-[8px] overflow-hidden relative cursor-pointer border-2 transition-all ${
                          isSelected ? "border-emerald-500 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={cov.url} alt={cov.name} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-28 w-full rounded-[14px] overflow-hidden glass-border-distinct relative">
                <img src={wizardData.cover_image} alt="Kapak Önizleme" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-end p-3">
                  <span className="text-white text-[0.75rem] font-bold uppercase tracking-wider backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-[8px]">Önizleme</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Onay Metni */}
          {wizardStep === 4 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] glass-border-distinct p-5 rounded-[18px]">
              <h4 className="m-0 text-[0.95rem] font-bold text-white flex items-center gap-1.5 mb-2">
                <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 4:</span> KVKK / GDPR Onay Metni
              </h4>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.8rem] font-semibold text-slate-200">Misafirlere Gösterilecek Açık Rıza Beyanı</label>
                <div className="w-full bg-slate-950/40 border border-[var(--glass-border)] rounded-[14px] p-4 text-[0.84rem] text-slate-300 leading-[1.5]">
                  {wizardData.consent_text}
                </div>
              </div>
              
              <label className="flex items-start gap-3 p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-[14px] cursor-pointer hover:bg-emerald-500/10 transition-colors">
                <input 
                  type="checkbox"
                  checked={wizardData.consent_approved !== false}
                  onChange={(e) => setWizardData({...wizardData, consent_approved: e.target.checked})}
                  className="w-4.5 h-4.5 accent-emerald-500 cursor-pointer mt-0.5"
                />
                <span className="text-[0.82rem] font-bold text-slate-200 leading-[1.3] select-none">
                  KVKK Aydınlatma Metninin misafirlere gösterilmesini onaylıyorum ve etkinleştiriyorum.
                </span>
              </label>

              <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-[12px]">
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="m-0 text-[0.72rem] text-slate-200 font-medium leading-[1.35]">Yasal uyarı: KVKK kapsamında misafirlerinizin selfie yüklemesinden önce açık rıza vermeleri zorunludur.</p>
              </div>
            </div>
          )}

          {/* Step 5: Özet & QR */}
          {wizardStep === 5 && (
            <div className="flex flex-col gap-4 animate-fade-in text-center items-center py-2 bg-white/[0.04] glass-border-distinct p-5 rounded-[18px]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-500 grid place-items-center mb-1">
                <Check size={24} />
              </div>
              <h4 className="m-0 text-[1.05rem] font-bold text-white">Etkinlik Oluşturulmaya Hazır!</h4>
              <p className="m-0 text-[0.78rem] text-slate-300 -mt-2">Son kontrollerinizi yapın ve kaydetme tuşuna basın.</p>
              
              <div className="w-full bg-slate-950/40 glass-border-distinct rounded-[14px] p-4 text-left flex flex-col gap-2.5 text-[0.82rem]">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-300 font-semibold">Etkinlik Adı:</span>
                  <strong className="text-white">{wizardData.title || "Yeni Etkinlik"}</strong>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-300 font-semibold">Tarih:</span>
                  <strong className="text-white">{wizardData.date}</strong>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-300 font-semibold">Mekan:</span>
                  <strong className="text-white">{wizardData.location || "İstanbul, Türkiye"}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300 font-semibold">Erişim Tipi:</span>
                  <strong className="text-white capitalize">{wizardData.access_type === "public" ? "Herkese Açık (Public)" : "Closed (Korumalı)"}</strong>
                </div>
                {wizardData.access_type === "closed" && (
                  <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                    <span className="text-slate-300 font-semibold">Etkinlik Şifresi:</span>
                    <strong className="text-emerald-400 font-black tracking-wider">{wizardData.access_password}</strong>
                  </div>
                )}
              </div>
            </div>

          )}
        </div>
      </GlassModal>

    </div>
  );
}
