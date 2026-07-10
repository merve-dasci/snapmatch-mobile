import React from "react";
import { motion } from "framer-motion";

/**
 * FloatingPhoto
 * A polaroid-style photo card that floats and animates.
 * Used inside HeroDemo to represent photos flying from phone → cloud → desktop.
 *
 * Props:
 *  - src: image URL
 *  - alt: alt text
 *  - delay: animation delay (seconds)
 *  - style: extra inline styles for positioning
 *  - className: extra Tailwind classes
 *  - width: card width (px)
 *  - height: image area height (px)
 */
const FloatingPhoto = ({
  src,
  alt = "Event photo",
  delay = 0,
  style = {},
  className = "",
  width = 70,
  height = 75,
}) => {
  return (
    <motion.div
      className={`relative flex-shrink-0 cursor-pointer ${className}`}
      style={{ width, ...style }}
      initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
      animate={{
        opacity: [0, 1, 1, 1, 0],
        scale: [0.5, 1, 1.02, 1, 0.85],
        rotate: [-8, 0, 3, -2, 0],
        y: [0, -12, -8, -14, -10],
      }}
      transition={{
        duration: 3.5,
        delay,
        ease: "easeInOut",
        times: [0, 0.15, 0.45, 0.8, 1],
        repeat: Infinity,
        repeatDelay: 6.5,
      }}
      whileHover={{ scale: 1.08, rotate: 0, transition: { duration: 0.2 } }}
    >
      {/* Glass polaroid card */}
      <div
        className="relative overflow-hidden rounded-[12px] border border-white/60 bg-white/90 backdrop-blur-sm"
        style={{
          padding: "5px 5px 18px 5px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 1px rgba(255,255,255,0.9)",
        }}
      >
        <div
          className="overflow-hidden rounded-[8px] bg-black/5"
          style={{ height }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>
        {/* Polaroid notch */}
        <div className="absolute bottom-0 left-0 right-0 h-[18px] flex items-center justify-center">
          <div className="w-6 h-[2px] rounded-full bg-black/10" />
        </div>
      </div>

      {/* Purple-pink gradient glow overlay */}
      <div
        className="absolute inset-0 rounded-[12px] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(236,72,153,0.06) 100%)",
        }}
      />
    </motion.div>
  );
};

export default FloatingPhoto;
