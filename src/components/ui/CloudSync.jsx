import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CloudSync
 * Fotoğrafları alıp bilgisayara geçirdiğini simgeleyen cloud ikonu.
 * Üç state: idle | receiving | done
 *
 * Props:
 *  - phase: "idle" | "receiving" | "done"
 */
const CloudSync = ({ phase = "idle" }) => {
  const isReceiving = phase === "receiving";
  const isDone = phase === "done";

  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      {/* Receiving glow */}
      <AnimatePresence>
        {isReceiving && (
          <motion.div
            key="glow"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.4, 0.8] }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              background: "rgba(139,92,246,0.25)",
              filter: "blur(10px)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Done burst */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="burst"
            initial={{ opacity: 0.8, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: "50%",
              background: "rgba(34,197,94,0.3)",
              filter: "blur(12px)",
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Icon card */}
      <motion.div
        animate={isReceiving ? { y: [0, -3, 0] } : isDone ? { scale: [1, 1.15, 1] } : { y: [0, -4, 0] }}
        transition={{
          duration: isReceiving ? 0.9 : isDone ? 0.4 : 3,
          repeat: isDone ? 0 : Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          zIndex: 1,
          width: 48,
          height: 48,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isDone
            ? "linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.15))"
            : "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))",
          boxShadow: isDone
            ? "0 6px 20px rgba(34,197,94,0.25), inset 0 1px rgba(255,255,255,0.6)"
            : "0 6px 20px rgba(139,92,246,0.2), inset 0 1px rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          transition: "background 0.4s ease, box-shadow 0.4s ease",
        }}
      >
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.svg
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 22, height: 22 }}
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="cloud"
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              viewBox="0 0 24 24"
              fill="none"
              stroke={isReceiving ? "#8B5CF6" : "#a78bfa"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: 24, height: 24 }}
            >
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              {isReceiving && (
                <>
                  <line x1="12" y1="13" x2="12" y2="9" />
                  <polyline points="10 11 12 9 14 11" />
                </>
              )}
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CloudSync;
