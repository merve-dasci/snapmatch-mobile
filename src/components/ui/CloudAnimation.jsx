import React from "react";
import { motion } from "framer-motion";

/**
 * CloudAnimation
 * Renders a glassmorphic cloud icon with upload arrows.
 * Pulses when photos are "arriving" and shows a success state.
 *
 * Props:
 *  - phase: "idle" | "receiving" | "done"
 */
const CloudAnimation = ({ phase = "idle" }) => {
  const isReceiving = phase === "receiving";
  const isDone = phase === "done";

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center"
      style={{ width: 72, height: 72 }}
      animate={
        isReceiving
          ? { scale: [1, 1.08, 1], y: [0, -3, 0] }
          : isDone
          ? { scale: [1, 1.12, 1] }
          : { y: [0, -4, 0] }
      }
      transition={{
        duration: isReceiving ? 1.2 : isDone ? 0.5 : 3,
        repeat: isDone ? 0 : Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Glow ring - receiving state */}
      {isReceiving && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "rgba(139,92,246,0.2)",
            filter: "blur(12px)",
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Done glow - green */}
      {isDone && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.8, 2] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: "rgba(34,197,94,0.3)",
            filter: "blur(14px)",
          }}
        />
      )}

      {/* Cloud card */}
      <div
        className="relative w-full h-full rounded-[20px] border border-white/50 flex items-center justify-center overflow-hidden"
        style={{
          background: isDone
            ? "linear-gradient(135deg, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.15) 100%)"
            : "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(59,130,246,0.15) 100%)",
          boxShadow: isDone
            ? "0 8px 24px rgba(34,197,94,0.25), inset 0 1px 1px rgba(255,255,255,0.6)"
            : "0 8px 24px rgba(139,92,246,0.25), inset 0 1px 1px rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Cloud SVG icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDone ? "#22c55e" : "#8B5CF6"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 36, height: 36 }}
        >
          {isDone ? (
            <>
              {/* Checkmark */}
              <polyline points="20 6 9 17 4 12" />
            </>
          ) : (
            <>
              {/* Cloud shape */}
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              {/* Upload arrow */}
              <line x1="12" y1="12" x2="12" y2="8" />
              <polyline points="10 10 12 8 14 10" />
            </>
          )}
        </svg>
      </div>

      {/* Subtle particle dots orbiting cloud */}
      {isReceiving && [0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: i === 0 ? "#8B5CF6" : i === 1 ? "#EC4899" : "#3B82F6",
            top: "50%",
            left: "50%",
          }}
          animate={{
            x: [0, Math.cos((i * 120 * Math.PI) / 180) * 36, 0],
            y: [0, Math.sin((i * 120 * Math.PI) / 180) * 36, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.6,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

export default CloudAnimation;
