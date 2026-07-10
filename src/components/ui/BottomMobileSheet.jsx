import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function BottomMobileSheet({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex flex-col justify-end">
          {/* Backdrop Blur & Fade */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet Body with spring sliding animation */}
          <motion.div
            className="relative bg-[var(--glass-bg-strong)] border-t border-[var(--glass-border)] rounded-t-[32px] p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto flex flex-col z-[10000] backdrop-blur-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Drag Handle Indicator */}
            <div className="w-12 h-1.5 bg-black/15 dark:bg-white/20 rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />

            {/* Header Area */}
            {(title || onClose) && (
              <div className="flex justify-between items-center mb-4">
                {title ? (
                  <h3 className="text-lg font-bold tracking-tight text-[var(--text-main)] m-0">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/5 border-none text-[var(--text-muted)] flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Content Slot */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
