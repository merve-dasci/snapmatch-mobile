import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import PhoneMockup from "./PhoneMockup";
import CloudAnimation from "./CloudAnimation";
import DesktopPreview from "./DesktopPreview";

// ---------------------------------------------------------------------------
// Photo data – Unsplash event photography
// ---------------------------------------------------------------------------
const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=200",
    alt: "Wedding dance",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=200",
    alt: "Wedding ceremony",
  },
  {
    src: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=80&w=200",
    alt: "Graduation day",
  },
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=200",
    alt: "Corporate event",
  },
  {
    src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=200",
    alt: "Party celebration",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200",
    alt: "Concert crowd",
  },
  {
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=200",
    alt: "Wedding dance floor",
  },
  {
    src: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=80&w=200",
    alt: "Garden wedding",
  },
];

// ---------------------------------------------------------------------------
// Animation phase timing (seconds within a 10s loop)
// ---------------------------------------------------------------------------
// 0–2s   → phone + QR pulse visible
// 2–5s   → photos fly from phone to cloud (staggered)
// 5–6.5s → cloud receiving → done
// 6.5–10s → desktop shows "Photos Found" gallery
// 10s    → loop restart

const LOOP_DURATION = 10000; // ms

// Breakpoints for each phase
const PHASE_TIMINGS = {
  phone: 0,
  flyStart: 2000,
  cloudReceiving: 3500,
  cloudDone: 5500,
  desktopLoading: 5800,
  desktopDone: 7000,
  end: 10000,
};

// ---------------------------------------------------------------------------
// Curved path helper (SVG path for photos to follow from phone → cloud)
// ---------------------------------------------------------------------------
/**
 * A single "flying photo" that moves along a curved SVG path upward.
 */
const FlyingCard = ({ photo, delay, containerRef }) => {
  // Each card follows a slightly different curved arc
  const randomXOffset = (Math.random() - 0.5) * 40;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 52,
        height: 62,
        left: "50%",
        bottom: "35%",
        zIndex: 20,
        originX: "50%",
        originY: "100%",
      }}
      initial={{ opacity: 0, x: randomXOffset - 26, y: 0, scale: 0.4, rotate: -10 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [randomXOffset - 26, randomXOffset - 26, -80 + randomXOffset, -90 + randomXOffset],
        y: [0, -40, -110, -170],
        scale: [0.4, 0.9, 0.7, 0.4],
        rotate: [-10, 0, 5, -5],
      }}
      transition={{
        duration: 2.8,
        delay,
        ease: "easeInOut",
        times: [0, 0.2, 0.65, 1],
      }}
    >
      {/* Polaroid card */}
      <div
        className="w-full h-full rounded-[10px] border border-white/70 overflow-hidden"
        style={{
          padding: "4px 4px 14px 4px",
          background: "rgba(255,255,255,0.92)",
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.9)",
        }}
      >
        <div className="w-full rounded-[6px] overflow-hidden" style={{ height: "calc(100% - 10px)" }}>
          <img src={photo.src} alt={photo.alt} className="w-full h-full object-cover" draggable={false} />
        </div>
      </div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// HeroDemo – the main animated demo orchestrator
// ---------------------------------------------------------------------------
/**
 * HeroDemo
 * Orchestrates the full 10-second animation loop showing Snapmatch's workflow:
 *   Phone QR → photos fly to cloud → cloud syncs → desktop shows matched photos
 *
 * Props: none (self-contained animation)
 */
const HeroDemo = () => {
  // ── Animation phase state ──────────────────────────────────────────────────
  const [phase, setPhase] = useState("phone"); // phone | flying | cloudReceiving | cloudDone | desktop | desktopDone
  const [flyingPhotos, setFlyingPhotos] = useState([]);
  const [loopKey, setLoopKey] = useState(0); // force re-mount to restart loop
  const timerRefs = useRef([]);

  // ── Parallax mouse tracking ────────────────────────────────────────────────
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const parallaxX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const parallaxY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const parallaxXInv = useTransform(smoothX, [-1, 1], [8, -8]);
  const parallaxYInv = useTransform(smoothY, [-1, 1], [6, -6]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set((e.clientX - cx) / (rect.width / 2));
      mouseY.set((e.clientY - cy) / (rect.height / 2));
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // ── Animation loop ─────────────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  }, []);

  const scheduleTimer = useCallback(
    (fn, delay) => {
      const id = setTimeout(fn, delay);
      timerRefs.current.push(id);
      return id;
    },
    []
  );

  const runLoop = useCallback(() => {
    clearTimers();

    // Phase: phone (QR visible)
    setPhase("phone");
    setFlyingPhotos([]);

    // Phase: photos start flying
    scheduleTimer(() => {
      setPhase("flying");
      // Stagger 4 cards flying out
      const activePhotos = PHOTOS.slice(0, 4).map((p, i) => ({ ...p, key: `fly-${i}` }));
      setFlyingPhotos(activePhotos);
    }, PHASE_TIMINGS.flyStart);

    // Phase: cloud receiving
    scheduleTimer(() => {
      setPhase("cloudReceiving");
    }, PHASE_TIMINGS.cloudReceiving);

    // Phase: cloud done
    scheduleTimer(() => {
      setPhase("cloudDone");
    }, PHASE_TIMINGS.cloudDone);

    // Phase: desktop loading
    scheduleTimer(() => {
      setPhase("desktopLoading");
    }, PHASE_TIMINGS.desktopLoading);

    // Phase: desktop done (photos found)
    scheduleTimer(() => {
      setPhase("desktopDone");
    }, PHASE_TIMINGS.desktopDone);

    // Loop restart
    scheduleTimer(() => {
      setLoopKey((k) => k + 1);
    }, PHASE_TIMINGS.end);
  }, [clearTimers, scheduleTimer]);

  useEffect(() => {
    runLoop();
    return clearTimers;
  }, [loopKey, runLoop, clearTimers]);

  // ── Derived phase helpers ──────────────────────────────────────────────────
  const cloudPhase =
    phase === "cloudReceiving"
      ? "receiving"
      : phase === "cloudDone" || phase === "desktopLoading" || phase === "desktopDone"
      ? "done"
      : "idle";

  const desktopPhase =
    phase === "desktopLoading"
      ? "loading"
      : phase === "desktopDone"
      ? "done"
      : "idle";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: 420, minWidth: 340 }}
      aria-label="Snapmatch product demo animation"
      role="img"
    >
      {/* ── Background blobs ─────────────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
          top: "10%",
          left: "5%",
          transform: "translate(-20%, -20%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)",
          filter: "blur(36px)",
          bottom: "5%",
          right: "8%",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(32px)",
          top: "50%",
          right: "15%",
        }}
      />

      {/* ── Grid pattern overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
          borderRadius: 24,
        }}
      />

      {/* ── Main parallax scene ──────────────────────────────────────────── */}
      <div
        className="relative flex items-end justify-center gap-8 w-full"
        style={{ maxWidth: 480, height: "100%", paddingBottom: 20 }}
      >
        {/* ── Phone (left) ──────────────────────────────────────────────── */}
        <motion.div
          className="relative flex-shrink-0"
          style={{ x: parallaxXInv, y: parallaxYInv }}
        >
          <PhoneMockup />

          {/* Flying photo cards that launch from phone */}
          <AnimatePresence>
            {phase === "flying" &&
              flyingPhotos.map((photo, i) => (
                <FlyingCard
                  key={`${loopKey}-${photo.key}`}
                  photo={photo}
                  delay={i * 0.35}
                  containerRef={containerRef}
                />
              ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Middle column: cloud + connection line ────────────────────── */}
        <motion.div
          className="relative flex flex-col items-center gap-4 flex-shrink-0"
          style={{ x: parallaxX, y: parallaxY, paddingBottom: 30 }}
        >
          {/* Vertical dashed connection line – phone side */}
          <motion.div
            className="rounded-full"
            style={{
              width: 2,
              height: 40,
              background:
                "linear-gradient(180deg, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0.1) 100%)",
            }}
            animate={{
              opacity:
                phase === "flying" || phase === "cloudReceiving"
                  ? [0.3, 1, 0.3]
                  : 0.2,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Cloud icon */}
          <CloudAnimation phase={cloudPhase} />

          {/* Vertical dashed connection line – desktop side */}
          <motion.div
            className="rounded-full"
            style={{
              width: 2,
              height: 40,
              background:
                "linear-gradient(180deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.5) 100%)",
            }}
            animate={{
              opacity:
                phase === "cloudDone" || phase === "desktopLoading" || phase === "desktopDone"
                  ? [0.3, 1, 0.3]
                  : 0.2,
            }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />

          {/* Phase label pill */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cloudPhase}
              initial={{ opacity: 0, y: 4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full border font-bold"
              style={{
                fontSize: 9,
                letterSpacing: "0.06em",
                background:
                  cloudPhase === "done"
                    ? "rgba(34,197,94,0.15)"
                    : cloudPhase === "receiving"
                    ? "rgba(139,92,246,0.15)"
                    : "rgba(255,255,255,0.1)",
                borderColor:
                  cloudPhase === "done"
                    ? "rgba(34,197,94,0.3)"
                    : cloudPhase === "receiving"
                    ? "rgba(139,92,246,0.3)"
                    : "rgba(255,255,255,0.15)",
                color:
                  cloudPhase === "done"
                    ? "#22c55e"
                    : cloudPhase === "receiving"
                    ? "#a78bfa"
                    : "rgba(255,255,255,0.4)",
              }}
            >
              {cloudPhase === "done"
                ? "✓ SYNCED"
                : cloudPhase === "receiving"
                ? "⬆ UPLOADING"
                : "CLOUD"}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Desktop (right) ──────────────────────────────────────────── */}
        <motion.div
          className="relative flex-shrink-0"
          style={{ x: parallaxX, y: parallaxY }}
        >
          <DesktopPreview phase={desktopPhase} photos={PHOTOS} />
        </motion.div>
      </div>

      {/* ── Bottom progress bar ─────────────────────────────────────────── */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
        style={{ width: 120, height: 3, background: "rgba(255,255,255,0.1)" }}
      >
        <motion.div
          key={loopKey}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)",
          }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: LOOP_DURATION / 1000, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default HeroDemo;
