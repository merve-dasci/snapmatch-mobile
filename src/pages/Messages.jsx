import React, { useState, useEffect, useRef } from "react";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { mockApi } from "../services/mockApi";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { ROLES } from "../auth/roles";
import { 
  Send, 
  MessageSquare, 
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  ExternalLink
} from "lucide-react";

export default function Messages() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [activeContactId, setActiveContactId] = useState("");
  const [inputText, setInputText] = useState("");
  const [callModalOpen, setCallModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper to resolve contact information dynamically from ROLES configuration
  const getContactInfo = (contactId) => {
    const r = ROLES[contactId];
    if (!r) return null;
    const initials = r.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return {
      id: contactId,
      name: r.name,
      label: r.label,
      initials,
      color: r.color,
    };
  };

  // Define contacts metadata based on roles
  const contactIdsMatrix = {
    platform_admin: ["business_admin", "event_owner"],
    business_admin: ["event_owner"],
    event_owner: ["business_admin", "uploader", "katilimci"],
    uploader: ["event_owner"],
    katilimci: ["event_owner"]
  };

  const currentUserRole = user?.role || "katilimci";
  const contactIds = contactIdsMatrix[currentUserRole] || [];
  const contacts = contactIds.map(getContactInfo).filter(Boolean);

  useEffect(() => {
    // Initial fetch of messages
    setMessages(mockApi.getMessages());
    
    // Select first contact by default if exists
    if (contacts.length > 0) {
      setActiveContactId(contacts[0].id);
    }
  }, [currentUserRole]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContactId]);

  const activeContact = contacts.find(c => c.id === activeContactId);

  // Filter messages for current thread
  const currentThreadMessages = messages.filter(m => 
    (m.sender_id === currentUserRole && m.receiver_id === activeContactId) ||
    (m.sender_id === activeContactId && m.receiver_id === currentUserRole)
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContactId) return;

    // Send message via mock api
    mockApi.sendMessage(currentUserRole, activeContactId, inputText);
    setMessages([...mockApi.getMessages()]);
    setInputText("");

    // Simulated Auto-Reply to show interactivity
    setTimeout(() => {
      let replyText = "Mesajınızı aldım, en kısa sürede kontrol edip döneceğim.";
      
      if (currentUserRole === "katilimci" && activeContactId === "event_owner") {
        replyText = `Merhaba Zeynep Hanım, mesajınızı aldım. Etkinlikteki yüz kayıtlarınızı inceleyip fotoğraflarınızın doğrulanmasını hızlandırıyorum.`;
      } else if (currentUserRole === "event_owner" && activeContactId === "business_admin") {
        replyText = `Merve Hanım selamlar, sisteme son yüklenen albümü asistanım şimdi onayladı, paneline düşmüş olmalı.`;
      } else if (currentUserRole === "event_owner" && activeContactId === "uploader") {
        replyText = `Merve Hanım, kapalı gruptaki fotoğrafları hemen uploader üzerinden aktarıyorum, 2 dakika içinde biter.`;
      } else if (currentUserRole === "business_admin" && activeContactId === "event_owner") {
        replyText = `Ezgi Hanım, etkinlik detaylarındaki QR kodunu misafirlerle paylaştım. Katılımcı kayıtları gelmeye başladı.`;
      }

      mockApi.sendMessage(activeContactId, currentUserRole, replyText);
      setMessages([...mockApi.getMessages()]);
      showToast(`${activeContact?.name || "Kullanıcı"} yeni bir mesaj gönderdi.`, "info");
    }, 1500);
  };

  const getFormatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return "";
    }
  };

  // Generate deterministic room name for Jitsi Meet
  const getJitsiRoomName = () => {
    if (!activeContact) return "";
    const sortedIds = [currentUserRole, activeContact.id].sort();
    return `snapmatch-call-${sortedIds[0]}-${sortedIds[1]}`;
  };

  const roomName = getJitsiRoomName();
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${user?.name || "Kullanıcı"}"`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[330px_1fr] gap-[var(--space-lg)] h-[calc(100vh-160px)] min-h-[500px]">
      {/* Left Column: Chat List */}
      <GlassCard className="glass-panel p-4 flex flex-col h-full overflow-hidden relative">
        {/* Glow Effects in list background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-0">
          <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-[var(--color-blue-medium)]/5 blur-[70px]" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4 relative z-10 border-b border-[var(--glass-border)] pb-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-blue-dark) 10%, transparent)",
              borderColor: "color-mix(in srgb, var(--color-blue-dark) 20%, transparent)",
              color: "var(--color-blue-dark)"
            }}
          >
            <MessageSquare size={16} />
          </div>
          <h3 className="text-[0.95rem] font-bold text-[var(--text-main)] m-0">Mesaj Kutusu</h3>
        </div>

        {/* Contacts Scrollable area */}
        <div className="flex-grow overflow-y-auto pr-1 flex flex-col gap-2 relative z-10 custom-scrollbar">
          {contacts.length === 0 ? (
            <div className="text-center p-8 text-[var(--text-muted)] text-[0.8rem] border border-dashed border-[var(--glass-border)] rounded-xl bg-[var(--glass-bg)]/20">
              Kişi veya aktif sohbet bulunamadı.
            </div>
          ) : (
            contacts.map(c => {
              // Find last message in this thread
              const thread = messages.filter(m => 
                (m.sender_id === currentUserRole && m.receiver_id === c.id) ||
                (m.sender_id === c.id && m.receiver_id === currentUserRole)
              );
              const lastMsg = thread[thread.length - 1];
              const isSelected = activeContactId === c.id;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveContactId(c.id)}
                  className={`w-full text-left p-3.5 rounded-[16px] border flex items-center gap-3 transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? "bg-[var(--glass-bg-strong)] shadow-md" 
                      : "bg-[var(--glass-bg)]/20 border-transparent hover:bg-[var(--glass-bg-strong)]/40 hover:border-[var(--glass-border)]"
                  }`}
                  style={{
                    borderColor: isSelected ? "color-mix(in srgb, var(--color-blue-dark) 30%, transparent)" : undefined
                  }}
                >
                  {/* Left accent border on selected */}
                  {isSelected && (
                    <div 
                      className="absolute left-0 top-3 bottom-3 w-[3.5px] rounded-r-[4px]" 
                      style={{
                        background: `linear-gradient(to bottom, var(--color-blue-dark), var(--color-blue-medium))`
                      }}
                    />
                  )}

                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[0.85rem] font-black shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${c.color} 0%, color-mix(in srgb, ${c.color} 75%, black) 100%)`,
                      boxShadow: `0 0 10px color-mix(in srgb, ${c.color} 15%, transparent)`
                    }}
                  >
                    {c.initials}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-grow overflow-hidden flex flex-col gap-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[var(--text-main)] text-[0.82rem] font-extrabold truncate">{c.name}</span>
                      {lastMsg && (
                        <span className="text-[0.66rem] text-[var(--text-muted)] font-semibold shrink-0">
                          {getFormatTime(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    <span 
                      className="text-[0.68rem] font-bold truncate leading-none"
                      style={{ color: "var(--color-blue-dark)" }}
                    >
                      {c.label}
                    </span>
                    {lastMsg && (
                      <span className="text-[0.72rem] text-[var(--text-muted)] truncate mt-1 leading-normal">
                        {lastMsg.text}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </GlassCard>

      {/* Right Column: Chat Window */}
      <GlassCard className="glass-panel p-0 flex flex-col h-full overflow-hidden relative">
        {/* Glow Effects in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-0">
          <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-[var(--color-blue-medium)]/8 blur-[90px]" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-[var(--color-blue-soft)]/8 blur-[90px]" />
        </div>

        {activeContact ? (
          <>
            {/* Header */}
            <div 
              className="p-4 border-b flex items-center justify-between backdrop-blur-md relative z-10"
              style={{ 
                backgroundColor: "color-mix(in srgb, var(--glass-bg-strong) 40%, transparent)",
                borderColor: "var(--glass-border)"
              }}
            >
              <div className="flex items-center gap-3">
                {/* Dynamic Avatar */}
                <div 
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center text-white text-[0.85rem] font-black"
                  style={{
                    background: `linear-gradient(135deg, ${activeContact.color} 0%, color-mix(in srgb, ${activeContact.color} 75%, black) 100%)`,
                    boxShadow: `0 0 10px color-mix(in srgb, ${activeContact.color} 15%, transparent)`
                  }}
                >
                  {activeContact.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[var(--text-main)] text-[0.9rem] font-extrabold leading-tight">{activeContact.name}</span>
                  <span 
                    className="text-[0.72rem] font-bold mt-0.5"
                    style={{ color: "var(--color-blue-dark)" }}
                  >
                    {activeContact.label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border cursor-pointer transition"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                    color: "var(--text-main)"
                  }}
                >
                  <Phone size={15} />
                </button>
                <button 
                  onClick={() => setCallModalOpen(true)}
                  className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border cursor-pointer transition hover:bg-[var(--color-blue-dark)]/15"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                    color: "var(--text-main)"
                  }}
                  title="Görüntülü Arama (Jitsi Meet)"
                >
                  <Video size={15} />
                </button>
                <button 
                  className="w-8.5 h-8.5 rounded-lg flex items-center justify-center border cursor-pointer transition"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    borderColor: "var(--glass-border)",
                    color: "var(--text-main)"
                  }}
                >
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            {/* Chat Messages list */}
            <div className="flex-grow overflow-y-auto p-5 flex flex-col gap-4 relative z-10 custom-scrollbar">
              {currentThreadMessages.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-[var(--text-muted)] text-[0.82rem] gap-2 p-12">
                  <MessageSquare size={36} className="opacity-30" style={{ color: "var(--color-blue-medium)" }} />
                  <span>Sohbeti başlatmak için ilk mesajı yazın.</span>
                </div>
              ) : (
                currentThreadMessages.map((msg) => {
                  const isMe = msg.sender_id === currentUserRole;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[70%] ${isMe ? "self-end items-end animate-slide-in-right" : "self-start items-start animate-slide-in-left"}`}
                    >
                      <div 
                        className={`p-3.5 rounded-[18px] text-[0.84rem] leading-[1.45] shadow-sm ${
                          isMe 
                            ? "text-white rounded-tr-sm" 
                            : "text-[var(--text-main)] rounded-tl-sm backdrop-blur-md border"
                        }`}
                        style={{
                          background: isMe 
                            ? "var(--accent-gradient)" 
                            : "var(--glass-bg-strong)",
                          borderColor: isMe 
                            ? "transparent" 
                            : "var(--glass-border)"
                        }}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1.5 text-[0.65rem] text-[var(--text-muted)] px-1 font-semibold">
                        <span>{getFormatTime(msg.timestamp)}</span>
                        {isMe && <CheckCheck size={12} style={{ color: "var(--color-blue-dark)" }} className="ml-0.5" />}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Form */}
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t backdrop-blur-md flex gap-2.5 items-center relative z-10"
              style={{
                backgroundColor: "color-mix(in srgb, var(--glass-bg-strong) 50%, transparent)",
                borderColor: "var(--glass-border)"
              }}
            >
              <input 
                type="text" 
                placeholder="Mesajınızı buraya yazın..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow bg-[var(--glass-bg-strong)]/30 border border-[var(--glass-border)] rounded-[14px] p-3 px-4 text-[0.85rem] outline-none text-[var(--text-main)] focus:border-[var(--color-blue-dark)] placeholder-[var(--text-muted)] transition-colors"
              />
              <button 
                type="submit" 
                className="w-11 h-11 rounded-[14px] text-white flex items-center justify-center border-none cursor-pointer transition-all active:scale-95 shadow-md shadow-blue-500/10 shrink-0"
                style={{
                  background: "var(--accent-gradient)"
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-[var(--text-muted)] text-[0.82rem] gap-2.5 p-12">
            <div 
              className="w-14 h-14 rounded-full border flex items-center justify-center mb-2"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-blue-dark) 10%, transparent)",
                borderColor: "color-mix(in srgb, var(--color-blue-dark) 20%, transparent)",
                color: "var(--color-blue-dark)"
              }}
            >
              <MessageSquare size={26} />
            </div>
            <strong className="text-[var(--text-main)] text-[0.95rem]">Sohbet Seçin</strong>
            <span className="text-[var(--text-muted)] text-center max-w-[280px]">İletişime geçmek istediğiniz kullanıcıyı sol listeden seçerek sohbeti başlatabilirsiniz.</span>
          </div>
        )}
      </GlassCard>

      {/* Jitsi Meet Video Call Modal */}
      {activeContact && (
        <GlassModal
          open={callModalOpen}
          onClose={() => setCallModalOpen(false)}
          title="Görüntülü Arama Başlatılıyor"
          subtitle={`${activeContact.name} ile güvenli video konferans`}
          icon={Video}
          width="max-w-[1200px] w-[95vw]"
          noPadding={true}
          height="h-[60vh] min-h-[500px]"
          overflow="overflow-hidden"
          footer={
            <div className="flex justify-between items-center w-full">
              <span className="text-[0.76rem] text-[var(--text-muted)] font-semibold">
                Oda Adı: {roomName}
              </span>
              <a 
                href={jitsiUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="primary-btn text-[0.82rem] p-[8px_14px] flex items-center gap-1.5 hover:opacity-90"
                style={{ textDecoration: "none" }}
              >
                <span>Ayrı Sekmede Aç</span>
                <ExternalLink size={14} />
              </a>
            </div>
          }
        >
          <iframe
            src={jitsiUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block"
            }}
            title="Jitsi Meet Conference"
          />
        </GlassModal>
      )}
    </div>
  );
}
