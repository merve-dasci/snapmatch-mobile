import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * DesktopPreview
 * Laptop mockup — idle / syncing / done üç fazlı ekran içeriğiyle.
 *
 * Props:
 *  - phase: "idle" | "syncing" | "done"
 *  - photoCount: gösterilecek fotoğraf sayısı
 *  - thumbnails: [{ src, alt }] thumbnail dizisi
 */
const DesktopPreview = ({ phase = "idle", photoCount = 128, thumbnails = [] }) => {
  const isSyncing = phase === "syncing";
  const isDone = phase === "done";

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
      style={{ position: "relative", flexShrink: 0 }}
    >
      {/* Monitor lid */}
      <div
        style={{
          width: 200,
          height: 130,
          borderRadius: "14px 14px 4px 4px",
          border: "1px solid rgba(255,255,255,0.35)",
          overflow: "hidden",
          background: "linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.07) 100%)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2), inset 0 1px rgba(255,255,255,0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          position: "relative",
        }}
      >
        {/* Menu bar */}
        <div
          style={{
            height: 18,
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "0 8px",
            background: "rgba(0,0,0,0.22)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c + "bb" }} />
          ))}
          <span style={{ marginLeft: "auto", fontSize: 6, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.06em" }}>SNAPMATCH</span>
        </div>

        {/* Screen */}
        <div
          style={{
            height: "calc(100% - 18px)",
            background: "linear-gradient(160deg, #0f0a1e 0%, #1a0533 50%, #0d0720 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Screen glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <AnimatePresence mode="wait">
            {/* Idle */}
            {phase === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.2)", fontWeight: 500, letterSpacing: "0.04em" }}>Fotoğraf bekleniyor…</span>
              </motion.div>
            )}

            {/* Syncing */}
            {isSyncing && (
              <motion.div
                key="syncing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}
              >
                {/* Progress bar */}
                <div style={{ width: "82%", height: 3, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                  <motion.div
                    style={{ height: "100%", background: "linear-gradient(90deg, #8B5CF6, #EC4899)", borderRadius: 3 }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      style={{ width: 5, height: 5, borderRadius: "50%", background: ["#8B5CF6", "#EC4899", "#3B82F6"][i] }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 0.8, delay: i * 0.16, repeat: Infinity }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>Senkronize ediliyor…</span>
              </motion.div>
            )}

            {/* Done */}
            {isDone && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%" }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 14, delay: 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 8px",
                    borderRadius: 99,
                    background: "rgba(34,197,94,0.15)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    boxShadow: "0 0 10px rgba(34,197,94,0.2)",
                  }}
                >
                  <svg viewBox="0 0 12 12" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" style={{ width: 8, height: 8 }}>
                    <polyline points="1 6 4 10 11 2" />
                  </svg>
                  <span style={{ fontSize: 7, color: "#22c55e", fontWeight: 700 }}>Photos Synced</span>
                </motion.div>

                {/* Thumbnail grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, width: "90%" }}>
                  {(thumbnails.length > 0 ? thumbnails : Array(10).fill(null)).slice(0, 10).map((t, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.15 + i * 0.05 }}
                      style={{ aspectRatio: "1", borderRadius: 3, overflow: "hidden", background: "rgba(139,92,246,0.2)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {t && <img src={t.src} alt={t.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" draggable={false} />}
                    </motion.div>
                  ))}
                </div>

                {/* Count */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}
                >
                  ✓ {photoCount} Photos Found
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Laptop hinge */}
      <div style={{ width: "100%", height: 8, background: "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))", borderRadius: "0 0 6px 6px", border: "1px solid rgba(255,255,255,0.18)", borderTop: "none" }} />
      {/* Base foot */}
      <div style={{ width: "55%", margin: "0 auto", height: 4, background: "rgba(255,255,255,0.07)", borderRadius: "0 0 4px 4px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
    </motion.div>
  );
};

export default DesktopPreview;
