import React, { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * MouseParallax
 * Container'a mouse konumuna göre hafif rotateX / rotateY ekler.
 * Hover olmadan durumda nötr pozisyonda durur.
 *
 * Props:
 *  - children: render edilecek içerik
 *  - strength: etki gücü (1 = standart, 0.5 = yarı güç)
 *  - className, style
 */
const MouseParallax = ({ children, strength = 1, className = "", style = {} }) => {
  const ref = useRef(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springX = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.6 });
  const springY = useSpring(rawY, { stiffness: 80, damping: 22, mass: 0.6 });

  const rotateX = useTransform(springY, [-1, 1], [8 * strength, -8 * strength]);
  const rotateY = useTransform(springX, [-1, 1], [-10 * strength, 10 * strength]);

  const handleMouseMove = useCallback(
    (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawX.set((e.clientX - cx) / (rect.width / 2));
      rawY.set((e.clientY - cy) / (rect.height / 2));
    },
    [rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        perspective: 1000,
        ...style,
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MouseParallax;
