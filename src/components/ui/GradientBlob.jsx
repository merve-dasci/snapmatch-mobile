import React from "react";
import { motion } from "framer-motion";

/**
 * GradientBlob
 * Yavaş floating animasyonuyla hareket eden büyük blur gradient ışığı.
 *
 * Props:
 *  - color: CSS renk değeri (ör. "rgba(139,92,246,0.25)")
 *  - size: genişlik/yükseklik px
 *  - style: konum için inline style
 *  - duration: animasyon süresi (saniye)
 *  - delay: animasyon gecikmesi
 */
const GradientBlob = ({
  color = "rgba(139,92,246,0.2)",
  size = 400,
  style = {},
  duration = 18,
  delay = 0,
}) => {
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
        pointerEvents: "none",
        ...style,
      }}
      animate={{
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 20, -10, 0],
        scale: [1, 1.08, 0.95, 1.04, 1],
      }}
      transition={{
        duration,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
};

export default GradientBlob;
