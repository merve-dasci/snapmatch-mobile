import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    UploadCloud,
    Users,
    BrainCircuit,
    CheckSquare,
    QrCode,
    BarChart3,
    UserCheck,
    ShieldCheck,
    LockKeyhole,
    Settings,
    ArrowRight,
    Plus,
    Clock,
    Share2,
    Download,
    MoreHorizontal,
    Calendar,
    Images
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";
import { useAdaptive } from "../context/AdaptiveContext";
import GlassCard from "../components/ui/GlassCard";
import TiltedCard from "../components/ui/TiltedCard";
import { mockApi } from "../services/mockApi";

// Rota -> kart bilgi (hızlı erişim için)
const ROUTE_META = {
    "/dashboard": { label: "Dashboard", desc: "Operasyonel genel bakış ve istatistikler", icon: LayoutDashboard },
    "/events": { label: "Etkinlikler", desc: "Yeni etkinlikler oluşturun ve yönetin", icon: CalendarDays },
    "/upload": { label: "Fotoğraf Yükle", desc: "Etkinlik albümlerine fotoğraf yükleyin", icon: UploadCloud },
    "/participants": { label: "Katılımcılar", desc: "Katılımcı yüz kayıtları ve profilleri", icon: Users },
    "/matching": { label: "Yapay Zeka Eşleşme", desc: "Yapay zeka yüz eşleştirmelerini başlatın", icon: BrainCircuit },
    "/review": { label: "Eşleşme Doğrulama", desc: "Eşleşme sonuçlarını inceleyin ve onaylayın", icon: CheckSquare },
    "/qr": { label: "QR ve Erişim", desc: "Misafirler için QR giriş kodlarını paylaşın", icon: QrCode },
    "/analytics": { label: "Analitik & Raporlar", desc: "Sistem ve yükleme raporlarını görüntüleyin", icon: BarChart3 },
    "/team": { label: "Ekip ve Roller", desc: "Uploader (fotoğrafçı asistanı) ekleyin", icon: UserCheck },
    "/roles": { label: "Roller", desc: "Sistem rol tanımları", icon: ShieldCheck },
    "/access-matrix": { label: "Erişim Matrisi", desc: "Rol bazlı sistem yetkileri", icon: LockKeyhole },
    "/settings": { label: "Ayarlar", desc: "Sistem ve çalışma alanı ayarları", icon: Settings },
    "/my-photos": { label: "Fotoğraflarım", desc: "Size eşleşen fotoğrafları görüntüleyin", icon: Images },
};

export default function RoleHome() {
    const { user } = useAuth();
    const { isMobile } = useAdaptive();
    const navigate = useNavigate();
    
    const role = ROLES[user?.role];
    if (!role) return null;

    const firstName = (user.name || "").split(" ")[0];
    const RoleIcon = role.icon;

    // Ana sayfa ve detay rotasını kart listesinden çıkar
    const quickRoutes = role.allowed.filter(
        (r) => r !== "/home" && r !== "/events/:id" && ROUTE_META[r]
    );

    if (isMobile) {
        // Fetch dynamic participants for album section
        const mockParticipants = mockApi.getParticipants().slice(0, 4);
        
        // Helper to fetch photos
        const getMatchedPhotosForParticipant = (pId) => {
            const allMatches = mockApi.getMatches() || [];
            const pMatches = allMatches.filter(m => m.participant_id === pId);
            const allPhotos = mockApi.getPhotos() || [];
            return allPhotos.filter(ph => pMatches.some(m => m.photo_id === ph.id));
        };

        return (
            <div className="flex flex-col gap-6 pt-2 pb-20 px-1 select-none">
                
                {/* 1. HERO AREA (ACTIVE EVENT) */}
                <div 
                    className="relative w-full h-[240px] rounded-[28px] overflow-hidden shadow-lg border border-white/10"
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                    }}
                >
                    {/* Dark Blue Transparent Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E2631]/95 via-[#3A4B5C]/70 to-transparent" />

                    {/* Hero Content Overlay */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                        {/* Upper Badge */}
                        <div className="flex justify-between items-start">
                            <span className="bg-white/12 backdrop-blur-md text-[10px] font-black text-white px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
                                Aktif Etkinlik
                            </span>
                            
                            {/* Live status animation */}
                            <span className="flex items-center gap-1 bg-emerald-500/80 text-white text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                Live
                            </span>
                        </div>

                        {/* Mid Info Stack */}
                        <div className="flex flex-col gap-1 mt-auto">
                            <h2 className="text-xl font-black m-0 text-white leading-tight">
                                Mezuniyet Töreni 2026
                            </h2>
                            <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2 text-[10px] text-white/85 font-medium">
                                <span className="flex items-center gap-0.5">
                                    📍 İstanbul Kongre Merkezi
                                </span>
                                <span className="flex items-center gap-0.5">
                                    📅 12 Haziran 2026
                                </span>
                                <span className="flex items-center gap-0.5">
                                    👥 324 Katılımcı
                                </span>
                                <span className="flex items-center gap-0.5">
                                    📷 4.286 Fotoğraf
                                </span>
                            </div>
                        </div>

                        {/* AI Status Badge */}
                        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md rounded-2xl p-2.5 mt-3 border border-white/10 select-none">
                            <div className="flex items-center gap-2">
                                <span className="text-xs">🤖</span>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-extrabold text-white">AI Eşleştiriliyor</span>
                                    <span className="text-[8px] text-white/70">Yüz analiz kuyruğu aktif</span>
                                </div>
                            </div>
                            
                            {/* Simple dynamic percentage bar representation */}
                            <div className="flex items-center gap-2">
                                <div className="w-[60px] bg-white/20 h-1.5 rounded-full overflow-hidden shrink-0">
                                    <div className="bg-emerald-400 h-full rounded-full animate-pulse" style={{ width: "78%" }} />
                                </div>
                                <span className="text-[10px] font-black text-white shrink-0">78%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. QUICK ACTIONS (HORIZONTAL SCROLL) */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/50 mb-0 px-1">
                        Hızlı Aksiyonlar
                    </h3>
                    
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
                        {/* New Event Card */}
                        <Link 
                            to="/events" 
                            className="glass-panel p-4 flex flex-col justify-between gap-4 min-w-[130px] h-[105px] border border-white/10 active:scale-95 transition-transform shrink-0"
                        >
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 text-white border border-white/10 flex items-center justify-center">
                                <Plus size={16} />
                            </div>
                            <span className="text-xs font-bold text-white leading-tight">Yeni Etkinlik</span>
                        </Link>

                        {/* Upload Card */}
                        <Link 
                            to="/upload" 
                            className="glass-panel p-4 flex flex-col justify-between gap-4 min-w-[130px] h-[105px] border border-white/10 active:scale-95 transition-transform shrink-0"
                        >
                            <div className="w-9 h-9 rounded-full bg-purple-500/10 text-white border border-white/10 flex items-center justify-center">
                                <UploadCloud size={16} />
                            </div>
                            <span className="text-xs font-bold text-white leading-tight">Fotoğraf Yükle</span>
                        </Link>

                        {/* QR Share Card */}
                        <Link 
                            to="/qr" 
                            className="glass-panel p-4 flex flex-col justify-between gap-4 min-w-[130px] h-[105px] border border-white/10 active:scale-95 transition-transform shrink-0"
                        >
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-white border border-white/10 flex items-center justify-center">
                                <QrCode size={16} />
                            </div>
                            <span className="text-xs font-bold text-white leading-tight">QR Paylaş</span>
                        </Link>

                        {/* Launch AI Card */}
                        <Link 
                            to="/matching" 
                            className="glass-panel p-4 flex flex-col justify-between gap-4 min-w-[130px] h-[105px] border border-white/10 active:scale-95 transition-transform shrink-0"
                        >
                            <div className="w-9 h-9 rounded-full bg-amber-500/10 text-white border border-white/10 flex items-center justify-center">
                                <BrainCircuit size={16} />
                            </div>
                            <span className="text-xs font-bold text-white leading-tight">AI Başlat</span>
                        </Link>
                    </div>
                </div>

                {/* 3. MY ALBUMS (SON ALBÜMLER) */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-black uppercase tracking-wider text-white/50 m-0">
                            Son Albümler
                        </h3>
                        <Link to="/participants" className="text-[10px] font-bold text-emerald-400 no-underline hover:underline">
                            Tümünü Gör
                        </Link>
                    </div>

                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-none px-1">
                        {mockParticipants.map((p) => {
                            const matchedPhotos = getMatchedPhotosForParticipant(p.id);
                            const coverPhoto = matchedPhotos.length > 0 ? matchedPhotos[0].thumbnail_url : p.selfie_url;
                            const middlePhoto = matchedPhotos.length > 1 ? matchedPhotos[1].thumbnail_url : p.selfie_url;
                            const backPhoto = matchedPhotos.length > 2 ? matchedPhotos[2].thumbnail_url : p.selfie_url;
                            const confidence = 94 + (p.id.toString().charCodeAt(0) % 6);

                            return (
                                <div key={p.id} className="relative w-[170px] shrink-0 active:scale-[0.96] transition-all duration-200">
                                    {/* Three Dot Options Button */}
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            alert(`${p.display_name} albümü seçenekleri açıldı.`);
                                        }}
                                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white border-none flex items-center justify-center z-20 cursor-pointer"
                                        title="Seçenekler"
                                    >
                                        <MoreHorizontal size={12} />
                                    </button>

                                    <Link 
                                        to="/participants"
                                        className="flex flex-col gap-4 no-underline text-white"
                                    >
                                        {/* Apple Photos Stack (Fanned Layout) */}
                                        <div className="relative w-full h-[130px] select-none flex items-center justify-center shrink-0">
                                            {/* Back-Left Photo (Photo 3) */}
                                            <div 
                                                className="absolute w-[80px] h-[85px] rounded-lg bg-cover bg-center shadow-md border-2 border-white rotate-[-12deg] -translate-x-9 translate-y-1 opacity-70"
                                                style={{ backgroundImage: `url(${backPhoto})` }}
                                            />
                                            {/* Back-Right Photo (Photo 2) */}
                                            <div 
                                                className="absolute w-[80px] h-[85px] rounded-lg bg-cover bg-center shadow-md border-2 border-white rotate-[12deg] translate-x-9 translate-y-1 opacity-70"
                                                style={{ backgroundImage: `url(${middlePhoto})` }}
                                            />
                                            {/* Center-Front Photo (Photo 1) - Highest confidence */}
                                            <div 
                                                className="absolute w-[110px] h-[115px] rounded-xl bg-cover bg-center shadow-xl border-2 border-white z-10"
                                                style={{ backgroundImage: `url(${coverPhoto})` }}
                                            />
                                        </div>

                                        {/* Album Text Info */}
                                        <div className="flex flex-col gap-1 px-1">
                                            <div className="flex justify-between items-start gap-1">
                                                <strong className="text-[12px] font-extrabold truncate flex-grow">
                                                    {p.display_name}
                                                </strong>
                                                <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-extrabold px-1 py-0.5 rounded shrink-0">
                                                    %{confidence}
                                                </span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center text-[9px] text-white/50">
                                                <span>{matchedPhotos.length} Fotoğraf</span>
                                                <span className="flex items-center gap-0.5"><Clock size={8} /> 12 Haz 2026</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY */}
                <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white/50 mb-0 px-1">
                        Son Aktiviteler
                    </h3>

                    <GlassCard className="glass-panel p-4 flex flex-col gap-3">
                        <div className="flex gap-3 items-start relative pb-3 border-b border-white/5">
                            <span className="text-[10px] font-black text-white/40 shrink-0 pt-0.5">09:20</span>
                            <div className="flex flex-col">
                                <strong className="text-[11px] font-bold text-white">124 Fotoğraf Yüklendi</strong>
                                <span className="text-[8px] text-white/50 mt-0.5">Mezuniyet Klasörü &bull; Fotoğrafçı</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start relative pb-3 border-b border-white/5">
                            <span className="text-[10px] font-black text-white/40 shrink-0 pt-0.5">09:35</span>
                            <div className="flex flex-col">
                                <strong className="text-[11px] font-bold text-white">AI Eşleştirmesi Tamamlandı</strong>
                                <span className="text-[8px] text-white/50 mt-0.5">78 eşleşme doğrulandı &bull; AI Engine</span>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start">
                            <span className="text-[10px] font-black text-white/40 shrink-0 pt-0.5">10:02</span>
                            <div className="flex flex-col">
                                <strong className="text-[11px] font-bold text-white">QR Bağlantısı Paylaşıldı</strong>
                                <span className="text-[8px] text-white/50 mt-0.5">Misafir giriş QR üretildi &bull; Admin</span>
                            </div>
                        </div>
                    </GlassCard>
                </div>

            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="page-head">
                <h1 className="font-extrabold">Merhaba, {firstName}</h1>
                <p>Snapmatch AI çalışma alanına hoş geldin.</p>
            </div>

            {/* Role summary card */}
            <div className={`glass-panel p-[var(--space-lg)] flex gap-4 ${role.blurb ? "items-start" : "items-center"}`}>
                <div
                    className="w-14 h-14 rounded-[16px] grid place-items-center shrink-0"
                    style={{
                        color: role.color,
                        background: `color-mix(in srgb, ${role.color} 15%, transparent)`,
                    }}
                >
                    <RoleIcon size={26} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-[1.05rem] font-bold m-0 leading-tight">{role.label}</h2>
                        <span
                            className="px-2 py-[3px] rounded-full text-[0.68rem] font-bold uppercase tracking-wide"
                            style={{
                                color: role.color,
                                background: `color-mix(in srgb, ${role.color} 13%, transparent)`,
                            }}
                        >
                            {role.tag}
                        </span>
                    </div>
                    {role.blurb && (
                        <p className="mt-1.5 mb-0 text-[0.88rem] text-[var(--text-muted)] leading-[1.45]">
                            {role.blurb}
                        </p>
                    )}
                </div>
            </div>

            {/* Quick access */}
            <div>
                <h2 className="text-[0.8rem] font-bold uppercase tracking-wide text-[var(--text-muted)] mb-3">
                    Hızlı Erişim
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[var(--space-md)]">
                    {quickRoutes.map((r) => {
                        const meta = ROUTE_META[r];
                        if (!meta) return null;
                        const Icon = meta.icon;
                        return (
                            <TiltedCard
                                key={r}
                                onClick={() => navigate(r)}
                                className="glass-subpanel interactive-tilted-card p-[var(--space-md)] flex items-center gap-3 group"
                                maxTilt={12}
                                scale={1.04}
                            >
                                <div className="w-11 h-11 rounded-[14px] grid place-items-center shrink-0 bg-white/15 text-[var(--color-blue-dark)]">
                                    <Icon size={20} strokeWidth={2.2} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <strong className="text-[0.92rem] block leading-tight">
                                        {meta.label}
                                    </strong>
                                    <small className="text-[var(--text-muted)] text-[0.78rem]">
                                        {meta.desc}
                                    </small>
                                </div>
                                <ArrowRight
                                    size={16}
                                    className="text-[var(--text-muted)] shrink-0 transition-transform group-hover:translate-x-0.5"
                                />
                            </TiltedCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
