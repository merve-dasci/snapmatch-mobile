import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * QRCodeAnimation
 * QR kod satır satır oluşturma animasyonu + pulse efekti.
 * staggerChildren ile her satır ayrı ayrı belirir.
 *
 * Props:
 *  - visible: boolean – QR görünür mü?
 *  - pulsing: boolean – pulse efekti aktif mi?
 */

// Dekoratif QR SVG: 7x7 modül grid
const QR_ROWS = [
  [1,1,1,1,1,1,1,  0,  1,0,1,0,1,  0,  1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,  0,  0,1,0,1,0,  0,  1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,  0,  1,0,1,0,1,  0,  1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,  0,  0,0,0,1,0,  0,  1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,  0,  1,1,0,0,1,  0,  1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,  0,  0,1,0,1,0,  0,  1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,  0,  1,0,1,0,1,  0,  1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,  0,  0,1,1,0,0,  0,  0,0,0,0,0,0,0],
  [1,0,1,1,0,1,0,  1,  0,0,1,1,0,  1,  0,1,1,0,1,0,1],
  [0,1,0,0,1,0,1,  0,  1,0,0,1,1,  0,  1,0,0,1,0,1,0],
  [1,1,0,1,0,1,1,  1,  0,1,1,0,0,  1,  1,1,0,1,0,1,1],
  [0,0,1,0,1,0,0,  0,  1,1,0,1,0,  0,  0,0,1,0,1,0,0],
  [1,0,1,0,0,1,1,  1,  0,0,1,0,1,  1,  1,0,1,0,0,1,1],
  [0,0,0,0,0,0,0,  0,  1,0,0,1,0,  0,  0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,  0,  0,1,1,0,1,  0,  1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,  0,  1,0,0,1,0,  0,  1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,  0,  0,1,0,1,1,  0,  1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,  0,  1,1,1,0,0,  0,  1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,  0,  0,0,1,0,1,  0,  1,1,1,1,1,1,1],
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, scaleX: 0.6, y: 4 },
  visible: {
    opacity: 1,
    scaleX: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

const QRCodeAnimation = ({ visible = false, pulsing = false }) => {
  const moduleSize = 5; // px per module
  const cols = QR_ROWS[0].length;
  const qrWidth = cols * moduleSize;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="qr-wrapper"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          style={{ position: "relative", display: "inline-block" }}
        >
          {/* Pulse glow arkasında */}
          {pulsing && (
            <motion.div
              style={{
                position: "absolute",
                inset: -12,
                borderRadius: 12,
                background: "rgba(139,92,246,0.18)",
                filter: "blur(14px)",
                zIndex: 0,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.06, 0.95] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}

          {/* QR arka plan kartı */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              background: "#ffffff",
              borderRadius: 10,
              padding: 8,
              boxShadow: pulsing
                ? "0 0 20px rgba(139,92,246,0.35), 0 4px 16px rgba(0,0,0,0.12)"
                : "0 4px 16px rgba(0,0,0,0.12)",
              transition: "box-shadow 0.4s ease",
            }}
          >
            <svg
              width={qrWidth}
              height={QR_ROWS.length * moduleSize}
              viewBox={`0 0 ${qrWidth} ${QR_ROWS.length * moduleSize}`}
              style={{ display: "block" }}
            >
              {QR_ROWS.map((row, rowIdx) => (
                <motion.g key={rowIdx} variants={rowVariants}>
                  {row.map((cell, colIdx) =>
                    cell ? (
                      <rect
                        key={colIdx}
                        x={colIdx * moduleSize}
                        y={rowIdx * moduleSize}
                        width={moduleSize - 0.5}
                        height={moduleSize - 0.5}
                        rx={0.8}
                        fill={
                          // Finder pattern köşeleri mor
                          (rowIdx < 7 && colIdx < 7) ||
                          (rowIdx < 7 && colIdx >= cols - 7) ||
                          (rowIdx >= QR_ROWS.length - 7 && colIdx < 7)
                            ? "#7c3aed"
                            : "#1C1917"
                        }
                      />
                    ) : null
                  )}
                </motion.g>
              ))}
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeAnimation;
