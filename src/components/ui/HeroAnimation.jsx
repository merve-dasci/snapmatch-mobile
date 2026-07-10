import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import QRCodeAnimation from "./QRCodeAnimation";
import PhotoCard from "./PhotoCard";
import CloudSync from "./CloudSync";
import DesktopPreview from "./DesktopPreview";
import GradientBlob from "./GradientBlob";

// ─── Sabit veriler ───────────────────────────────────────────────────────────

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=200", alt: "Düğün" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200", alt: "Tören" },
  { src: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=80&w=200", alt: "Mezuniyet" },
  { src: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=80&w=200", alt: "Kır Düğünü" },
  { src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200", alt: "Parti" },
];

const EVENT_CODE = "A72KF";

// ─── Animasyon fazları (ms cinsinden kümülatif) ──────────────────────────────
// Toplam döngü: ~14 saniye
const T = {
  logo: 300,          // Logo fade-in
  creating: 1000,     // "Creating Event..." metni
  qrBuild: 2800,      // QR oluşmaya başlar
  qrPulse: 4200,      // QR tamam → pulse
  codeType: 5000,     // 5 haneli kod yazılır
  photos: 6500,       // Fotoğraflar uçmaya başlar
  cloudActive: 8000,  // Cloud receiving
  cloudDone: 9200,    // Cloud done
  desktopSync: 9400,  // Desktop loading
  desktopDone: 10800, // Desktop done
  wait: 13000,        // 2s bekleme
  reset: 14500,       // fade ile başa dön
};

// ─── Yazma efekti hook'u ─────────────────────────────────────────────────────
function useTypewriter(text, active, charDelay = 120) {
  const [displayed, setDisplayed] = useState("");
  const iRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      iRef.current = 0;
      return;
    }
    iRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (iRef.current < text.length) {
        setDisplayed(text.slice(0, iRef.current + 1));
        iRef.current++;
      } else {
        clearInterval(interval);
      }
    }, charDelay);
    return () => clearInterval(interval);
  }, [active, text, charDelay]);

  return displayed;
}

// ─── PhoneMockup ─────────────────────────────────────────────────────────────

const PhoneMockup = ({ phase, eventCode, children }) => {
  const showLogo = phase >= 1;
  const showCreating = phase >= 2;
  const showQR = phase >= 3;
  const showPulse = phase >= 4;
  const showCode = phase >= 5;
  const typeActive = phase === 5 || phase >= 5;
  const typedCode = useTypewriter(eventCode, typeActive, 140);

  return (
    <div
      style={{
        position: "relative",
        width: 155,
        height: 300,
        flexShrink: 0,
      }}
    >
      {/* Phone glow */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)",
          filter: "blur(24px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Outer shell */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          borderRadius: 36,
          border: "1px solid rgba(255,255,255,0.38)",
          background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.07) 100%)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 30px 70px rgba(0,0,0,0.28), 0 8px 24px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.55), 0 0 0 1px rgba(139,92,246,0.12)",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            width: 60,
            height: 14,
            borderRadius: 9,
            background: "rgba(0,0,0,0.8)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 6,
            gap: 3,
          }}
        >
          {/* Camera dot */}
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(40,40,50,0.9)", border: "1px solid rgba(255,255,255,0.05)" }} />
          {/* FaceID sensor */}
          <div style={{ width: 2, height: 2, borderRadius: "50%", background: "rgba(60,60,80,0.9)" }} />
        </div>

        {/* Screen */}
        <div
          style={{
            position: "absolute",
            inset: 5,
            borderRadius: 31,
            overflow: "hidden",
            background: "linear-gradient(160deg, #180830 0%, #0c0520 50%, #150c2e 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 12px 16px",
            gap: 10,
          }}
        >
          {/* Screen ambient glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 35%, rgba(139,92,246,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />

          {/* ── Logo ── */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, y: 8, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}
              >
                {/* Logo mark */}
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #8B5CF6, #EC4899)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(139,92,246,0.4)" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                    <circle cx="12" cy="12" r="3" />
                    <path d="M20.94 11A8.994 8.994 0 0 0 3.06 11" />
                    <path d="M3.06 13A8.994 8.994 0 0 0 20.94 13" />
                  </svg>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.9)", letterSpacing: "0.08em" }}>SNAPMATCH</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Creating Event... ── */}
          <AnimatePresence>
            {showCreating && !showQR && (
              <motion.div
                key="creating"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid rgba(139,92,246,0.3)", borderTopColor: "#8B5CF6" }}
                />
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>Creating Event...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── QR Code ── */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <QRCodeAnimation visible={showQR} pulsing={showPulse} />
          </div>

          {/* ── Event Code ── */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
              >
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Etkinlik Kodu
                </span>
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 7,
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    boxShadow: "0 0 10px rgba(139,92,246,0.15)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: "#c4b5fd",
                      fontFamily: "monospace",
                      letterSpacing: "0.18em",
                      textShadow: "0 0 12px rgba(139,92,246,0.5)",
                    }}
                  >
                    {typedCode}
                    {typedCode.length < eventCode.length && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        style={{ color: "#8B5CF6" }}
                      >|</motion.span>
                    )}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Share label ── */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                key="share"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}
              >
                {["WhatsApp", "SMS"].map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: 6.5,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.4)",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4,
                      padding: "2px 5px",
                    }}
                  >
                    {p}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom pill */}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Side buttons */}
        <div style={{ position: "absolute", right: -3, top: 52, width: 3, height: 22, background: "rgba(255,255,255,0.18)", borderRadius: "0 2px 2px 0" }} />
        <div style={{ position: "absolute", left: -3, top: 44, width: 3, height: 16, background: "rgba(255,255,255,0.15)", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 65, width: 3, height: 28, background: "rgba(255,255,255,0.15)", borderRadius: "2px 0 0 2px" }} />
        <div style={{ position: "absolute", left: -3, top: 98, width: 3, height: 28, background: "rgba(255,255,255,0.15)", borderRadius: "2px 0 0 2px" }} />

        {/* Glass sheen */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 36, background: "linear-gradient(145deg, rgba(255,255,255,0.13) 0%, transparent 55%)", pointerEvents: "none" }} />
      </div>

      {/* Flying photo cards (positioned relative to phone) */}
      {children}
    </div>
  );
};

// ─── PhotoFlow ────────────────────────────────────────────────────────────────

const PhotoFlow = ({ active, photos, onDone }) => {
  return (
    <>
      {photos.map((photo, i) => (
        <PhotoCard
          key={`flow-${i}`}
          src={photo.src}
          alt={photo.alt}
          index={i}
          visible={active}
          onComplete={i === 0 ? onDone : undefined}
        />
      ))}
    </>
  );
};

// ─── HeroAnimation — Ana orchestrator ────────────────────────────────────────

/**
 * HeroAnimation
 * Snapmatch'in çalışma mantığını anlatan ~14 saniyelik sonsuz döngü animasyonu.
 * Telefon → QR + Kod → Fotoğraflar uçar → Cloud → Desktop "Photos Found"
 */
const HeroAnimation = () => {
  const [phase, setPhase] = useState(0);
  const [cloudPhase, setCloudPhase] = useState("idle");
  const [desktopPhase, setDesktopPhase] = useState("idle");
  const [loopKey, setLoopKey] = useState(0);
  const [photosActive, setPhotosActive] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const timers = useRef([]);

  const schedule = useCallback((fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runLoop = useCallback(() => {
    clearAll();
    setPhase(0);
    setCloudPhase("idle");
    setDesktopPhase("idle");
    setPhotosActive(false);
    setIsResetting(false);

    schedule(() => setPhase(1), T.logo);
    schedule(() => setPhase(2), T.creating);
    schedule(() => setPhase(3), T.qrBuild);
    schedule(() => setPhase(4), T.qrPulse);
    schedule(() => setPhase(5), T.codeType);
    schedule(() => { setPhase(6); setPhotosActive(true); }, T.photos);
    schedule(() => setCloudPhase("receiving"), T.cloudActive);
    schedule(() => { setCloudPhase("done"); setPhotosActive(false); }, T.cloudDone);
    schedule(() => setDesktopPhase("syncing"), T.desktopSync);
    schedule(() => setDesktopPhase("done"), T.desktopDone);

    // Fade out & restart
    schedule(() => setIsResetting(true), T.wait);
    schedule(() => setLoopKey((k) => k + 1), T.reset);
  }, [clearAll, schedule]);

  useEffect(() => {
    runLoop();
    return clearAll;
  }, [loopKey]); // eslint-disable-line

  // ── Mouse parallax ──
  const containerRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 70, damping: 20 });
  const springY = useSpring(rawY, { stiffness: 70, damping: 20 });
  const rotateX = useTransform(springY, [-1, 1], [7, -7]);
  const rotateY = useTransform(springX, [-1, 1], [-9, 9]);

  const onMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left - r.width / 2) / (r.width / 2));
    rawY.set((e.clientY - r.top - r.height / 2) / (r.height / 2));
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  // ── Progress bar ──
  const LOOP_MS = T.reset;

  // ── Cloud–Desktop connector label ──
  const statusLabel =
    cloudPhase === "receiving" ? "Yükleniyor" :
    cloudPhase === "done" ? "Senkronize edildi" :
    desktopPhase === "done" ? "128 Fotoğraf Bulundu" :
    "Hazırlanıyor";

  const statusColor =
    desktopPhase === "done" ? "#22c55e" :
    cloudPhase === "done" ? "#3B82F6" :
    cloudPhase === "receiving" ? "#8B5CF6" :
    "rgba(255,255,255,0.3)";

  return (
    <motion.div
      animate={{ opacity: isResetting ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ position: "relative", width: "100%", height: "100%" }}
      role="img"
      aria-label="Snapmatch ürün demosu animasyonu"
    >
      {/* ── Arka plan blob'ları ── */}
      <GradientBlob color="rgba(139,92,246,0.22)" size={280} style={{ top: "5%", left: "0%" }} duration={16} delay={0} />
      <GradientBlob color="rgba(236,72,153,0.15)" size={220} style={{ bottom: "10%", right: "5%" }} duration={20} delay={3} />
      <GradientBlob color="rgba(59,130,246,0.12)" size={200} style={{ top: "50%", right: "15%" }} duration={18} delay={7} />

      {/* ── Hafif grid doku ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.035,
          backgroundImage: "linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      {/* ── Ana sahne ── */}
      <div
        ref={containerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          width: "100%",
          height: "100%",
          padding: "20px 16px 32px",
          perspective: 900,
        }}
      >
        {/* Telefon (parallax wrapper) */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <PhoneMockup phase={phase} eventCode={EVENT_CODE}>
            {/* Uçan fotoğraflar telefona göre konumlandırılmış */}
            <PhotoFlow active={photosActive} photos={PHOTOS} onDone={() => {}} />
          </PhoneMockup>
        </motion.div>

        {/* Orta: Cloud + bağlantı çizgileri */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            paddingBottom: 20,
          }}
        >
          {/* Üst bağlantı çizgisi (telefon → cloud) */}
          <motion.div
            style={{
              width: 2,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(180deg, rgba(139,92,246,0.6) 0%, rgba(139,92,246,0.1) 100%)",
            }}
            animate={{
              opacity: photosActive || cloudPhase === "receiving" ? [0.4, 1, 0.4] : 0.15,
              scaleY: photosActive || cloudPhase === "receiving" ? [0.9, 1.05, 0.9] : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          <CloudSync phase={cloudPhase} />

          {/* Alt bağlantı çizgisi (cloud → desktop) */}
          <motion.div
            style={{
              width: 2,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.6) 100%)",
            }}
            animate={{
              opacity: cloudPhase === "done" || desktopPhase !== "idle" ? [0.4, 1, 0.4] : 0.15,
              scaleY: cloudPhase === "done" ? [0.9, 1.05, 0.9] : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />

          {/* Durum etiketi */}
          <AnimatePresence mode="wait">
            <motion.div
              key={statusLabel}
              initial={{ opacity: 0, y: 4, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.88 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: 2,
                padding: "3px 8px",
                borderRadius: 99,
                background: `${statusColor}18`,
                border: `1px solid ${statusColor}40`,
                fontSize: 7.5,
                fontWeight: 700,
                color: statusColor,
                whiteSpace: "nowrap",
                letterSpacing: "0.05em",
              }}
            >
              {statusLabel}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop */}
        <DesktopPreview phase={desktopPhase} photoCount={128} thumbnails={PHOTOS} />
      </div>

      {/* ── Progress bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 100,
          height: 3,
          borderRadius: 2,
          background: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
        <motion.div
          key={loopKey}
          style={{ height: "100%", background: "linear-gradient(90deg, #8B5CF6, #EC4899, #3B82F6)", borderRadius: 2 }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: LOOP_MS / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default HeroAnimation;
