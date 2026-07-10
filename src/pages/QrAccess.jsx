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
  Info
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

export default function QrAccess() {
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [copied, setCopied] = useState(false);
  const [accessType, setAccessType] = useState("public"); // public, token, invite
  const [guestUpload, setGuestUpload] = useState(true);

  useEffect(() => {
    const evs = mockApi.getEvents();
    setEvents(evs);
    if (evs.length > 0) {
      setSelectedEventId(evs[0].id);
    }
  }, []);

  const getSelectedEvent = () => {
    return events.find(e => e.id === selectedEventId) || null;
  };

  const getGuestLink = () => {
    const ev = getSelectedEvent();
    return ev ? `https://snapmatch.me/guest/${ev.qr_token || "tok_default"}` : "https://snapmatch.me/guest/select";
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
            className="w-full p-3 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
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
                  className="p-2.5 rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[0.92rem] font-semibold text-[var(--text-main)] outline-none"
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
                      className="flex-grow p-[8px_12px] rounded-[10px] bg-white/5 border border-[var(--glass-border)] text-[0.82rem] text-[var(--text-main)] outline-none" 
                    />
                    <button className="icon-btn" onClick={handleCopyLink} title="Linki Kopyala">
                      {copied ? <Check size={16} className="text-[var(--accent-green)]" /> : <Copy size={16} />}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button className="primary-btn p-[8px_12px] text-[0.8rem] gap-1.5" onClick={() => showToast("PNG formatında yüksek çözünürlüklü QR kod indiriliyor...", "info")}>
                      <Download size={14} /> PNG İndir
                    </button>
                    <button className="primary-btn p-[8px_12px] text-[0.8rem] gap-1.5 !bg-transparent text-[var(--text-main)] border border-[var(--glass-border)]" onClick={() => showToast("SVG formatında vektörel QR kod indiriliyor...", "info")}>
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
                onClick={() => setAccessType("public")}
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
                onClick={() => setAccessType("token")}
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
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-[0.88rem] block">Misafirlerin Fotoğraf Yüklemesine İzin Ver</strong>
                  <span className="text-[0.78rem] text-[var(--text-muted)]">Aktif edildiğinde misafirler de kendi çektiklerini galeriye yükleyebilir.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={guestUpload} 
                  onChange={(e) => setGuestUpload(e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1.5 border-t border-[var(--glass-border)] pt-3.5">
                <label className="text-[0.85rem] font-bold">KVKK Rıza Metni Taslağı</label>
                <textarea 
                  rows={3} 
                  defaultValue="Snapmatch AI arama motoruna selfie yükleyerek biyometrik verilerimin etkinlik fotoğraflarında eşleştirilmesine rıza gösteriyorum."
                  className="p-[8px_12px] rounded-[10px] bg-white/5 border border-[var(--glass-border)] text-[0.8rem] text-[var(--text-main)] resize-none outline-none"
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Guest View Mobile Mockup Preview */}
        <div className="flex flex-col gap-3 items-center">
          <div className="flex items-center gap-2">
            <Smartphone size={18} className="text-[var(--color-blue-dark)]" />
            <span className="text-[0.88rem] font-bold">Misafir Arayüzü Önizleme (Mobile Mockup)</span>
          </div>

          {/* Custom phone mockup */}
          <div className="w-[280px] h-[560px] rounded-[36px] border-[8px] border-[#1a202c] bg-[var(--body-bg)] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex flex-col">
            {/* Camera notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[18px] bg-[#1a202c] rounded-b-[10px] z-10" />
            
            {/* Mock Header Image */}
            <div className="h-[120px] w-full relative">
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
            <div className="p-4 flex-grow flex flex-col gap-4 justify-between">
              <div className="flex flex-col gap-3 text-center">
                <div className="w-[50px] h-[50px] rounded-full bg-indigo-500/15 text-[var(--color-blue-dark)] grid place-items-center mt-2.5 mx-auto mb-0">
                  <Smartphone size={24} />
                </div>
                <strong className="text-[0.85rem] block font-bold">Selfie Çek & Fotoğraflarını Bul!</strong>
                <p className="m-0 text-[0.72rem] text-[var(--text-muted)] leading-5">
                  Bir selfie yükleyerek etkinlik albümündeki tüm fotoğraflarınıza anında erişin.
                </p>
              </div>

              {/* Upload CTA */}
              <div className="flex flex-col gap-2.5">
                <button className="primary-btn text-[0.78rem] p-2.5 justify-center w-full">
                  Kamerayı Aç / Selfie Yükle
                </button>
                
                {/* Consent text footer preview */}
                <div className="flex gap-1.5 items-start text-left">
                  <input type="checkbox" defaultChecked className="mt-0.5" />
                  <span className="text-[0.62rem] text-[var(--text-muted)] leading-[1.3]">
                    Biyometrik verilerimin eşleştirilmesi amacıyla Snapmatch aydınlatma beyanını kabul ediyorum.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
