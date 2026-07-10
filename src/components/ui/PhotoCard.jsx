import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PhotoCard
 * Telefon ekranından çıkarak havada süzülen fotoğraf kartı.
 * rotate + scale + blur + translate kombinasyonuyla hareket eder.
 *
 * Props:
 *  - src: fotoğraf URL
 *  - alt: alt text
 *  - index: sıra numarası (stagger delay için)
 *  - visible: boolean
 *  - onComplete: animasyon bitince çağrılacak callback
 */
const PhotoCard = ({ src, alt = "Photo", index = 0, visible = false, onComplete }) => {
  const delay = index * 0.22;

  // Her kartın biraz farklı yörüngesi olsun
  const xVariance = (index % 2 === 0 ? 1 : -1) * (18 + index * 8);
  const rotateStart = index % 2 === 0 ? -12 : 12;
  const rotateEnd = index % 2 === 0 ? 5 : -5;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`photo-card-${index}`}
          style={{
            position: "absolute",
            bottom: "12%",
            left: "50%",
            width: 52,
            height: 64,
            zIndex: 30 + index,
            originX: "50%",
            originY: "100%",
            marginLeft: -26,
          }}
          initial={{
            opacity: 0,
            scale: 0.3,
            x: 0,
            y: 0,
            rotate: rotateStart,
            filter: "blur(6px)",
          }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            scale: [0.3, 0.9, 0.85, 0.8, 0.5],
            x: [0, xVariance * 0.3, xVariance * 0.7, xVariance, xVariance * 1.1],
            y: [0, -40, -90, -145, -195],
            rotate: [rotateStart, rotateEnd * 0.5, rotateEnd, rotateEnd * 0.3, 0],
            filter: ["blur(6px)", "blur(0px)", "blur(0px)", "blur(0px)", "blur(4px)"],
          }}
          transition={{
            duration: 2.2,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.18, 0.5, 0.82, 1],
          }}
          onAnimationComplete={() => {
            if (index === 0 && onComplete) onComplete();
          }}
        >
          {/* Polaroid frame */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "white",
              borderRadius: 8,
              padding: "4px 4px 14px 4px",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.22), 0 2px 8px rgba(139,92,246,0.15), inset 0 1px rgba(255,255,255,0.8)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "calc(100% - 10px)",
                borderRadius: 5,
                overflow: "hidden",
                background: "#f0e8ff",
              }}
            >
              <img
                src={src}
                alt={alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
                draggable={false}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoCard;
