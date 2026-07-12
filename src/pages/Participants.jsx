import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { fetchEvents } from "../features/events/eventsSlice";
import { 
  fetchParticipants, 
  deleteParticipantFaceData, 
  setSelectedParticipant 
} from "../features/participants/participantsSlice";
import { 
  Users, 
  UserCheck, 
  Camera, 
  Zap, 
  Search, 
  Trash2, 
  FileText, 
  ShieldAlert,
  Phone,
  Mail,
  Calendar,
  XCircle,
  Sparkles,
  Loader2,
  ArrowLeft,
  MoreHorizontal,
  Share2,
  Download,
  Star,
  CheckSquare,
  FolderSync,
  Clock,
  ChevronDown,
  RefreshCw,
  UploadCloud,
  Plus,
  Shield
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

export default function Participants() {
  const { showToast, showConfirm } = useToast();
  const { isMobile } = useAdaptive();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isUploader = user?.role === "uploader";
  const isOrganizer = user?.role === "event_owner";
  const isPhotographer = user?.role === "business_admin" || user?.role === "platform_admin";
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [newPartName, setNewPartName] = useState("");
  const [newPartEmail, setNewPartEmail] = useState("");
  const [newPartPhone, setNewPartPhone] = useState("");
  const [newPartEventId, setNewPartEventId] = useState("");
  const [wizardStep, setWizardStep] = useState(1);
  const [kvkkConsent, setKvkkConsent] = useState(false);
  
  // Selfie / Camera States
  const [selfieMode, setSelfieMode] = useState("upload");
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const videoRef = useRef(null);
  const modalFileInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const participants = useSelector((state) => state.participants.items) || [];
  const selectedParticipant = useSelector((state) => state.participants.selectedParticipant);
  const events = useSelector((state) => state.events.items) || [];
  const [matches, setMatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAlbumParticipant, setActiveAlbumParticipant] = useState(null);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(null);
  const [zoomVal, setZoomVal] = useState(1);
  const [loadingAlbumPhotos, setLoadingAlbumPhotos] = useState(false);

  useEffect(() => {
    if (activeAlbumParticipant) {
      setLoadingAlbumPhotos(true);
      const timer = setTimeout(() => {
        setLoadingAlbumPhotos(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [activeAlbumParticipant]);

  useEffect(() => {
    if (location.state?.selectedParticipantId && participants.length > 0) {
      const target = participants.find(p => p.id === location.state.selectedParticipantId);
      if (target) {
        setActiveAlbumParticipant(target);
        dispatch(setSelectedParticipant(target));
      }
    }
  }, [location.state, participants, dispatch]);
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchParticipants());
    dispatch(fetchEvents());
    setMatches(mockApi.getMatches());
  }, [dispatch]);

  useEffect(() => {
    if (participants.length > 0 && !selectedParticipant) {
      dispatch(setSelectedParticipant(participants[0]));
    }
  }, [participants, selectedParticipant, dispatch]);

  const startCamera = async () => {
    try {
      setCapturedPhoto(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 320, facingMode: "user" },
        audio: false
      });
      setCameraStream(stream);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera access error:", err);
      showToast("Kameraya erişilemedi. Lütfen izinleri kontrol edin.", "error");
      setSelfieMode("upload");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 320;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");
    setCapturedPhoto(dataUrl);
    stopCamera();
  };

  const handleCloseModal = () => {
    stopCamera();
    setCapturedPhoto(null);
    setSelfieMode("upload");
    setNewPartName("");
    setNewPartEmail("");
    setNewPartPhone("");
    setNewPartEventId("");
    setWizardStep(1);
    setKvkkConsent(false);
    setShowAddParticipantModal(false);
  };

  const handleAddParticipant = (e) => {
    if (e) e.preventDefault();
    if (!newPartName.trim()) {
      showToast("Lütfen katılımcı adını girin.", "warning");
      return;
    }
    if (!newPartEventId) {
      showToast("Lütfen bir etkinlik seçin.", "warning");
      return;
    }
    if (!capturedPhoto) {
      showToast("Lütfen bir selfie fotoğrafı yükleyin veya kamerayla çekin.", "warning");
      return;
    }
    if (!kvkkConsent) {
      showToast("Katılımcı eklemek için KVKK Açık Rıza Onay kutusunu işaretlemeniz gerekmektedir.", "warning");
      return;
    }
    
    mockApi.createParticipant(
      newPartEventId,
      newPartName.trim(),
      capturedPhoto,
      newPartEmail.trim(),
      newPartPhone.trim()
    );
    
    dispatch(fetchParticipants());
    
    showToast("Katılımcı başarıyla eklendi ve AI yüz eşleştirmesi başlatıldı.", "success");
    
    handleCloseModal();
  };

  const handleRemoveFaceData = (partId) => {
    showConfirm(
      "Bu katılımcının biyometrik yüz verilerini ve eşleşmelerini silmek istediğinize emin misiniz?",
      () => {
        dispatch(deleteParticipantFaceData(partId)).then(() => {
          setMatches(mockApi.getMatches());
          showToast("Katılımcının biyometrik yüz verileri silindi.", "success");
        });
      }
    );
  };

  const handleTriggerSelfieUpload = (partId) => {
    // Predefined high-quality portraits to simulate face scanning upload
    const presetSelfies = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    ];
    const randomSelfie = presetSelfies[Math.floor(Math.random() * presetSelfies.length)];
    
    // Call mockApi to save and trigger face detection
    const updatedParticipant = mockApi.updateParticipantSelfie(partId, randomSelfie);
    if (updatedParticipant) {
      dispatch(fetchParticipants());
      setMatches(mockApi.getMatches());
      dispatch(setSelectedParticipant(updatedParticipant));
      showToast(`${updatedParticipant.display_name} kullanıcısının yüz taraması başarıyla tamamlandı ve AI eşleştirmesi tetiklendi.`, "success");
    }
  };

  const handleRealSelfieUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file || !selectedParticipant) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result;
      const updatedParticipant = mockApi.updateParticipantSelfie(selectedParticipant.id, base64Url);
      if (updatedParticipant) {
        dispatch(fetchParticipants());
        setMatches(mockApi.getMatches());
        dispatch(setSelectedParticipant(updatedParticipant));
        showToast(`${updatedParticipant.display_name} kullanıcısının yüz taraması başarıyla tamamlandı ve AI eşleştirmesi tetiklendi.`, "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const getEventName = (eventId) => {
    const ev = events.find(e => e.id === eventId);
    return ev ? ev.title : "Genel Galeri";
  };

  const generateAlbumPdf = (participant, photos, confidence) => {
    if (!participant) return;
    showToast("PDF oluşturuluyor...", "info");

    const dateStr = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
    const eventName = getEventName(participant.event_id);

    const infoRows = [
      ["Etkinlik", eventName],
      ["E-posta", participant.email || "Belirtilmemiş"],
      ["Telefon", participant.phone || "Belirtilmemiş"],
      ["AI Eşleşme Skoru", `%${confidence}`],
      ["Toplam Eşleşen Fotoğraf", String(photos.length)],
      ["Katılım Durumu", participant.status === "active" ? "Aktif" : "Pasif"],
    ];

    const infoHtml = infoRows.map(([l, v]) => `<tr><td>${l}</td><td>${v}</td></tr>`).join("");
    const photoHtml = photos.slice(0, 50).map((ph, i) =>
      `<tr><td>${i + 1}</td><td>${ph.filename || ph.id || `foto-${i + 1}`}</td><td>${ph.status === "approved" ? "Onaylandı ✓" : "Otomatik"}</td><td>%${ph.matchConfidence || confidence}</td></tr>`
    ).join("");

    const html = [
      "<!DOCTYPE html><html lang='tr'><head><meta charset='UTF-8'/>",
      `<title>SnapMatch Albüm — ${participant.display_name}</title>`,
      "<style>",
      "*{margin:0;padding:0;box-sizing:border-box;}",
      "body{font-family:'Helvetica Neue',Arial,sans-serif;color:#1e293b;background:#fff;padding:32px 40px;font-size:13px;}",
      ".hdr{background:#10553f;color:#fff;padding:18px 24px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}",
      ".hdr h1{font-size:18px;font-weight:800;}",
      ".hdr span{font-size:11px;opacity:.8;}",
      ".name{font-size:20px;font-weight:900;color:#10553f;margin-bottom:16px;}",
      ".sec{font-size:13px;font-weight:800;color:#10553f;margin:22px 0 8px;border-left:4px solid #10553f;padding-left:10px;}",
      "table{width:100%;border-collapse:collapse;margin-bottom:6px;}",
      "th{background:#10553f;color:#fff;padding:8px 12px;text-align:left;font-size:11px;font-weight:700;}",
      "th:last-child{text-align:right;}",
      "td{padding:7px 12px;font-size:12px;border-bottom:1px solid #e2e8f0;}",
      "td:last-child{text-align:right;font-weight:700;color:#10553f;}",
      "tr:nth-child(even) td{background:#f0faf5;}",
      ".footer{margin-top:32px;text-align:center;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;}",
      "@media print{body{padding:20px 28px;}}",
      "</style></head><body>",
      `<div class='hdr'><h1>SnapMatch &mdash; Katılımcı Albümü</h1><span>${dateStr} &bull; ${eventName}</span></div>`,
      `<div class='name'>${participant.display_name || "Katılımcı"}</div>`,
      "<div class='sec'>Kişi Bilgileri</div>",
      "<table><thead><tr><th>Alan</th><th>Değer</th></tr></thead><tbody>",
      infoHtml,
      "</tbody></table>",
      photos.length > 0 ? [
        "<div class='sec'>Eşleşen Fotoğraflar</div>",
        "<table><thead><tr><th>#</th><th>Fotoğraf</th><th>Durum</th><th>Skor</th></tr></thead><tbody>",
        photoHtml,
        "</tbody></table>"
      ].join("") : "",
      `<div class='footer'>SnapMatch Katılımcı Albümü &mdash; ${participant.display_name} &mdash; ${dateStr}</div>`,
      "</body></html>"
    ].join("");

    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      showToast("Pop-up engellendi. Lütfen tarayıcı pop-up iznini açın.", "error");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
    showToast("Yazdır penceresinde 'PDF olarak kaydet' seçin.", "success");
  };

  const getParticipantMatches = (partId) => {
    return matches.filter(m => m.participant_id === partId && (m.status === 'approved' || m.status === 'auto_approved')).length;
  };

  const globalSearch = useSelector((state) => state.ui.globalSearchQuery) || "";
  const activeSearchQuery = searchQuery || globalSearch;

  const filteredParticipants = participants.filter(p => {
    const name = p.display_name || "";
    const email = p.email || "";
    const phone = p.phone || "";
    const searchLower = activeSearchQuery.toLocaleLowerCase("tr-TR");
    return name.toLocaleLowerCase("tr-TR").includes(searchLower) ||
           email.toLocaleLowerCase("tr-TR").includes(searchLower) ||
           phone.includes(activeSearchQuery);
  });

  // Stats
  const totalCount = participants.length;
  const activeCount = participants.filter(p => p.status === "active" && p.selfie_url).length;
  const consentCount = participants.filter(p => p.consent_accepted_at).length;
  const totalMatchedCount = participants.filter(p => getParticipantMatches(p.id) > 0).length;

  useEffect(() => {
    setVisibleCount(10);
  }, [activeSearchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= filteredParticipants.length || loadingMore) return;

      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120;
      if (scrolledToBottom) {
        setLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 10);
          setLoadingMore(false);
        }, 800);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredParticipants.length, loadingMore]);

  const visibleParticipants = filteredParticipants.slice(0, visibleCount);

  if (isMobile) {
    if (activeAlbumParticipant) {
      const pPhotos = matches
        .filter(m => m.participant_id === activeAlbumParticipant.id)
        .map(m => {
          const ph = mockApi.getPhotos().find(p => p.id === m.photo_id);
          return ph ? { ...ph, matchConfidence: m.confidence || (94 + (ph.id.toString().charCodeAt(0) % 6)) } : null;
        })
        .filter(Boolean);

      const coverPhoto = pPhotos.length > 0 ? pPhotos[0].thumbnail_url : activeAlbumParticipant.selfie_url;
      const confidence = 94 + (activeAlbumParticipant.id.toString().charCodeAt(0) % 6);

      // Columns for masonry
      const col1 = pPhotos.filter((_, idx) => idx % 2 === 0);
      const col2 = pPhotos.filter((_, idx) => idx % 2 === 1);

      return (
        <div className="flex flex-col gap-6 pt-2 pb-20 select-none animate-fade-in relative">
          
          {/* Header Navigation */}
          <div className="flex items-center justify-between px-1 relative z-20">
            <button 
              onClick={() => setActiveAlbumParticipant(null)}
              className="flex items-center gap-1.5 bg-transparent border-none text-emerald-400 font-bold text-[11px] cursor-pointer select-none active:scale-95 transition-transform"
            >
              <ArrowLeft size={16} />
              <span>Albümler</span>
            </button>

            {/* Actions Menü Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowMenuDropdown(!showMenuDropdown)}
                className="w-8 h-8 rounded-full bg-white/10 dark:bg-black/20 flex items-center justify-center border-none text-white cursor-pointer active:scale-90 transition-transform"
              >
                <MoreHorizontal size={14} />
              </button>

              {showMenuDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenuDropdown(false)} />
                  <div className="absolute right-0 mt-2 w-[160px] glass-panel border border-white/15 p-1 rounded-2xl shadow-xl flex flex-col z-50 animate-fade-in text-[10px]">
                    {[
                      { label: "Albümü Paylaş", action: () => { showToast("Paylaşım bağlantısı kopyalandı.", "success"); setShowMenuDropdown(false); } },
                      { label: "Albümü İndir", action: () => { showToast("Albüm indirme kuyruğuna alındı.", "success"); setShowMenuDropdown(false); } },
                      { label: "PDF Oluştur", action: () => { generateAlbumPdf(activeAlbumParticipant, pPhotos, confidence); setShowMenuDropdown(false); } },
                      { label: "AI Tekrar Tara", action: () => { showToast("AI analiz motoru tetiklendi.", "info"); setShowMenuDropdown(false); } },
                      { label: "Albümü Sil", action: () => { setShowMenuDropdown(false); showConfirm("Albümü silmek istediğinizden emin misiniz?", () => { setActiveAlbumParticipant(null); showToast("Albüm başarıyla silindi.", "warning"); }); } }
                    ].map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={opt.action}
                        className="p-[8px_12px] bg-transparent border-none text-white text-left font-bold cursor-pointer rounded-lg hover:bg-white/10 active:bg-white/15 text-[10px] w-full"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero Banner (35% scale layout with micro zoom load animation) */}
          <div 
            className="relative w-full h-[250px] rounded-[28px] overflow-hidden shadow-lg border border-white/10 transition-transform duration-[800ms] scale-100"
            style={{
              backgroundImage: `url("${coverPhoto}")`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* Transparent Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1E2631]/95 via-[#3A4B5C]/50 to-transparent z-10" />

            {/* Info Overlay */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end z-20">
              <h2 className="text-xl font-black m-0 text-white leading-tight flex items-center gap-1.5">
                👤 {activeAlbumParticipant.display_name}
              </h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[10px] text-white/80 font-semibold">
                <span>{pPhotos.length} Fotoğraf</span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-black">AI Match %{confidence}</span>
                <span>&bull;</span>
                <span>Son Güncelleme: 12 Haziran 2026</span>
              </div>
            </div>
          </div>

          {/* Statistics Pill Labels */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none px-1">
            <span className="bg-white/10 dark:bg-black/25 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 text-white shrink-0 flex items-center gap-1">
              📷 {pPhotos.length} Fotoğraf
            </span>
            <span className="bg-white/10 dark:bg-black/25 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 text-white shrink-0 flex items-center gap-1">
              🤖 %{confidence} Match
            </span>
            <span className="bg-white/10 dark:bg-black/25 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 text-white shrink-0 flex items-center gap-1">
              ⭐ 12 Favori
            </span>
            <span className="bg-white/10 dark:bg-black/25 text-[10px] font-bold px-3 py-1.5 rounded-full border border-white/10 text-white shrink-0 flex items-center gap-1">
              ⬇ 45 İndirildi
            </span>
          </div>

          {/* Action Buttons Row (Icon on Top, Label Below) */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
            {[
              { icon: <Download size={18} />, label: "İndir", action: () => showToast("Tüm albüm indiriliyor...", "success") },
              { icon: <Share2 size={18} />, label: "Paylaş", action: () => showToast("Paylaşım bağlantısı kopyalandı.", "success") },
              { icon: <Star size={18} />, label: "Favorile", action: () => showToast("Albüme favori eklendi.", "success") },
              { icon: <CheckSquare size={18} />, label: "AI Review", action: () => showToast("AI Review süreci başlatıldı.", "info") },
              { icon: <FolderSync size={18} />, label: "Export", action: () => showToast("Koleksiyon dışa aktarılıyor...", "info") }
            ].map((btn, idx) => (
              <button 
                key={idx}
                onClick={btn.action}
                className="glass-panel w-[90px] h-[85px] shrink-0 border border-white/10 flex flex-col items-center justify-center gap-2 text-white active:scale-95 transition-transform cursor-pointer"
              >
                <div className="text-emerald-400">{btn.icon}</div>
                <span className="text-[9px] font-black tracking-wide uppercase">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Pinterest / Apple Photos Modern Masonry Gallery Grid */}
          <div className="flex flex-col gap-3 px-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-white/50 m-0">Fotoğraflar</h4>
            
            {loadingAlbumPhotos ? (
              /* Shimmering Skeletons */
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1 h-[190px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="col-span-1 h-[140px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="col-span-2 h-[155px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="col-span-1 h-[210px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="col-span-1 h-[170px] rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
              </div>
            ) : pPhotos.length === 0 ? (
              <GlassCard className="p-8 text-center text-[var(--text-muted)] text-[0.8rem]">
                Henüz eşleşmiş fotoğraf bulunmuyor.
              </GlassCard>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {pPhotos.map((ph, idx) => {
                  // Dynamic layout mapping (alternating long, square, and wide items)
                  const mod = idx % 5;
                  const layoutClass = 
                    mod === 0 ? "col-span-1 h-[140px]" : 
                    mod === 1 ? "col-span-1 h-[220px]" : 
                    mod === 2 ? "col-span-2 h-[150px]" : 
                    mod === 3 ? "col-span-1 h-[190px]" : 
                    "col-span-1 h-[170px]";

                  return (
                    <div 
                      key={ph.id}
                      onClick={() => {
                        setPreviewPhotoIndex(idx);
                        setZoomVal(1);
                      }}
                      className={`w-full ${layoutClass} bg-white p-1 shadow-md border-2 border-white relative overflow-hidden active:scale-[0.97] transition-all duration-200 cursor-pointer rounded-2xl animate-fade-in`}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <img src={ph.thumbnail_url} alt="masonry" className="w-full h-full object-cover rounded-xl" />
                      {/* Glass Badge Overlay */}
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black p-[2px_6px] rounded-[6px] flex items-center gap-0.5 shadow">
                        🤖 %{ph.matchConfidence}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Chronological Timeline (Labeled "Çekim Anları") */}
          <div className="flex flex-col gap-4 mt-4 px-2 pb-10">
            <h4 className="text-xs font-black uppercase tracking-wider text-white/50 m-0">Çekim Anları</h4>
            <div className="flex flex-col gap-3">
              {[
                { time: "09:10", label: "Hazırlık" },
                { time: "09:45", label: "Toplu Çekim" },
                { time: "10:20", label: "Sahne" },
                { time: "11:10", label: "Kapanış" }
              ].map((item, idx, arr) => (
                <div key={idx} className="flex items-center gap-4 relative">
                  <span className="text-[10px] font-black text-white/40 shrink-0 w-10">{item.time}</span>
                  <div className="relative flex items-center justify-center shrink-0 w-4 h-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 z-10 animate-pulse" />
                    {idx < arr.length - 1 && (
                      <div className="absolute top-2 w-[1.5px] bg-emerald-500/20 h-[32px] z-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-extrabold text-white/90">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Screen Photo Preview Modal */}
          {previewPhotoIndex !== null && pPhotos[previewPhotoIndex] && (() => {
            const currentPhoto = pPhotos[previewPhotoIndex];
            const goPrev = (e) => {
              e.stopPropagation();
              setPreviewPhotoIndex(prev => prev > 0 ? prev - 1 : pPhotos.length - 1);
              setZoomVal(1);
            };
            const goNext = (e) => {
              e.stopPropagation();
              setPreviewPhotoIndex(prev => prev < pPhotos.length - 1 ? prev + 1 : 0);
              setZoomVal(1);
            };

            return (
              <GlassModal
                open={previewPhotoIndex !== null}
                onClose={() => { setPreviewPhotoIndex(null); setZoomVal(1); }}
                title={`Fotoğraf Önizleme (${previewPhotoIndex + 1} / ${pPhotos.length})`}
                width="max-w-[640px]"
              >
                <div className="flex flex-col select-none text-white gap-4">
                  {/* Top Control Bar */}
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => showToast("Görsel indiriliyor...", "success")}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-none text-white cursor-pointer active:scale-90"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => showToast("Görsel paylaşıldı.", "success")}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-none text-white cursor-pointer active:scale-90"
                    >
                      <Share2 size={14} />
                    </button>
                    <button 
                      onClick={() => showToast("Görsel favorilere eklendi.", "success")}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border-none text-white cursor-pointer active:scale-90"
                    >
                      <Star size={14} className="text-amber-400" />
                    </button>
                  </div>

                  {/* Middle Viewport (Image and Swiper Controls) */}
                  <div className="relative flex items-center justify-center overflow-hidden my-2 min-h-[300px]">
                    {/* Prev Control */}
                    <button 
                      onClick={goPrev} 
                      className="absolute left-2 w-10 h-10 rounded-full bg-black/60 border-none flex items-center justify-center text-white/70 active:text-white z-20 cursor-pointer text-lg font-bold"
                    >
                      &larr;
                    </button>

                    {/* Image Frame */}
                    <div 
                      className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center"
                      style={{ transform: `scale(${zoomVal})` }}
                    >
                      <img 
                        src={currentPhoto.thumbnail_url} 
                        alt="preview" 
                        className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-2xl border border-white/10"
                      />
                    </div>

                    {/* Next Control */}
                    <button 
                      onClick={goNext} 
                      className="absolute right-2 w-10 h-10 rounded-full bg-black/60 border-none flex items-center justify-center text-white/70 active:text-white z-20 cursor-pointer text-lg font-bold"
                    >
                      &rarr;
                    </button>
                  </div>

                  {/* Mock Zoom Control Slider */}
                  <div className="flex flex-col gap-2 items-center bg-black/40 p-3 rounded-2xl border border-white/5 mx-auto max-w-[200px] w-full mb-1 shrink-0">
                    <span className="text-[9px] font-black uppercase text-white/60 tracking-wider">Zoom: {Math.round(zoomVal * 100)}%</span>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.1" 
                      value={zoomVal} 
                      onChange={(e) => setZoomVal(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                    />
                  </div>

                  {/* Bottom Metadata Panel */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 shrink-0 z-10">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-extrabold text-emerald-400">🤖 AI Match: %{currentPhoto.matchConfidence}</span>
                      <span className="text-white/40">{currentPhoto.filename}</span>
                    </div>
                    <div className="h-[1px] bg-white/5 my-1" />
                    <div className="flex justify-between text-[8px] text-white/50">
                      <span>Sony A7IV &bull; FE 50mm f/1.8</span>
                      <span>1/250s &bull; f/2.2 &bull; ISO 640</span>
                    </div>
                  </div>
                </div>
              </GlassModal>
            );
          })()}

        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Search */}
        <div className="search-pill bg-white/20">
          <Search size={16} className="text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Katılımcı ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grouped list of participants */}
        <div className="flex flex-col gap-2.5">
          {filteredParticipants.map(p => (
            <div 
              key={p.id} 
              onClick={() => {
                setActiveAlbumParticipant(p);
                dispatch(setSelectedParticipant(p));
              }}
              className="glass-panel p-3.5 flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
            >
              <div className="flex items-center gap-3">
                {isOrganizer ? (
                  <div 
                    className="w-10 h-10 rounded-full bg-slate-950/40 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0"
                    title="KVKK Güvenliği: Organizatörler biyometrik selfie verisini görüntüleyemez."
                  >
                    <Shield size={18} />
                  </div>
                ) : (
                  <img src={p.selfie_url || p.face_url} alt={p.display_name} className="w-10 h-10 rounded-full object-cover border border-[var(--glass-border)]" />
                )}
                <div>
                  <strong className="text-xs font-bold text-[var(--text-main)] block">{p.display_name}</strong>
                  <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">{p.consent_status === "given" ? "Açık Rıza Verildi" : "Onay Bekliyor"}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-white/50 bg-white/5 p-1 rounded-md">
                  {getParticipantMatches(p.id)} Görsel
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFaceData(p.id);
                  }}
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 border-none cursor-pointer active:scale-95 transition-transform"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          
          {filteredParticipants.length === 0 && (
            <div className="text-center py-10 text-xs text-[var(--text-muted)]">Katılımcı bulunamadı.</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">

      {/* KPI Cards */}
      <div className="stats-grid">
        <GlassCard className="p-4 flex gap-3 items-center">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-blue-500/12 text-blue-500 grid place-items-center">
            <Users size={20} />
          </div>
          <div>
            <small className="text-[var(--text-muted)] block">Toplam Katılımcı</small>
            <strong className="text-[1.2rem] font-bold">{totalCount}</strong>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex gap-3 items-center">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-emerald-500/12 text-emerald-500 grid place-items-center">
            <UserCheck size={20} />
          </div>
          <div>
            <small className="text-[var(--text-muted)] block">KVKK Onayı Veren</small>
            <strong className="text-[1.2rem] text-[var(--accent-green)] font-bold">{consentCount}</strong>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex gap-3 items-center">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-purple-500/12 text-purple-500 grid place-items-center">
            <Camera size={20} />
          </div>
          <div>
            <small className="text-[var(--text-muted)] block">Selfie Yükleyenler</small>
            <strong className="text-[1.2rem] font-bold">{activeCount}</strong>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex gap-3 items-center">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-amber-500/12 text-amber-500 grid place-items-center">
            <Zap size={20} />
          </div>
          <div>
            <small className="text-[var(--text-muted)] block">En Az 1 Eşleşme Alan</small>
            <strong className="text-[1.2rem] font-bold">{totalMatchedCount}</strong>
          </div>
        </GlassCard>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
        {/* Table List */}
        <div className="flex flex-col gap-[var(--space-md)]">
          <GlassCard className="glass-panel p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="search-pill bg-white/25 flex-grow w-full">
                <Search size={18} className="text-[var(--text-muted)]" />
                <input 
                  type="text" 
                  placeholder="Katılımcı adı, email veya telefon numarası ara..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-[var(--text-main)]"
                />
              </div>

              {(isOrganizer || isPhotographer) && (
                <button
                  type="button"
                  onClick={() => {
                    setNewPartEventId(events[0]?.id || "");
                    setCapturedPhoto(null);
                    setSelfieMode("upload");
                    setShowAddParticipantModal(true);
                  }}
                  className="primary-btn flex items-center gap-1.5 whitespace-nowrap p-[10px_16px] text-xs font-bold rounded-xl"
                >
                  <Plus size={15} />
                  <span>Yeni Katılımcı Ekle</span>
                </button>
              )}
            </div>
          </GlassCard>

          <GlassCard className="glass-panel p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] bg-black/5">
                    <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Katılımcı</th>
                    <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Etkinlik</th>
                    <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Onay Durumu</th>
                    <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold text-center">Eşleşen</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleParticipants.map((p) => {
                    const isSelected = selectedParticipant && selectedParticipant.id === p.id;
                    const matchesCount = getParticipantMatches(p.id);
                    return (
                      <tr 
                        key={p.id}
                        onClick={() => dispatch(setSelectedParticipant(p))}
                        className={`border-b border-[var(--glass-border)] cursor-pointer transition-colors duration-200 theme-card-hover ${isSelected ? "bg-white/10" : "bg-transparent"}`}
                      >
                        <td className="p-[12px_16px] flex items-center gap-2.5">
                          {isOrganizer ? (
                            <div 
                              className="w-9 h-9 rounded-full bg-slate-950/40 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0"
                              title="KVKK Güvenliği: Organizatörler biyometrik selfie verisini görüntüleyemez."
                            >
                              <Shield size={16} />
                            </div>
                          ) : p.selfie_url ? (
                            <img src={p.selfie_url} alt={p.display_name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[var(--glass-border)] grid place-items-center text-[0.8rem] font-bold">
                              {p.display_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <strong className="text-[0.88rem] text-[var(--text-main)] block">{p.display_name}</strong>
                            <small className="text-[var(--text-muted)] text-[0.75rem]">{p.email}</small>
                          </div>
                        </td>
                        <td className="p-[12px_16px] text-[0.85rem] font-semibold">{getEventName(p.event_id)}</td>
                        <td className="p-[12px_16px]">
                          {p.consent_accepted_at ? (
                            <span className="text-[var(--accent-green)] text-[0.75rem] font-bold inline-flex items-center gap-1">
                              <UserCheck size={12} /> KVKK Onaylı
                            </span>
                          ) : (
                            <span className="text-red-500 text-[0.75rem] font-bold inline-flex items-center gap-1">
                              <XCircle size={12} /> Onay Yok
                            </span>
                          )}
                        </td>
                        <td className={`p-[12px_16px] font-extrabold text-center text-[0.88rem] ${matchesCount > 0 ? "text-[var(--color-blue-dark)]" : "text-[var(--text-muted)]"}`}>
                          {matchesCount}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Infinite loading indicator row */}
                  {loadingMore && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-[0.82rem] font-semibold">
                          <Loader2 size={16} className="animate-spin text-[var(--color-blue-dark)]" />
                          <span>Daha fazla katılımcı yükleniyor...</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* End of list row */}
                  {visibleCount >= filteredParticipants.length && filteredParticipants.length > 0 && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-[var(--text-muted)] text-[0.78rem] font-semibold">
                        Tüm katılımcılar listelendi. (Toplam: {filteredParticipants.length})
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Selected Participant Details Drawer / Card */}
        <div>
          {selectedParticipant ? (
            <GlassCard 
              title="Katılımcı Kartı" 
              action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
              className="glass-panel flex flex-col gap-5"
            >
              {/* Profile Preview */}
              <div className="flex flex-col items-center text-center py-2.5 gap-1.5 w-full">

                {isOrganizer ? (
                   <div 
                     className="w-[100px] h-[100px] rounded-full bg-slate-950/40 border-3 border-amber-500/30 flex flex-col items-center justify-center text-amber-500 gap-1"
                     title="KVKK Güvenliği: Organizatörler biyometrik selfie verisini görüntüleyemez."
                   >
                     <Shield size={32} />
                     <span className="text-[0.62rem] font-bold text-amber-500/80">KVKK Korumalı</span>
                   </div>
                 ) : selectedParticipant.selfie_url ? (
                  <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-3 border-[var(--color-blue-dark)]">
                    <img src={selectedParticipant.selfie_url} alt="selfie" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-[100px] h-[100px] rounded-full bg-[var(--glass-border)] grid place-items-center text-[1.8rem] font-bold">
                    {selectedParticipant.display_name.charAt(0)}
                  </div>
                )}
                <h3 className="m-0 mb-1 text-[1.15rem] font-extrabold text-center w-full truncate" title={selectedParticipant.display_name}>
                  {selectedParticipant.display_name}
                </h3>
                <span className="bg-[var(--glass-border)] p-[2.5px_10px] rounded-[10px] text-[0.72rem] font-bold text-[var(--text-muted)] whitespace-nowrap self-center">ID: {selectedParticipant.id}</span>
              </div>


              {/* Info Rows */}
              <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4">
                <div className="flex items-center gap-2.5 text-[0.85rem]">
                  <Mail size={16} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)]">Email:</span>
                  <strong className="ml-auto text-right truncate max-w-[180px]" title={selectedParticipant.email || "-"}>
                    {selectedParticipant.email || "-"}
                  </strong>
                </div>
                <div className="flex items-center gap-2.5 text-[0.85rem]">
                  <Phone size={16} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)]">Telefon:</span>
                  <strong className="ml-auto text-right truncate max-w-[180px]" title={selectedParticipant.phone || "-"}>
                    {selectedParticipant.phone || "-"}
                  </strong>
                </div>
                <div className="flex items-center gap-2.5 text-[0.85rem]">
                  <Calendar size={16} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)]">Kayıt Tarihi:</span>
                  <strong className="ml-auto text-right whitespace-nowrap" title={selectedParticipant.registered_at ? new Date(selectedParticipant.registered_at).toLocaleDateString("tr-TR") : "-"}>
                    {selectedParticipant.registered_at ? new Date(selectedParticipant.registered_at).toLocaleDateString("tr-TR") : "-"}
                  </strong>
                </div>

              </div>

              {/* Selfie / Yüz Fotoğrafı Yükleme Alanı */}
              <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4">
                <div className="flex items-center gap-2">
                  <Camera size={16} className="text-[var(--color-blue-dark)]" />
                  <span className="text-[0.78rem] font-extrabold tracking-wider text-[var(--text-muted)] uppercase">Yüz Tarama Fotoğrafı (Selfie)</span>
                </div>
                
                {isOrganizer ? (
                  <div className="bg-amber-500/5 border border-amber-500/20 p-3.5 rounded-[16px] text-[0.76rem] text-amber-500/90 leading-relaxed text-left">
                    🔐 <strong>KVKK Bilgilendirmesi:</strong> Katılımcıların hassas biyometrik (yüz) verileri, güvenlik ve gizlilik politikaları gereği organizatörler tarafından doğrudan görüntülenemez veya değiştirilemez.
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleRealSelfieUpload} 
                    />

                    {selectedParticipant.selfie_url ? (
                      <div className="flex flex-col gap-2">
                        <div className="text-[0.76rem] text-[var(--text-muted)] leading-relaxed text-left">
                          Mevcut yüz taraması sisteme tanımlıdır. Bilgisayarınızdan yeni bir fotoğraf yükleyerek güncelleyebilirsiniz.
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="primary-btn flex-1 p-2.5 text-[0.8rem] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <UploadCloud size={14} />
                            <span>Fotoğrafı Güncelle</span>
                          </button>
                          <button
                            onClick={() => handleTriggerSelfieUpload(selectedParticipant.id)}
                            title="Simüle Fotoğraf Yükle"
                            className="secondary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-[16px]">
                        <div className="text-[0.76rem] text-[var(--text-muted)] leading-relaxed text-left">
                          Eşleşme yapılabilmesi için katılımcının yüz fotoğrafını yükleyin.
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="primary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] w-full flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <UploadCloud size={14} />
                            <span>Bilgisayardan Selfie Yükle</span>
                          </button>
                          <button
                            onClick={() => handleTriggerSelfieUpload(selectedParticipant.id)}
                            className="secondary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] w-full flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={14} />
                            <span>Simülasyon Fotoğrafı Yükle</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* KVKK / GDPR Info Box */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-[12px] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--accent-green)] font-bold text-[0.82rem]">
                  <Sparkles size={14} />
                  <span>KVKK Aydınlatma Beyanı</span>
                </div>
                <p className="m-0 text-[0.76rem] text-[var(--text-muted)] leading-[1.35]">
                  Katılımcı {selectedParticipant.registered_at ? new Date(selectedParticipant.registered_at).toLocaleDateString("tr-TR") : "Kayıt Tarihi Belirsiz"} tarihinde biyometrik yüz verilerinin aranması ve galerinin eşleştirilmesi için rıza göstermiştir.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-2.5 justify-end">
                <button 
                  className={`primary-btn px-4 py-2.5 gap-2 text-[0.85rem] font-bold ${isUploader ? "opacity-50 cursor-not-allowed" : ""}`} 
                  onClick={isUploader ? () => showToast("Fotoğrafçı asistanı yetkisiyle bu günlük indirilemez.", "error") : () => showToast("KVKK onay günlüğü başarıyla oluşturuldu ve indirildi.", "success")}
                  title={isUploader ? "Yetki Yetersiz" : "KVKK Onay Logu"}
                >
                  <FileText size={16} />
                  <span>KVKK Onay Logu</span>
                </button>
                {!isUploader && (
                  <button 
                    className="icon-btn !bg-red-500/10 border border-red-500/35 text-red-500 w-[42px] h-[42px] shrink-0 flex items-center justify-center" 
                    onClick={() => handleRemoveFaceData(selectedParticipant.id)}
                    title="Yüz Verisini ve Eşleşmeleri Sil"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="glass-panel p-7.5 text-center">
              <Users size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-[var(--text-muted)] text-[0.85rem]">Detayları incelemek için sol listeden bir katılımcı seçin.</p>
            </GlassCard>
          )}
        </div>
      </div>

      {/* ADD PARTICIPANT MODAL */}
      <GlassModal
        open={showAddParticipantModal}
        onClose={handleCloseModal}
        title="Yeni Katılımcı Ekle"
        subtitle="Katılımcı bilgilerini ve yüz profilini 3 adımda kolayca tanımlayın"
        icon={Users}
        width="max-w-[540px]"
        footer={
          <div className="flex justify-between items-center gap-3 w-full">
            {wizardStep > 1 ? (
              <button 
                type="button"
                onClick={() => {
                  if (wizardStep === 2) {
                    stopCamera();
                  }
                  setWizardStep(wizardStep - 1);
                }}
                className="glass-btn flex items-center gap-1.5 p-[10px_20px] text-[0.85rem] font-bold rounded-[14px] border border-white/10 hover:bg-white/10 text-white cursor-pointer bg-transparent"
              >
                <span>Geri</span>
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="glass-btn flex items-center gap-1.5 p-[10px_20px] text-[0.85rem] font-bold rounded-[14px] border border-white/10 hover:bg-white/10 text-white cursor-pointer bg-transparent"
              >
                <span>İptal</span>
              </button>
            )}

            {wizardStep < 3 ? (
              <button 
                type="button"
                onClick={() => {
                  if (wizardStep === 1) {
                    if (!newPartName.trim()) {
                      showToast("Lütfen katılımcı adını girin.", "warning");
                      return;
                    }
                    if (!newPartEventId) {
                      showToast("Lütfen bir etkinlik seçin.", "warning");
                      return;
                    }
                    setWizardStep(2);
                  } else if (wizardStep === 2) {
                    if (!capturedPhoto) {
                      showToast("Lütfen bir selfie fotoğrafı yükleyin veya kamerayla çekin.", "warning");
                      return;
                    }
                    setWizardStep(3);
                  }
                }}
                className="primary-btn flex items-center gap-1.5 p-[10px_24px] text-[0.85rem] font-bold rounded-[14px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none cursor-pointer shadow-md"
              >
                <span>İleri</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleAddParticipant}
                disabled={!kvkkConsent}
                className={`primary-btn flex items-center gap-1.5 p-[10px_24px] text-[0.85rem] font-bold rounded-[14px] bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none cursor-pointer shadow-md ${!kvkkConsent ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span>Kaydet ve AI Eşleştir</span>
              </button>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-left">
          {/* Step Indicators */}
          <div className="mb-2 bg-white/[0.03] p-4 rounded-[18px] select-none relative z-10 border border-white/5">
            <div className="flex justify-between items-center relative px-2">
              {/* Connecting line */}
              <div className="absolute top-[14px] left-8 right-8 h-[2px] bg-white/10 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${(wizardStep - 1) * 50}%` }}
                />
              </div>
              
              {[1, 2, 3].map((s) => {
                const labels = ["Kişi Bilgileri", "Yüz Tanımlama", "Onay & KVKK"];
                const isActive = wizardStep === s;
                const isCompleted = wizardStep > s;
                return (
                  <div key={s} className="flex flex-col items-center gap-2 z-10 flex-1 relative">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.8rem] font-bold transition-all relative border ${
                        isActive 
                          ? "border-blue-400 bg-blue-500/20 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] scale-110" 
                          : (isCompleted 
                            ? "border-blue-400/80 bg-blue-500/10 text-white" 
                            : "border-white/20 bg-slate-950/40 text-slate-300")
                      }`}
                    >
                      {s}
                    </div>
                    <span 
                      className={`text-[0.68rem] font-black transition-colors ${
                        isActive ? "text-blue-400 font-extrabold" : "text-slate-200"
                      }`}
                    >
                      {labels[s - 1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1 Content */}
          {wizardStep === 1 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] p-5 rounded-[18px] border border-white/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-[var(--color-blue-medium)]">
                  <UserCheck size={16} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-[0.9rem] font-bold text-white flex items-center gap-1.5">
                    <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 1:</span>
                    <span className="text-white font-bold">Kişi Bilgileri</span>
                  </div>
                  <span className="text-[0.72rem] text-slate-400">Katılımcının temel iletişim bilgilerini tanımlayın.</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Adı Soyadı</label>
                <input 
                  type="text" 
                  placeholder="Örn. Ezgi Kuzu" 
                  required
                  value={newPartName}
                  onChange={(e) => setNewPartName(e.target.value)}
                  className="glass-input-distinct w-full p-[10px_14px] rounded-xl text-[0.92rem] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">E-posta (İsteğe Bağlı)</label>
                  <input 
                    type="email" 
                    placeholder="ornek@domain.com"
                    value={newPartEmail}
                    onChange={(e) => setNewPartEmail(e.target.value)}
                    className="glass-input-distinct w-full p-[10px_14px] rounded-xl text-[0.92rem] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Telefon (İsteğe Bağlı)</label>
                  <input 
                    type="tel" 
                    placeholder="Örn. 0532 123 45 67" 
                    value={newPartPhone}
                    onChange={(e) => setNewPartPhone(e.target.value)}
                    className="glass-input-distinct w-full p-[10px_14px] rounded-xl text-[0.92rem] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Etkinlik Seçin</label>
                <select
                  value={newPartEventId}
                  onChange={(e) => setNewPartEventId(e.target.value)}
                  required
                  className="glass-input-distinct w-full p-[10px_14px] rounded-xl text-[0.92rem] outline-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[var(--glass-bg-strong)] text-[var(--text-muted)]">Bir Etkinlik Seçin...</option>
                  {events.map(e => (
                    <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2 Content */}
          {wizardStep === 2 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] p-5 rounded-[18px] border border-white/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-[var(--color-blue-medium)]">
                  <Camera size={16} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-[0.9rem] font-bold text-white flex items-center gap-1.5">
                    <span className="text-[var(--color-blue-medium)] font-extrabold">Adım 2:</span>
                    <span className="text-white font-bold">Yüz Tanımlama</span>
                  </div>
                  <span className="text-[0.72rem] text-slate-400">Katılımcının AI eşleştirmesinde kullanılacak biyometrik selfiesini yükleyin veya çekin.</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {/* Toggle Button Group */}
                <div className="flex gap-2 p-1 bg-slate-950/60 border border-white/10 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      setSelfieMode("upload");
                    }}
                    className={`p-[6px_14px] text-[0.76rem] font-bold rounded-lg cursor-pointer transition-all border-none ${selfieMode === "upload" ? "bg-[var(--color-blue-dark)] text-white shadow-sm" : "text-slate-300 hover:text-white bg-transparent"}`}
                  >
                    📁 Dosya Yükle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelfieMode("camera");
                      startCamera();
                    }}
                    className={`p-[6px_14px] text-[0.76rem] font-bold rounded-lg cursor-pointer transition-all border-none ${selfieMode === "camera" ? "bg-[var(--color-blue-dark)] text-white shadow-sm" : "text-slate-300 hover:text-white bg-transparent"}`}
                  >
                    📷 Kamera Aç
                  </button>
                </div>

                {/* Selfie Mode: Upload */}
                {selfieMode === "upload" && (
                  <div className="mt-1">
                    {capturedPhoto ? (
                      <div className="flex items-center gap-4 p-3 bg-white/5 border border-[var(--glass-border)] rounded-xl">
                        <img src={capturedPhoto} alt="Uploaded preview" className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-sm" />
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[0.78rem] text-white font-semibold">Selfie Dosyası Yüklendi</span>
                          <button
                            type="button"
                            onClick={() => setCapturedPhoto(null)}
                            className="text-[0.72rem] text-red-400 hover:text-red-300 font-bold w-fit bg-transparent border-none cursor-pointer p-0 text-left"
                          >
                            Fotoğrafı Kaldır
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          onClick={() => modalFileInputRef.current?.click()}
                          className="border border-dashed border-white/20 hover:border-blue-400/50 bg-slate-950/40 hover:bg-slate-900/60 rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center gap-2"
                        >
                          <UploadCloud size={24} className="text-blue-400" />
                          <span className="text-[0.78rem] text-slate-200 font-bold">Cihazınızdan bir selfie (JPEG, PNG) seçin</span>
                          <span className="text-[0.68rem] text-slate-400 font-medium">Dosyayı seçmek için buraya tıklayın</span>
                        </div>
                        <input 
                          type="file" 
                          ref={modalFileInputRef} 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => setCapturedPhoto(reader.result);
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden" 
                        />
                      </>
                    )}
                  </div>
                )}

                {/* Selfie Mode: Camera */}
                {selfieMode === "camera" && (
                  <div className="mt-1 flex flex-col items-center gap-3 w-full">
                    {capturedPhoto ? (
                      <div className="flex items-center gap-4 p-3 bg-white/5 border border-[var(--glass-border)] rounded-xl w-full">
                        <img src={capturedPhoto} alt="Captured preview" className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-sm" />
                        <div className="flex flex-col gap-1 text-left">
                          <span className="text-[0.78rem] text-[var(--text-main)] font-semibold">Fotoğraf Başarıyla Çekildi</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCapturedPhoto(null);
                              startCamera();
                            }}
                            className="text-[0.72rem] text-[var(--color-blue-dark)] hover:brightness-110 font-bold w-fit bg-transparent border-none cursor-pointer p-0 text-left"
                          >
                            Yeniden Fotoğraf Çek
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black flex items-center justify-center">
                        {cameraStream ? (
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover scale-x-[-1]"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-[var(--text-muted)] text-[0.78rem] p-4">
                            <RefreshCw size={20} className="animate-spin text-[var(--color-blue-dark)]" />
                            <span>Kamera başlatılıyor...</span>
                          </div>
                        )}
                        
                        {cameraStream && (
                          <button
                            type="button"
                            onClick={capturePhoto}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-[8px_16px] bg-[var(--color-blue-dark)] hover:brightness-110 text-white text-[0.76rem] font-bold rounded-xl shadow-md border-none cursor-pointer active:scale-95 transition-all"
                          >
                            📸 Fotoğrafı Çek
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 Content */}
          {wizardStep === 3 && (
            <div className="flex flex-col gap-4 animate-fade-in bg-white/[0.04] p-5 rounded-[18px] border border-white/5">
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-[var(--accent-green)]">
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col text-left">
                  <div className="text-[0.9rem] font-bold text-white flex items-center gap-1.5">
                    <span className="text-[var(--accent-green)] font-extrabold">Adım 3:</span>
                    <span className="text-white font-bold">Onay ve KVKK</span>
                  </div>
                  <span className="text-[0.72rem] text-slate-400">Katılımcı kaydını doğrulamak için KVKK iznini onaylayın.</span>
                </div>
              </div>

              {/* Summary card */}
              <div className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-white/5 border border-[var(--glass-border)] rounded-xl">
                <img src={capturedPhoto} alt="Captured preview" className="w-16 h-16 rounded-xl object-cover border border-white/20 shadow-sm shrink-0" />
                <div className="flex flex-col gap-1 text-[0.8rem] text-left w-full overflow-hidden">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-slate-400">Katılımcı:</span>
                    <strong className="text-white truncate max-w-[160px]">{newPartName}</strong>
                  </div>
                  {newPartEmail && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">E-posta:</span>
                      <span className="text-slate-200 truncate max-w-[160px]">{newPartEmail}</span>
                    </div>
                  )}
                  {newPartPhone && (
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-slate-400">Telefon:</span>
                      <span className="text-slate-200">{newPartPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Etkinlik:</span>
                    <span className="text-indigo-400 font-semibold truncate max-w-[160px]">{getEventName(newPartEventId)}</span>
                  </div>
                </div>
              </div>

              {/* KVKK consent checkbox */}
              <label className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/25 rounded-xl cursor-pointer select-none transition-all hover:bg-emerald-500/10">
                <input 
                  type="checkbox" 
                  checked={kvkkConsent} 
                  onChange={(e) => setKvkkConsent(e.target.checked)} 
                  className="mt-0.5 rounded border-[var(--glass-border)] bg-slate-900 text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-[0.74rem] text-slate-300 leading-normal text-left">
                  Katılımcı {new Date().toLocaleDateString("tr-TR")} tarihinde biyometrik yüz verilerinin aranması, galerinin eşleştirilmesi ve KVKK Aydınlatma Metninde belirtilen amaçlarla işlenmesi için <strong>açık rıza göstermiştir.</strong>
                </span>
              </label>
            </div>
          )}
        </div>
      </GlassModal>
    </div>
  );
}
