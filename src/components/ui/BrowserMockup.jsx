import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Photo data ───────────────────────────────────────────────────────────────
const GRID_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300&h=220", alt: "Düğün çifti" },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300&h=220", alt: "Tören anı" },
  { src: "https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&q=80&w=300&h=220", alt: "Mezuniyet" },
  { src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=300&h=220", alt: "Kutlama" },
  { src: "https://images.unsplash.com/photo-1505232458627-a72726f5b712?auto=format&fit=crop&q=80&w=300&h=220", alt: "Kır düğünü" },
  { src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=300&h=220", alt: "Dans" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=300&h=220", alt: "Konser" },
  { src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=300&h=220", alt: "Toplantı" },
];

const AVATARS = [
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format", name: "Selin" },
  { src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&auto=format", name: "Mert" },
  { src: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&auto=format", name: "Can" },
  { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", name: "Melis" },
];

// ─── Variants ─────────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.25 },
  },
};

const photoVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 240, damping: 20 },
  },
};

const avatarVariants = {
  hidden: { opacity: 0, scale: 0.5, y: 14 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18, delay: 0.55 + i * 0.1 },
  }),
};

// ─── BrowserMockup ────────────────────────────────────────────────────────────
/**
 * BrowserMockup
 * macOS Safari çerçevesinde Snapmatch misafir galeri ekranı.
 * FindMePic referans tasarımından ilham alınmıştır, Snapmatch'e özeldir.
 */
const BrowserMockup = () => {
  const [highlightedAvatar, setHighlightedAvatar] = useState(null);
  const [page] = useState(0);

  // Avatar'ı otomatik sırayla highlight et
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setHighlightedAvatar(i % AVATARS.length);
      i++;
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: "spring", damping: 26, stiffness: 200 }}
      style={{
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.06)",
        background: "#ffffff",
        userSelect: "none",
      }}
    >
      {/* ── macOS Chrome ─────────────────────────────────────────────────── */}
      <div
        style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 16px",
          background: "#f6f6f6",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {[
            { color: "#FF5F57", hover: "#ff3b30" },
            { color: "#FEBC2E", hover: "#ff9500" },
            { color: "#28C840", hover: "#34c759" },
          ].map((btn, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: btn.color,
                boxShadow: `inset 0 0.5px 0 rgba(255,255,255,0.4), 0 0.5px 1px rgba(0,0,0,0.15)`,
              }}
            />
          ))}
        </div>

        {/* URL bar */}
        <div
          style={{
            flex: 1,
            height: 26,
            borderRadius: 6,
            background: "#ebebeb",
            border: "1px solid rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            maxWidth: 380,
            margin: "0 auto",
          }}
        >
          {/* Lock icon */}
          <svg viewBox="0 0 12 14" fill="none" style={{ width: 9, height: 9, flexShrink: 0 }}>
            <rect x="1" y="6" width="10" height="8" rx="1.5" fill="rgba(0,0,0,0.35)" />
            <path d="M3.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="rgba(0,0,0,0.35)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </svg>
          <span
            style={{
              fontSize: 11,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              color: "rgba(0,0,0,0.6)",
              letterSpacing: "0.01em",
            }}
          >
            snapmatch.ai/e/dugun-2025
          </span>
        </div>

        {/* Right spacer (mirrors traffic lights width) */}
        <div style={{ width: 42, flexShrink: 0 }} />
      </div>

      {/* ── Page content ─────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#ffffff",
          padding: "20px 20px 16px",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: "#111",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Düğün Fotoğrafları
              <span style={{ fontSize: 16 }}>📷</span>
            </h3>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: 12,
                color: "rgba(0,0,0,0.45)",
                fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              128 fotoğraf · 28 Haz 2025
            </p>
          </div>
          <span
            style={{
              fontSize: 13,
              color: "rgba(0,0,0,0.4)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              marginTop: 2,
            }}
          >
            1 / 2
          </span>
        </div>

        {/* Photo grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {GRID_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              variants={photoVariants}
              whileHover={{ scale: 1.04, zIndex: 10, transition: { duration: 0.18 } }}
              style={{
                aspectRatio: "1 / 0.82",
                borderRadius: 8,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            padding: "0 2px",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12.5,
              color: "rgba(0,0,0,0.35)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              padding: "4px 0",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
              <polyline points="10 4 6 8 10 12" />
            </svg>
            Önceki
          </button>

          {/* Dots */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  width: i === page ? 20 : 7,
                  height: 7,
                  borderRadius: 4,
                  background: i === page ? "#8B5CF6" : "rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12.5,
              color: "rgba(0,0,0,0.55)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              padding: "4px 0",
            }}
          >
            Sonraki
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
              <polyline points="6 4 10 8 6 12" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(0,0,0,0.07)", margin: "0 0 14px" }} />

        {/* "Are you in these photos?" section */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: 13,
              color: "rgba(0,0,0,0.45)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            Bu fotoğraflarda sen var mısın? Bulmak için tıkla
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {AVATARS.map((av, i) => {
              const isHighlighted = highlightedAvatar === i;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  variants={avatarVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    cursor: "pointer",
                  }}
                  whileHover={{ scale: 1.08, transition: { duration: 0.18 } }}
                >
                  {/* Avatar circle */}
                  <motion.div
                    animate={
                      isHighlighted
                        ? {
                            boxShadow: [
                              "0 0 0 0px rgba(139,92,246,0.4)",
                              "0 0 0 4px rgba(139,92,246,0.25)",
                              "0 0 0 0px rgba(139,92,246,0.4)",
                            ],
                          }
                        : { boxShadow: "0 0 0 0px rgba(139,92,246,0)" }
                    }
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: isHighlighted
                        ? "2.5px solid #8B5CF6"
                        : "2.5px solid rgba(0,0,0,0.08)",
                      transition: "border-color 0.3s ease",
                      position: "relative",
                    }}
                  >
                    <img
                      src={av.src}
                      alt={av.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      loading="lazy"
                      draggable={false}
                    />
                    {/* Highlight overlay */}
                    <AnimatePresence>
                      {isHighlighted && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(139,92,246,0.12)",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: isHighlighted ? 600 : 400,
                      color: isHighlighted ? "#8B5CF6" : "rgba(0,0,0,0.55)",
                      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {av.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowserMockup;
