import React, { useEffect, useState, useRef } from "react";
import GlassCard from "../components/ui/GlassCard";
import { 
  Sparkles, 
  Download, 
  Share2, 
  X, 
  ImageOff, 
  Info, 
  MessageSquare,
  Camera,
  UploadCloud,
  RefreshCw,
  Mail,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  Sliders
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import { motion, AnimatePresence } from "framer-motion";

export default function MyPhotos() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [event, setEvent] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);
    const [participantRecord, setParticipantRecord] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [activeIndex, setActiveIndex] = useState(0);

    const refreshUserData = () => {
        const allEvents = mockApi.getEvents();
        const ev = allEvents.find((e) => e.qr_token === user?.eventToken) || allEvents[0];
        setEvent(ev || null);

        const allParticipants = mockApi.getParticipants();
        const found = allParticipants.find(
            (p) => p.display_name === user?.name || p.email === user?.email
        );
        if (found) {
            setParticipantRecord(found);
            const evMatches = mockApi.getMatches().filter(
                (m) => m.participant_id === found.id && (m.status === 'approved' || m.status === 'auto_approved')
            );
            const allPhotos = mockApi.getPhotos();
            const matchedPhotos = evMatches.map(m => allPhotos.find(p => p.id === m.photo_id)).filter(Boolean);
            setPhotos(matchedPhotos);
        } else {
            if (ev) {
                const evPhotos = mockApi.getPhotos(ev.id) || [];
                setPhotos(evPhotos.slice(0, 6));
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshUserData();
    }, [user]);

    const handleRealSelfieUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file || !participantRecord) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64Url = reader.result;
            const updatedParticipant = mockApi.updateParticipantSelfie(participantRecord.id, base64Url);
            if (updatedParticipant) {
                refreshUserData();
                alert("Selfie fotoğrafınız başarıyla yüklendi! Yapay zeka eşleşen yeni fotoğraflarınızı arıyor...");
            }
        };
        reader.readAsDataURL(file);
    };

    const handleTriggerMockSelfie = () => {
        if (!participantRecord) return;
        const presetSelfies = [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
        ];
        const randomSelfie = presetSelfies[Math.floor(Math.random() * presetSelfies.length)];
        const updatedParticipant = mockApi.updateParticipantSelfie(participantRecord.id, randomSelfie);
        if (updatedParticipant) {
            refreshUserData();
        }
    };

    const downloadImage = async (url, name) => {
        try {
            const res = await fetch(url, { mode: "cors" });
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = name || "snapmatch.jpg";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(objectUrl);
        } catch {
            window.open(url, "_blank", "noopener");
        }
    };

    const shareImage = async (url) => {
        if (navigator.share) {
            try {
                await navigator.share({ title: event?.title || "Snapmatch", text: "Snapmatch fotoğrafım", url });
                return;
            } catch {
                /* iptal */
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            alert("Fotoğraf bağlantısı panoya kopyalandı.");
        } catch {
            window.open(url, "_blank", "noopener");
        }
    };

    const firstName = (user?.name || "").split(" ")[0];

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="page-head !mb-0">
                    <h1 className="font-extrabold">Fotoğraflarım</h1>
                    <p>
                        {event ? (
                            <>
                                <strong className="text-[var(--text-main)]">{event.title}</strong> etkinliğinde sana özel eşleşen fotoğraflar.
                            </>
                        ) : (
                            "Sana özel eşleşen fotoğraflar."
                        )}
                    </p>
                </div>
                <button 
                    onClick={() => navigate("/messages")}
                    className="primary-btn gap-2 py-2 px-4 text-[0.82rem] font-bold rounded-xl shrink-0 self-start sm:self-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95 flex items-center"
                >
                    <MessageSquare size={16} />
                    <span>Organizatörle İletişime Geç</span>
                </button>
            </div>

            {/* Bilgi kartı */}
            <GlassCard className="p-[var(--space-md)] flex items-start gap-3">
                <div
                    className="w-10 h-10 rounded-[12px] grid place-items-center shrink-0"
                    style={{ color: "var(--color-blue-dark)", background: "color-mix(in srgb, var(--color-blue-dark) 14%, transparent)" }}
                >
                    <Info size={18} />
                </div>
                <div className="text-[0.85rem] text-[var(--text-muted)] leading-[1.5]">
                    Merhaba {firstName || "Misafir"}! Yalnızca sana ait onaylı eşleşmeleri görürsün. Daha isabetli sonuç için
                    yüz tarama fotoğrafını (selfie) güncelleyebilirsin.
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
                
                {/* Sol Sütun - Galeri */}
                <GlassCard className="p-[var(--space-lg)] h-fit">
                    <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-3 mb-4">
                        <div className="flex items-center gap-1.5">
                            <Sparkles size={16} className="text-purple-600 animate-pulse" />
                            <strong className="text-[0.95rem] font-bold">Eşleşen Fotoğraflar</strong>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {photos.length > 0 && (
                                <div className="flex bg-black/5 p-0.5 rounded-lg border border-black/5">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-md cursor-pointer transition-colors border-none flex items-center justify-center ${
                                            viewMode === "grid" ? "bg-white text-stone-900 shadow-sm" : "bg-transparent text-stone-500 hover:text-stone-950"
                                        }`}
                                        title="Izgara Görünümü"
                                    >
                                        <Grid size={15} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewMode("carousel");
                                            setActiveIndex(0);
                                        }}
                                        className={`p-1.5 rounded-md cursor-pointer transition-colors border-none flex items-center justify-center ${
                                            viewMode === "carousel" ? "bg-white text-stone-900 shadow-sm" : "bg-transparent text-stone-500 hover:text-stone-950"
                                        }`}
                                        title="3D Slayt Görünümü"
                                    >
                                        <Sliders size={15} />
                                    </button>
                                </div>
                            )}
                            <span className="text-[0.78rem] font-bold text-[var(--text-muted)]">{photos.length} Fotoğraf</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-[150px] rounded-[12px] bg-black/5 animate-pulse" />
                            ))}
                        </div>
                    ) : photos.length === 0 ? (
                        <div className="flex flex-col items-center text-center py-10 text-[var(--text-muted)]">
                            <ImageOff size={40} className="mb-3 opacity-70" />
                            <p className="m-0 text-[0.9rem]">Henüz eşleşen fotoğraf yok. Selfie yüklediğinizde eşleşmeler burada listelenecektir.</p>
                        </div>
                    ) : viewMode === "carousel" ? (
                        <div className="p-2 text-stone-800 select-none flex flex-col items-center relative overflow-hidden min-h-[400px] justify-center">
                            
                            {/* carousel wrapper */}
                            <div className="w-full max-w-[280px] mt-2 mb-10 overflow-visible relative flex justify-center">
                                {/* slides container */}
                                <motion.div 
                                    className="flex w-fit items-center justify-center" 
                                    animate={{ x: -activeIndex * 280 }}
                                    transition={{ type: 'spring', bounce: 0.15, duration: 0.8 }}
                                    style={{ transformOrigin: "center" }}
                                >
                                    {photos.map((photo, i) => {
                                        const isActive = activeIndex === i;
                                        return (
                                            <div className="perspective-midrange relative flex justify-center items-center" key={photo.id} style={{ width: "280px", flexShrink: 0 }}>
                                                <motion.div 
                                                    className="w-full aspect-[3/4] flex flex-col items-center gap-3 will-change-[transform,scale]"
                                                    animate={{ 
                                                        rotateY: (activeIndex - i) * 55, 
                                                        scale: isActive ? 1 : 0.82,
                                                        z: isActive ? 0 : -100
                                                    }}
                                                    transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
                                                >
                                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-black/5 border border-black/10 shadow-lg relative group">
                                                        <img 
                                                            src={photo.thumbnail_url} 
                                                            alt="3D Slide" 
                                                            className="w-full h-full object-cover cursor-zoom-in" 
                                                            onClick={() => setActiveIndex(i)} 
                                                        />
                                                        
                                                        {isActive && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setLightbox(photo);
                                                                }}
                                                                className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-colors cursor-zoom-in flex items-center justify-center group/btn border-none"
                                                            >
                                                                <span className="opacity-0 group-hover/btn:opacity-100 bg-white/90 text-stone-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-opacity duration-200">Büyüt</span>
                                                            </button>
                                                        )}

                                                        <span
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                downloadImage(photo.original_url, photo.filename);
                                                            }}
                                                            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/65 hover:bg-black/80 text-white grid place-items-center hover:scale-105 transition-all shadow-md cursor-pointer"
                                                            title="İndir"
                                                        >
                                                            <Download size={14} />
                                                        </span>
                                                    </div>

                                                    <motion.div 
                                                        className="text-xs md:text-sm font-bold text-stone-800 whitespace-nowrap will-change-[opacity,filter] mt-1" 
                                                        animate={{ filter: isActive ? 'blur(0)' : 'blur(2px)', opacity: isActive ? 1 : 0 }}
                                                    >
                                                        {photo.filename || `Fotoğraf #${i + 1}`}
                                                    </motion.div>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            {/* controls */}
                            <div className="flex items-center gap-4 justify-center text-stone-700 rounded-full bg-black/5 border border-black/5 shadow-sm p-1.5 max-w-xs w-full">
                                {/* prev button */}
                                <button 
                                    onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))} 
                                    disabled={activeIndex === 0}
                                    className="p-1.5 cursor-pointer rounded-full hover:bg-white text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                
                                {/* slide dots */}
                                <div className="flex-grow flex justify-center items-center gap-1.5 overflow-hidden px-2">
                                    {photos.map((_, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setActiveIndex(i)}
                                            className={`rounded-full cursor-pointer h-1.5 transition-all duration-300 ${activeIndex === i ? 'w-5 bg-stone-800' : 'w-1.5 bg-stone-800/30 hover:bg-stone-800/50'}`}
                                        />
                                    ))}
                                </div>
                                
                                {/* next button */}
                                <button 
                                    onClick={() => setActiveIndex(prev => Math.min(photos.length - 1, prev + 1))} 
                                    disabled={activeIndex === photos.length - 1}
                                    className="p-1.5 cursor-pointer rounded-full hover:bg-white text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {photos.map((photo) => (
                                <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => setLightbox(photo)}
                                    className="relative h-[150px] rounded-[12px] overflow-hidden border border-[var(--glass-border)] cursor-pointer p-0 group animate-[fadeIn_0.3s_ease]"
                                >
                                    <img
                                        src={photo.thumbnail_url}
                                        alt="eşleşme"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            downloadImage(photo.original_url, photo.filename);
                                        }}
                                        className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/65 text-white grid place-items-center hover:scale-105 transition-transform"
                                        title="İndir"
                                    >
                                        <Download size={14} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </GlassCard>

                {/* Sağ Sütun - Katılımcı Kartı */}
                <div>
                    {participantRecord ? (
                        <GlassCard 
                          title="Katılımcı Kartı" 
                          action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
                          className="glass-panel flex flex-col gap-5"
                        >
                          {/* Profile Preview */}
                          <div className="flex flex-col items-center text-center py-2.5 gap-1.5 w-full">
                            {participantRecord.selfie_url ? (
                              <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-3 border-[var(--color-blue-dark)]">
                                <img src={participantRecord.selfie_url} alt="selfie" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-[100px] h-[100px] rounded-full bg-[var(--glass-border)] grid place-items-center text-[1.8rem] font-bold">
                                {participantRecord.display_name.charAt(0)}
                              </div>
                            )}
                            <h3 className="m-0 mb-1 text-[1.15rem] font-extrabold text-center w-full truncate" title={participantRecord.display_name}>
                              {participantRecord.display_name}
                            </h3>
                            <span className="bg-[var(--glass-border)] p-[2.5px_10px] rounded-[10px] text-[0.72rem] font-bold text-[var(--text-muted)] whitespace-nowrap self-center">ID: {participantRecord.id}</span>
                          </div>

                          {/* Info Rows */}
                          <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4">
                            <div className="flex items-center gap-2.5 text-[0.85rem]">
                              <Mail size={16} className="text-[var(--text-muted)]" />
                              <span className="text-[var(--text-muted)]">Email:</span>
                              <strong className="ml-auto text-right truncate max-w-[180px]" title={participantRecord.email || "-"}>
                                {participantRecord.email || "-"}
                              </strong>
                            </div>
                            <div className="flex items-center gap-2.5 text-[0.85rem]">
                              <Calendar size={16} className="text-[var(--text-muted)]" />
                              <span className="text-[var(--text-muted)]">Etkinlik:</span>
                              <strong className="ml-auto text-right truncate max-w-[180px]" title={event?.title || "-"}>
                                {event?.title || "-"}
                              </strong>
                            </div>
                          </div>

                          {/* Selfie / Yüz Fotoğrafı Yükleme Alanı */}
                          <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4">
                            <div className="flex items-center gap-2">
                              <Camera size={16} className="text-[var(--color-blue-dark)]" />
                              <span className="text-[0.78rem] font-extrabold tracking-wider text-[var(--text-muted)] uppercase">Yüz Tarama Fotoğrafı (Selfie)</span>
                            </div>
                            
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleRealSelfieUpload} 
                            />

                            {participantRecord.selfie_url ? (
                              <div className="flex flex-col gap-2">
                                <div className="text-[0.76rem] text-[var(--text-muted)] leading-relaxed text-left">
                                  Mevcut yüz taramanız sisteme tanımlıdır. Bilgisayarınızdan yeni bir fotoğraf yükleyerek güncelleyebilirsiniz.
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
                                    onClick={handleTriggerMockSelfie}
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
                                  Fotoğraflarınızla eşleşme yapılabilmesi için bir yüz fotoğrafınızı yükleyin.
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
                                    onClick={handleTriggerMockSelfie}
                                    className="secondary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] w-full flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <RefreshCw size={14} />
                                    <span>Simülasyon Fotoğrafı Yükle</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                        </GlassCard>
                    ) : (
                        <GlassCard className="glass-panel p-6 text-center text-[var(--text-muted)] text-[0.85rem]">
                            Profil verileriniz yükleniyor...
                        </GlassCard>
                    )}
                </div>

            </div>

            {/* Lightbox */}
            {lightbox && (
                <div onClick={() => setLightbox(null)} className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4">
                    <button
                        onClick={() => setLightbox(null)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white grid place-items-center cursor-pointer border-none"
                        title="Kapat"
                    >
                        <X size={20} />
                    </button>
                    <div onClick={(e) => e.stopPropagation()} className="max-w-[640px] w-full">
                        <img
                            src={lightbox.original_url}
                            alt={lightbox.filename || "foto"}
                            className="w-full max-h-[72vh] object-contain rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                        />
                        <div className="flex gap-2 justify-center mt-4">
                            <button onClick={() => downloadImage(lightbox.original_url, lightbox.filename)} className="primary-btn justify-center gap-2 px-5">
                                <Download size={16} />
                                <span>İndir</span>
                            </button>
                            <button onClick={() => shareImage(lightbox.original_url)} className="secondary-btn justify-center gap-2 px-5">
                                <Share2 size={16} />
                                <span>Paylaş</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}