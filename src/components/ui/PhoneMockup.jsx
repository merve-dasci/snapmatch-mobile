import React from "react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";

/**
 * PhoneMockup
 * Renders a premium glassmorphic phone mockup with:
 *  - An animated QR code on the screen (pulse glow)
 *  - Photo cards that "launch" from the phone
 *
 * Props:
 *  - photoCards: array of { src, alt } objects shown on screen
 *  - showPhotos: boolean – triggers the photo-fly-out animation
 */
const PhoneMockup = ({ photoCards = [], showPhotos = false }) => {
  return (
    <div className="relative flex flex-col items-center" style={{ width: 180 }}>
      {/* Phone outer shell */}
      <motion.div
        className="relative rounded-[36px] border border-white/40 overflow-hidden"
        style={{
          width: 160,
          height: 300,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)",
          boxShadow:
            "0 25px 60px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.6), 0 0 0 1px rgba(139,92,246,0.15)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-black/20 z-10"
          style={{ width: 44, height: 12 }}
        />

        {/* Screen content */}
        <div
          className="absolute inset-[6px] rounded-[30px] overflow-hidden flex flex-col items-center justify-center gap-3"
          style={{
            background:
              "linear-gradient(160deg, #1a0533 0%, #0d0720 50%, #1a1035 100%)",
          }}
        >
          {/* Subtle screen glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(139,92,246,0.2) 0%, transparent 70%)",
            }}
          />

          {/* QR Code area */}
          <motion.div
            className="relative flex flex-col items-center gap-2"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Pulse rings */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "rgba(139,92,246,0.15)",
                filter: "blur(8px)",
              }}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* QR card */}
            <div
              className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-white/20 z-10"
              style={{
                padding: "12px",
                background: "rgba(255,255,255,0.95)",
                boxShadow:
                  "0 0 24px rgba(139,92,246,0.4), 0 0 48px rgba(139,92,246,0.15)",
              }}
            >
              {/* SVG QR Pattern - decorative */}
              <div
                className="relative overflow-hidden rounded-lg"
                style={{ width: 64, height: 64 }}
              >
                <QRPatternSVG />
              </div>

              <p
                className="text-stone-700 font-bold text-center leading-tight"
                style={{ fontSize: 7, letterSpacing: "0.05em" }}
              >
                SNAPMATCH
              </p>
            </div>

            <p
              className="text-white/50 font-medium"
              style={{ fontSize: 7, letterSpacing: "0.08em" }}
            >
              TAP TO SCAN
            </p>
          </motion.div>

          {/* Bottom pill */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full"
            style={{
              width: 40,
              height: 4,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>

        {/* Glass sheen on phone body */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[36px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Side button details */}
      <div
        className="absolute right-0 top-16 rounded-r-sm"
        style={{
          width: 3,
          height: 28,
          background: "rgba(255,255,255,0.2)",
          right: -3,
        }}
      />
      <div
        className="absolute left-0 top-12 rounded-l-sm"
        style={{
          width: 3,
          height: 18,
          background: "rgba(255,255,255,0.2)",
          left: -3,
        }}
      />
      <div
        className="absolute left-0 top-[38px] rounded-l-sm"
        style={{
          width: 3,
          height: 14,
          background: "rgba(255,255,255,0.2)",
          left: -3,
        }}
      />
    </div>
  );
};

/**
 * Pure SVG QR-code-like decorative pattern.
 * No external library needed – just a visually authentic placeholder.
 */
const QRPatternSVG = () => (
  <svg
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%" }}
  >
    {/* Top-left finder pattern */}
    <rect x="2" y="2" width="18" height="18" rx="3" fill="#1C1917" />
    <rect x="6" y="6" width="10" height="10" rx="1" fill="white" />
    <rect x="8" y="8" width="6" height="6" rx="0.5" fill="#7c3aed" />

    {/* Top-right finder pattern */}
    <rect x="44" y="2" width="18" height="18" rx="3" fill="#1C1917" />
    <rect x="48" y="6" width="10" height="10" rx="1" fill="white" />
    <rect x="50" y="8" width="6" height="6" rx="0.5" fill="#7c3aed" />

    {/* Bottom-left finder pattern */}
    <rect x="2" y="44" width="18" height="18" rx="3" fill="#1C1917" />
    <rect x="6" y="48" width="10" height="10" rx="1" fill="white" />
    <rect x="8" y="50" width="6" height="6" rx="0.5" fill="#7c3aed" />

    {/* Data dots - randomized pattern */}
    {[
      [24,2],[28,2],[32,2],[36,2],[24,6],[32,6],[36,6],
      [24,10],[28,10],[36,10],[24,14],[28,14],[32,14],
      [24,18],[36,18],[2,24],[6,24],[14,24],[18,24],
      [28,24],[36,24],[44,24],[52,24],[58,24],[62,24],
      [2,28],[10,28],[18,28],[24,28],[32,28],[40,28],
      [48,28],[56,28],[2,32],[6,32],[14,32],[20,32],
      [28,32],[34,32],[44,32],[50,32],[58,32],[62,32],
      [2,36],[8,36],[16,36],[24,36],[30,36],[38,36],[46,36],[54,36],[62,36],
      [24,44],[32,44],[36,44],[40,44],[24,48],[28,48],[36,48],[44,48],[52,48],[58,48],[62,48],
      [24,52],[30,52],[38,52],[46,52],[24,56],[32,56],[40,56],[48,56],[56,56],
      [24,60],[28,60],[34,60],[44,60],[52,60],[60,60],
    ].map(([x, y], i) => (
      <rect key={i} x={x} y={y} width="3" height="3" rx="0.5" fill="#1C1917" />
    ))}
  </svg>
);

export default PhoneMockup;
