import React, { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { mockApi } from "../services/mockApi";
import { useToast } from "../context/ToastContext";
import { fetchEvents } from "../features/events/eventsSlice";
import { 
  fetchPhotosByEvent, 
  uploadPhotos, 
  fetchUploadBatchesByEvent, 
  setSelectedEventId, 
  setUploadProgress, 
  setUploading 
} from "../features/photos/photosSlice";
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Image as ImageIcon,
  FolderOpen,
  Info,
  Calendar,
  Layers,
  FileWarning,
  Copy,
  Clock,
  User,
  Trash2,
  ChevronDown
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

export default function PhotoUpload() {
  const { showToast } = useToast();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.items) || [];
  const selectedEventId = useSelector((state) => state.photos.selectedEventId);
  const recentPhotos = useSelector((state) => state.photos.items) || [];
  const batches = useSelector((state) => state.photos.batches) || [];
  const uploading = useSelector((state) => state.photos.uploading);
  const uploadProgress = useSelector((state) => state.photos.uploadProgress);

  const [uploadStatusText, setUploadStatusText] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Upload results states
  const [uploadedBatch, setUploadedBatch] = useState(null);
  const [failedFiles, setFailedFiles] = useState([]);
  const [duplicateFiles, setDuplicateFiles] = useState([]);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchEvents()).then((action) => {
      if (action.payload && action.payload.length > 0 && !selectedEventId) {
        dispatch(setSelectedEventId(action.payload[0].id));
      }
    });
  }, [dispatch, selectedEventId]);

  useEffect(() => {
    if (selectedEventId) {
      dispatch(fetchPhotosByEvent(selectedEventId));
      dispatch(fetchUploadBatchesByEvent(selectedEventId));
      // Reset upload states
      setUploadedBatch(null);
      setFailedFiles([]);
      setDuplicateFiles([]);
    }
  }, [selectedEventId, dispatch]);

  const refreshData = () => {
    if (selectedEventId) {
      dispatch(fetchPhotosByEvent(selectedEventId));
      dispatch(fetchUploadBatchesByEvent(selectedEventId));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFiles = (filesList) => {
    if (!selectedEventId) {
      showToast("Lütfen önce bir etkinlik seçin.", "warning");
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB Limit
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    const validFiles = [];
    const failed = [];
    const duplicates = [];

    Array.from(filesList).forEach(file => {
      // 1. Format validation
      const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      const isValidType = allowedTypes.includes(file.type) || allowedExtensions.includes(fileExt);

      if (!isValidType) {
        failed.push({
          name: file.name,
          reason: "Desteklenmeyen dosya formatı (Sadece JPG, PNG, WebP)"
        });
        return;
      }

      // 2. Size validation
      if (file.size > maxSizeBytes) {
        failed.push({
          name: file.name,
          reason: `Dosya boyutu limit dışı (${(file.size / (1024 * 1024)).toFixed(1)}MB > 10MB)`
        });
        return;
      }

      // 3. Duplicate filename check
      const isDuplicate = recentPhotos.some(p => p.filename === file.name);
      if (isDuplicate) {
        duplicates.push({ name: file.name });
      }

      validFiles.push(file);
    });

    setFailedFiles(failed);
    setDuplicateFiles(duplicates);

    if (validFiles.length === 0) {
      if (failed.length > 0) {
        showToast(`${failed.length} adet dosya kriterlere uymadığı için yüklenemedi.`, "error");
      }
      return;
    }

    // Process valid files
    startSimulatedUpload(validFiles, failed.length);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFiles(e.target.files);
    }
  };

  const startSimulatedUpload = (validFiles, errorCount = 0) => {
    dispatch(setUploading(true));
    dispatch(setUploadProgress(0));
    setUploadStatusText("Dosyalar taranıyor...");

    let progress = 0;
    const stepDuration = 800;

    const interval = setInterval(() => {
      progress += 25;
      dispatch(setUploadProgress(progress));

      if (progress === 25) {
        setUploadStatusText("Görseller istemci tarafında analiz ediliyor...");
      } else if (progress === 50) {
        setUploadStatusText("Görseller optimize ediliyor... (WebP Dönüşümü: %72 Boyut Tasarrufu)");
      } else if (progress === 75) {
        setUploadStatusText("Sunucuya aktarılıyor ve yüz haritaları çıkartılıyor...");
      } else if (progress === 100) {
        clearInterval(interval);
        
        // Prepare mock data
        const simulatedPhotosData = validFiles.map((file, idx) => ({
          name: file.name,
          size: file.size,
          url: file.url || null
        }));

        dispatch(uploadPhotos({
          eventId: selectedEventId,
          files: simulatedPhotosData,
          source: "photographer"
        })).unwrap().then(() => {
          refreshData();
          
          const successCount = validFiles.length;
          setUploadedBatch({
            total: successCount + errorCount,
            processed: successCount,
            errors: errorCount,
            compressed: validFiles.filter(f => f.size > 8 * 1024 * 1024).length
          });

          showToast(`${successCount} adet fotoğraf başarıyla yüklendi!`, "success");
        }).catch((err) => {
          showToast("Fotoğraflar yüklenemedi: " + err, "error");
        });
      }
    }, stepDuration);
  };

  const handleSimulateBatch50 = () => {
    if (!selectedEventId) {
      showToast("Lütfen önce bir etkinlik seçin.", "warning");
      return;
    }

    // Generate 50 mock files
    const mockFiles = [];
    const duplicateList = [];
    const failedList = [];

    // Add 45 valid photos (some large, some normal)
    for (let i = 1; i <= 45; i++) {
      const isLarge = i % 10 === 0; // every 10th is larger than 8MB
      mockFiles.push({
        name: `nikah_toreni_batch_${i}.jpg`,
        size: isLarge ? 9.5 * 1024 * 1024 : 3.4 * 1024 * 1024,
        type: "image/jpeg"
      });
    }

    // Add 3 duplicate files
    if (recentPhotos.length > 0) {
      for (let i = 0; i < Math.min(recentPhotos.length, 3); i++) {
        duplicateList.push({ name: recentPhotos[i].filename });
        mockFiles.push({
          name: recentPhotos[i].filename,
          size: 2.1 * 1024 * 1024,
          type: "image/jpeg"
        });
      }
    } else {
      // Fallback duplicates within the batch
      duplicateList.push({ name: "nikah_toreni_batch_1.jpg" });
      mockFiles.push({
        name: "nikah_toreni_batch_1.jpg",
        size: 3.4 * 1024 * 1024,
        type: "image/jpeg"
      });
    }

    // Add 5 invalid files (too large, or wrong extension)
    failedList.push(
      { name: "davetli_listesi_dokuman.pdf", reason: "Desteklenmeyen dosya formatı (Sadece JPG, PNG, WebP)" },
      { name: "etkinlik_videosu_ultra_hd.mp4", reason: "Desteklenmeyen dosya formatı (Sadece JPG, PNG, WebP)" },
      { name: "gelin_damat_RAW_yedek.cr3", reason: "Desteklenmeyen dosya formatı (Sadece JPG, PNG, WebP)" },
      { name: "drone_panoroma_max_boyut.png", reason: "Dosya boyutu limit dışı (18.4MB > 10MB)" },
      { name: "backstage_detaylar.zip", reason: "Desteklenmeyen dosya formatı (Sadece JPG, PNG, WebP)" }
    );

    // Combine valid files for upload (valid count: mockFiles minus duplicates if checking strictly, but let's upload all valid items)
    const validOnes = mockFiles.filter(f => f.size <= 10 * 1024 * 1024 && f.type.startsWith("image/"));
    
    setFailedFiles(failedList);
    setDuplicateFiles(duplicateList);
    
    startSimulatedUpload(validOnes, failedList.length);
  };

  const getSelectedEventTitle = () => {
    const ev = events.find(e => e.id === selectedEventId);
    return ev ? ev.title : "";
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Event Selector Dropdown */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">Etkinlik Seçin</label>
          <div className="relative">
            <select
              value={selectedEventId}
              onChange={(e) => dispatch(setSelectedEventId(e.target.value))}
              className="w-full p-3 rounded-xl border border-[rgba(99,115,129,0.22)] bg-white/40 text-sm text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] focus:border-[var(--color-blue-dark)] focus:ring-1 focus:ring-[var(--color-blue-dark)] transition-all cursor-pointer"
            >
              <option value="" disabled className="bg-[var(--glass-bg-strong)] text-[var(--text-muted)]">Bir Etkinlik Seçin...</option>
              {events.map(e => (
                <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload Container (Apple style) */}
        <div className="glass-panel p-6 text-center flex flex-col items-center justify-center min-h-[220px]">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <RefreshCw size={36} className="animate-spin text-[var(--color-blue-dark)]" />
              <strong className="text-sm font-bold text-[var(--text-main)]">{uploadStatusText}</strong>
              <div className="w-48 bg-white/10 h-2.5 rounded-full overflow-hidden border border-[var(--glass-border)] mt-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-bold mt-1">%{uploadProgress} Tamamlandı</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[var(--color-blue-dark)]/10 text-[var(--color-blue-dark)] flex items-center justify-center">
                <UploadCloud size={28} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] m-0">Fotoğrafları Yükleyin</h3>
                <p className="text-[10px] text-[var(--text-muted)] mt-1.5 max-w-[200px] leading-relaxed mx-auto">
                  Kameranızdan çekin veya kütüphanenizden toplu fotoğraf seçimi yapın.
                </p>
              </div>
              <button
                onClick={() => {
                  if (!selectedEventId) {
                    showToast("Lütfen önce bir etkinlik seçin.", "warning");
                    return;
                  }
                  handleSimulateBatch50();
                }}
                className="primary-btn w-full max-w-[180px] py-2.5 text-xs font-bold justify-center rounded-xl"
              >
                Fotoğraf Seç ve Yükle
              </button>
            </div>
          )}
        </div>

        {/* Active Upload Result / History */}
        {uploadedBatch && (
          <div className="glass-panel p-4">
            <h4 className="text-xs font-bold text-[var(--text-main)] m-0 mb-3 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-[var(--accent-green)]" />
              <span>Yükleme Özeti</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white/5 rounded-xl">
                <strong className="block text-sm">{uploadedBatch.total}</strong>
                <span className="text-[9px] text-[var(--text-muted)] font-medium">Toplam</span>
              </div>
              <div className="p-2.5 bg-white/5 rounded-xl">
                <strong className="block text-sm text-[var(--accent-green)]">{uploadedBatch.processed}</strong>
                <span className="text-[9px] text-[var(--text-muted)] font-medium">Başarılı</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Uploaded Grid */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1">Son Yüklenen Fotoğraflar</h3>
          {recentPhotos.length === 0 ? (
            <div className="text-center py-6 text-[var(--text-muted)] text-xs">Henüz fotoğraf yüklenmedi.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {recentPhotos.slice(0, 6).map((photo, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-[var(--glass-border)]">
                  <img src={photo.thumbnail_url} alt="uploaded" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
        {/* Left Side - Upload controls */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          
          {/* Select Event Card */}
          <GlassCard title="1. Etkinlik Seçin" className="glass-panel">
            <div className="flex items-center gap-3">
              <FolderOpen size={20} className="text-[var(--color-blue-dark)]" />
              <select 
                value={selectedEventId} 
                onChange={(e) => dispatch(setSelectedEventId(e.target.value))}
                className="p-[10px_14px] rounded-[12px] border border-[rgba(99,115,129,0.22)] bg-white/40 text-[0.92rem] font-semibold flex-grow text-[var(--text-main)] outline-none shadow-sm hover:border-[rgba(99,115,129,0.35)] focus:border-[var(--color-blue-dark)] focus:ring-1 focus:ring-[var(--color-blue-dark)] transition-all cursor-pointer"
              >
                <option value="" className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">-- Etkinlik Seçin --</option>
                {events.map(e => (
                  <option key={e.id} value={e.id} className="bg-[var(--glass-bg-strong)] text-[var(--text-main)]">{e.title}</option>
                ))}
              </select>
            </div>
          </GlassCard>

          {/* Drag & Drop Upload Zone */}
          <GlassCard title="2. Dosya Yükleme Alanı" className="glass-panel">
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[16px] p-10 text-center cursor-pointer transition-all duration-200 ease-in-out ${
                isDragActive 
                  ? "border-[var(--color-blue-dark)] bg-[var(--color-blue-dark)]/5 scale-[0.99]" 
                  : "border-[var(--glass-border)] bg-white/3 hover:bg-white/5"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple 
                accept="image/jpeg,image/png,image/webp"
                className="hidden" 
              />
              <UploadCloud size={48} className="text-[var(--color-blue-dark)] mx-auto mb-4 animate-bounce" />
              <strong className="block text-[1.1rem] mb-1">
                Görselleri Sürükleyip Buraya Bırakın
              </strong>
              <p className="text-[var(--text-muted)] text-[0.82rem] max-w-[400px] mx-auto mb-5">
                Klasör veya tekli/çoklu dosyaları bırakabilirsiniz. JPG, PNG ve WebP uzantıları desteklenir.
              </p>

              <div className="flex gap-2 justify-center flex-wrap">
                <span className="bg-white/10 dark:bg-black/30 border border-[var(--glass-border)]/50 p-[4px_10px] rounded-[20px] text-[0.72rem] font-semibold text-[var(--text-muted)]">Max Boyut: 10MB</span>
                <span className="bg-white/10 dark:bg-black/30 border border-[var(--glass-border)]/50 p-[4px_10px] rounded-[20px] text-[0.72rem] font-semibold text-[var(--text-muted)]">Akıllı EXIF Okuma</span>
                <span className="bg-white/10 dark:bg-black/30 border border-[var(--glass-border)]/50 p-[4px_10px] rounded-[20px] text-[0.72rem] font-semibold text-[var(--text-muted)]">Akıllı Sıkıştırma (8MB+)</span>
              </div>
            </div>

            {/* Quick Demo Simulate Buttons */}
            <div className="mt-4 flex gap-2.5 justify-end">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimulateBatch50();
                }}
                className="primary-btn flex items-center gap-1.5 text-[0.78rem] font-bold text-white shadow-md"
              >
                <Layers size={14} />
                <span>50 Fotoğraflık Batch Simüle Et</span>
              </button>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="mt-5 p-4 bg-white/5 border border-[var(--glass-border)]/40 rounded-[12px] animate-pulse">
                <div className="flex justify-between items-center text-[0.82rem] mb-2">
                  <span className="font-semibold flex items-center gap-1.5">
                    <RefreshCw size={14} className="animate-spin text-[var(--color-blue-dark)]" />
                    {uploadStatusText}
                  </span>
                  <strong className="text-[var(--color-blue-dark)]">%{uploadProgress}</strong>
                </div>
                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                  <div style={{ width: `${uploadProgress}%` }} className="h-full bg-[var(--accent-gradient)] rounded-full transition-all duration-300" />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Validation Failed Files Alert List */}
          {failedFiles.length > 0 && (
            <GlassCard className="border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-3 text-red-500 font-extrabold text-[0.9rem]">
                <FileWarning size={18} />
                <span>Yüklenemeyen Hatalı Dosyalar ({failedFiles.length})</span>
              </div>
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {failedFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.78rem] p-[6px_10px] rounded-[8px] bg-red-500/10 border border-red-500/10">
                    <span className="font-semibold truncate max-w-[280px]">{file.name}</span>
                    <span className="text-red-400 font-medium">{file.reason}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Duplicate Warnings List */}
          {duplicateFiles.length > 0 && (
            <GlassCard className="border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3 text-amber-500 font-extrabold text-[0.9rem]">
                <Copy size={18} />
                <span>Sistemde Zaten Kayıtlı Olan Dosyalar ({duplicateFiles.length})</span>
              </div>
              <p className="text-[0.75rem] text-[var(--text-muted)] m-0 mb-2">Bu görseller yine de yüklenebilir fakat mükerrer kayıt oluşturabileceği için kontrol etmeniz önerilir.</p>
              <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                {duplicateFiles.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[0.78rem] p-[6px_10px] rounded-[8px] bg-amber-500/10 border border-amber-500/10">
                    <span className="font-semibold truncate">{file.name}</span>
                    <span className="text-amber-500 font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} /> Mükerrer
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

        </div>

        {/* Right Side - History & Stats */}
        <div className="flex flex-col gap-[var(--space-lg)]">
          
          {/* Active / Last Upload Summary */}
          <GlassCard 
            title="Aktif İşlem Özeti" 
            action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
            className="glass-panel"
          >
            {uploadedBatch ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-emerald-500/12 text-emerald-500 p-3 rounded-[12px]">
                  <CheckCircle2 size={18} />
                  <span className="text-[0.85rem] font-bold">Yükleme başarıyla tamamlandı!</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white/3 border border-[var(--glass-border)] rounded-[10px]">
                    <strong className="block text-[1.2rem]">{uploadedBatch.total}</strong>
                    <small className="text-[var(--text-muted)] text-[0.72rem]">Toplam Dosya</small>
                  </div>
                  <div className="p-3 bg-white/3 border border-[var(--glass-border)] rounded-[10px]">
                    <strong className="block text-[1.2rem] text-[var(--accent-green)]">{uploadedBatch.processed}</strong>
                    <small className="text-[var(--text-muted)] text-[0.72rem]">Başarılı Yüklenen</small>
                  </div>
                  <div className="p-3 bg-white/3 border border-[var(--glass-border)] rounded-[10px]">
                    <strong className="block text-[1.2rem] text-[var(--color-blue-dark)]">{uploadedBatch.compressed}</strong>
                    <small className="text-[var(--text-muted)] text-[0.72rem]">Optimize Edilen</small>
                  </div>
                  <div className="p-3 bg-white/3 border border-[var(--glass-border)] rounded-[10px]">
                    <strong className="block text-[1.2rem] text-[#ef4444]">{uploadedBatch.errors}</strong>
                    <small className="text-[var(--text-muted)] text-[0.72rem]">Hatalı Dosya</small>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6 text-[var(--text-muted)]">
                <Info size={30} className="mx-auto mb-2 opacity-60" />
                <p className="text-[0.8rem] m-0 leading-normal">Aktif bir yükleme işlemi bulunmuyor. Yüklemeyi başlatmak için sol taraftaki alana dosya bırakabilir veya tıklayabilirsiniz.</p>
              </div>
            )}
          </GlassCard>

          {/* Upload Batches History */}
          <GlassCard 
            title="Yükleme Geçmişi (Batches)" 
            action={<ChevronDown size={16} className="text-[var(--text-muted)] opacity-70" />}
            className="glass-panel"
          >
            {batches.length === 0 ? (
              <div className="text-center p-6 text-[var(--text-muted)]">
                <Clock size={28} className="mx-auto mb-2 opacity-50" />
                <p className="text-[0.8rem] m-0">Bu etkinliğe ait geçmiş yükleme kaydı bulunmuyor.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {batches.map((batch) => (
                  <div key={batch.id} className="p-3 bg-white/4 border border-[var(--glass-border)]/60 rounded-[12px] flex flex-col gap-2 transition-all hover:bg-white/8">
                    <div className="flex justify-between items-center">
                      <strong className="text-[0.82rem] text-[var(--text-main)] truncate max-w-[150px]">{batch.name}</strong>
                      <span className="text-[0.7rem] bg-white/10 p-[2px_6px] rounded-[6px] text-[var(--text-muted)] font-semibold">
                        {batch.id.slice(0, 8)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 text-center text-[0.75rem] border-t border-b border-[var(--glass-border)]/20 py-1.5 my-0.5">
                      <div>
                        <span className="block font-bold text-[var(--text-main)]">{batch.file_count}</span>
                        <span className="text-[0.62rem] text-[var(--text-muted)]">Dosya</span>
                      </div>
                      <div>
                        <span className="block font-bold text-emerald-500">{batch.success_count}</span>
                        <span className="text-[0.62rem] text-[var(--text-muted)]">Başarılı</span>
                      </div>
                      <div>
                        <span className="block font-bold text-red-500">{batch.error_count}</span>
                        <span className="text-[0.62rem] text-[var(--text-muted)]">Hata</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[0.7rem] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 font-medium">
                        <User size={11} /> {batch.uploader}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={11} /> {batch.duration_seconds} sn
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>
      </div>

      {/* Recent Uploads Grid */}
      <GlassCard title={`Son Yüklenen Fotoğraflar - ${getSelectedEventTitle()}`} className="glass-panel">
        {recentPhotos.length === 0 ? (
          <div className="text-center p-8 text-[var(--text-muted)]">
            <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
            <p className="m-0 text-[0.82rem]">Bu etkinlik için henüz fotoğraf yüklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
            {recentPhotos.slice(0, 14).map((p) => (
              <div key={p.id} className="relative h-[110px] rounded-[10px] overflow-hidden border border-[var(--glass-border)] group">
                <img src={p.thumbnail_url} alt={p.filename} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                  <span className="text-white text-[0.68rem] truncate w-full font-medium">{p.filename}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
