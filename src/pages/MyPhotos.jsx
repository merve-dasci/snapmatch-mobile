import React, { useEffect, useState, useRef } from "react";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { 
  Sparkles, 
  Download, 
  Share2, 
  X, 
  ImageOff, 
  Info, 
  Camera,
  UploadCloud,
  RefreshCw,
  Mail,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid,
  Sliders,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../context/ToastContext";
import { useDispatch } from "react-redux";
import { deleteParticipantFaceData } from "../features/participants/participantsSlice";

export default function MyPhotos() {
    const { user, logout } = useAuth();
    const { showToast, showConfirm } = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    
    // Demo Onboarding Steps: 1 (QR Giriş), 2 (Onay/KVKK), 3 (Selfie), 4 (Fotoğraflar)
    const [step, setStep] = useState(1);
    const [qrToken, setQrToken] = useState("");
    const [consentAccepted, setConsentAccepted] = useState(false);

    const [event, setEvent] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);
    const [participantRecord, setParticipantRecord] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [activeIndex, setActiveIndex] = useState(0);

    // Album List States
    const [albums, setAlbums] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [slideDirection, setSlideDirection] = useState(0);

    // Live Camera States
    const videoRef = useRef(null);
    const [cameraStream, setCameraStream] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const handleDeleteFaceData = () => {
        showConfirm(
            "Yüz biyometrik verilerinizi ve tüm eşleşmelerinizi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.",
            () => {
                if (participantRecord?.id) {
                    dispatch(deleteParticipantFaceData(participantRecord.id))
                        .unwrap()
                        .then(() => {
                            showToast("Yüz verileriniz silindi. Rızanız geri çekildi.", "success");
                            setPhotos([]);
                            setParticipantRecord(null);
                            logout();
                            navigate("/");
                        })
                        .catch((err) => {
                            showToast(err || "İşlem başarısız.", "error");
                        });
                } else {
                    showToast("Kayıtlı yüz veriniz bulunamadı.", "warning");
                }
            }
        );
    };

    const refreshUserData = () => {
        const allEvents = mockApi.getEvents();
        const ev = allEvents.find((e) => e.qr_token === user?.eventToken || e.qr_token === qrToken) || allEvents[0];
        setEvent(ev || null);

        const allParticipants = mockApi.getParticipants();
        let found = allParticipants.find(
            (p) => p.display_name === user?.name || p.email === user?.email
        );
        
        if (!found && user) {
            found = mockApi.createParticipant(
                ev?.id || "evt_1",
                user.name || "Zeynep Kaya",
                ""
            );
        }
        
        let matchedPhotosList = [];
        if (found) {
            setParticipantRecord(found);
            const evMatches = mockApi.getMatches().filter(
                (m) => m.participant_id === found.id && (m.status === 'approved' || m.status === 'auto_approved')
            );
            const allPhotos = mockApi.getPhotos();
            matchedPhotosList = evMatches.map(m => allPhotos.find(p => p.id === m.photo_id)).filter(Boolean);
            setPhotos(matchedPhotosList);
        } else {
            if (ev) {
                const evPhotos = mockApi.getPhotos(ev.id) || [];
                matchedPhotosList = evPhotos.slice(0, 6);
                setPhotos(matchedPhotosList);
            }
        }

        // Populate Albums List (main album + a mock prep album)
        const mainAlbum = {
            id: "album_1",
            title: ev?.title || "Zeynep & Can Düğünü",
            subtitle: "Düğün Töreni & Kutlama",
            cover: matchedPhotosList[0]?.thumbnail_url || ev?.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80",
            photos: matchedPhotosList,
            date: ev?.date || "2026-07-10",
            location: ev?.location || "Kadıköy, İstanbul"
        };
        const preparationAlbum = {
            id: "album_2",
            title: "Dış Çekim & Hazırlık",
            subtitle: "Düğün Öncesi Albümü",
            cover: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=80",
            photos: [
                { id: "p_prep_1", thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80", original_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80", filename: "hazirlik_1.jpg" },
                { id: "p_prep_2", thumbnail_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&auto=format&fit=crop&q=80", original_url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80", filename: "hazirlik_2.jpg" },
                { id: "p_prep_3", thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80", original_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", filename: "hazirlik_3.jpg" }
            ],
            date: "2026-07-09",
            location: "Atatürk Arboretumu"
        };
        setAlbums([mainAlbum, preparationAlbum]);
        setLoading(false);
    };

    useEffect(() => {
        refreshUserData();
    }, [user, qrToken]);

    const handleQrSubmit = (e) => {
        e.preventDefault();
        if (!qrToken.trim()) {
            showToast("Lütfen geçerli bir etkinlik kodu girin veya mock butona basın.", "warning");
            return;
        }
        // Validate mock token
        const foundEvent = mockApi.getEvents().find(e => e.qr_token === qrToken.trim());
        if (!foundEvent) {
            showToast("Etkinlik bulunamadı. Lütfen kodun doğru olduğundan emin olun.", "error");
            return;
        }
        setEvent(foundEvent);
        showToast("QR Etkinlik Sayfasına başarıyla girildi!", "success");
        setStep(2);
    };

    const triggerQuickQrMock = () => {
        const defaultToken = user?.eventToken || "ev_token_zeynep_can";
        setQrToken(defaultToken);
        const foundEvent = mockApi.getEvents().find(e => e.qr_token === defaultToken);
        setEvent(foundEvent || null);
        showToast("QR Kod okuma simüle edildi. Kod: " + defaultToken, "info");
        setStep(2);
    };

    const handleAcceptConsent = () => {
        if (!consentAccepted) {
            showToast("Devam etmek için onay metnini kabul etmelisiniz.", "warning");
            return;
        }
        showToast("KVKK onay metni kabul edildi.", "success");
        setStep(3);
    };

    const handleRealSelfieUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file || !participantRecord) return;
        const reader = new FileReader();
        reader.onload = () => {
            const base64Url = reader.result;
            const updatedParticipant = mockApi.updateParticipantSelfie(participantRecord.id, base64Url);
            if (updatedParticipant) {
                refreshUserData();
                showToast("Selfie fotoğrafınız başarıyla yüklendi!", "success");
                setStep(4);
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
            showToast("Simüle selfie yüklendi ve yapay zeka eşleşmeleri bulundu!", "success");
            setStep(4);
        }
    };

    const restartDemoFlow = () => {
        setStep(1);
        setQrToken("");
        setConsentAccepted(false);
        setSelectedAlbumId(null);
        handleCloseCamera();
        showToast("Demo akışı baştan başlatıldı.", "info");
    };

    const handleOpenStream = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            setCameraStream(stream);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            showToast("Kameraya erişim izni verilmedi veya kamera bulunamadı.", "error");
            setIsCameraActive(false);
        }
    };

    const handleCapture = () => {
        if (!videoRef.current || !participantRecord) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth || 480;
        canvas.height = videoRef.current.videoHeight || 640;
        const ctx = canvas.getContext("2d");
        
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        
        handleCloseCamera();
        
        const updatedParticipant = mockApi.updateParticipantSelfie(participantRecord.id, dataUrl);
        if (updatedParticipant) {
            refreshUserData();
            showToast("Selfie fotoğrafınız kamera ile başarıyla çekildi!", "success");
            setStep(4);
        }
    };

    const handleCloseCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
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
            showToast("Fotoğraf bağlantısı panoya kopyalandı.", "info");
        } catch {
            window.open(url, "_blank", "noopener");
        }
    };

    const selectedAlbum = albums.find(a => a.id === selectedAlbumId);
    const albumPhotos = selectedAlbum ? selectedAlbum.photos : [];

    const slideVariants = {
        enter: (dir) => ({
            x: dir > 0 ? 150 : -150,
            opacity: 0,
            scale: 0.96
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: (dir) => ({
            x: dir < 0 ? 150 : -150,
            opacity: 0,
            scale: 0.96,
            transition: { duration: 0.25, ease: "easeIn" }
        })
    };

    const firstName = (user?.name || "").split(" ")[0];

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="page-head !mb-0">
                    <h1 className="font-extrabold text-[var(--text-main)]">Fotoğraflarım</h1>
                    <p className="text-[var(--text-muted)]">
                        {event ? (
                            <>
                                <strong className="text-[var(--text-main)]">{event.title}</strong> albümündeki size özel anılar.
                            </>
                        ) : (
                            "Etkinlik albümündeki size özel anılar."
                        )}
                    </p>
                </div>
                {step === 4 && (
                    <div className="flex gap-2.5 self-start sm:self-auto flex-wrap">
                        <button 
                            onClick={() => navigate("/messages")}
                            className="primary-btn gap-2.5 py-2.5 px-4 text-[0.82rem] font-bold rounded-xl flex items-center cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md shadow-blue-500/10"
                        >
                            <MessageSquare size={16} />
                            <span>Organizatörle İletişime Geç</span>
                        </button>
                        <button 
                            onClick={restartDemoFlow}
                            className="secondary-btn gap-2 py-2 px-4 text-[0.82rem] font-bold rounded-xl flex items-center cursor-pointer border border-white/10"
                        >
                            <RefreshCw size={14} />
                            <span>Demo Akışını Yeniden Başlat</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Step Onboarding Indicators */}
            <div className="flex items-center justify-between max-w-[620px] mx-auto w-full mb-4 bg-white/5 border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                {[
                    { number: 1, label: "QR Giriş", icon: QrCode },
                    { number: 2, label: "Açık Rıza", icon: ShieldCheck },
                    { number: 3, label: "Selfie Yükle", icon: Camera },
                    { number: 4, label: "Fotoğraflarım", icon: Sparkles }
                ].map((s) => {
                    const isPassed = step > s.number;
                    const isActive = step === s.number;
                    return (
                        <div key={s.number} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all">
                            <div 
                                className="w-8 h-8 rounded-full grid place-items-center font-bold text-xs"
                                style={{
                                    background: isPassed ? "var(--accent-green)" : isActive ? "var(--color-blue-dark)" : "rgba(255,255,255,0.06)",
                                    color: isPassed || isActive ? "white" : "var(--text-muted)"
                                }}
                            >
                                <s.icon size={14} />
                            </div>
                            <span className={`text-[0.74rem] font-bold max-sm:hidden ${isActive ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* STEP CONTROLLERS */}
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-[500px] mx-auto w-full"
                    >
                        <GlassCard className="p-8 flex flex-col gap-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-[var(--color-blue-dark)] mx-auto grid place-items-center border border-white/10">
                                <QrCode size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-white">QR ile Etkinlik Sayfasına Giriş</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                                    QR kodunu okutarak veya size verilen etkinlik davet token'ını girerek albüme giriş yapın.
                                </p>
                            </div>

                            <form onSubmit={handleQrSubmit} className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Davet Kodu (Örn: ev_token_zeynep_can)"
                                    value={qrToken}
                                    onChange={(e) => setQrToken(e.target.value)}
                                    className="w-full glass-input-distinct rounded-[14px] p-3.5 text-xs text-center outline-none text-white font-semibold tracking-wider"
                                />
                                <div className="flex gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={triggerQuickQrMock}
                                        className="secondary-btn flex-1 py-3 text-xs font-bold rounded-[14px] flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <QrCode size={14} />
                                        <span>QR Kodu Okut (Simüle)</span>
                                    </button>
                                    <button
                                        type="submit"
                                        className="primary-btn flex-1 py-3 text-xs font-bold rounded-[14px] flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <span>Giriş Yap</span>
                                        <ArrowRight size={14} />
                                    </button>
                                </div>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-[540px] mx-auto w-full"
                    >
                        <GlassCard className="p-8 flex flex-col gap-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-[var(--accent-green)] mx-auto grid place-items-center border border-white/10">
                                <ShieldCheck size={28} />
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-extrabold text-white">Yüz Verisi İşleme Açık Rıza ve Onay Metni</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                                    Snapmatch AI ile fotoğraflarınızın eşleştirilebilmesi için KVKK kapsamında onayınız gerekmektedir.
                                </p>
                            </div>

                            <div 
                                className="rounded-[16px] p-5 max-h-[190px] overflow-y-auto custom-scrollbar text-[0.78rem] leading-relaxed text-left shadow-inner backdrop-blur-md"
                                style={{
                                    background: "var(--glass-bg-strong)",
                                    border: "1px solid var(--glass-border)",
                                    color: "var(--text-main)"
                                }}
                            >
                                <p className="m-0 mb-3 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider animate-[pulse_3s_infinite]" style={{ color: "var(--accent-yellow)" }}>
                                    <Info size={14} className="shrink-0" />
                                    <span>KVKK Aydınlatma ve Açık Rıza Beyanı</span>
                                </p>
                                <p className="m-0 mb-2.5">
                                    <strong>Snapmatch AI</strong> platformu, etkinlik sahiplerinin yüklediği fotoğraflar içerisinden sizin göründüğünüz anları tespit etmek amacıyla <strong>yüz biyometrisi karşılaştırma teknolojilerini</strong> kullanır.
                                </p>
                                <p className="m-0 mb-2.5">
                                    Sisteme yükleyeceğiniz selfie fotoğrafı, <strong>yalnızca bu etkinlik kapsamındaki fotoğraflarla eşleştirme yapmak amacıyla</strong> işlenmektedir. Yüz şablonunuz başka hiçbir amaçla kullanılmaz, üçüncü taraflarla paylaşılmaz ve etkinlik tamamlandığında <strong>kalıcı olarak sistemden silinir</strong>.
                                </p>
                                <p className="m-0 font-bold" style={{ color: "var(--accent-green)" }}>
                                    Onay metnini kabul ederek bu verilerin işlenmesine ve eşleşmelerin yapılmasına açık rıza verdiğinizi beyan edersiniz.
                                </p>
                            </div>

                            <label 
                                className="flex items-start gap-3 cursor-pointer text-left select-none p-3.5 rounded-xl transition-all active:scale-[0.99]"
                                style={{
                                    background: "var(--glass-bg-strong)",
                                    border: "1px solid var(--glass-border)",
                                    color: "var(--text-main)"
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={consentAccepted}
                                    onChange={(e) => setConsentAccepted(e.target.checked)}
                                    className="mt-0.5 accent-emerald-500 w-4 h-4 cursor-pointer shrink-0"
                                />
                                <span className="text-xs font-extrabold leading-relaxed">
                                    KVKK aydınlatma metnini okudum. Yüz biyometrisi verilerimin işlenerek eşleşen fotoğraflarımın bana gösterilmesini kabul ediyorum.
                                </span>
                            </label>

                            <div className="flex gap-3 mt-1.5 border-t border-white/10 pt-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="secondary-btn flex-1 py-3 text-xs font-bold rounded-[14px] cursor-pointer"
                                >
                                    Geri Dön
                                </button>
                                <button
                                    onClick={handleAcceptConsent}
                                    disabled={!consentAccepted}
                                    className="primary-btn flex-1 py-3 text-xs font-bold rounded-[14px] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <span>Onayla ve Devam Et</span>
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="max-w-[500px] mx-auto w-full"
                    >
                        <GlassCard className="p-8 flex flex-col gap-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-[var(--color-blue-dark)] mx-auto grid place-items-center border border-white/10">
                                <Camera size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-extrabold text-white">Selfie / Yüz Kaydı Yükleyin</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-1.5 leading-relaxed">
                                    Yapay zekanın albümde sizi bulabilmesi için net, cepheden çekilmiş bir selfie fotoğrafınızı yükleyin.
                                </p>
                            </div>

                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleRealSelfieUpload} 
                            />

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleOpenStream}
                                    className="primary-btn py-3.5 text-xs font-bold rounded-[14px] w-full flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none shadow-md shadow-blue-500/10"
                                >
                                    <Camera size={16} />
                                    <span>Kamerayı Aç & Fotoğraf Çek</span>
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="secondary-btn py-3.5 text-xs font-bold rounded-[14px] w-full flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                                >
                                    <UploadCloud size={16} />
                                    <span>Dosyadan Fotoğraf Yükle</span>
                                </button>
                                <button
                                    onClick={handleTriggerMockSelfie}
                                    className="bg-transparent border-none text-slate-400 hover:text-white text-[11px] font-bold mt-1 cursor-pointer flex items-center justify-center gap-1 mx-auto"
                                >
                                    <RefreshCw size={11} />
                                    <span>Simülasyon Selfie Yükle (Mock)</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="bg-transparent border-none text-slate-400 hover:text-white text-xs font-bold mt-2 cursor-pointer"
                            >
                                Geri Dön
                            </button>
                        </GlassCard>
                    </motion.div>
                )}

                {step === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)] w-full"
                    >
                        {/* Sol Sütun - Galeri (Albümler veya Seçilen Albüm Detayı) */}
                        <GlassCard className="p-[var(--space-lg)] h-fit min-h-[460px]">
                            <AnimatePresence mode="wait">
                                {selectedAlbumId ? (
                                    <motion.div
                                        key={selectedAlbumId}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -50, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        className="flex flex-col gap-5"
                                    >
                                        {/* Seçilen Albüm Üst Bilgisi */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[var(--glass-border)] pb-3.5 gap-3">
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => setSelectedAlbumId(null)}
                                                    className="secondary-btn p-2 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5"
                                                    title="Albümlere Dön"
                                                >
                                                    <ChevronLeft size={16} />
                                                </button>
                                                <div className="text-left">
                                                    <h3 className="m-0 text-[0.92rem] font-black text-white leading-normal">{selectedAlbum.title}</h3>
                                                    <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">{selectedAlbum.location} &bull; {selectedAlbum.date}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                                {albumPhotos.length > 0 && (
                                                    <div className="flex bg-black/5 p-0.5 rounded-lg border border-black/5">
                                                        <button
                                                            onClick={() => setViewMode("grid")}
                                                            className={`p-1.5 rounded-md cursor-pointer transition-colors border-none flex items-center justify-center ${
                                                                viewMode === "grid" ? "bg-white text-stone-900 shadow-sm" : "bg-transparent text-stone-400 hover:text-stone-200"
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
                                                                viewMode === "carousel" ? "bg-white text-stone-900 shadow-sm" : "bg-transparent text-stone-400 hover:text-stone-200"
                                                            }`}
                                                            title="Slayt Gösterisi"
                                                        >
                                                            <Sliders size={15} />
                                                        </button>
                                                    </div>
                                                )}
                                                <span className="text-[0.78rem] font-bold text-[var(--text-muted)]">{albumPhotos.length} Fotoğraf</span>
                                            </div>
                                        </div>

                                        {/* Fotoğraflar Listesi / Slider */}
                                        {loading ? (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {Array.from({ length: 3 }).map((_, i) => (
                                                    <div key={i} className="h-[150px] rounded-[12px] bg-black/5 animate-pulse" />
                                                ))}
                                            </div>
                                        ) : albumPhotos.length === 0 ? (
                                            <div className="flex flex-col items-center text-center py-12 text-[var(--text-muted)]">
                                                <ImageOff size={40} className="mb-3 opacity-70" />
                                                <p className="m-0 text-[0.85rem] max-w-[280px] leading-relaxed">Bu albümde henüz eşleşen fotoğraf yok. Selfie yüklediğinizde yapay zeka taraması ile fotoğraflarınız listelenecektir.</p>
                                            </div>
                                        ) : viewMode === "carousel" ? (
                                            /* Gelişmiş Kaydırmalı Büyük Görünüm */
                                            <div className="flex flex-col items-center gap-5 py-2">
                                                <div className="w-full relative max-w-[320px] aspect-[3/4] flex items-center justify-center overflow-hidden rounded-2xl bg-black/15 border border-white/5 shadow-inner">
                                                    <AnimatePresence initial={false} custom={slideDirection}>
                                                        <motion.div
                                                            key={activeIndex}
                                                            custom={slideDirection}
                                                            variants={slideVariants}
                                                            initial="enter"
                                                            animate="center"
                                                            exit="exit"
                                                            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-3"
                                                        >
                                                            <div className="relative w-full h-full rounded-xl overflow-hidden group shadow-lg">
                                                                <img 
                                                                    src={albumPhotos[activeIndex]?.original_url || albumPhotos[activeIndex]?.thumbnail_url} 
                                                                    alt={albumPhotos[activeIndex]?.filename || "foto"} 
                                                                    className="w-full h-full object-cover select-none pointer-events-none" 
                                                                />
                                                                <button
                                                                    onClick={() => setLightbox(albumPhotos[activeIndex])}
                                                                    className="absolute inset-0 bg-black/0 hover:bg-black/15 transition-colors cursor-zoom-in flex items-center justify-center group/btn border-none"
                                                                >
                                                                    <span className="opacity-0 group-hover/btn:opacity-100 bg-white/95 text-stone-900 px-3.5 py-2 rounded-full text-xs font-bold shadow-md transition-opacity duration-200">Tam Ekran</span>
                                                                </button>
                                                                <span
                                                                    onClick={() => downloadImage(albumPhotos[activeIndex]?.original_url, albumPhotos[activeIndex]?.filename)}
                                                                    className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/65 hover:bg-black/80 text-white grid place-items-center hover:scale-105 transition-all shadow-md cursor-pointer"
                                                                    title="İndir"
                                                                >
                                                                    <Download size={14} />
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>

                                                {/* Önceki - Sonraki Butonları */}
                                                <div className="flex items-center gap-4 justify-between text-slate-300 rounded-full bg-white/5 border border-white/10 shadow-sm p-1.5 max-w-[280px] w-full">
                                                    <button 
                                                        onClick={() => {
                                                            setSlideDirection(-1);
                                                            setActiveIndex(prev => Math.max(0, prev - 1));
                                                        }} 
                                                        disabled={activeIndex === 0}
                                                        className="w-8 h-8 cursor-pointer rounded-full hover:bg-white/10 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent transition-all"
                                                    >
                                                        <ChevronLeft size={18} />
                                                    </button>
                                                    
                                                    <div className="text-xs font-extrabold text-slate-200">
                                                        {activeIndex + 1} / {albumPhotos.length}
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => {
                                                            setSlideDirection(1);
                                                            setActiveIndex(prev => Math.min(albumPhotos.length - 1, prev + 1));
                                                        }} 
                                                        disabled={activeIndex === albumPhotos.length - 1}
                                                        className="w-8 h-8 cursor-pointer rounded-full hover:bg-white/10 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed border-none bg-transparent transition-all"
                                                    >
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Izgara Görünümü */
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {albumPhotos.map((photo) => (
                                                    <button
                                                        key={photo.id}
                                                        type="button"
                                                        onClick={() => setLightbox(photo)}
                                                        className="relative h-[130px] sm:h-[150px] rounded-[12px] overflow-hidden border border-[var(--glass-border)] cursor-pointer p-0 group animate-[fadeIn_0.3s_ease]"
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
                                                            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/65 text-white grid place-items-center hover:scale-105 transition-transform"
                                                            title="İndir"
                                                        >
                                                            <Download size={13} />
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    /* Albümler Listesi Görünümü */
                                    <motion.div
                                        key="albums-list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col gap-5 text-left"
                                    >
                                        <div className="flex items-center gap-1.5 border-b border-[var(--glass-border)] pb-3">
                                            <Sparkles size={16} className="text-purple-500 animate-pulse shrink-0" />
                                            <strong className="text-[0.92rem] font-bold text-white">Size Özel Fotoğraf Albümleri</strong>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {albums.map((album) => {
                                                const coverImg = album.cover;
                                                const photos = album.photos || [];
                                                const leftImg = photos[1]?.thumbnail_url || coverImg;
                                                const rightImg = photos[2]?.thumbnail_url || coverImg;
                                                return (
                                                    <div 
                                                        key={album.id}
                                                        onClick={() => {
                                                            setSelectedAlbumId(album.id);
                                                            setActiveIndex(0);
                                                        }}
                                                        className="flex flex-col gap-3.5 cursor-pointer active:scale-[0.98] transition-all select-none p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 group shadow-md"
                                                    >
                                                        {/* 3D Yığın Fotoğraflar */}
                                                        <div className="relative aspect-[4/3] w-full rounded-xl bg-black/10 flex items-center justify-center overflow-hidden shadow-inner p-4 transition-all duration-300">
                                                            <div className="relative w-[75%] h-[80%] flex items-center justify-center">
                                                                {/* Left stacked photo */}
                                                                <div className="absolute w-[40%] h-[75%] rounded-lg overflow-hidden border-2 border-white shadow-md transition-all duration-300 origin-bottom scale-90 translate-x-[-14px] rotate-[-10deg] group-hover:translate-x-[-18px] group-hover:rotate-[-14deg]">
                                                                    <img src={leftImg} alt="left" className="w-full h-full object-cover select-none pointer-events-none" />
                                                                </div>
                                                                {/* Right stacked photo */}
                                                                <div className="absolute w-[40%] h-[75%] rounded-lg overflow-hidden border-2 border-white shadow-md transition-all duration-300 origin-bottom scale-90 translate-x-[14px] rotate-[10deg] group-hover:translate-x-[18px] group-hover:rotate-[14deg]">
                                                                    <img src={rightImg} alt="right" className="w-full h-full object-cover select-none pointer-events-none" />
                                                                </div>
                                                                {/* Center photo */}
                                                                <div className="absolute w-[44%] h-[82%] rounded-lg overflow-hidden border-2 border-white shadow-lg transition-all duration-300 origin-bottom scale-100 group-hover:scale-[1.05]">
                                                                    <img src={coverImg} alt="cover" className="w-full h-full object-cover select-none pointer-events-none" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Details */}
                                                        <div>
                                                            <strong className="block text-[0.88rem] font-bold text-white truncate leading-tight group-hover:text-[var(--color-blue-dark)] transition-colors">{album.title}</strong>
                                                            <span className="text-[10px] text-[var(--text-muted)] block mt-1">{album.location} &bull; {album.date}</span>
                                                            <span className="text-[10px] text-emerald-400 font-extrabold block mt-2.5 uppercase tracking-wide">{photos.length} Eşleşen Fotoğraf</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>

                        {/* Sağ Sütun - Katılımcı Kartı */}
                        <div>
                            {participantRecord ? (
                                <GlassCard 
                                  title="Katılımcı Bilgileri" 
                                  action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
                                  className="glass-panel flex flex-col gap-5 text-left"
                                >
                                  {/* Profile Preview */}
                                  <div className="flex flex-col items-center text-center py-2.5 gap-1.5 w-full">
                                    {participantRecord.selfie_url ? (
                                      <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border-3 border-[var(--color-blue-dark)]">
                                        <img src={participantRecord.selfie_url} alt="selfie" className="w-full h-full object-cover" />
                                      </div>
                                    ) : (
                                      <div className="w-[100px] h-[100px] rounded-full bg-[var(--glass-border)] grid place-items-center text-[1.8rem] font-bold text-white">
                                        {participantRecord.display_name.charAt(0)}
                                      </div>
                                    )}
                                    <h3 className="m-0 mb-1 text-[1.15rem] font-extrabold text-center w-full truncate text-[var(--text-main)]" title={participantRecord.display_name}>
                                      {participantRecord.display_name}
                                    </h3>
                                    <span className="bg-[var(--glass-border)] p-[2.5px_10px] rounded-[10px] text-[0.72rem] font-bold text-[var(--text-muted)] whitespace-nowrap self-center">ID: {participantRecord.id}</span>
                                  </div>

                                  {/* Info Rows */}
                                  <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 text-[var(--text-main)]">
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
                                  <div className="flex flex-col gap-3 border-t border-[var(--glass-border)] pt-4 text-[var(--text-main)]">
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

                                    <div className="flex flex-col gap-2">
                                        <div className="text-[0.76rem] text-[var(--text-muted)] leading-relaxed text-left">
                                          {participantRecord.selfie_url 
                                            ? "Mevcut yüz taramanız sisteme tanımlıdır. Yeni bir fotoğraf yükleyerek güncelleyebilirsiniz." 
                                            : "Fotoğraflarınızla eşleşme yapılabilmesi için bir yüz fotoğrafı tanımlayın."
                                          }
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                          <button
                                            onClick={handleOpenStream}
                                            className="primary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white w-full"
                                          >
                                            <Camera size={14} />
                                            <span>Kameradan Çek</span>
                                          </button>
                                          <div className="flex gap-2 w-full">
                                            <button
                                              onClick={() => fileInputRef.current?.click()}
                                              className="secondary-btn flex-1 p-2.5 text-[0.8rem] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                                            >
                                              <UploadCloud size={14} />
                                              <span>Dosya Seç</span>
                                            </button>
                                            <button
                                              onClick={handleTriggerMockSelfie}
                                              title="Simüle Fotoğraf Yükle"
                                              className="secondary-btn p-2.5 text-[0.8rem] font-bold rounded-[12px] flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                                            >
                                              <RefreshCw size={14} />
                                            </button>
                                          </div>
                                        </div>
                                    </div>
                                  </div>

                                </GlassCard>
                            ) : (
                                <GlassCard className="glass-panel p-6 text-center text-[var(--text-muted)] text-[0.85rem]">
                                    Profil verileriniz yükleniyor...
                                </GlassCard>
                            )}
                        </div>

                        {/* Danger Zone: Gizlilik ve Verilerim */}
                        {participantRecord && (
                            <GlassCard className="col-span-1 lg:col-span-2 p-5 border border-red-500/30 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-4 mt-2">
                                <div>
                                    <h3 className="text-[var(--text-main)] font-bold text-sm mb-1 flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-red-400" />
                                        Gizlilik ve Verilerim
                                    </h3>
                                    <p className="text-[var(--text-muted)] text-xs m-0 max-w-xl leading-relaxed">
                                        Sistemdeki yüz biyometrisi verilerinizi silerek rızanızı geri çekebilirsiniz. Bu işlem geri alınamaz ve eşleşmeleriniz de kalıcı olarak kaldırılır.
                                    </p>
                                </div>
                                <button 
                                    onClick={handleDeleteFaceData}
                                    className="bg-[var(--accent-red)]/10 text-[var(--accent-red)] hover:bg-[var(--accent-red)] hover:text-white border border-[var(--accent-red)]/30 transition-all font-bold text-xs py-2.5 px-5 rounded-xl whitespace-nowrap cursor-pointer"
                                >
                                    Yüz Verimi Sil ve Rızamı Geri Çek
                                </button>
                            </GlassCard>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Canlı Kamera Modali */}
            <GlassModal
              open={isCameraActive}
              onClose={handleCloseCamera}
              title="Kameradan Fotoğraf Çek"
              icon={Camera}
              width="max-w-[400px]"
            >
              <div className="flex flex-col gap-5 text-center relative">
                {/* Video Görüntüsü */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-inner flex items-center justify-center">
                    {!cameraStream ? (
                        <div className="text-slate-400 text-xs font-bold flex flex-col items-center gap-2">
                            <RefreshCw size={24} className="animate-spin text-[var(--color-blue-dark)]" />
                            <span>Kamera başlatılıyor...</span>
                        </div>
                    ) : (
                        <video 
                            ref={videoRef}
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                    )}
                </div>

                {/* Butonlar */}
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={handleCloseCamera}
                        className="secondary-btn flex-1 py-3 text-xs font-bold rounded-[14px] cursor-pointer"
                    >
                        İptal
                    </button>
                    <button 
                        onClick={handleCapture}
                        disabled={!cameraStream}
                        className="primary-btn flex-1 py-3 text-xs font-bold rounded-[14px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-none shadow-md shadow-blue-500/10"
                    >
                        <Camera size={14} />
                        <span>Fotoğrafı Çek</span>
                    </button>
                </div>
              </div>
            </GlassModal>

            {/* Lightbox */}
            <GlassModal
              open={!!lightbox}
              onClose={() => setLightbox(null)}
              title={lightbox?.filename || "Fotoğraf Önizleme"}
              width="max-w-[640px]"
            >
              <div className="flex flex-col gap-4">
                <img
                    src={lightbox?.original_url}
                    alt={lightbox?.filename || "foto"}
                    className="w-full max-h-[60vh] object-contain rounded-[16px] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                />
                <div className="flex gap-2 justify-center mt-2">
                    <button onClick={() => downloadImage(lightbox.original_url, lightbox.filename)} className="primary-btn justify-center gap-2 px-5 cursor-pointer">
                        <Download size={16} />
                        <span>İndir</span>
                    </button>
                    <button onClick={() => shareImage(lightbox.original_url)} className="secondary-btn justify-center gap-2 px-5 cursor-pointer">
                        <Share2 size={16} />
                        <span>Paylaş</span>
                    </button>
                </div>
              </div>
            </GlassModal>
        </div>
    );
}