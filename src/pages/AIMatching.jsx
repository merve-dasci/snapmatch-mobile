import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { fetchEvents } from "../features/events/eventsSlice";
import { 
  startMatching, 
  setThresholds, 
  setProgress, 
  setProcessing, 
  setActiveJobLocal, 
  clearActiveJob 
} from "../features/matchingJobs/matchingJobsSlice";
import { matchingService } from "../services/matchingService";
import { 
  Zap, 
  Settings, 
  Cpu, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Sliders, 
  Play, 
  ListOrdered,
  Gauge,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

export default function AIMatching() {
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.items) || [];
  const progress = useSelector((state) => state.matchingJobs.progress);
  const thresholdReview = useSelector((state) => state.matchingJobs.thresholdReview);
  const thresholdApprove = useSelector((state) => state.matchingJobs.thresholdApprove);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [matchingStatus, setMatchingStatus] = useState("idle"); // idle, processing, completed
  const [currentStep, setCurrentStep] = useState(0);
  const [eventParticipants, setEventParticipants] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState("");

  // Stats derived from mockApi
  const [photosCount, setPhotosCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);

  useEffect(() => {
    dispatch(fetchEvents()).then((action) => {
      if (action.payload && action.payload.length > 0 && !selectedEventId) {
        setSelectedEventId(action.payload[0].id);
      }
    });
  }, [dispatch, selectedEventId]);

  useEffect(() => {
    if (selectedEventId) {
      const phs = mockApi.getPhotos(selectedEventId);
      const mtch = mockApi.getMatches(selectedEventId);
      const parts = mockApi.getParticipants(selectedEventId);
      
      setPhotosCount(phs.length);
      setMatchesCount(mtch.length);
      setEventParticipants(parts);
      setSelectedParticipantId(""); // Reset selection when event changes
    }
  }, [selectedEventId]);

  const handleStartMatching = () => {
    if (matchingStatus === "processing") return;
    setMatchingStatus("processing");
    setCurrentStep(1);
    dispatch(setProgress(20));
    dispatch(setProcessing(true));
    
    // Start matching in Redux
    dispatch(startMatching(selectedEventId)).unwrap().then((job) => {
      // Simulate steps
      setTimeout(() => {
        setCurrentStep(2);
        dispatch(setProgress(45));
      }, 1200);

      setTimeout(() => {
        setCurrentStep(3);
        dispatch(setProgress(75));
      }, 2400);

      setTimeout(() => {
        setCurrentStep(4);
        dispatch(setProgress(100));
        setMatchingStatus("completed");
        
        // Simulating API call to trigger matching mock
        if (selectedParticipantId) {
          // Run matching only for the selected participant
          mockApi.simulateAiMatchingForParticipant(selectedEventId, selectedParticipantId);
        } else {
          // Run matching for all event photos
          mockApi.simulateAiMatching(selectedEventId, mockApi.getPhotos(selectedEventId).map(p => p.id));
        }
        
        // Update local numbers
        const mtch = mockApi.getMatches(selectedEventId);
        setMatchesCount(mtch.length);

        // Update job status in backend mock
        const updatedJob = matchingService.updateJobLocal(job.id, {
          status: "completed",
          progress: 100,
          completed_at: new Date().toISOString(),
          matched_count: mtch.length
        });
        dispatch(setActiveJobLocal(updatedJob));
        dispatch(setProcessing(false));
      }, 3600);
    });
  };

  const steps = [
    { label: "Fotoğraflar Alındı", desc: "Sisteme yüklenen tüm dosyalar analiz edildi" },
    { label: "Yüz Algılama (Face Detection)", desc: "Fotoğraflardaki biyometrik yüz alanları çıkartılıyor" },
    { label: "Öznitelik Eşleştirme (Matching)", desc: "Öznitelikler katılımcı selfieleriyle karşılaştırılıyor" },
    { label: "İnceleme Sıralaması (Review Queue)", desc: "Eşik değerine göre onay/red kuyruğu hazırlanıyor" },
    { label: "İşlem Tamamlandı", desc: "Eşleşmeler katılımcı galerilerine dağıtıldı" }
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Selector Header */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Etkinlik Seçin</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            disabled={matchingStatus === "processing"}
            className="w-full p-3 rounded-xl border border-[var(--glass-border)] bg-white/10 text-sm text-[var(--text-main)] outline-none"
          >
            {events.map(e => (
              <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Engine State View */}
        {matchingStatus === "idle" && (
          <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] flex items-center justify-center animate-pulse">
              <Cpu size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] m-0">AI Eşleştirme Hazır</h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed max-w-[220px] mx-auto">
                Seçili etkinlikteki {photosCount} fotoğraf üzerinde yüz tarama ve katılımcı eşleme motorunu başlatın.
              </p>
            </div>
            
            {/* Simple slider info */}
            <div className="w-full text-left bg-white/5 border border-[var(--glass-border)]/40 p-3.5 rounded-xl text-xs flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Otomatik Onay Eşiği:</span>
                <strong className="text-[var(--text-main)]">%{(thresholdApprove * 100).toFixed(0)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Manuel Denetim Eşiği:</span>
                <strong className="text-[var(--text-main)]">%{(thresholdReview * 100).toFixed(0)}</strong>
              </div>
            </div>

            <button
              onClick={handleStartMatching}
              className="primary-btn w-full py-3 text-xs font-bold justify-center rounded-xl"
            >
              Eşleştirmeyi Tetikle
            </button>
          </div>
        )}

        {matchingStatus === "processing" && (
          <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
            {/* Spinning Radar style indicator */}
            <div className="relative w-24 h-24 rounded-full border border-[var(--color-blue-medium)]/30 flex items-center justify-center">
              <div className="absolute inset-0.5 rounded-full border border-dashed border-[var(--color-blue-dark)] animate-spin" />
              <div className="w-16 h-16 rounded-full bg-[var(--color-blue-dark)]/10 flex items-center justify-center text-[var(--color-blue-dark)]">
                <Cpu size={24} className="animate-pulse" />
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] m-0">AI Yüz Analizi Yapılıyor...</h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">Lütfen bekleyin, işlem tamamlanmak üzere.</p>
            </div>

            <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-[var(--glass-border)]">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">%{progress}</span>
          </div>
        )}

        {matchingStatus === "completed" && (
          <div className="glass-panel p-6 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--text-main)] m-0">Analiz Başarıyla Tamamlandı</h3>
              <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
                Model taramayı bitirdi ve eşleşme kayıtlarını güncelledi.
              </p>
            </div>

            <div className="w-full bg-white/5 border border-[var(--glass-border)]/40 p-3.5 rounded-xl text-xs flex flex-col gap-2 text-left">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Toplam Fotoğraf:</span>
                <strong className="text-[var(--text-main)]">{photosCount}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Bulunan Eşleşmeler:</span>
                <strong className="text-[var(--accent-green)]">{matchesCount} Eşleşme</strong>
              </div>
            </div>

            <button
              onClick={() => {
                setMatchingStatus("idle");
                setProgress(0);
                setCurrentStep(0);
              }}
              className="secondary-btn w-full py-3 text-xs font-bold justify-center rounded-xl"
            >
              Yeni Eşleştirme Başlat
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
        {/* Left: AI Pipeline Control & Stepper */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          {/* Controls */}
          <GlassCard title="Eşleştirme Tetikleme" className="glass-panel">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3 flex-grow">
                  <Cpu size={20} className="text-[var(--color-blue-dark)]" />
                  <select 
                    value={selectedEventId} 
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="p-[10px_14px] rounded-[12px] border border-[var(--glass-border)] bg-white/15 text-[0.92rem] font-semibold w-[260px] text-[var(--text-main)] outline-none"
                    disabled={matchingStatus === "processing"}
                  >
                    {events.map(e => <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>)}
                  </select>
                </div>

                <button 
                  className="primary-btn gap-2 p-[12px_24px]"
                  onClick={handleStartMatching}
                  disabled={matchingStatus === "processing"}
                >
                  {matchingStatus === "processing" ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Play size={18} />
                  )}
                  <span>
                    {matchingStatus === "processing" 
                      ? "AI Model Çalışıyor..." 
                      : selectedParticipantId 
                        ? "Seçili Katılımcıyı Eşleştir" 
                        : "AI Eşleştirmeyi Başlat (Tümü)"}
                  </span>
                </button>
              </div>

              {/* Katılımcı Filtreleme / Seçim Kısmı */}
              <div className="border-t border-[var(--glass-border)] pt-4 flex flex-col gap-3">
                <span className="text-[0.76rem] font-extrabold tracking-wider text-[var(--text-muted)] uppercase">
                  Katılımcı Seçimi (Profile Göre Eşleme)
                </span>
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Tüm Katılımcılar Seçeneği */}
                  <button
                    type="button"
                    onClick={() => setSelectedParticipantId("")}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-[16px] border transition-all cursor-pointer ${
                      selectedParticipantId === ""
                        ? "border-[var(--color-blue-dark)] bg-gradient-to-tr from-indigo-500/20 to-[var(--color-blue-dark)]/30 shadow-[0_0_15px_rgba(99,102,241,0.35)] scale-105"
                        : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/5 hover:scale-105"
                    }`}
                    disabled={matchingStatus === "processing"}
                  >
                    <div 
                      className={`w-12 h-12 rounded-full grid place-items-center text-[0.72rem] transition-all duration-300 ${
                        selectedParticipantId === ""
                          ? "bg-gradient-to-tr from-[var(--color-blue-dark)] to-indigo-500 shadow-[0_3px_12px_rgba(99,102,241,0.4)] border-none text-white font-black animate-[pulse_2s_infinite]"
                          : "bg-white/5 border border-white/10 text-[var(--text-muted)] font-extrabold"
                      }`}
                    >
                      HEPSİ
                    </div>
                    <span className="text-[0.74rem] font-bold text-[var(--text-main)] truncate w-[72px] text-center">Tümü</span>
                  </button>

                  {/* Katılımcıların Listesi */}
                  {eventParticipants.map(p => {
                    const isSelected = selectedParticipantId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedParticipantId(p.id)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-[16px] border transition-all cursor-pointer ${
                          isSelected
                            ? "border-[var(--color-blue-dark)] bg-[var(--color-blue-dark)]/20 shadow-[0_0_12px_rgba(255,255,255,0.08)] scale-[1.03]"
                            : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/5"
                        }`}
                        disabled={matchingStatus === "processing"}
                      >
                        {p.selfie_url ? (
                          <img 
                            src={p.selfie_url} 
                            alt={p.display_name} 
                            className="w-12 h-12 rounded-full object-cover border-2" 
                            style={{ borderColor: isSelected ? "var(--color-blue-dark)" : "rgba(255,255,255,0.15)" }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[var(--glass-border)] border border-white/10 grid place-items-center text-[0.85rem] font-bold text-[var(--text-main)]">
                            {p.display_name.charAt(0)}
                          </div>
                        )}
                        <span className="text-[0.74rem] font-bold text-[var(--text-main)] truncate w-[72px] text-center" title={p.display_name}>
                          {p.display_name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {matchingStatus === "processing" && (
              <div className="mt-5">
                <div className="flex justify-between text-[0.85rem] mb-1.5">
                  <span>Eşleştirme motoru ilerleme durumu...</span>
                  <strong>%{progress}</strong>
                </div>
                <div className="h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div style={{ width: `${progress}%` }} className="h-full bg-[var(--accent-gradient)] rounded-full" />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Stepper Pipeline */}
          <GlassCard title="AI Pipeline İlerleme Adımları" className="glass-panel">
            <div className="flex flex-col gap-5 relative py-2.5">
              <div className="absolute left-[19px] top-[15px] bottom-[15px] w-[2px] bg-[var(--glass-border)]" />
              
              {steps.map((step, idx) => {
                const isCompleted = currentStep > idx;
                const isCurrent = currentStep === idx;
                const isPending = currentStep < idx;

                return (
                  <div key={idx} className={`flex gap-4 items-start transition-opacity duration-300 ${isPending ? "opacity-50" : "opacity-100"}`}>
                    <div className={`w-10 h-10 rounded-full grid place-items-center text-[0.95rem] font-bold z-10 ${
                      isCompleted ? "bg-[var(--color-blue-dark)] text-white border-0" :
                      isCurrent ? "bg-indigo-500/15 text-[var(--color-blue-dark)] border-2 border-[var(--color-blue-dark)]" :
                      "bg-[var(--glass-bg-strong)] text-[var(--text-muted)] border border-[var(--glass-border)]"
                    }`}>
                      {isCompleted ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>
                    <div>
                      <strong className={`text-[0.92rem] block ${isCurrent ? "text-[var(--color-blue-dark)] font-bold" : "text-[var(--text-main)]"}`}>
                        {step.label}
                      </strong>
                      <p className="mt-0.5 mb-0 text-[0.8rem] text-[var(--text-muted)]">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right: AI settings Threshold, Health metrics */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          {/* Threshold Sliders */}
          <GlassCard 
            title="Eşleşme Güven Eşikleri (Threshold)" 
            action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
            className="glass-panel"
          >
            <div className="flex flex-col gap-5">
              <div className="flex gap-2.5">
                <Sliders size={18} className="text-[var(--color-blue-dark)]" />
                <span className="text-[0.88rem] font-bold">Model Karar Toleransları</span>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[0.82rem]">
                  <span className="text-[var(--text-muted)]">İnceleme Eşiği (Manual Match)</span>
                  <strong>{thresholdReview}</strong>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="0.75" 
                  step="0.05"
                  value={thresholdReview} 
                  onChange={(e) => dispatch(setThresholds({ review: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <small className="text-[var(--text-muted)] text-[0.72rem]">Bu skorun altındaki yüz eşleşmeleri doğrudan reddedilir.</small>
              </div>

              <div className="flex flex-col gap-1.5 border-t border-[var(--glass-border)] pt-3.5">
                <div className="flex justify-between text-[0.82rem]">
                  <span className="text-[var(--text-muted)]">Otomatik Onay Eşiği (Auto Approve)</span>
                  <strong>{thresholdApprove}</strong>
                </div>
                <input 
                  type="range" 
                  min="0.76" 
                  max="0.95" 
                  step="0.05"
                  value={thresholdApprove} 
                  onChange={(e) => dispatch(setThresholds({ approve: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <small className="text-[var(--text-muted)] text-[0.72rem]">Bu skorun üzerindeki yüzler sorgusuz onaylanarak kullanıcıya bildirim gönderilir.</small>
              </div>
            </div>
          </GlassCard>

          {/* Eşleşme İstatistikleri */}
          <GlassCard 
            title="Eşleşme İstatistikleri" 
            action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
            className="glass-panel"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-[0.85rem]">
                <ListOrdered size={16} className="text-[var(--color-blue-dark)]" />
                <span>Etkinlik Fotoğrafı:</span>
                <strong className="ml-auto">{photosCount} adet</strong>
              </div>
              <div className="flex items-center gap-2.5 text-[0.85rem]">
                <Zap size={16} className="text-[var(--color-blue-dark)]" />
                <span>Eşleşen Yüz Sayısı:</span>
                <strong className="ml-auto">{matchesCount} adet</strong>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Terminal Realtime Job Log */}
      <GlassCard title="Model Log Çıktısı (Realtime Logs)" className="glass-panel p-0 overflow-hidden">
        <div className="flex items-center gap-2 bg-black/15 p-[10px_16px] border-b border-[var(--glass-border)]">
          <Terminal size={16} className="text-[var(--text-muted)]" />
          <span className="text-[0.78rem] font-bold uppercase tracking-wider text-[var(--text-muted)]">Terminal Console</span>
        </div>
        <div className="bg-[#080b11] text-[#4ade80] font-mono p-4 text-[0.82rem] leading-6 max-h-[220px] overflow-y-auto">
          <div>[20:12:01] [SYSTEM] CUDA 12.1 initialized. GPU acceleration active.</div>
          <div>[20:12:03] [MODEL] Face detection model 'yolov8-face' loaded successfully.</div>
          <div>[20:12:04] [MODEL] Feature extraction model 'facenet-512' loaded successfully.</div>
          {matchingStatus === "processing" && (
            <>
              <div className="text-amber-500">[20:14:10] [JOBS] Processing event batch: {selectedEventId}</div>
              <div className="text-amber-500">[20:14:11] [INFO] Extracting biometric vectors for {photosCount} source photos...</div>
            </>
          )}
          {matchingStatus === "completed" && (
            <>
              <div className="text-amber-500">[20:14:10] [JOBS] Processing event batch: {selectedEventId}</div>
              <div>[20:14:12] [SUCCESS] Feature matching completed. Found {matchesCount} potential candidate matches.</div>
              <div>[20:14:13] [SYSTEM] Syncing matching matrices with workspace analytics database.</div>
              <div className="text-slate-200">[20:14:13] [SUCCESS] All matches pushed to review database. Pipeline idle.</div>
            </>
          )}
          {(!matchingStatus || matchingStatus === "idle") && (
            <div className="text-[var(--text-muted)]">[Idle] Model tetiklenmeye hazır...</div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
