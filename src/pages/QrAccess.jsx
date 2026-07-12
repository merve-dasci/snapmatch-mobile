import React, { useState, useEffect } from "react";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import { 
  QrCode, 
  Copy, 
  Download, 
  Globe, 
  Lock, 
  Key, 
  Smartphone, 
  Sparkles, 
  Check,
  Eye,
  Info,
  Camera,
  ArrowLeft
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import EmptyState from "../components/ui/EmptyState";

export default function QrAccess() {
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [copied, setCopied] = useState(false);
  const [accessType, setAccessType] = useState("public"); // public, token, invite
  const [guestUpload, setGuestUpload] = useState(true);

  // Participant access control states
  const [participants, setParticipants] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");

  // Guest preview mock scanner states
  const [previewStep, setPreviewStep] = useState(1); // 1: Welcome/Upload, 2: Scanning, 3: Matched Photos

  useEffect(() => {
    const evs = mockApi.getEvents();
    setEvents(evs);
    if (evs.length > 0) {
      setSelectedEventId(evs[0].id);
    }
  }, []);

  // Update participant list on event selection changes
  useEffect(() => {
    if (selectedEventId) {
      const allParts = mockApi.getParticipants();
      const eventParts = allParts.filter(p => p.event_id === selectedEventId);
      setParticipants(eventParts);
      if (eventParts.length > 0) {
        setSelectedPartId(eventParts[0].id);
      } else {
        setSelectedPartId("");
      }
    }
  }, [selectedEventId]);

  const getSelectedEvent = () => {
    return events.find(e => e.id === selectedEventId) || null;
  };

  const getGuestLink = () => {
    const ev = getSelectedEvent();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    return ev ? `${baseUrl}/guest/${ev.qr_token || "tok_default"}` : `${baseUrl}/guest/select`;
  };

  const selectedPart = participants.find(p => p.id === selectedPartId);

  const handleToggleParticipantAccess = () => {
    if (!selectedPart) return;
    const newStatus = selectedPart.status === "active" ? "blocked" : "active";
    
    const allParts = mockApi.getParticipants();
    const updated = allParts.map(p => {
      if (p.id === selectedPart.id) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    localStorage.setItem("sm_participants", JSON.stringify(updated));
    
    setParticipants(updated.filter(p => p.event_id === selectedEventId));
    showToast(`${selectedPart.display_name} erişim izni ${newStatus === "active" ? "verildi" : "kısıtlandı"}.`, "success");
  };

  const handleStartMockScan = () => {
    setPreviewStep(2);
    setTimeout(() => {
      setPreviewStep(3);
      showToast("Biyometrik eşleştirme tamamlandı! 3 fotoğraf bulundu.", "success");
    }, 2000);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "#000000";
    ctx.fillRect(20, 20, 60, 60);
    ctx.fillRect(176, 20, 60, 60);
    ctx.fillRect(20, 176, 60, 60);
    ctx.fillRect(50, 50, 20, 20);
    ctx.fillRect(90, 30, 40, 20);
    ctx.fillRect(100, 70, 30, 40);
    ctx.fillRect(40, 100, 40, 30);
    ctx.fillRect(150, 120, 50, 50);
    ctx.fillRect(120, 180, 40, 40);
    ctx.fillRect(200, 200, 20, 20);
    
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapmatch-qr-${selectedEvent?.title || "event"}.png`;
    a.click();
    showToast("PNG formatında QR kod indirildi.", "success");
  };

  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
      <rect width="256" height="256" fill="#ffffff"/>
      <rect x="20" y="20" width="60" height="60" fill="#000000"/>
      <rect x="176" y="20" width="60" height="60" fill="#000000"/>
      <rect x="20" y="176" width="60" height="60" fill="#000000"/>
      <rect x="100" y="50" width="30" height="30" fill="#000000"/>
      <rect x="120" y="120" width="60" height="60" fill="#000000"/>
    </svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `snapmatch-qr-${selectedEvent?.title || "event"}.svg`;
    a.click();
    showToast("SVG formatında QR kod indirildi.", "success");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getGuestLink());
    setCopied(true);
    showToast("Bağlantı başarıyla kopyalandı!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedEvent = getSelectedEvent();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Selector Header */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Etkinlik Seçin</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-3 rounded-xl border border-[rgba(99,115,129,0.22)] bg-white/40 text-sm text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] focus:border-[var(--color-blue-dark)] focus:ring-1 focus:ring-[var(--color-blue-dark)] transition-all cursor-pointer"
          >
            {events.map(e => (
              <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
            ))}
          </select>
        </div>

        {/* QR Wallet card view */}
        {selectedEvent && (
          <div className="glass-panel p-5 flex flex-col items-center text-center bg-[var(--glass-bg-strong)] border border-[var(--glass-border)] rounded-3xl">
            <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider mb-3">Misafir QR Kartı</span>
            <div className="bg-white p-3.5 rounded-2xl shadow-inner border border-black/5">
              <QrCode size={180} className="text-black" />
            </div>
            
            <strong className="text-xs font-extrabold text-[var(--text-main)] mt-4">{selectedEvent.title}</strong>
            <span className="text-[10px] text-[var(--text-muted)] mt-1">{selectedEvent.location}</span>
            
            <div className="flex flex-col gap-2 w-full mt-5">
              <button
                onClick={handleCopyLink}
                className="primary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
              >
                Link Kopyala
              </button>
              
              <button
                onClick={() => window.open(getGuestLink(), "_blank")}
                className="secondary-btn w-full py-2.5 text-xs font-bold justify-center rounded-xl"
              >
                Giriş Linkini Aç
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.2fr] gap-[var(--space-lg)]">
        
        {/* Left Side: QR Generator & Access Settings */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          {/* Select Event & QR Preview */}
          <GlassCard title="QR Kod Matrisi" className="glass-panel">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.85rem] font-bold">Erişilecek Etkinlik</label>
                <select 
                   value={selectedEventId} 
                   onChange={(e) => setSelectedEventId(e.target.value)}
                   className="p-2.5 rounded-[12px] border border-[rgba(99,115,129,0.22)] bg-white/40 text-[0.92rem] font-semibold text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] focus:border-[var(--color-blue-dark)] focus:ring-1 focus:ring-[var(--color-blue-dark)] transition-all cursor-pointer"
                 >
                  {events.map(e => <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>)}
                </select>
              </div>

              <div className="flex flex-wrap gap-5 items-center border-t border-[var(--glass-border)] pt-5">
                {/* QR Box */}
                <div className="bg-white p-3 rounded-[16px] border border-[var(--glass-border)]">
                  <QrCode size={130} className="text-black block" />
                </div>
                
                {/* Actions & Guest Links */}
                <div className="flex-grow flex flex-col gap-3 min-w-[200px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--text-muted)] text-[0.72rem] font-bold uppercase tracking-wider">Misafir Hızlı Bağlantısı</span>
                    <span className="text-[0.78rem] text-blue-400 font-semibold truncate block max-w-[280px]">{getGuestLink()}</span>
                  </div>

                  <div className="flex gap-1.5">
                    <input 
                       type="text" 
                       readOnly 
                       value={getGuestLink()} 
                       className="flex-grow p-[8px_12px] rounded-[10px] bg-white/40 border border-[rgba(99,115,129,0.22)] text-[0.82rem] text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] transition-all" 
                     />
                     <button className="icon-btn" onClick={handleCopyLink} title="Linki Kopyala">
                       {copied ? <Check size={16} className="text-[var(--accent-green)]" /> : <Copy size={16} />}
                     </button>
                   </div>

                   <div className="flex gap-2">
                     <button className="primary-btn p-[8px_12px] text-[0.8rem] gap-1.5 font-bold text-white shadow-md" onClick={handleDownloadPng}>
                       <Download size={14} /> PNG İndir
                     </button>
                     <button className="primary-btn p-[8px_12px] text-[0.8rem] gap-1.5 font-bold text-white shadow-md" onClick={handleDownloadSvg}>
                       <Download size={14} /> SVG İndir
                     </button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Access Mode Option Cards */}
          <GlassCard title="Giriş Yetkilendirme Tipi" className="glass-panel">
            <div className="flex flex-col gap-3">
              <div 
                onClick={() => {
                  setAccessType("public");
                  showToast("Giriş yetkilendirme tipi Açık QR olarak güncellendi.", "success");
                }}
                className={`flex gap-3 items-start p-3 rounded-[14px] cursor-pointer transition-all duration-180 border ${accessType === 'public' ? 'bg-blue-500/8 border-[var(--color-blue-dark)]' : 'bg-transparent border-[var(--glass-border)]'}`}
              >
                <div className={`mt-0.5 ${accessType === 'public' ? 'text-[var(--color-blue-dark)]' : 'text-[var(--text-muted)]'}`}>
                  <Globe size={18} />
                </div>
                <div>
                  <strong className="text-[0.9rem] block">Açık QR (Public)</strong>
                  <span className="text-[0.78rem] text-[var(--text-muted)]">Barkodu okutan herkes selfie yükleyerek kendi fotoğrafını bulabilir.</span>
                </div>
              </div>

              <div 
                onClick={() => {
                  setAccessType("token");
                  showToast("Giriş yetkilendirme tipi Kapalı Jeton olarak güncellendi.", "success");
                }}
                className={`flex gap-3 items-start p-3 rounded-[14px] cursor-pointer transition-all duration-180 border ${accessType === 'token' ? 'bg-blue-500/8 border-[var(--color-blue-dark)]' : 'bg-transparent border-[var(--glass-border)]'}`}
              >
                <div className={`mt-0.5 ${accessType === 'token' ? 'text-[var(--color-blue-dark)]' : 'text-[var(--text-muted)]'}`}>
                  <Key size={18} />
                </div>
                <div>
                  <strong className="text-[0.9rem] block">Kapalı Jeton (Closed Token)</strong>
                  <span className="text-[0.78rem] text-[var(--text-muted)]">Giriş jetonu olan misafirler erişebilir. Girişler sınırlandırılabilir.</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Settings checkboxes */}
          <GlassCard title="Erişim Konfigürasyonu" className="glass-panel">
            <div className="flex flex-col gap-4">
              
              {/* Photo Upload Permission Option */}
              <div 
                className="flex justify-between items-center p-4 rounded-[14px] border border-[var(--glass-border)] text-left"
                style={{ background: "rgba(255, 255, 255, 0.015)" }}
              >
                <div>
                  <strong className="text-[0.88rem] block text-[var(--text-main)]">Misafirlerin Fotoğraf Yüklemesine İzin Ver</strong>
                  <span className="text-[0.78rem] text-[var(--text-muted)]">Aktif edildiğinde misafirler de kendi çektiklerini galeriye yükleyebilir.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={guestUpload} 
                  onChange={(e) => {
                    setGuestUpload(e.target.checked);
                    showToast(`Misafir fotoğraf yükleme izni ${e.target.checked ? "aktif edildi" : "kapatıldı"}.`, "success");
                  }}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Participant Access Control */}
              <div 
                className="flex flex-col gap-3 p-4 rounded-[14px] border border-[var(--glass-border)] text-left"
                style={{ background: "rgba(255, 255, 255, 0.015)" }}
              >
                <span className="text-[0.88rem] font-bold text-[var(--text-main)] block">Katılımcı Erişim Denetimi</span>
                
                {participants.length === 0 ? (
                  <EmptyState
                    icon={Globe}
                    title="Katılımcı Bulunamadı"
                    description="Bu etkinlikte kayıtlı katılımcı bulunmamaktadır."
                  />
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <span className="text-[0.72rem] text-[var(--text-muted)] block">Belirli bir katılımcının albüme erişim iznini kapatıp açabilirsiniz:</span>
                    <div className="flex gap-2.5 items-center">
                      <select
                        value={selectedPartId}
                        onChange={(e) => setSelectedPartId(e.target.value)}
                        className="flex-grow p-2.5 px-3 rounded-xl border border-[rgba(99,115,129,0.22)] bg-white/40 text-[0.82rem] font-semibold text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] focus:border-[var(--color-blue-dark)] focus:ring-1 focus:ring-[var(--color-blue-dark)] transition-all cursor-pointer"
                      >
                        {participants.map(p => (
                          <option key={p.id} value={p.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">
                            {p.display_name} ({p.status === "active" ? "İzin Verildi" : "Kısıtlandı"})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={handleToggleParticipantAccess}
                        className="primary-btn p-[9.5px_20px] text-[0.8rem] font-extrabold rounded-xl cursor-pointer transition-all active:scale-95 whitespace-nowrap shadow-md border-none text-white"
                      >
                        {selectedPart?.status === "active" ? "Erişimi Kısıtla" : "Erişim İzni Ver"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* KVKK Consent Box */}
              <div 
                className="flex flex-col gap-2.5 p-4 rounded-[14px] border border-[var(--glass-border)] text-left"
                style={{ background: "rgba(255, 255, 255, 0.015)" }}
              >
                <span className="text-[0.88rem] font-bold text-[var(--text-main)] block">KVKK Rıza Metni Taslağı</span>
                <div 
                  className="p-3.5 rounded-[12px] text-[0.78rem] text-[var(--text-muted)] leading-relaxed"
                  style={{
                    background: "var(--glass-bg-strong)",
                    border: "1px solid var(--glass-border)"
                  }}
                >
                  Snapmatch AI arama motoruna selfie yükleyerek biyometrik verilerimin etkinlik fotoğraflarında eşleştirilmesine rıza gösteriyorum.
                </div>
              </div>

            </div>
          </GlassCard>
        </div>

        {/* Right Side: Guest View Mobile Mockup Preview */}
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-[var(--color-blue-dark)]" />
            <span className="text-[0.88rem] font-bold">Misafir Arayüzü Önizleme</span>
          </div>

          {/* Custom phone mockup */}
          <div className="w-[280px] h-[560px] rounded-[36px] border-[8px] border-[var(--phone-frame)] bg-[var(--body-bg)] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col">
            {/* Camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[18px] bg-[var(--phone-frame)] rounded-b-[10px] z-10" />
            
            {/* Mock Header Image */}
            <div className="h-[120px] w-full relative select-none">
              <img 
                src={selectedEvent?.cover_image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300"} 
                alt="preview cover" 
                className="w-full h-full object-cover brightness-[0.7]" 
              />
              <div className="absolute bottom-2.5 left-3 text-white">
                <h4 className="m-0 text-[0.95rem] font-extrabold">{selectedEvent?.title || "Etkinlik Yükleniyor"}</h4>
                <small className="text-[0.68rem] opacity-80">Hoş geldiniz!</small>
              </div>
            </div>

            {/* Mobile Body Content */}
            {previewStep === 1 && (
              <div className="p-4 flex-grow flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-3 text-center">
                  <div className="w-[50px] h-[50px] rounded-full bg-indigo-500/15 text-[var(--color-blue-dark)] grid place-items-center mt-2.5 mx-auto mb-0 select-none">
                    <Smartphone size={24} />
                  </div>
                  <strong className="text-[0.85rem] block font-bold text-[var(--text-main)]">Selfie Çek & Fotoğraflarını Bul!</strong>
                  <p className="m-0 text-[0.72rem] text-[var(--text-muted)] leading-5">
                    Bir selfie yükleyerek etkinlik albümündeki tüm fotoğraflarınıza anında erişin.
                  </p>
                </div>

                {/* Upload CTA */}
                <div className="flex flex-col gap-2.5">
                  <button 
                    onClick={handleStartMockScan}
                    className="primary-btn text-[0.78rem] p-2.5 justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white font-bold rounded-lg cursor-pointer"
                  >
                    Kamerayı Aç / Selfie Yükle
                  </button>
                  
                  {/* Consent text footer preview */}
                  <div className="flex gap-1.5 items-start text-left select-none">
                    <input type="checkbox" defaultChecked className="mt-0.5" />
                    <span className="text-[0.62rem] text-[var(--text-muted)] leading-[1.3]">
                      Biyometrik verilerimin eşleştirilmesi amacıyla Snapmatch aydınlatma beyanını kabul ediyorum.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {previewStep === 2 && (
              <div className="flex-grow flex flex-col items-center justify-center p-4 gap-4">
                <div className="relative w-[110px] h-[110px] rounded-full border-2 border-dashed border-indigo-400 overflow-hidden flex items-center justify-center bg-black/10">
                  {/* Glowing scan bar */}
                  <div 
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_var(--glow-blue)]" 
                    style={{
                      animation: "scanLine 2s infinite ease-in-out",
                      top: "0%"
                    }}
                  />
                  <Camera size={32} className="text-indigo-400 opacity-60 animate-pulse" />
                </div>
                
                {/* CSS keyframe for animation inline injected */}
                <style>{`
                  @keyframes scanLine {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                  }
                `}</style>

                <div className="text-center flex flex-col gap-1.5">
                  <strong className="text-[0.8rem] text-[var(--text-main)] block font-bold">Eşleşmeler Aranıyor...</strong>
                  <span className="text-[0.65rem] text-[var(--text-muted)]">Biyometrik verileriniz karşılaştırılıyor</span>
                </div>
              </div>
            )}

            {previewStep === 3 && (
              <div className="p-3.5 flex-grow flex flex-col justify-between gap-3 overflow-hidden">
                <div className="flex flex-col gap-2">
                  <div className="text-center">
                    <strong className="text-[0.82rem] text-emerald-400 font-extrabold block">3 Eşleşen Fotoğraf Bulundu! 🎉</strong>
                    <span className="text-[0.65rem] text-[var(--text-muted)]">Fotoğraflarınız güvenle listelendi.</span>
                  </div>
                  
                  {/* Small Grid of mock wedding photos */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2 select-none">
                    <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150" alt="match 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                      <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=150" alt="match 2" className="w-full h-full object-cover" />
                    </div>
                    <div className="h-[75px] rounded-lg overflow-hidden border border-white/5 col-span-2">
                      <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200" alt="match 3" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <button 
                    onClick={() => {
                      setPreviewStep(4);
                      showToast("Konuk albümü simülasyonu açıldı.", "info");
                    }}
                    className="primary-btn text-[0.75rem] p-2 justify-center w-full bg-gradient-to-r from-blue-500 to-indigo-500 border-none text-white font-bold rounded-lg cursor-pointer"
                  >
                    Tüm Fotoğrafları Gör
                  </button>
                  <button 
                    onClick={() => setPreviewStep(1)}
                    className="secondary-btn text-[0.72rem] p-1.5 justify-center w-full border border-white/10 rounded-lg text-[var(--text-muted)] cursor-pointer"
                  >
                    Yeniden Dene
                  </button>
                </div>
              </div>
            )}

            {previewStep === 4 && (
              <div className="p-3.5 flex-grow flex flex-col justify-between gap-3 overflow-hidden text-left">
                <div className="flex flex-col flex-grow overflow-hidden">
                  {/* Mock Album Header with Back arrow */}
                  <div className="flex items-center gap-2 pb-2 border-b border-[var(--glass-border)]/40 mb-2 select-none">
                    <button 
                      onClick={() => setPreviewStep(3)}
                      className="p-1 bg-white/5 hover:bg-white/10 rounded-lg border-none text-[var(--text-main)] cursor-pointer flex items-center justify-center animate-fade-in"
                    >
                      <ArrowLeft size={14} />
                    </button>
                    <span className="text-[0.78rem] font-bold truncate text-[var(--text-main)]">{selectedEvent?.title || "Etkinlik Albümü"}</span>
                  </div>

                  {/* Scrollable grid of guest photos */}
                  <div className="flex-grow overflow-y-auto pr-0.5 flex flex-col gap-2 select-none scrollbar-thin" style={{ maxHeight: "250px" }}>
                    <div className="grid grid-cols-2 gap-1.5 pb-2">
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=150" alt="wedding 1" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=150" alt="wedding 2" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=150" alt="wedding 3" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=150" alt="wedding 4" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=150" alt="wedding 5" className="w-full h-full object-cover" />
                      </div>
                      <div className="h-[75px] rounded-lg overflow-hidden border border-white/5">
                        <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=150" alt="wedding 6" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <button 
                    onClick={() => setPreviewStep(1)}
                    className="secondary-btn text-[0.72rem] p-2 justify-center w-full border border-white/10 rounded-lg text-[var(--text-muted)] cursor-pointer"
                  >
                    Simülasyonu Sıfırla
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
