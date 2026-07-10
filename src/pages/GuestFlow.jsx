import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import BottomMobileSheet from "../components/ui/BottomMobileSheet";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";
import {
  Library,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Play,
  Pause,
  Camera, 
  UserCheck, 
  Shield, 
  Sparkles, 
  Download, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  Share2, 
  Grid,
  CheckCircle,
  Eye,
  Home,
  BookOpen,
  Bell,
  User,
  Heart,
  Star,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
  Trash2,
  Lock,
  ThumbsUp,
  Image as ImageIcon,
  Check,
  LogOut,
  Maximize2,
  Search,
  Settings,
  BrainCircuit,
  Plus,
  Upload,
  Grid2X2,
  GalleryHorizontal,
  X
} from "lucide-react";

// Onboarding adımları (landing hariç)
const STEPS = ["consent", "upload"];
const STEP_LABELS = ["Onay", "Selfie"];

// ==========================================
// SUB-COMPONENTS FOR CLEAN CODEBASE (DRY)
// ==========================================

export function GuestHeader({ guestName, totalEvents, totalPhotos }) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/5 pb-4 mb-2 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--gt-accent)] text-white flex items-center justify-center font-black text-sm border-2 border-white/10 shadow-md">
            {guestName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "M"}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/45 font-black uppercase tracking-wider leading-none">Snapmatch Mobile</span>
            <h1 className="text-lg font-black m-0 text-white mt-1 leading-tight flex items-center gap-1.5">
              <span>Merhaba, {guestName.split(" ")[0]}</span>
              <Sparkles size={14} className="text-amber-400 shrink-0" />
            </h1>
          </div>
        </div>
        
        <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Match Active
        </span>
      </div>

      <div className="glass-panel border border-white/5 bg-white/5 p-4 rounded-[22px] flex items-center justify-between shadow-inner">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-white/40 font-black uppercase tracking-wider">Durum</span>
          <strong className="text-xs text-white">Anıların Hazır!</strong>
        </div>
        
        <div className="flex gap-4 border-l border-white/10 pl-4">
          <div className="flex flex-col items-center">
            <span className="text-[17px] font-black text-white">{totalEvents}</span>
            <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Albüm</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[17px] font-black text-emerald-400">{totalPhotos}</span>
            <span className="text-[8px] text-white/40 font-bold uppercase tracking-wider mt-0.5">Fotoğraf</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestAlbumCard({ event, photos = [], matchedPhotosCount, onClick }) {
  // Extract three images for the 3D stack
  const centerImg = photos[0]?.thumbnail_url || event.cover_url;
  const leftImg = photos[1]?.thumbnail_url || photos[0]?.thumbnail_url || event.cover_url;
  const rightImg = photos[2]?.thumbnail_url || photos[0]?.thumbnail_url || event.cover_url;

  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform select-none group"
    >
      {/* 3D Stack Container Plate */}
      <div className="relative aspect-square w-full rounded-[28px] border border-white/5 bg-white/5 flex items-center justify-center overflow-hidden shadow-inner p-4 group-hover:bg-white/10 transition-all duration-300">
        
        {/* Soft radial overlay glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

        {/* 3D STACK LAYOUT */}
        <div className="relative w-[85%] h-[80%] flex items-center justify-center">
          
          {/* Left Stacked Photo Card */}
          <div 
            className="absolute w-[45%] h-[75%] rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white/5 transition-all duration-300 origin-bottom scale-90 translate-x-[-14px] rotate-[-10deg] group-hover:translate-x-[-18px] group-hover:rotate-[-14deg]"
            style={{ zIndex: 1 }}
          >
            <img src={leftImg} alt="left photo" className="w-full h-full object-cover" />
          </div>

          {/* Right Stacked Photo Card */}
          <div 
            className="absolute w-[45%] h-[75%] rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white/5 transition-all duration-300 origin-bottom scale-90 translate-x-[14px] rotate-[10deg] group-hover:translate-x-[18px] group-hover:rotate-[14deg]"
            style={{ zIndex: 1 }}
          >
            <img src={rightImg} alt="right photo" className="w-full h-full object-cover" />
          </div>

          {/* Center/Top Photo Card */}
          <div 
            className="absolute w-[48%] h-[82%] rounded-xl overflow-hidden border-2 border-white shadow-xl bg-white/5 transition-all duration-300 origin-bottom scale-100 rotate-0 group-hover:scale-[1.04]"
            style={{ zIndex: 2 }}
          >
            <img src={centerImg} alt="center photo" className="w-full h-full object-cover" />
          </div>

        </div>

        {/* Live / Bitti Badge Overlay */}
        <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-white/10 text-emerald-400 flex items-center gap-1 shrink-0 z-10">
          {event.status === "live" ? (
            <>
              <Sparkles size={8} className="text-emerald-400 shrink-0" />
              <span>Canlı</span>
            </>
          ) : (
            <>
              <Check size={8} className="text-emerald-400 shrink-0" />
              <span>Bitti</span>
            </>
          )}
        </span>
      </div>

      {/* Details (Apple Bookshelf visual styling) */}
      <div className="flex flex-col gap-0.5 px-1.5 text-left">
        <div className="flex justify-between items-start gap-1">
          <strong className="text-xs font-black text-white truncate block flex-grow leading-tight">{event.title}</strong>
          <span className="text-[10px] text-white/30 hover:text-white/60 transition-colors cursor-pointer shrink-0 mt-0.5">&bull;&bull;&bull;</span>
        </div>
        <span className="text-[9px] text-white/40 block font-medium truncate mt-0.5">{event.location.split(",")[0]}</span>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[8px] text-emerald-400 font-black tracking-wider uppercase">AI EŞLEŞTİ</span>
          <span className="text-[9px] text-white/40 font-bold">{matchedPhotosCount} Fotoğraf</span>
        </div>
      </div>
    </div>
  );
}

export function GuestThemeSettings({ 
  guestTheme, 
  setGuestTheme, 
  showToast, 
  handleDeleteFaceData, 
  guestName, 
  selfieUrl 
}) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (confirmDelete) {
      const t = setTimeout(() => setConfirmDelete(false), 4000);
      return () => clearTimeout(t);
    }
  }, [confirmDelete]);

  const THEMES = [
    { id: "beige", name: "Açık Bej", desc: "Zarif albüm hissi sunan sıcak bej ve fildişi tonları.", bg: "#FAF8F5", accent: "#C39C70" },
    { id: "pink", name: "Açık Pembe", desc: "Romantik etkinlikler için soft pastel pembe tonları.", bg: "#FFF5F6", accent: "#E06C7F" },
    { id: "blue", name: "Buz Mavisi", desc: "Modern premium görünüm sunan buz mavisi.", bg: "#F3F6FA", accent: "#4B85CC" },
    { id: "lavender", name: "Lavanta", desc: "Sakin ve modern lila ve lavanta renk tonları.", bg: "#F8F6FF", accent: "#825AF6" },
    { id: "dark", name: "Koyu Premium", desc: "Fotoğrafları öne çıkaran derin lacivert ve siyah.", bg: "#07090E", accent: "#3B82F6" },
    { id: "purple", name: "Gece Moru", desc: "Premium koyu lila ve mor tonları.", bg: "#0C0714", accent: "#7C3AED" }
  ];

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-1 mt-2">
        <h2 className="text-lg font-black m-0 text-white">Görünüm Ayarları</h2>
        <p className="text-[10px] text-white/50 m-0">Etkinlik mobil albümünüz için bir renk teması seçin.</p>
      </div>

      {/* Themes List */}
      <div className="flex flex-col gap-3 mt-1">
        {THEMES.map((theme) => {
          const isSelected = guestTheme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => {
                setGuestTheme(theme.id);
                localStorage.setItem("sm_guest_theme", theme.id);
                showToast(`${theme.name} teması uygulandı.`, "success");
              }}
              className="glass-panel p-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-white/10 transition-all rounded-2xl"
              style={{
                border: isSelected ? "2px solid var(--guest-accent)" : "1px solid var(--guest-border)"
              }}
            >
              <div className="flex gap-1.5 shrink-0 bg-black/10 p-1.5 rounded-xl border border-white/5">
                <span className="w-4.5 h-4.5 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: theme.bg }} />
                <span className="w-4.5 h-4.5 rounded-full shadow-inner" style={{ backgroundColor: theme.accent }} />
              </div>

              <div className="flex-grow">
                <strong className="text-xs font-black block text-white">{theme.name}</strong>
                <span className="text-[10px] text-white/50 block mt-0.5 leading-relaxed">{theme.desc}</span>
              </div>

              {isSelected && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--guest-accent)" }}>
                  <Check size={12} strokeWidth={3} className="text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Profil details & Self Deletion inside Settings */}
      <div className="h-[1px] bg-white/5 my-3" />
      
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-white uppercase tracking-wider m-0">Güvenlik ve Profil</h3>
        
        {/* User Card */}
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-white/5 shrink-0">
            {selfieUrl ? (
              <img src={selfieUrl} alt="selfie" className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-white/20 mx-auto mt-2" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <strong className="text-xs text-white truncate block">{guestName}</strong>
            <span className="text-[9px] text-white/40 mt-0.5">Biyometrik KVKK Aydınlatma Kaydı Aktif</span>
          </div>
        </div>

        <button 
          onClick={() => {
            if (!confirmDelete) {
              setConfirmDelete(true);
            } else {
              handleDeleteFaceData();
              setConfirmDelete(false);
            }
          }}
          className={`w-full p-3.5 border text-xs font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all mb-24 ${
            confirmDelete 
              ? "bg-red-600 border-red-600 text-white animate-pulse" 
              : "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
          }`}
        >
          <Trash2 size={14} />
          <span>{confirmDelete ? "Emin misiniz? Onaylamak için tekrar tıklayın" : "Biyometrik Verimi & Profilimi Sil"}</span>
        </button>
      </div>
    </div>
  );
}

export function GuestBottomNav({ activeTab, setActiveTab, onTabClick }) {
  const tabs = [
    { id: "albums", label: "Albümler", icon: <Library size={18} /> },
    { id: "photos", label: "Fotoğraflar", icon: <ImageIcon size={18} /> },
    { id: "favorites", label: "Favoriler", icon: <Heart size={18} /> },
    { id: "settings", label: "Ayarlar", icon: <Settings size={18} /> }
  ];

  return (
    <nav className="guest-tab-bar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (onTabClick) onTabClick(tab.id);
              setActiveTab(tab.id);
            }}
            className={`flex flex-col items-center justify-center bg-transparent border-none cursor-pointer flex-grow py-2 ${
              isActive ? "text-emerald-400 font-extrabold scale-[1.08]" : "text-white/40"
            } transition-all duration-200`}
          >
            {tab.icon}
            <span className="text-[8.5px] mt-1 block font-bold leading-none">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ==========================================
// MEMORIES CAROUSEL & DETAIL COMPONENTS
// ==========================================

export function GuestMemoryCard({ memory, onClick }) {
  const categoryBadge = () => {
    switch (memory.category) {
      case "wedding": 
        return (
          <span className="flex items-center gap-1 text-white">
            <Heart size={10} className="fill-current text-white" /> Wedding
          </span>
        );
      case "graduation": 
        return (
          <span className="flex items-center gap-1 text-white">
            <Library size={10} className="text-white" /> Graduation
          </span>
        );
      case "birthday": 
        return (
          <span className="flex items-center gap-1 text-white">
            <Sparkles size={10} className="text-white" /> Birthday
          </span>
        );
      case "corporate": 
        return (
          <span className="flex items-center gap-1 text-white">
            <UserCheck size={10} className="text-white" /> Corporate
          </span>
        );
      default: 
        return (
          <span className="flex items-center gap-1 text-white">
            <Sparkles size={10} className="text-white" /> Etkinlik
          </span>
        );
    }
  };

  return (
    <div 
      onClick={onClick}
      className="relative w-full aspect-[16/10] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl cursor-pointer active:scale-[0.97] transition-all group shrink-0"
    >
      <img 
        src={memory.cover_url} 
        alt={memory.title} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.7]" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      
      {/* Category badge */}
      <span className="absolute top-4 left-4 bg-black/45 backdrop-blur-md text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-white border border-white/10 flex items-center justify-center">
        {categoryBadge()}
      </span>

      {/* AI badge */}
      <span className="absolute top-4 right-4 bg-emerald-500/85 backdrop-blur-md text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-lg flex items-center gap-1">
        <Sparkles size={8} className="text-white" /> AI
      </span>

      {/* Text overlays */}
      <div className="absolute bottom-4 left-4 right-4 text-left flex flex-col gap-0.5">
        <span className="text-[9px] text-white/50 font-bold uppercase tracking-wider">{memory.date} &bull; {memory.count}</span>
        <h3 className="text-sm font-black text-white m-0 tracking-tight leading-tight">{memory.title}</h3>
        <p className="text-[10px] text-white/70 font-medium m-0 mt-1 line-clamp-1 italic">{memory.description}</p>
      </div>
    </div>
  );
}

export function GuestMemoriesSection({ memories, onMemoryClick }) {
  return (
    <div className="flex flex-col gap-3 text-left w-full mt-2 select-none">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-400 shrink-0" />
          <span>Senin İçin Hazırlandı</span>
        </h3>
        <p className="text-[10px] text-white/50 font-medium m-0 leading-none">Yapay zeka senin en güzel anılarını seçti.</p>
      </div>

      {/* Horizontal Carousel List */}
      <div className="w-full overflow-hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-5 px-5 guest-horizontal-scroller">
          {memories.map(mem => (
            <div key={mem.id} className="w-[88%] shrink-0">
              <GuestMemoryCard 
                memory={mem}
                onClick={() => onMemoryClick(mem)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuestSlideshow({ photos, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % photos.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, photos]);

  if (photos.length === 0) return null;
  const currentPhoto = photos[currentIdx];

  return (
    <div className="fixed inset-0 bg-[#06080C] z-[999999] flex flex-col justify-between p-5 select-none text-white animate-fade-in guest-slideshow max-w-[430px] mx-auto w-full">
      {/* Top action header */}
      <div className="flex items-center justify-between z-10 pt-4">
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10 text-white cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>
        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          AI Oynatılıyor ({currentIdx + 1}/{photos.length})
        </span>
      </div>

      {/* Centered Slideshow Image with soft cross-fade animation */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden my-4 rounded-[28px] border border-white/5 bg-black/20">
        <div key={currentIdx} className="absolute inset-0 flex items-center justify-center animate-fade-in">
          
          {/* Blurred Background Replica */}
          <img 
            src={currentPhoto.original_url || currentPhoto.thumbnail_url} 
            alt="blurred background" 
            className="absolute inset-0 w-full h-full object-cover filter blur-[32px] opacity-25 scale-110 pointer-events-none"
          />

          {/* Main Focused Photo with Ken Burns slow zoom */}
          <div className="relative w-full h-full flex items-center justify-center p-4 z-10 overflow-hidden">
            <img 
              src={currentPhoto.original_url || currentPhoto.thumbnail_url} 
              alt="slideshow active" 
              className="max-w-full max-h-[70vh] object-contain rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/15 animate-ken-burns" 
            />
          </div>

        </div>
      </div>

      {/* Timing indicator progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6 relative">
        <div 
          key={`bar-${currentIdx}-${isPlaying}`}
          className={`absolute left-0 top-0 bottom-0 bg-emerald-400 rounded-full ${isPlaying ? 'w-full transition-all duration-[2800ms] ease-linear' : 'w-0'}`} 
          style={{ width: isPlaying ? '100%' : '0%' }}
        />
      </div>

      {/* Control Actions bar */}
      <div className="glass-panel border border-white/10 bg-black/60 backdrop-blur-md p-4.5 rounded-[24px] flex items-center justify-center gap-6 shadow-2xl mb-2">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-emerald-500 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 justify-center"
        >
          {isPlaying ? (
            <>
              <Pause size={12} className="text-white fill-white" />
              <span>Duraklat</span>
            </>
          ) : (
            <>
              <Play size={12} className="text-white fill-white" />
              <span>Devam Et</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function GuestMemoryScreen({ memory, photos, onBack, onPhotoClick, onPlaySlideshow, favorites = [], onToggleFavorite, onDownload, onShare }) {
  return (
    <div className="flex-1 flex flex-col justify-between animate-fade-in py-1 select-none">
      {/* Top Header cover image */}
      <div className="relative w-full aspect-[16/10] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shrink-0">
        <img 
          src={memory.cover_url} 
          alt={memory.title} 
          className="w-full h-full object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E121E] via-transparent to-transparent" />
        
        {/* Back navigation button */}
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center cursor-pointer text-white active:scale-90 z-20"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Text information over cover */}
        <div className="absolute bottom-5 left-5 right-5 text-left flex flex-col gap-1">
          <span className="text-[8px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-0.5 rounded-full w-fit flex items-center gap-1">
            <Sparkles size={8} className="text-emerald-400 shrink-0" />
            <span>AI Memory</span>
          </span>
          <h1 className="text-lg font-black text-white m-0 tracking-tight leading-tight mt-1">{memory.title}</h1>
          <span className="text-[10px] text-white/50 font-bold block mt-0.5">{memory.date} &bull; {memory.count}</span>
        </div>
      </div>

      {/* Details body */}
      <div className="flex flex-col gap-4 mt-4 px-1 text-left flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/70 italic font-medium m-0 max-w-[70%]">
            "{memory.description}"
          </p>

          {/* Slideshow button */}
          <button 
            onClick={() => onPlaySlideshow(photos)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
          >
            <Play size={10} className="fill-current text-white shrink-0" />
            <span>Anıları Oynat</span>
          </button>
        </div>

        {/* Photos Grid below */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Fotoğraflar ({photos.length})</span>
          <GuestPhotoGrid 
            photos={photos}
            onPhotoClick={onPhotoClick}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onDownload={onDownload}
            onShare={onShare}
          />
        </div>
      </div>
    </div>
  );
}

export function GuestPhotoGrid({ 
  photos, 
  onPhotoClick, 
  favorites = [], 
  onToggleFavorite,
  onDownload,
  onShare 
}) {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
          <ImageIcon size={22} className="text-white/20" />
        </div>
        <strong className="text-xs font-black text-white block mb-1">Henüz eşleşen fotoğraf bulunamadı</strong>
        <span className="text-[10px] text-white/40 max-w-[200px] leading-relaxed block mx-auto">
          AI eşleştirme tamamlandığında fotoğraflarınız burada görünecek.
        </span>
      </div>
    );
  }

  // Split photos into 2 columns for a clean masonry grid layout matching the design reference
  const leftColumn = photos.filter((_, idx) => idx % 2 === 0);
  const rightColumn = photos.filter((_, idx) => idx % 2 !== 0);

  const renderPhotoCard = (ph, globalIdx) => {
    const isFav = favorites.some(p => p.id === ph.id);
    
    // Stable pseudo-random likes & shares based on photo id hash
    const charCodeSum = ph.id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockLikes = (1.0 + (charCodeSum % 9) / 10).toFixed(1) + "k";
    const mockShares = (100 + (charCodeSum % 400));

    return (
      <div 
        key={ph.id}
        className="relative rounded-[28px] overflow-hidden bg-[#0A0D14] border border-white/10 group cursor-pointer active:scale-[0.98] transition-all duration-200 select-none shadow-xl"
      >
        <img 
          src={ph.thumbnail_url || ph.url} 
          alt="matched photo" 
          className="w-full h-auto object-cover block"
          onClick={() => onPhotoClick(globalIdx)}
        />
        
        {/* Apple Style Dark Overlay at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 pointer-events-none" />
        
        {/* Top-left match confidence score tag */}
        <span className="absolute top-3 left-3 backdrop-blur-md bg-black/30 border border-white/10 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 text-white select-none">
          <Sparkles size={9} className="text-emerald-400 fill-emerald-400 shrink-0" />
          <span>%{ph.matchConfidence || (94 + (charCodeSum % 6))}</span>
        </span>
        
        {/* Bottom actions pill layout matching the reference design */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-1">
          {/* Like / Favorite pill button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleFavorite) onToggleFavorite(ph);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-[10px] font-extrabold text-white cursor-pointer active:scale-90 transition-transform hover:bg-black/50"
          >
            <Heart size={11} className={isFav ? "fill-rose-500 text-rose-500" : "text-white"} />
            <span>{mockLikes}</span>
          </button>
          
          {/* Share / Download pill button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onDownload) onDownload(ph);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-[10px] font-extrabold text-white cursor-pointer active:scale-90 transition-transform hover:bg-black/50"
          >
            <Share2 size={11} className="text-white" />
            <span>{mockShares}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-3 mt-2 text-left items-start">
      {/* Left Column */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {leftColumn.map((ph, idx) => renderPhotoCard(ph, idx * 2))}
      </div>
      
      {/* Right Column */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {rightColumn.map((ph, idx) => renderPhotoCard(ph, idx * 2 + 1))}
      </div>
    </div>
  );
}

export function GuestPhotoTimeline({ 
  photos, 
  onPhotoClick, 
  favorites = [], 
  onToggleFavorite, 
  onDownload, 
  onShare 
}) {
  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
          <ImageIcon size={22} className="text-white/20" />
        </div>
        <strong className="text-xs font-black text-white block mb-1">Henüz eşleşen fotoğraf bulunamadı</strong>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 select-none py-2 overflow-hidden">
      {photos.map((ph, idx) => {
        const isFav = favorites.some(p => p.id === ph.id);
        const charCodeSum = ph.id.toString().split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

        return (
          <div 
            key={ph.id}
            className="w-full glass-panel border border-white/10 bg-white/5 rounded-[24px] overflow-hidden p-3 flex flex-col gap-2.5 relative shadow-lg hover:bg-white/10 active:scale-95 transition-all duration-200"
          >
            {/* Photo container */}
            <div 
              onClick={() => onPhotoClick(idx)}
              className="relative aspect-[3/4] w-full rounded-[18px] overflow-hidden cursor-pointer bg-[#0A0D14]"
            >
              <img 
                src={ph.thumbnail_url || ph.url} 
                alt="timeline moment photo" 
                className="w-full h-full object-cover"
              />
              
              {/* Top-left match tag */}
              <span className="absolute top-2.5 left-2.5 backdrop-blur-md bg-black/40 border border-white/10 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 text-white">
                <Sparkles size={10} className="text-emerald-400 fill-emerald-400 shrink-0" />
                <span>%{ph.matchConfidence || (94 + (charCodeSum % 6))}</span>
              </span>
            </div>

            {/* Actions row */}
            <div className="flex justify-between items-center px-1">
              {/* Favorite check */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleFavorite) onToggleFavorite(ph);
                }}
                className="bg-transparent border-none p-1 cursor-pointer flex items-center justify-center text-white/60 active:scale-90"
              >
                <Heart size={15} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDownload) onDownload(ph);
                }}
                className="bg-transparent border-none p-1 cursor-pointer flex items-center justify-center text-white/60 active:scale-90"
              >
                <Download size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}



export function GuestEventAlbumDetail({ 
  event, 
  photos, 
  onBack, 
  onPhotoClick, 
  favorites = [], 
  onToggleFavorite, 
  onDownload, 
  onShare,
  onBulkDownload,
  onPhotoUpload
}) {
  const [viewMode, setViewMode] = useState("swipe");
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const filteredPhotos = photos || [];

  React.useEffect(() => {
    if (activePhotoIdx >= filteredPhotos.length) {
      setActivePhotoIdx(Math.max(0, filteredPhotos.length - 1));
    }
  }, [filteredPhotos, activePhotoIdx]);

  // Swiping gestures are handled directly by Framer Motion drag callbacks below

  const currentPhoto = filteredPhotos[activePhotoIdx];
  const isFav = currentPhoto ? favorites.some(p => p.id === currentPhoto.id) : false;

  return (
    <div className="flex flex-col gap-4 animate-fade-in text-left">
      {/* Back button & Action Header */}
      <div className="flex items-center justify-between z-10 w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center gap-1 bg-transparent border-none text-xs font-black cursor-pointer p-0 active:opacity-75 transition-opacity"
            style={{ color: "var(--guest-accent)" }}
          >
            <ArrowLeft size={16} />
            <span>Albümler</span>
          </button>

          {/* Conditional Upload Photo Button - Only for Wedding category! */}
          {event?.category === "wedding" && (
            <>
              <button
                onClick={() => {
                  document.getElementById("guest-album-photo-upload").click();
                }}
                className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Upload size={10} />
                <span>Fotoğraf Yükle</span>
              </button>
              <input 
                type="file" 
                id="guest-album-photo-upload" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const localUrl = URL.createObjectURL(file);
                    const newPhoto = {
                      id: `ph-uploaded-${Date.now()}`,
                      event_id: event.id,
                      url: localUrl,
                      thumbnail_url: localUrl,
                      filename: file.name,
                      matchConfidence: 100,
                      date: new Date().toISOString()
                    };
                    if (onPhotoUpload) onPhotoUpload(newPhoto);
                  }
                }}
              />
            </>
          )}
        </div>
        
        {/* Apple style Glass Pill Selector for viewMode */}
        <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 select-none shrink-0 shadow-inner">
          <button
            onClick={() => setViewMode("swipe")}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 ${
              viewMode === "swipe" 
                ? "bg-white/10 text-white shadow-md" 
                : "bg-transparent text-white/40"
            }`}
          >
            <Library size={10} />
            <span>Kaydır</span>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 ${
              viewMode === "grid" 
                ? "bg-white/10 text-white shadow-md" 
                : "bg-transparent text-white/40"
            }`}
          >
            <Grid size={10} />
            <span>Izgara</span>
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 ${
              viewMode === "timeline" 
                ? "bg-white/10 text-white shadow-md" 
                : "bg-transparent text-white/40"
            }`}
          >
            <Clock size={10} />
            <span>Zaman</span>
          </button>
        </div>
      </div>

      {viewMode === "swipe" ? (
        /* Cinematic Swipe View */
        <div className="flex flex-col gap-4 w-full select-none animate-fade-in pb-16">
          
          <div className="flex flex-col text-left px-1 mt-1">
            <h1 className="text-xl font-black text-white m-0 tracking-tight leading-tight">{event.title}</h1>
            <span className="text-[9px] text-white/50 font-bold block mt-1">
              {filteredPhotos.length} anı &bull; {new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Large Swipeable Photo Card (Framer Motion Elastic Drag & Snap) */}
          {filteredPhotos.length > 0 ? (
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[36px] bg-black/40 border border-white/10 shadow-2xl">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentPhoto.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 60;
                    if (info.offset.x < -swipeThreshold) {
                      // Swiped left -> next photo
                      setActivePhotoIdx(prev => (prev < filteredPhotos.length - 1 ? prev + 1 : prev));
                    } else if (info.offset.x > swipeThreshold) {
                      // Swiped right -> prev photo
                      setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : prev));
                    }
                  }}
                  onTap={() => onPhotoClick(photos.findIndex(p => p.id === currentPhoto.id))}
                  initial={{ opacity: 0, scale: 0.96, x: 80 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.96, x: -80 }}
                  transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  className="w-full h-full cursor-grab active:cursor-grabbing absolute inset-0 select-none touch-none"
                >
                  <img 
                    src={currentPhoto.original_url || currentPhoto.thumbnail_url} 
                    alt="swipe photo" 
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  
                  {/* Bottom blur gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                  {/* Match Tag */}
                  <span className="absolute top-4 left-4 backdrop-blur-md bg-black/40 border border-white/10 text-[9px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 text-white">
                    <Sparkles size={10} className="text-emerald-400 fill-emerald-400 shrink-0" />
                    <span>%{currentPhoto.matchConfidence || 96} Match</span>
                  </span>

                  {/* Index Indicator */}
                  <span className="absolute bottom-4 right-4 backdrop-blur-md bg-black/40 border border-white/10 text-[9px] font-black px-2.5 py-0.5 rounded-full text-white">
                    {activePhotoIdx + 1} / {filteredPhotos.length}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none animate-fade-in bg-white/5 border border-white/5 rounded-[36px]">
              <ImageIcon size={28} className="text-white/20 mb-3" />
              <strong className="text-xs font-black text-white block">Eşleşen fotoğraf bulunamadı</strong>
            </div>
          )}

          {/* Face filters row removed */}

          {/* Bottom Actions Tray */}
          {filteredPhotos.length > 0 && (
            <div className="flex items-center justify-between gap-3 mt-2 px-1 z-10 shrink-0">
              <button 
                onClick={() => onToggleFavorite(currentPhoto)}
                className={`w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer active:scale-90 transition-transform ${
                  isFav 
                    ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white/5 border-white/10 text-white"
                }`}
              >
                <Heart size={16} className={isFav ? "fill-white" : ""} />
              </button>

              <button 
                onClick={() => onBulkDownload(filteredPhotos)}
                className="flex-1 h-12 bg-white text-black font-black text-xs rounded-full flex items-center justify-center shadow-xl active:scale-98 transition-transform cursor-pointer"
              >
                <span>Tümünü İndir ({filteredPhotos.length})</span>
              </button>

              <button 
                onClick={() => onDownload(currentPhoto)}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
              >
                <Download size={16} />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Standard Grid & Timeline Views */
        <>
          <div className="relative w-full aspect-[2/1] rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={event.cover_url} 
              alt={event.title} 
              className="w-full h-full object-cover brightness-[0.7]" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-0.5">
              <strong className="text-sm font-black text-white leading-tight truncate">{event.title}</strong>
              <span className="text-[10px] text-white/60 leading-none truncate">{event.location} &bull; {new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline mt-2 px-1">
            <h3 className="text-base font-black m-0 text-white">Senin Anıların</h3>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onBulkDownload(photos)}
                className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 active:scale-95 transition-transform"
              >
                Toplu İndir
              </button>
              <span className="text-[10px] text-white/40 font-bold">{photos.length} Fotoğraf</span>
            </div>
          </div>

          <div className="px-1">
            {viewMode === "grid" ? (
              <GuestPhotoGrid 
                photos={photos} 
                onPhotoClick={onPhotoClick}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                onDownload={onDownload}
                onShare={onShare}
              />
            ) : (
              <GuestPhotoTimeline 
                photos={photos} 
                onPhotoClick={onPhotoClick}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                onDownload={onDownload}
                onShare={onShare}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function GuestPhotoInfoSheet({ photo, event, onClose }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-[#0E121E]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[32px] p-5 z-[100000] text-left animate-slide-up shadow-[0_-12px_40px_rgba(0,0,0,0.6)]">
      {/* Notch handle */}
      <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />
      
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-black text-white m-0">Fotoğraf Bilgileri</h4>
        <button 
          onClick={onClose}
          className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 cursor-pointer active:scale-95"
        >
          Kapat
        </button>
      </div>

      <div className="flex flex-col gap-3 text-xs mt-2">
        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">Albüm / Etkinlik</span>
          <strong className="text-white font-black truncate max-w-[200px]">{event?.title || "Etkinlik Albümü"}</strong>
        </div>

        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">Tarih</span>
          <strong className="text-white">{event ? new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "-"}</strong>
        </div>

        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">Dosya Adı</span>
          <strong className="text-white font-mono text-[10px] truncate max-w-[200px]">{photo.filename}</strong>
        </div>

        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">AI Eşleşme Oranı</span>
          <strong className="text-emerald-400 font-extrabold">% {photo.matchConfidence || 98}</strong>
        </div>

        <div className="flex justify-between border-b border-white/5 pb-2">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">Kaynak</span>
          <strong className="text-white font-semibold">Photographer</strong>
        </div>

        <div className="flex justify-between pb-1">
          <span className="text-white/40 font-bold uppercase tracking-wider text-[8px]">Durum</span>
          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-full uppercase tracking-wider leading-none">
            {photo.status || "approved"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function GuestPhotoLightbox({ 
  photo, 
  event, 
  onClose, 
  isFavorite, 
  onToggleFavorite, 
  onDownload, 
  onShare 
}) {
  const [zoomVal, setZoomVal] = useState(1);
  const [showInfoSheet, setShowInfoSheet] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      setZoomVal(prev => (prev > 1 ? 1 : 2));
    }
    setLastTap(now);
  };

  return (
    <div className="fixed inset-0 bg-[#06080C] z-[99999] flex flex-col justify-between p-5 select-none text-white animate-fade-in guest-lightbox max-w-[430px] mx-auto w-full">
      {/* Header action bar */}
      <div className="flex items-center justify-between z-10 pt-4">
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/5 text-white cursor-pointer active:scale-90"
        >
          <X size={18} />
        </button>
        <span className="text-[10px] font-black uppercase text-white/50 tracking-widest bg-white/5 border border-white/5 px-3 py-1 rounded-full">
          Görünüm
        </span>
      </div>

      {/* Centered Image */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden my-4">
        <div 
          className="transition-transform duration-200 ease-out max-w-full max-h-full flex items-center justify-center" 
          style={{ transform: `scale(${zoomVal})` }}
        >
          <img 
            src={photo.original_url || photo.thumbnail_url} 
            alt="lightbox preview" 
            className="max-w-full max-h-[66vh] object-contain rounded-2xl shadow-2xl border border-white/10 cursor-zoom-in active:scale-[0.98] transition-transform" 
            onDoubleClick={() => setZoomVal(prev => (prev > 1 ? 1 : 2))}
            onTouchEnd={handleDoubleTap}
          />
        </div>
      </div>

      {/* Zoom scale slider */}
      <div className="flex flex-col gap-1.5 items-center bg-black/40 p-2.5 rounded-2xl border border-white/5 mx-auto max-w-[200px] w-full mb-3 shrink-0">
        <span className="text-[8px] font-black uppercase text-white/50 tracking-wider">Yakınlaştırma: {Math.round(zoomVal * 100)}%</span>
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

      {/* Bottom action icons bar */}
      <div className="glass-panel border border-white/5 bg-[#0E121E]/90 p-4 rounded-[24px] flex items-center justify-around shadow-2xl shrink-0 z-10">
        <button 
          onClick={onToggleFavorite}
          className="flex flex-col items-center justify-center bg-transparent border-none gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Heart size={20} className={isFavorite ? "fill-rose-500 text-rose-500" : "text-white/60"} />
          <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Favori</span>
        </button>

        <button 
          onClick={onDownload}
          className="flex flex-col items-center justify-center bg-transparent border-none gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Download size={20} className="text-white/60" />
          <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">İndir</span>
        </button>

        <button 
          onClick={onShare}
          className="flex flex-col items-center justify-center bg-transparent border-none gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Share2 size={20} className="text-white/60" />
          <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Paylaş</span>
        </button>

        <button 
          onClick={() => setShowInfoSheet(true)}
          className="flex flex-col items-center justify-center bg-transparent border-none gap-1 cursor-pointer active:scale-95 transition-transform"
        >
          <Info size={20} className={showInfoSheet ? "text-emerald-400" : "text-white/60"} />
          <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Bilgi</span>
        </button>
      </div>

      {/* Slide up info bottom sheet */}
      {showInfoSheet && (
        <GuestPhotoInfoSheet 
          photo={photo} 
          event={event} 
          onClose={() => setShowInfoSheet(false)} 
        />
      )}
    </div>
  );
}

// ==========================================
// MOCK AI MEMORIES DATA
// ==========================================
const MOCK_MEMORIES = [
  {
    id: "mem-1",
    title: "Ece & Mert Düğünü",
    date: "9 Temmuz 2026",
    count: "143 Anı",
    category: "wedding",
    cover_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
    description: "Ece & Mert düğününde yakalanan en özel anlar."
  },
  {
    id: "mem-2",
    title: "En Çok Gülümsediğiniz Anlar",
    date: "Temmuz 2026",
    count: "86 Anı",
    category: "birthday",
    cover_url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    description: "Etkinlik genelinde en mutlu göründüğünüz ve gülümsediğiniz kareler."
  },
  {
    id: "mem-3",
    title: "Grup Fotoğrafları",
    date: "Haziran 2026",
    count: "27 Anı",
    category: "corporate",
    cover_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80",
    description: "Arkadaşlarınızla ve sevdiklerinizle bir arada olduğunuz en keyifli anlar."
  }
];

// ==========================================
// MAIN GUEST FLOW PAGE COMPONENT
// ==========================================

export default function GuestFlow() {
  const { token } = useParams();
  const navigate = useNavigate();
const { showToast } = useToast();
  const { login } = useAuth();
  
  // App States
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [consentChecked, setConsentChecked] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState("");
  const fileInputRef = useRef(null);
  
  // Persistence state resolver
  const [step, setStep] = useState(() => {
    const pathParts = window.location.pathname.split("/guest/");
    const urlToken = pathParts[1] || "";
    try {
      if (urlToken) {
        const onboardingData = localStorage.getItem("sm_guest_onboarding_" + urlToken);
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.consentAccepted && parsed.guestName) {
            return "albums";
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return "qr";
  });
  
  const currentIdx = STEPS.indexOf(step);

  const [qrSubStep, setQrSubStep] = useState("scanning"); // scanning, verified
  const [kvkkChecked, setKvkkChecked] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const pathParts = window.location.pathname.split("/guest/");
    const urlToken = pathParts[1] || "";
    try {
      if (urlToken) {
        const onboardingData = localStorage.getItem("sm_guest_onboarding_" + urlToken);
        if (onboardingData) {
          const parsed = JSON.parse(onboardingData);
          if (parsed.consentAccepted && parsed.guestName) {
            return "photos";
          }
        }
      }
    } catch {}
    return "albums";
  }); // albums, photos, search, favorites, settings
  const [selectedEvent, setSelectedEvent] = useState(null); // active event for Screen 7
  const [selectedMemory, setSelectedMemory] = useState(null); // active AI Memory detail page
  const [photosViewMode, setPhotosViewMode] = useState("grid");
  const [albumViewMode, setAlbumViewMode] = useState("grid"); // grid, slide
  
  // Form/Auth States
  const [guestName, setGuestName] = useState(() => {
    const pathParts = window.location.pathname.split("/guest/");
    const urlToken = pathParts[1] || "";
    try {
      if (urlToken) {
        const onboardingData = localStorage.getItem(`sm_guest_onboarding_${urlToken}`);
        if (onboardingData) {
          return JSON.parse(onboardingData).guestName || "";
        }
      }
    } catch {}
    return "";
  });
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);
  const [consent3, setConsent3] = useState(false);
  
  // Selfie States
  const [selfieStage, setSelfieStage] = useState(0);
  const [selfieCaptured, setSelfieCaptured] = useState(() => {
    const pathParts = window.location.pathname.split("/guest/");
    const urlToken = pathParts[1] || "";
    try {
      if (urlToken) {
        const onboardingData = localStorage.getItem(`sm_guest_onboarding_${urlToken}`);
        if (onboardingData) {
          return JSON.parse(onboardingData).selfieCaptured || false;
        }
      }
    } catch {}
    return false;
  });
  const [selfieUrl, setSelfieUrl] = useState(() => {
    const pathParts = window.location.pathname.split("/guest/");
    const urlToken = pathParts[1] || "";
    try {
      if (urlToken) {
        const onboardingData = localStorage.getItem(`sm_guest_onboarding_${urlToken}`);
        if (onboardingData) {
          return JSON.parse(onboardingData).selfieUrl || "";
        }
      }
    } catch {}
    return "";
  });
  const [flashActive, setFlashActive] = useState(false);
  
  // Matches Data
  const [participant, setParticipant] = useState(null);
  const [matchedPhotosMap, setMatchedPhotosMap] = useState({}); // eventId -> photos array
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("sm_guest_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Lightbox State
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoEvent, setSelectedPhotoEvent] = useState(null);
  const [activeSlideshowPhotos, setActiveSlideshowPhotos] = useState(null);
  const [activeSharePhoto, setActiveSharePhoto] = useState(null);
  const [activeShareCardPhoto, setActiveShareCardPhoto] = useState(null);

  // Pull-to-refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const containerRef = React.useRef(null);

  // Simulation loading progress
  const [preparingPercent, setPreparingPercent] = useState(0);
  const [preparingStatusIdx, setPreparingStatusIdx] = useState(0);

  // Theme state
  const [guestTheme, setGuestTheme] = useState(() => localStorage.getItem("sm_guest_theme") || "beige");

  // Sync favorites with localStorage
  useEffect(() => {
localStorage.setItem("sm_guest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Initialize event and load other events for albums
  useEffect(() => {
    const events = mockApi.getEvents();
    setAllEvents(events);
    
    const matchedEvent = events.find(e => e.qr_token === token) || events[0];
    if (matchedEvent) {
      setEvent(matchedEvent);
    }
  }, [token]);

  // Populate matched photos map on mount if onboarding completed
  useEffect(() => {
    const onboardingData = localStorage.getItem(`sm_guest_onboarding_${token}`);
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData);
        if (parsed && parsed.selfieCaptured) {
          const events = mockApi.getEvents();
          const loadedMatches = {};
          
          // Re-create or find participant in mock DB
          let part = mockApi.getParticipants(event?.id || events[0]?.id).find(p => p.name === parsed.guestName);
          if (!part) {
            part = mockApi.createParticipant(event?.id || events[0]?.id, parsed.guestName, parsed.selfieUrl);
          }
          setParticipant(part);

          events.forEach(evt => {
            mockApi.simulateAiMatchingForParticipant(evt.id, part.id);
            const allMatches = mockApi.getMatches(evt.id);
            const participantMatches = allMatches.filter(m => m.participant_id === part.id);
            const eventPhotos = mockApi.getPhotos(evt.id);
            let matched = eventPhotos.filter(ph => 
              participantMatches.some(m => m.photo_id === ph.id)
            );
            if (matched.length === 0 && eventPhotos.length > 0) {
              matched = eventPhotos.slice(0, Math.min(3, eventPhotos.length));
            }
            loadedMatches[evt.id] = matched;
          });
          setMatchedPhotosMap(loadedMatches);
        }
      } catch (err) {
        console.error("Error restoring matching photos on mount:", err);
      }
    }
  }, [token, event]);

  // Auto-transition from QR scanning to QR verified to Welcome
  useEffect(() => {
    if (step === "qr") {
      setQrSubStep("scanning");
      const timer1 = setTimeout(() => {
        setQrSubStep("verified");
      }, 2000);
      const timer2 = setTimeout(() => {
        setStep("welcome");
      }, 3500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [step]);

  // Simulate selfie scanning indicators
  useEffect(() => {
    if (step === "selfie") {
      setSelfieStage(0);
      setSelfieCaptured(false);
      const timer1 = setTimeout(() => setSelfieStage(1), 600);
      const timer2 = setTimeout(() => setSelfieStage(2), 1200);
      const timer3 = setTimeout(() => setSelfieStage(3), 1800);
      const timer4 = setTimeout(() => setSelfieStage(4), 2400);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [step]);

  // AI analysis processing loader simulation
  useEffect(() => {
    if (step === "processing") {
      setPreparingPercent(0);
      setPreparingStatusIdx(0);

      const startTime = Date.now();
      const duration = 3000; // 3 seconds total

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min(100, Math.round((elapsed / duration) * 100));
        setPreparingPercent(percentage);

        // 5 status logs over 3000ms: 600ms per status
        const idx = Math.min(4, Math.floor(elapsed / 600));
        setPreparingStatusIdx(idx);

        if (percentage >= 100) {
          clearInterval(interval);
          const timer = setTimeout(() => {
            setStep("albums");
            setActiveTab("photos");
            showToast("Fotoğrafların başarıyla eşleştirildi!", "success");
          }, 400);
          return () => clearTimeout(timer);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [step]);

  const handleConsentSubmit = () => {
if (!consent1 || !consent2 || !consent3) {
      showToast("Lütfen tüm onayları işaretleyin.", "warning");
      return;
    }
    setStep("selfie");
  };

const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelfiePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUploadSelfie = () => {
    if (!guestName.trim()) {
      showToast("Lütfen adınızı soyadınızı girin.", "warning");
      return;
    }
    
    // Simulate flash
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 300);

    const mockSelfie = selfiePreview || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
    setSelfieUrl(mockSelfie);
    setSelfieCaptured(true);

    showToast("Selfie kaydedildi, yüz taranıyor...", "success");

    // Save onboarding details to localStorage
    const onboardingObj = {
      consentAccepted: true,
      selfieCaptured: true,
      guestName: guestName,
      selfieUrl: mockSelfie
    };
    localStorage.setItem("sm_guest_onboarding_" + token, JSON.stringify(onboardingObj));

    // Register in mock DB
    const newPart = mockApi.createParticipant(event.id, guestName, mockSelfie);
    setParticipant(newPart);

    // Call login from AuthContext so they have a participant session registered
    if (login) {
      const initials = guestName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      login({
        role: "katilimci",
        name: guestName,
        email: guestName.toLowerCase().replace(/\s+/g, "") + "@example.com",
        initials,
        eventToken: token,
        hasSelfie: true,
      });
    }

    // Simulate matches across ALL events in the DB so other albums have pictures
    const loadedMatches = {};
    const events = mockApi.getEvents();
    
    events.forEach(evt => {
      mockApi.simulateAiMatchingForParticipant(evt.id, newPart.id);
      
      const allMatches = mockApi.getMatches(evt.id);
      const participantMatches = allMatches.filter(m => m.participant_id === newPart.id);
      const eventPhotos = mockApi.getPhotos(evt.id);
      
      let matched = eventPhotos.filter(ph => 
        participantMatches.some(m => m.photo_id === ph.id)
      );

      if (matched.length === 0 && eventPhotos.length > 0) {
        matched = eventPhotos.slice(0, Math.min(3, eventPhotos.length));
      }

      loadedMatches[evt.id] = matched;
    });

    setMatchedPhotosMap(loadedMatches);
    setStep("processing");
  };

  const getTotalMatchedCount = () => {
    return Object.values(matchedPhotosMap).reduce((acc, curr) => acc + curr.length, 0);
  };

  const handleTouchStart = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0 && !isRefreshing) {
      setTouchStartY(e.touches[0].clientY);
    } else {
      setTouchStartY(0);
    }
  };

  const handleTouchMove = (e) => {
    if (touchStartY === 0 || isRefreshing) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;
    if (deltaY > 0) {
      const dist = Math.min(60, deltaY * 0.3);
      setPullDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    if (isRefreshing) return;
    if (pullDistance >= 40) {
      setIsRefreshing(true);
      setPullDistance(40);
      showToast("Yeni fotoğraflar kontrol ediliyor...", "success");
      
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
        showToast("Yeni fotoğraf bulunamadı, albümünüz güncel!", "success");
      }, 1500);
    } else {
      setPullDistance(0);
    }
    setTouchStartY(0);
  };

  const handleDeleteFaceData = () => {
    if (participant) {
      mockApi.deleteParticipantFaceData(participant.id);
    }
    showToast("Tüm verileriniz kalıcı olarak silindi.", "success");
    
    setParticipant(null);
    setGuestName("");
    setConsent1(false);
    setConsent2(false);
    setConsent3(false);
    setSelfieCaptured(false);
    setSelfieUrl("");
    setMatchedPhotosMap({});
    setFavorites([]);
    localStorage.removeItem("sm_guest_favorites");
    localStorage.removeItem("sm_guest_onboarding_" + token);
    setStep("qr");
    setActiveTab("albums");
    setSelectedEvent(null);
    setSelectedMemory(null);
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    if (previewPhotoIndex > 0) {
      setPreviewPhotoIndex(previewPhotoIndex - 1);
      setZoomVal(1);
    } else {
      setPreviewPhotoIndex(previewPhotosList.length - 1);
      setZoomVal(1);
    }
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    if (previewPhotoIndex < previewPhotosList.length - 1) {
      setPreviewPhotoIndex(previewPhotoIndex + 1);
      setZoomVal(1);
    } else {
      setPreviewPhotoIndex(0);
      setZoomVal(1);
    }
  };

  const handleToggleFavorite = (photo) => {
    setFavorites(prev => {
      const isFav = prev.some(p => p.id === photo.id);
      if (isFav) {
        showToast("Favorilerden kaldırıldı.", "info");
        return prev.filter(p => p.id !== photo.id);
      } else {
        showToast("Favorilere eklendi!", "success");
        return [...prev, photo];
      }
    });
  };

  const handleDownload = (photo) => {
    showToast("Görsel indiriliyor...", "success");
    fetch(photo.thumbnail_url || photo.url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = photo.filename || "snapmatch-photo.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        showToast("Görsel cihazınıza kaydedildi!", "success");
      })
      .catch(() => {
        window.open(photo.thumbnail_url || photo.url, "_blank");
      });
  };

  const handleBulkDownload = async (photosToDownload) => {
    if (!photosToDownload || photosToDownload.length === 0) {
      showToast("İndirilecek fotoğraf bulunamadı.", "warning");
      return;
    }
    
    showToast(`${photosToDownload.length} fotoğraf sırayla indiriliyor...`, "info");
    
    for (let i = 0; i < photosToDownload.length; i++) {
      const photo = photosToDownload[i];
      try {
        const response = await fetch(photo.thumbnail_url || photo.url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = photo.filename || `snapmatch-photo-${i + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (err) {
        console.error("Bulk download error:", err);
      }
    }
    showToast("Tüm fotoğraflar başarıyla indirildi!", "success");
  };

  const handleShare = (photo) => {
    setActiveSharePhoto(photo);
  };

  if (!event) {
    return (
<div className="guest-flow-container flex justify-center items-center min-h-screen p-5">
        <GlassCard className="glass-panel max-w-[420px] text-center p-7.5">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Geçersiz QR Kod</h3>
          <p className="text-[var(--text-muted)] text-[0.85rem]">Lütfen QR kodu tekrar okutun veya doğru bağlantıyı ziyaret edin.</p>
        </GlassCard>
      </div>
    );
  }

  // Status logs for loader
  const statusLogs = [
    "QR bilgileri doğrulandı",
    "Selfie analiz ediliyor",
    "Fotoğraflar taranıyor",
    "Eşleşmeler hazırlanıyor",
    "Albüm oluşturuluyor"
  ];

  return (
    <div className="guest-app-root">
      {/* Visual gradients */}
      <div className="absolute top-[-10%] left-[-20%] w-[70%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0 guest-bg-blob-1" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[70%] h-[50%] rounded-full bg-emerald-500/8 blur-[100px] pointer-events-none z-0 guest-bg-blob-2" />
      <div className="absolute top-[40%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-500/6 blur-[90px] pointer-events-none z-0 guest-bg-blob-3" />

      {/* Main Wrapper */}
      <div className={`guest-app-wrapper guest-theme-${guestTheme}`}>
        
        {/* Instagram Story Style Step Progress Lines */}
        {["welcome", "consent", "selfie"].includes(step) && (
          <div className="flex gap-1.5 w-full px-1 mb-2 shrink-0 select-none z-10">
            {["welcome", "consent", "selfie"].map((st, idx) => {
              const stepsList = ["welcome", "consent", "selfie"];
              const currentIdx = stepsList.indexOf(step);
              let barClass = "h-0.5 rounded-full flex-1 transition-all duration-500";
              if (idx < currentIdx) {
                barClass += " bg-blue-500";
              } else if (idx === currentIdx) {
                barClass += " bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]";
              } else {
                barClass += " bg-white/10";
              }
              return <div key={st} className={barClass} />;
            })}
          </div>
        )}
        
        {/* STEP 1: QR Verification screen */}
        {step === "qr" && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in p-6 select-none">
            {qrSubStep === "scanning" ? (
              <>
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-pulse">
                  <QrCode size={40} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-white m-0 tracking-tight">QR Kod Algılanıyor</h2>
                <strong className="text-[10px] text-white/40 block mt-2 font-mono uppercase tracking-widest">{token}</strong>
                
                <div className="flex flex-col gap-1.5 items-center mt-12 w-full">
                  <span className="text-[9px] font-black uppercase text-blue-400 tracking-wider">Kamera ve sinyal aranıyor...</span>
                  <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden mt-2 relative">
                    <div className="animate-progress-loading" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={40} className="text-emerald-400 animate-scale-in" />
                </div>
                <h2 className="text-xl font-black text-white m-0 tracking-tight">QR Kod Doğrulandı</h2>
                <strong className="text-xs text-white/50 block mt-2 font-medium">{event.title}</strong>
                
                <div className="flex flex-col gap-1.5 items-center mt-12 w-full">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Etkinliğe bağlanıyorsunuz...</span>
                  <div className="w-28 h-1 bg-white/10 rounded-full overflow-hidden mt-2 relative">
                    <div className="animate-progress-loading" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: Welcome / Onboarding Landing Screen */}
        {step === "welcome" && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none min-h-0 w-full animate-fade-in py-1 select-none pb-8 guest-safe-area-pb">
            {/* Top part cover card */}
            <div className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl shrink-0">
              <img 
                src={event.cover_url || "https://images.unsplash.com/photo-1519741497674-611481863552?w=500"} 
                alt={event.title} 
                className="w-full h-full object-cover brightness-[0.65]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E121E] via-transparent to-transparent" />
              
              {/* Back navigation to QR page */}
              <button 
                onClick={() => setStep("qr")}
                className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center cursor-pointer text-white z-10 active:scale-90"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 text-left">
                <span className="text-[9px] text-white/50 font-black bg-white/10 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider w-fit mb-1.5 flex items-center gap-1.5">
                  {event.category === "wedding" ? (
                    <>
                      <Heart size={10} className="fill-current text-rose-400" />
                      <span>Düğün</span>
                    </>
                  ) : event.category === "graduation" ? (
                    <>
                      <Library size={10} className="text-blue-400" />
                      <span>Mezuniyet</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={10} className="text-amber-400" />
                      <span>Etkinlik</span>
                    </>
                  )}
                </span>
                <h1 className="text-xl font-black text-white m-0 tracking-tight leading-tight">{event.title}</h1>
                <span className="text-[10px] text-white/60 font-medium block mt-1">{event.location} &bull; {new Date(event.date).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</span>
                <span className="text-[9px] text-emerald-400 font-extrabold mt-1 flex items-center gap-1">
                  <ImageIcon size={10} />
                  <span>1.240 Fotoğraf Yüklendi</span>
                </span>
              </div>
            </div>

            {/* Bottom info section */}
            <div className="flex flex-col gap-5 px-1 mt-4 flex-grow justify-between text-left">
              <div className="flex flex-col gap-4">
                <p className="text-xs text-white/70 leading-relaxed font-medium m-0">
                  Bu etkinlikte çekilen fotoğraflar arasından yapay zeka sadece size ait anıları bulacaktır.
                </p>

                {/* Bullet Rows */}
                <div className="flex flex-col gap-3.5 mt-1 bg-white/5 border border-white/5 p-4 rounded-[24px]">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-[10px] text-white/60 font-bold">Yapay Zeka Yüz Eşleştirme</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Shield size={14} />
                    </div>
                    <span className="text-[10px] text-white/60 font-bold">Güvenli KVKK Korumalı Altyapı</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                      <Clock size={14} />
                    </div>
                    <span className="text-[10px] text-white/60 font-bold">Ortalama 5 Saniye İşlem Süresi</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <Lock size={14} />
                    </div>
                    <span className="text-[10px] text-white/60 font-bold">Fotoğraflar Sadece Size Gösterilir</span>
                  </div>
                </div>
              </div>

              {/* Devam Et Button */}
              <button 
                onClick={() => setStep("consent")}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all mt-4 shrink-0"
              >
                <span>Devam Et</span>
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: KVKK Privacy / Consent screen */}
        {step === "consent" && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none min-h-0 w-full animate-fade-in py-1 select-none pb-8 guest-safe-area-pb">
            <div className="flex flex-col gap-3 mt-4 text-left">
              <button 
                onClick={() => setStep("welcome")}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer text-white/75 active:scale-90"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-xl font-black m-0 mt-3 text-white">Gizliliğiniz Önceliğimiz</h2>
              <p className="text-white/50 text-xs m-0 leading-relaxed">
                Kişisel verilerinizin korunması ve güvenliği bizim için en önemli unsurdur.
              </p>
            </div>

            {/* Privacy list items */}
            <div className="flex flex-col gap-3 my-6 justify-center flex-grow">
              <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/5 text-left flex gap-3.5 items-start">
                <ShieldCheck size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-white/70 leading-relaxed font-medium">Selfie yalnızca bu etkinlikte fotoğraflarınızı bulmak için kullanılır.</span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/5 text-left flex gap-3.5 items-start">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-white/70 leading-relaxed font-medium">Fotoğraflarınız başka katılımcılarla paylaşılmaz.</span>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/5 text-left flex gap-3.5 items-start">
                <ShieldCheck size={16} className="text-purple-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-white/70 leading-relaxed font-medium">İstediğiniz zaman yüz verinizi silebilirsiniz.</span>
              </div>
            </div>

            {/* KVKK Checkbox & CTA */}
            <div className="flex flex-col gap-4 mt-auto">
              <div 
                onClick={() => setKvkkChecked(!kvkkChecked)}
                className={`flex items-center gap-3 text-left p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer select-none shadow-md ${
                  kvkkChecked 
                    ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]" 
                    : "bg-white/10 border-white/20 hover:bg-white/15"
                }`}
              >
                <div className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                  kvkkChecked 
                    ? 'bg-emerald-500 border-emerald-500 text-white scale-[1.05]' 
                    : 'border-white/40 bg-white/5 text-transparent'
                }`}>
                  {kvkkChecked && <Check size={12} strokeWidth={3.5} className="text-white" />}
                </div>
                <span className={`text-[11px] transition-colors ${
                  kvkkChecked ? 'text-white font-extrabold' : 'text-white/80 font-bold'
                }`}>
                  KVKK metnini okudum ve kabul ediyorum.
                </span>
              </div>

              <button 
                onClick={() => {
                  setConsent1(true);
                  setConsent2(true);
                  setConsent3(true);
                  setStep("selfie");
                }}
                disabled={!kvkkChecked}
                className={`w-full py-4 text-xs font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all ${
                  kvkkChecked
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg" 
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                <span>Devam Et</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Selfie Face Registration Onboarding */}
        {step === "selfie" && (
          <div className="flex-1 flex flex-col justify-between overflow-y-auto scrollbar-none min-h-0 w-full animate-fade-in relative py-1 select-none pb-8 guest-safe-area-pb">
            {/* Camera Flash overlay simulation */}
            {flashActive && (
              <div className="absolute inset-0 bg-white z-[99999] animate-fade-out" />
            )}

            <div className="flex flex-col gap-3 mt-4 text-left">
              <button 
                onClick={() => setStep("consent")}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer text-white/75 active:scale-90"
              >
                <ArrowLeft size={16} />
              </button>
              <h2 className="text-xl font-black m-0 mt-3 text-white">Yüz Kaydınızı Oluşturun</h2>
              <p className="text-white/50 text-xs m-0">
                Size ait fotoğrafları bulabilmemiz için bir selfie gerekiyor.
              </p>
            </div>

            {/* Circular Camera Viewport */}
            <div className="relative aspect-square w-full max-w-[240px] mx-auto my-6 rounded-full overflow-hidden border-2 border-white/20 bg-black/40 flex items-center justify-center shadow-inner">
              <style>{`
                @keyframes scanner-sweep {
                  0% { top: 10%; opacity: 0.3; }
                  50% { top: 85%; opacity: 1; }
                  100% { top: 10%; opacity: 0.3; }
                }
                .animate-scanner-sweep {
                  animation: scanner-sweep 2.5s ease-in-out infinite;
                }
              `}</style>

              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{
                  backgroundImage: selfieCaptured ? 'url("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80")' : 'none',
                  filter: selfieCaptured ? "brightness(1) contrast(1.05)" : "none"
                }}
              />

              {/* Biometric Face Guide Oval & Scanner Line */}
              {!selfieCaptured && (
                <div className="absolute inset-3 rounded-full border border-dashed border-blue-400/30 flex items-center justify-center pointer-events-none z-10 animate-pulse">
                  <div className="w-[85%] h-[85%] rounded-[60%_60%_60%_60%_/_70%_70%_50%_50%] border-2 border-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.25)] relative overflow-hidden">
                    {/* Scanner line animation inside the oval */}
                    <div className="absolute left-0 right-0 h-[2px] bg-blue-400/70 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-scanner-sweep" />
                  </div>
                </div>
              )}

              {!selfieCaptured ? (
                <div className="flex flex-col items-center justify-center text-white/20 gap-2 z-10">
                  <Camera size={32} />
                  <span className="text-[8px] font-black uppercase tracking-wider">Kamera Hazır</span>
                </div>
              ) : (
                <div className="relative z-20 w-12 h-12 rounded-full bg-emerald-500/90 flex items-center justify-center border-2 border-white/50 animate-scale-in">
                  <Check size={24} className="text-white" />
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="flex flex-col gap-2 px-6 items-center">
              <span className="text-[10px] text-white/60 font-bold flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Kameraya doğru bakın</span>
              </span>
              <span className="text-[10px] text-white/60 font-bold flex items-center gap-1.5 justify-center">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span>Karanlık ortamdan kaçının</span>
              </span>
            </div>

            {/* Camera Actions */}
            <div className="flex flex-col gap-4 mt-6">
              {!selfieCaptured ? (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setFlashActive(true);
                        setTimeout(() => setFlashActive(false), 300);
                        setSelfieCaptured(true);
                        showToast("Kamera açıldı, selfie kaydedildi.", "success");
                      }}
                      className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                    >
                      <Camera size={14} />
                      <span>Kamerayı Aç</span>
                    </button>

                    <button 
                      onClick={() => {
                        setGuestName("Ezgi Çelik");
                        const mockSelfie = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80";
                        setSelfieUrl(mockSelfie);
                        setSelfieCaptured(true);
                        
                        // Directly trigger matches and advance to processing
                        const newPart = mockApi.createParticipant(event.id, "Ezgi Çelik", mockSelfie);
                        setParticipant(newPart);
                        const loadedMatches = {};
                        const events = mockApi.getEvents();
                        events.forEach(evt => {
                          mockApi.simulateAiMatchingForParticipant(evt.id, newPart.id);
                          const allMatches = mockApi.getMatches(evt.id);
                          const participantMatches = allMatches.filter(m => m.participant_id === newPart.id);
                          const eventPhotos = mockApi.getPhotos(evt.id);
                          let matched = eventPhotos.filter(ph => 
                            participantMatches.some(m => m.photo_id === ph.id)
                          );
                          if (matched.length === 0 && eventPhotos.length > 0) {
                            matched = eventPhotos.slice(0, Math.min(3, eventPhotos.length));
                          }
                          loadedMatches[evt.id] = matched;
                        });
                        setMatchedPhotosMap(loadedMatches);
                        
                        const onboardingObj = {
                          consentAccepted: true,
                          selfieCaptured: true,
                          guestName: "Ezgi Çelik",
                          selfieUrl: mockSelfie
                        };
                        localStorage.setItem(`sm_guest_onboarding_${token}`, JSON.stringify(onboardingObj));
                        
                        showToast("Demo selfie kullanıldı, analiz ediliyor.", "success");
                        setStep("processing");
                      }}
                      className="p-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
                    >
                      <ImageIcon size={14} />
                      <span>Demo Selfie Kullan</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setGuestName("Misafir");
                      setSelfieUrl(null);
                      setSelfieCaptured(false);
                      
                      const loadedMatches = {};
                      const events = mockApi.getEvents();
                      events.forEach(evt => {
                        const eventPhotos = mockApi.getPhotos(evt.id);
                        loadedMatches[evt.id] = eventPhotos;
                      });
                      setMatchedPhotosMap(loadedMatches);
                      
                      const onboardingObj = {
                        consentAccepted: true,
                        selfieCaptured: false,
                        guestName: "Misafir",
                        selfieUrl: null
                      };
                      localStorage.setItem(`sm_guest_onboarding_${token}`, JSON.stringify(onboardingObj));
                      
                      showToast("Selfie adımı atlandı, albümlere yönlendiriliyorsunuz.", "success");
                      setStep("albums");
                      setActiveTab("photos");
                    }}
                    className="p-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <span>Şimdilik Atla</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 text-left">
                  {/* Premium Face Quality Analysis Mock Cards */}
                  <div className="glass-panel p-4 border border-white/10 bg-white/5 rounded-[24px] flex flex-col gap-3 my-1 select-none animate-scale-in text-left">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[9px] text-white/40 font-black uppercase tracking-wider">Biyometrik Analiz</span>
                      <span className="text-[8px] text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Sparkles size={8} />
                        <span>Analiz Başarılı</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-white/50">Işık Kalitesi</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <Check size={10} strokeWidth={3} />
                          <span>%92</span>
                        </span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-white/50">Yüz Netliği</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <Check size={10} strokeWidth={3} />
                          <span>%96</span>
                        </span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-white/50">Pozisyon</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <Check size={10} strokeWidth={3} />
                          <span>Merkez</span>
                        </span>
                      </div>

                      <div className="bg-white/[0.02] border border-white/5 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-white/50">Göz Teması</span>
                        <span className="text-emerald-400 font-black flex items-center gap-1">
                          <Check size={10} strokeWidth={3} />
                          <span>Aktif</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-black uppercase text-white/40 tracking-wider">Adınız Soyadınız</span>
                    <input 
                      type="text" 
                      placeholder="Ezgi Çelik"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-bold focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <button 
                    onClick={handleUploadSelfie}
                    disabled={!guestName.trim()}
                    className={`w-full py-4 text-xs font-black rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all ${
                      guestName.trim()
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg" 
                        : "bg-white/10 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <span>Onayla ve Eşleştir</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Processing Loader Screen */}
        {step === "processing" && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in relative bg-transparent select-none">
            {/* Ambient glows */}
            <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 blur-[80px] animate-pulse z-0" />
            
            <div className="glass-panel w-full max-w-[340px] p-6 flex flex-col items-center gap-6 border border-white/5 rounded-[32px] z-10 shadow-2xl relative">
              <div className="flex flex-col items-center gap-2 text-center">
                <BrainCircuit size={32} className="text-emerald-400 animate-pulse" />
                <h3 className="text-base font-black uppercase tracking-wider text-emerald-400 m-0 mt-1">
                  Anılarınız Hazırlanıyor
                </h3>
                <p className="m-0 text-[10px] text-white/50 leading-relaxed max-w-[260px] mt-1 font-medium">
                  Yapay zeka binlerce fotoğraf arasında sizi arıyor.
                </p>
              </div>

              {/* Progress circle */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="56" 
                    className="stroke-white/5" 
                    strokeWidth="6" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="56" 
                    className="stroke-emerald-400 transition-all duration-300 ease-out" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 56}
                    strokeDashoffset={2 * Math.PI * 56 * (1 - preparingPercent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black tracking-tight text-white">{preparingPercent}%</span>
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mt-0.5 font-sans">Analiz</span>
                </div>
              </div>

              {/* Log update message */}
              <div className="h-6 flex items-center justify-center">
                <span className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider animate-pulse">
                  {statusLogs[preparingStatusIdx] || "Tamamlanıyor..."}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Guest App Dashboard */}
        {step === "albums" && (
          <div className="flex-1 flex flex-col justify-between h-full min-h-0 w-full relative overflow-hidden">
            


            {/* TAB VIEW CONTAINER */}
            <div 
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex-1 overflow-y-auto scrollbar-none w-full min-h-0 relative"
            >
              {/* Pull-to-refresh spinner visual */}
              <div 
                className="w-full flex items-center justify-center transition-all duration-150 overflow-hidden bg-white/5 border-b border-white/5 shrink-0"
                style={{ 
                  height: pullDistance > 0 || isRefreshing ? `${pullDistance}px` : '0px',
                  opacity: pullDistance > 0 || isRefreshing ? 1 : 0
                }}
              >
                <div className="flex items-center gap-2 py-2">
                  <RefreshCw 
                    size={14} 
                    className={`text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`}
                    style={{ transform: !isRefreshing ? `rotate(${pullDistance * 6}deg)` : 'none' }}
                  />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                    {isRefreshing ? "Yenileniyor..." : "Yenilemek İçin Çekin"}
                  </span>
                </div>
              </div>
              
              {/* TAB 1: Albums (Albums Grid) */}
              {activeTab === "albums" && (() => {
                const allGuestPhotos = Object.values(matchedPhotosMap).flat();
                return (
                  <div className="flex flex-col pb-36 animate-fade-in text-left">
                    <div className="p-4 flex flex-col gap-4">
                      {/* HEADER AREA */}
                      <div className="flex justify-between items-start mt-2 w-full">
                        <div className="flex flex-col gap-1">
                          <h2 className="text-lg font-black m-0 text-white font-sans">Fotoğraf Albümüm</h2>
                          <p className="text-[10px] text-white/50 m-0">Sana ait bulunan tüm fotoğrafları görüntüle.</p>
                        </div>

                        {/* Apple style Glass Pill Selector for albumViewMode */}
                        <div className="flex bg-white/5 border border-white/10 rounded-full p-0.5 select-none shrink-0 shadow-inner">
                          <button
                            onClick={() => setAlbumViewMode("grid")}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 ${
                              albumViewMode === "grid" 
                                ? "bg-white/10 text-white shadow-md" 
                                : "bg-transparent text-white/40"
                            }`}
                          >
                            <Grid2X2 size={10} />
                            <span>Izgara</span>
                          </button>
                          <button
                            onClick={() => setAlbumViewMode("slide")}
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-none flex items-center gap-1 ${
                              albumViewMode === "slide" 
                                ? "bg-white/10 text-white shadow-md" 
                                : "bg-transparent text-white/40"
                            }`}
                          >
                            <GalleryHorizontal size={10} />
                            <span>Slide</span>
                          </button>
                        </div>
                      </div>

                      {/* VIEW CONTENT */}
                      {allGuestPhotos.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-white/20">
                            <ImageIcon size={24} />
                          </div>
                          <span className="text-xs font-black text-white/70">Henüz sana ait fotoğraf bulunamadı.</span>
                          <p className="text-[10px] text-white/40 max-w-[240px] mt-1">Yeni eşleşmeler tamamlandığında burada görünecek.</p>
                        </div>
                      ) : albumViewMode === "grid" ? (
                        /* GRID VIEW */
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          {allGuestPhotos.map((photo) => (
                            <div 
                              key={photo.id}
                              onClick={() => {
                                setSelectedPhoto(photo);
                                const relatedEvent = allEvents.find(e => e.id === photo.event_id) || event;
                                setSelectedPhotoEvent(relatedEvent);
                              }}
                              className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-md active:scale-[0.98] transition-transform"
                            >
                              <img 
                                src={photo.url} 
                                alt={photo.filename} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {photo.matchConfidence && (
                                <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-emerald-400">
                                  %{photo.matchConfidence}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* SLIDE VIEW */
                        <div className="flex flex-col gap-4 mt-2 w-full relative">
                          <div 
                            className="flex gap-4 w-full overflow-x-auto scrollbar-none snap-x snap-mandatory py-2"
                            style={{
                              scrollBehavior: "smooth",
                              overscrollBehaviorX: "contain",
                              WebkitOverflowScrolling: "touch"
                            }}
                          >
                            {allGuestPhotos.map((photo, idx) => (
                              <div 
                                key={photo.id}
                                className="snap-start shrink-0 w-[82%] flex flex-col items-center"
                              >
                                <div 
                                  onClick={() => {
                                    setSelectedPhoto(photo);
                                    const relatedEvent = allEvents.find(e => e.id === photo.event_id) || event;
                                    setSelectedPhotoEvent(relatedEvent);
                                  }}
                                  className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl relative cursor-pointer active:scale-[0.98] transition-transform"
                                >
                                  <img 
                                    src={photo.url} 
                                    alt={photo.filename} 
                                    className="w-full h-full object-cover"
                                  />
                                  {photo.matchConfidence && (
                                    <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-emerald-400">
                                      %{photo.matchConfidence}
                                    </div>
                                  )}
                                </div>
                                
                                {/* Counter below the image card */}
                                <div className="text-[10px] font-extrabold text-white/40 mt-2 select-none tracking-wider">
                                  {idx + 1} / {allGuestPhotos.length}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* TAB 2: Photos (Unified Photos List) */}
              {/* TAB 2: Photos (Unified Photos List) */}
              {activeTab === "photos" && (() => {
                const allPhotos = Object.values(matchedPhotosMap).flat();
                
                // Group photos
                const groupedPhotos = {
                  "09:00 — Hazırlık": [],
                  "10:30 — Karşılama": [],
                  "12:00 — Tören": [],
                  "14:15 — Kutlama": [],
                  "18:30 — Gece Çekimleri": []
                };

                allPhotos.forEach((ph, idx) => {
                  let groupKey = "";
                  const dateStr = ph.date || ph.uploaded_at || ph.created_at || (ph.metadata_json && ph.metadata_json.time);
                  if (dateStr) {
                    try {
                      const dateObj = new Date(dateStr);
                      const hour = dateObj.getHours();
                      if (hour < 10) groupKey = "09:00 — Hazırlık";
                      else if (hour < 12) groupKey = "10:30 — Karşılama";
                      else if (hour < 14) groupKey = "12:00 — Tören";
                      else if (hour < 18) groupKey = "14:15 — Kutlama";
                      else groupKey = "18:30 — Gece Çekimleri";
                    } catch (e) {
                      // fallback to index
                    }
                  }
                  
                  if (!groupKey) {
                    const fallbackKeys = [
                      "09:00 — Hazırlık",
                      "10:30 — Karşılama",
                      "12:00 — Tören",
                      "14:15 — Kutlama",
                      "18:30 — Gece Çekimleri"
                    ];
                    groupKey = fallbackKeys[idx % 5];
                  }

                  groupedPhotos[groupKey].push(ph);
                });

                const renderEditorialLayout = (items) => {
                  if (items.length === 0) return null;

                  const handlePhotoSelect = (photo) => {
                    setSelectedPhoto(photo);
                    const relatedEvent = allEvents.find(e => e.id === photo.event_id) || event;
                    setSelectedPhotoEvent(relatedEvent);
                  };

                  const renderCard = (photo, sizeClass) => (
                    <div 
                      key={photo.id}
                      onClick={() => handlePhotoSelect(photo)}
                      className={`relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer shadow-lg active:scale-[0.98] transition-transform select-none ${sizeClass}`}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.filename} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {photo.matchConfidence && (
                        <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-emerald-400">
                          %{photo.matchConfidence}
                        </div>
                      )}
                    </div>
                  );

                  if (items.length === 1) {
                    return (
                      <div className="flex flex-col w-full">
                        {renderCard(items[0], "w-full aspect-[4/3]")}
                      </div>
                    );
                  }

                  if (items.length === 2) {
                    return (
                      <div className="flex flex-col gap-3 w-full">
                        {renderCard(items[0], "w-full aspect-[4/3]")}
                        {renderCard(items[1], "w-full aspect-[16/9]")}
                      </div>
                    );
                  }

                  // 3 or more photos
                  const largePhoto = items[0];
                  const remainingPhotos = items.slice(1);

                  return (
                    <div className="flex flex-col gap-3 w-full">
                      {renderCard(largePhoto, "w-full aspect-[4/3]")}
                      <div className="grid grid-cols-2 gap-3">
                        {remainingPhotos.map(photo => renderCard(photo, "w-full aspect-square"))}
                      </div>
                    </div>
                  );
                };

                return (
                  <div className="flex flex-col gap-4 p-4 pb-36 animate-fade-in text-left relative overflow-x-hidden w-full">
                    {/* Header Area */}
                    <div className="flex justify-between items-center mt-2 w-full select-none">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-black m-0 text-white font-sans">Zaman Tüneli</h2>
                          {allPhotos.length > 0 && (
                            <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {allPhotos.length} Fotoğraf
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/50 m-0 font-medium">Etkinlik boyunca sana ait bulunan fotoğrafları çekim sırasına göre keşfet.</p>
                      </div>
                    </div>

                    {/* Timeline Content */}
                    {allPhotos.length === 0 ? (
                      /* EMPTY STATE */
                      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mb-4 text-white/20">
                          <ImageIcon size={24} />
                        </div>
                        <span className="text-xs font-black text-white/70 font-sans">Zaman tünelin henüz hazır değil.</span>
                        <p className="text-[10px] text-white/40 max-w-[240px] mt-1 font-medium">Yeni eşleşmeler tamamlandığında fotoğrafların çekim sırasına göre burada görünecek.</p>
                      </div>
                    ) : (
                      /* Chronological Timeline */
                      <div className="relative pl-6 mt-4 flex flex-col gap-8 w-full">
                        {/* Vertical Timeline Axis Line */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/10" />

                        {Object.entries(groupedPhotos).map(([groupTitle, groupItems]) => {
                          if (groupItems.length === 0) return null;
                          
                          const [groupTime, groupLabel] = groupTitle.split(" — ");

                          return (
                            <div key={groupTitle} className="relative flex flex-col gap-3 w-full">
                              {/* Dot and Group Header */}
                              <div className="absolute left-[-25px] top-1.5 flex items-center gap-2">
                                {/* Small indicator dot */}
                                <div className="w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#080A0F] shadow-[0_0_8px_rgba(16,185,129,0.5)] z-10" />
                                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                                  <span className="text-[10px] font-black text-white font-mono bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{groupTime}</span>
                                  <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{groupLabel}</span>
                                </div>
                              </div>

                              {/* Spacer to push photos down past absolute header */}
                              <div className="h-6" />

                              {/* Editorial Grid Layout */}
                              {renderEditorialLayout(groupItems)}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}



              {/* TAB 4: Favorites (Favoriler Grid) */}
              {activeTab === "favorites" && (
                <div className="flex flex-col gap-4 p-4 pb-36 animate-fade-in text-left">
                  <div className="flex flex-col gap-1 mt-2">
                    <h2 className="text-lg font-black m-0 text-white">Favorilerim</h2>
                    <p className="text-[10px] text-white/50 m-0">Beğendiğiniz ve favorilere eklediğiniz en güzel anlar.</p>
                  </div>

                  {/* Grid of favorited photos */}
                  <div className="mt-2">
                    {favorites.length === 0 ? (
                      <div className="col-span-3 text-center py-16 text-[10px] text-white/40 flex flex-col items-center gap-2">
                        <Heart size={24} className="text-white/20" />
                        <span>Henüz favorilere fotoğraf eklemediniz.</span>
                      </div>
                    ) : (
                      <GuestPhotoGrid 
                        photos={favorites}
                        onPhotoClick={(idx) => {
                          setSelectedPhoto(favorites[idx]);
                          const relatedEvent = allEvents.find(e => e.id === favorites[idx].event_id) || event;
                          setSelectedPhotoEvent(relatedEvent);
                        }}
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        onDownload={handleDownload}
                        onShare={handleShare}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: Settings (Tema & Profil) */}
              {activeTab === "settings" && (
                <div className="p-4 pb-36 animate-fade-in">
                  <GuestThemeSettings 
                    guestTheme={guestTheme}
                    setGuestTheme={setGuestTheme}
                    showToast={showToast}
                    handleDeleteFaceData={handleDeleteFaceData}
                    guestName={guestName}
                    selfieUrl={selfieUrl}
                  />
                </div>
              )}

            </div>

            {/* TAB BAR NAVIGATION */}
            <GuestBottomNav 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onTabClick={(tabId) => {
                if (tabId === "albums") {
                  setSelectedEvent(null);
                  setSelectedMemory(null);
                }
              }}
            />

          </div>
        )}

        {/* SCREEN 8: Full Screen iPhone Photos style Lightbox Modal */}
        {selectedPhoto && (
          <GuestPhotoLightbox 
            photo={selectedPhoto}
            event={selectedPhotoEvent}
            onClose={() => {
              setSelectedPhoto(null);
              setSelectedPhotoEvent(null);
            }}
            isFavorite={favorites.some(p => p.id === selectedPhoto.id)}
            onToggleFavorite={() => handleToggleFavorite(selectedPhoto)}
            onDownload={() => handleDownload(selectedPhoto)}
            onShare={() => handleShare(selectedPhoto)}
          />
        )}

        {/* SCREEN 9: Full Screen Slideshow Modal */}
        {activeSlideshowPhotos && (
          <GuestSlideshow 
            photos={activeSlideshowPhotos}
            onClose={() => setActiveSlideshowPhotos(null)}
          />
        )}

        {/* SCREEN 10: Instagram Story template Modal */}
        {activeShareCardPhoto && (
          <GlassModal
            isOpen={!!activeShareCardPhoto}
            onClose={() => setActiveShareCardPhoto(null)}
            title="Hikaye Kartı Hazır!"
          >
            <div className="flex flex-col gap-5 text-center text-white py-1">
              <p className="text-[10px] text-white/50 m-0">Bu şablonu telefonunuza kaydedip Instagram Stories'de paylaşabilirsiniz.</p>
              
              {/* Instagram Story Preview Card */}
              <div className="w-full max-w-[280px] mx-auto aspect-[9/16] bg-gradient-to-b from-[#1C1F2E] via-[#0E121E] to-[#0A0D14] border border-white/10 rounded-[32px] overflow-hidden p-4 flex flex-col justify-between shadow-2xl relative">
                {/* Neon blur accent glow behind photo */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-blue-500/10 blur-[40px] pointer-events-none" />
                
                {/* Card Header (Snapmatch Logo) */}
                <div className="flex justify-between items-center z-10 shrink-0">
                  <span className="text-[9px] font-black uppercase tracking-wider text-white/40 flex items-center gap-1">
                    <Sparkles size={10} className="text-amber-400" />
                    <span>Snapmatch Moments</span>
                  </span>
                  <span className="text-[8px] font-bold text-white/30 uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    Story Template
                  </span>
                </div>

                {/* Main Photo Card inside Template */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40 my-3 z-10">
                  <img 
                    src={activeShareCardPhoto.url || activeShareCardPhoto.thumbnail_url} 
                    alt="Story card photo" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Footer (Event title & branding) */}
                <div className="flex flex-col gap-1 items-center text-center z-10 shrink-0 mt-auto">
                  <strong className="text-xs font-black text-white tracking-wide">{event?.title || "Etkinlik Albümü"}</strong>
                  <span className="text-[8px] text-white/40 tracking-wider">Anıları ölümsüzleştiriyoruz &bull; 2026</span>
                  
                  {/* QR code simulation */}
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center mt-2.5">
                    <QrCode size={20} className="text-white/40" />
                  </div>
                </div>
              </div>

              {/* Download / Share Templates buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleDownload(activeShareCardPhoto);
                    setActiveShareCardPhoto(null);
                    showToast("Şablon başarıyla galerinize kaydedildi!", "success");
                  }}
                  className="flex-1 py-3 text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Download size={14} />
                  <span>Şablonu İndir</span>
                </button>
                <button
                  onClick={() => {
                    setActiveShareCardPhoto(null);
                  }}
                  className="px-4 py-3 text-xs font-bold bg-white/5 border border-white/10 text-white rounded-xl active:scale-95 transition-transform"
                >
                  Kapat
                </button>
              </div>
            </div>
          </GlassModal>
        )}

        {/* iOS Native Style Share Sheet Panel */}
        <BottomMobileSheet 
          isOpen={!!activeSharePhoto} 
          onClose={() => setActiveSharePhoto(null)}
          title="Fotoğrafı Paylaş"
        >
          {activeSharePhoto && (
            <div className="flex flex-col gap-5 text-left text-white select-none">
              {/* Photo Preview Card */}
              <div className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 items-center">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                  <img 
                    src={activeSharePhoto.thumbnail_url || activeSharePhoto.url} 
                    alt="share preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <strong className="text-xs text-white truncate block">{activeSharePhoto.filename}</strong>
                  <span className="text-[10px] text-white/40 mt-0.5 font-medium">JPEG Görsel &bull; 1.2 MB (Mock)</span>
                </div>
              </div>

              {/* Share Apps Row */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">Uygulamalarda Paylaş</span>
                <div className="grid grid-cols-4 gap-3 mt-1">
                  {[
                    { label: "WhatsApp", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <Share2 size={18} />, action: () => { window.open("https://api.whatsapp.com/send", "_blank"); showToast("WhatsApp yönlendiriliyor...", "success"); } },
                    { label: "Instagram", color: "bg-pink-500/10 text-pink-400 border-pink-500/20", icon: <Sparkles size={18} />, action: () => showToast("Instagram Stories açılıyor...", "success") },
                    { label: "AirDrop", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <RefreshCw size={18} />, action: () => showToast("Yakındaki cihazlar aranıyor...", "success") },
                    { label: "E-Posta", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", icon: <User size={18} />, action: () => { window.location.href = "mailto:?body=" + encodeURIComponent(activeSharePhoto.url); } }
                  ].map(app => (
                    <button 
                      key={app.label}
                      onClick={() => {
                        app.action();
                        setActiveSharePhoto(null);
                      }}
                      className="flex flex-col items-center gap-1.5 cursor-pointer bg-transparent border-none active:scale-95 transition-transform"
                    >
                      <div className={`w-12 h-12 rounded-full border ${app.color} flex items-center justify-center`}>
                        {app.icon}
                      </div>
                      <span className="text-[10px] text-white/70 font-semibold">{app.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action List */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-white/30 tracking-wider">Hızlı Eylemler</span>
                <div className="flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 mt-1">
                  <button 
                    onClick={() => {
                      setActiveShareCardPhoto(activeSharePhoto);
                      setActiveSharePhoto(null);
                    }}
                    className="w-full p-4 flex items-center justify-between text-xs font-bold text-white hover:bg-white/5 active:bg-white/10 cursor-pointer border-none bg-transparent"
                  >
                    <span>Hikaye Şablonu Üret</span>
                    <Sparkles size={14} className="text-pink-400" />
                  </button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(activeSharePhoto.url || activeSharePhoto.thumbnail_url);
                      showToast("Paylaşım bağlantısı kopyalandı!", "success");
                      setActiveSharePhoto(null);
                    }}
                    className="w-full p-4 flex items-center justify-between text-xs font-bold text-white hover:bg-white/5 active:bg-white/10 cursor-pointer border-none bg-transparent"
                  >
                    <span>Bağlantıyı Kopyala</span>
                    <Share2 size={14} className="text-white/40" />
                  </button>
                  <button 
                    onClick={() => {
                      handleDownload(activeSharePhoto);
                      setActiveSharePhoto(null);
                    }}
                    className="w-full p-4 flex items-center justify-between text-xs font-bold text-white hover:bg-white/5 active:bg-white/10 cursor-pointer border-none bg-transparent"
                  >
                    <span>Cihaza İndir</span>
                    <Download size={14} className="text-white/40" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </BottomMobileSheet>

      </div>

    </div>
  );
}