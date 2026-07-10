import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { mockApi } from "../services/mockApi";
import { fetchParticipants } from "../features/participants/participantsSlice";
import { fetchPhotosByEvent } from "../features/photos/photosSlice";
import { 
  fetchMatches, 
  updateMatchStatus, 
  createManualMatch 
} from "../features/matches/matchesSlice";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
  UserCheck, 
  XCircle, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Users, 
  ChevronRight, 
  Image as ImageIcon,
  Sparkles,
  Sliders,
  AlertCircle,
  Plus,
  X
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";
import { motion } from "framer-motion";

export default function MatchReview() {
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isUploader = user?.role === "uploader";

  const participants = useSelector((state) => state.participants.items) || [];
  const photos = useSelector((state) => state.photos.items) || [];
  const matches = useSelector((state) => state.matches.items) || [];
  const [selectedPartId, setSelectedPartId] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending_review"); // pending_review, approved, rejected, all
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualPhotoId, setManualPhotoId] = useState("");

  useEffect(() => {
    dispatch(fetchMatches());
    
    if (participants.length === 0) {
      dispatch(fetchParticipants());
    }
    if (photos.length === 0) {
      dispatch(fetchPhotosByEvent());
    }
  }, [dispatch]);

  useEffect(() => {
    if (participants.length > 0 && !selectedPartId) {
      setSelectedPartId(participants[0].id);
    }
  }, [participants, selectedPartId]);

  useEffect(() => {
    if (photos.length > 0 && !manualPhotoId) {
      setManualPhotoId(photos[0].id);
    }
  }, [photos, manualPhotoId]);

  const handleUpdateStatus = (matchId, status) => {
    dispatch(updateMatchStatus({ matchId, status }));
  };

  const getParticipantDetails = (partId) => {
    return participants.find(p => p.id === partId);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "auto_approved":
        return (
          <span className="bg-emerald-500/15 text-emerald-500 text-[0.7rem] font-bold p-[2px_8px] rounded-[10px] inline-flex items-center gap-1">
            <CheckCircle2 size={12} /> Onaylandı
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-500/15 text-red-500 text-[0.7rem] font-bold p-[2px_8px] rounded-[10px] inline-flex items-center gap-1">
            <XCircle size={12} /> Reddedildi
          </span>
        );
      default:
        return (
          <span className="bg-amber-500/15 text-amber-500 text-[0.7rem] font-bold p-[2px_8px] rounded-[10px] inline-flex items-center gap-1">
            <HelpCircle size={12} /> Onay Bekliyor
          </span>
        );
    }
  };

  const selectedParticipant = getParticipantDetails(selectedPartId);

  // Filtered matches for selected participant and status
  const currentMatches = matches.filter(m => 
    m.participant_id === selectedPartId && 
    (statusFilter === "all" || m.status === statusFilter || (statusFilter === "approved" && m.status === "auto_approved"))
  );

  const pendingMatchesCount = matches.filter(m => m.status === "pending_review").length;

  const handleCreateManualMatch = () => {
    if (selectedParticipant && manualPhotoId) {
      dispatch(createManualMatch({
        eventId: selectedParticipant.event_id,
        participantId: selectedPartId,
        photoId: manualPhotoId
      })).unwrap().then(() => {
        setShowManualModal(false);
      });
    }
  };

  if (isMobile) {
    const getMatchPhoto = (photoId) => photos.find(p => p.id === photoId);
    
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Horizontal Participant Selector (iOS style) */}
        <div>
          <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-wider mb-2 block px-1">Katılımcı Seçin</span>
          <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
            {participants.map(p => {
              const isActive = p.id === selectedPartId;
              const pendingCount = matches.filter(m => m.participant_id === p.id && m.status === "pending_review").length;
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`flex-shrink-0 flex items-center gap-2 p-2 rounded-full border cursor-pointer transition-all ${
                    isActive 
                      ? "bg-[var(--color-blue-dark)] border-[var(--color-blue-dark)] text-white" 
                      : "bg-white/10 border-[var(--glass-border)] text-[var(--text-main)]"
                  }`}
                >
                  <img src={p.face_url} alt={p.display_name} className="w-8 h-8 rounded-full object-cover border border-white/20" />
                  <span className="text-xs font-bold whitespace-nowrap pr-2">{p.display_name}</span>
                  {pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white font-extrabold text-[9px] flex items-center justify-center -ml-1 mr-1">
                      {pendingCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Participant Details Card */}
        {selectedParticipant && (
          <div className="glass-panel p-3 flex items-center gap-3 bg-[var(--glass-bg-strong)]">
            <img src={selectedParticipant.face_url} alt="Selfie" className="w-12 h-12 rounded-full object-cover border border-[var(--glass-border)]" />
            <div>
              <strong className="text-xs font-black block text-[var(--text-main)]">{selectedParticipant.display_name}</strong>
              <p className="text-[9px] text-[var(--text-muted)] mt-0.5 m-0">Eşleşmeler bu selfie referans alınarak doğrulanır.</p>
            </div>
          </div>
        )}

        {/* Swipe Card Deck Container */}
        <div className="flex-grow flex items-center justify-center min-h-[300px] relative">
          {currentMatches.length === 0 ? (
            <div className="glass-panel p-8 text-center max-w-[280px]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                <UserCheck size={24} />
              </div>
              <strong className="text-sm font-bold block text-[var(--text-main)]">İşlem Tamam!</strong>
              <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                Bu katılımcıya ait onay bekleyen başka eşleşme kalmadı. Diğer katılımcıları inceleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="w-full max-w-[280px] h-[340px] relative">
              {currentMatches.slice(0, 2).reverse().map((match, idx) => {
                const photo = getMatchPhoto(match.photo_id);
                if (!photo) return null;
                const isTopCard = idx === 1 || currentMatches.length === 1;

                return (
                  <motion.div
                    key={match.id}
                    drag={isTopCard}
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(event, info) => {
                      if (info.offset.x > 100) {
                        handleUpdateStatus(match.id, "approved");
                        showToast("Fotoğraf onaylandı.");
                      } else if (info.offset.x < -100) {
                        handleUpdateStatus(match.id, "rejected");
                        showToast("Fotoğraf reddedildi.");
                      }
                    }}
                    className="absolute inset-0 glass-panel overflow-hidden flex flex-col shadow-xl cursor-grab active:cursor-grabbing rounded-3xl border border-[var(--glass-border)] bg-[var(--glass-bg-strong)]"
                    style={{
                      zIndex: isTopCard ? 10 : 1,
                      scale: isTopCard ? 1 : 0.95,
                      y: isTopCard ? 0 : 8,
                      opacity: isTopCard ? 1 : 0.8
                    }}
                  >
                    {/* Visual Photo */}
                    <div className="flex-1 relative bg-black/5">
                      <img src={photo.thumbnail_url} alt="match candidate" className="w-full h-full object-cover pointer-events-none" />
                      
                      {/* Matching rate badge overlay */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white font-extrabold text-[10px] flex items-center gap-1">
                        <Sparkles size={10} className="text-amber-400" />
                        <span>Skor: %{(match.confidence * 100).toFixed(0)}</span>
                      </div>

                      {/* Status indicator */}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(match.status)}
                      </div>
                    </div>

                    {/* Bottom action bar */}
                    <div className="p-4 flex items-center justify-around bg-white/5 border-t border-[var(--glass-border)]/20">
                      <button
                        onClick={() => {
                          handleUpdateStatus(match.id, "rejected");
                          showToast("Eşleşme reddedildi.");
                        }}
                        className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 border-none flex items-center justify-center shadow-sm cursor-pointer active:scale-90 transition-transform"
                      >
                        <X size={18} />
                      </button>
                      
                      <button
                        onClick={() => {
                          handleUpdateStatus(match.id, "approved");
                          showToast("Eşleşme onaylandı.");
                        }}
                        className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 border-none flex items-center justify-center shadow-sm cursor-pointer active:scale-90 transition-transform"
                      >
                        <UserCheck size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      {/* Page Header Area */}
      <div className="flex justify-end items-center mb-1">
        {!isUploader && (
          <button 
            className="primary-btn gap-2" 
            onClick={() => setShowManualModal(true)}
          >
            <Plus size={18} />
            <span>Manuel Eşleşme Ekle</span>
          </button>
        )}
      </div>

      {/* Human-in-the-loop alert band */}
      <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-4 rounded-[16px] text-[var(--text-main)]">
        <AlertCircle size={20} className="text-amber-500 shrink-0" />
        <span className="text-[0.88rem] font-semibold">
          Yapay zeka analiz etti! Onay bekleyen <strong className="text-amber-500 font-bold">{pendingMatchesCount} fotoğraf eşleşmesi</strong> insan doğrulaması (human-in-the-loop) gerektiriyor.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-[var(--space-lg)]">
        {/* Left Side: Participants Panel */}
        <GlassCard className="glass-panel p-4 flex flex-col gap-3 min-h-[500px]">
          <h3 className="text-[1rem] font-extrabold text-[var(--text-main)] m-0">Katılımcı Seç</h3>
          
          <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
            {participants.map((p) => {
              const isSelected = selectedPartId === p.id;
              const participantPendingCount = matches.filter(m => m.participant_id === p.id && m.status === "pending_review").length;
              
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPartId(p.id)}
                  className={`flex items-center p-3 rounded-[12px] cursor-pointer transition-all duration-200 border ${
                    isSelected 
                      ? "bg-[var(--color-blue-dark)] border-transparent text-white" 
                      : "bg-white/5 border-[var(--glass-border)] text-[var(--text-main)] hover:bg-white/10"
                  }`}
                >
                  <img 
                    src={p.selfie_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                    alt={p.display_name} 
                    className="w-10 h-10 rounded-full object-cover mr-3 shrink-0"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"; }}
                  />
                  <div className="flex-grow min-w-0">
                    <strong className={`text-[0.88rem] block truncate font-bold ${isSelected ? "text-white" : "text-[var(--text-main)]"}`}>
                      {p.display_name}
                    </strong>
                    <small className={`text-[0.72rem] ${isSelected ? "text-blue-100" : "text-[var(--text-muted)]"}`}>
                      Toplam: {matches.filter(m => m.participant_id === p.id).length} eşleşme
                    </small>
                  </div>
                  {participantPendingCount > 0 && (
                    <span className={`ml-2 shrink-0 text-[0.7rem] font-extrabold p-[2px_8px] rounded-full ${
                      isSelected ? "bg-white text-[var(--color-blue-dark)]" : "bg-amber-500/15 text-amber-500"
                    }`}>
                      {participantPendingCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Right Side: Review Panel */}
        <div className="flex flex-col gap-[var(--space-md)]">
          {/* Status Tabs */}
          <GlassCard className="glass-panel p-2">
            <div className="flex flex-wrap gap-1">
              {[
                { id: "pending_review", label: "İnceleme Bekleyenler" },
                { id: "approved", label: "Onaylananlar" },
                { id: "rejected", label: "Reddedilenler" },
                { id: "all", label: "Tümü" }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-grow sm:flex-grow-0 p-[8px_16px] rounded-[10px] text-[0.85rem] font-bold border-none cursor-pointer transition-all duration-200 ${
                    statusFilter === tab.id 
                      ? "bg-[var(--color-blue-dark)] text-white shadow-sm" 
                      : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  }`}
                >
                  {tab.label} ({
                    tab.id === "all" 
                      ? matches.filter(m => m.participant_id === selectedPartId).length
                      : matches.filter(m => m.participant_id === selectedPartId && (m.status === tab.id || (tab.id === "approved" && m.status === "auto_approved"))).length
                  })
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Matches Grid */}
          <GlassCard className="glass-panel p-5" title="Eşleşme Fotoğrafları">
            {currentMatches.length === 0 ? (
              <div className="text-center p-12 text-[var(--text-muted)] flex flex-col items-center justify-center border border-dashed border-[var(--glass-border)] rounded-2xl bg-white/5">
                <ImageIcon size={48} className="mb-4 opacity-40 text-[var(--color-blue-dark)]" />
                <h4 className="font-extrabold text-[1rem] text-[var(--text-main)] mb-1">Bu filtrede incelenecek eşleşme yok.</h4>
                <p className="m-0 text-[0.8rem]">Seçili katılımcının bu duruma ait bir eşleşmesi bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentMatches.map((match) => {
                  const photo = photos.find(p => p.id === match.photo_id);
                  const pUrl = photo ? (photo.thumbnail_url || photo.original_url || "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=400") : "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=400";
                  const pName = photo ? photo.filename : `fotoğraf_${match.photo_id}.jpg`;
                  
                  return (
                    <GlassCard 
                      key={match.id} 
                      className="stat-card p-0 overflow-hidden flex flex-col justify-between relative group"
                    >
                      {/* Photo Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/10">
                        <img 
                          src={pUrl} 
                          alt="matched thumbnail" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=400"; }}
                        />
                        
                        {/* Confidence score badge */}
                        <div className="absolute top-2.5 right-2.5 z-10">
                          <span className={`bg-black/70 backdrop-blur-[6px] px-2.5 py-1 rounded-[10px] text-[0.72rem] font-bold ${
                            match.confidence >= 0.8 ? "text-emerald-400" : "text-amber-400"
                          }`}>
                            %{(match.confidence * 100).toFixed(0)} Güven
                          </span>
                        </div>

                        {/* Status badge */}
                        <div className="absolute bottom-2.5 left-2.5 z-10">
                          {getStatusBadge(match.status)}
                        </div>
                      </div>

                      {/* Details & Action Button Footer */}
                      <div className="p-3 flex flex-col justify-between flex-grow">
                        <span className="text-[var(--text-muted)] text-[0.75rem] block truncate font-mono mb-2.5">
                          {pName}
                        </span>

                        <div className="flex gap-1.5 w-full">
                          {match.status === "pending_review" ? (
                            <>
                              <button 
                                className={`flex-grow h-8 py-1 px-2.5 text-[0.78rem] justify-center items-center bg-emerald-500 hover:bg-emerald-600 text-white border-none rounded-lg flex gap-1 font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${isUploader ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={isUploader ? () => showToast("Fotoğrafçı asistanı yetkisiyle bu eşleşme onaylanamaz.", "error") : () => handleUpdateStatus(match.id, "approved")}
                              >
                                <CheckCircle2 size={14} />
                                <span>Onayla</span>
                              </button>
                              <button 
                                className={`flex-grow h-8 py-1 px-2.5 text-[0.78rem] justify-center items-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg flex gap-1 font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${isUploader ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={isUploader ? () => showToast("Fotoğrafçı asistanı yetkisiyle bu eşleşme reddedilemez.", "error") : () => handleUpdateStatus(match.id, "rejected")}
                              >
                                <XCircle size={14} />
                                <span>Reddet</span>
                              </button>
                            </>
                          ) : (
                            <button 
                              className={`flex-grow h-8 py-1 px-2.5 text-[0.78rem] justify-center items-center bg-transparent hover:bg-white/5 text-[var(--text-muted)] border border-[var(--glass-border)] rounded-lg flex gap-1 font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${isUploader ? "opacity-50 cursor-not-allowed" : ""}`}
                              onClick={isUploader ? () => showToast("Fotoğrafçı asistanı yetkisiyle bu işlem geri alınamaz.", "error") : () => handleUpdateStatus(match.id, "pending_review")}
                            >
                              Geri Al (İnceleme)
                            </button>
                          )}
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Simulated Manual Match Modal */}
      <GlassModal
        open={showManualModal}
        onClose={() => setShowManualModal(false)}
        title="Manuel Fotoğraf Eşleştirme"
        subtitle="Seçili katılımcının yüzü yapay zeka tarafından algılanamadıysa, manuel olarak galerideki bir fotoğrafla eşleştirebilirsiniz."
        icon={UserCheck}
        width="max-w-[460px]"
        footer={
          <div className="flex gap-3">
            <button 
              className="primary-btn flex-grow py-2.5 justify-center font-bold"
              onClick={handleCreateManualMatch}
            >
              Eşleştir
            </button>
            <button 
              className="glass-btn flex-grow py-2.5 justify-center font-bold"
              onClick={() => setShowManualModal(false)}
            >
              İptal
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.82rem] font-bold text-slate-100">Katılımcı</label>
            <input 
              type="text" 
              readOnly 
              value={selectedParticipant?.display_name || ""} 
              className="w-full bg-slate-950/40 border border-white/20 rounded-[12px] p-[10px_14px] text-[0.85rem] text-slate-200 outline-none" 
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.82rem] font-bold text-slate-100">Fotoğraf Dosyası (ID)</label>
            <select 
              value={manualPhotoId}
              onChange={(e) => setManualPhotoId(e.target.value)}
              className="w-full p-2.5 rounded-[12px] bg-[#151c2c] border border-white/20 text-white outline-none cursor-pointer"
            >
              {photos.map(ph => (
                <option key={ph.id} value={ph.id} className="bg-[#151c2c] text-white">
                  {ph.filename} ({ph.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
