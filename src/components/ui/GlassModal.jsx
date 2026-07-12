import { useRef, useEffect } from "react";
import { X } from "lucide-react";

export default function GlassModal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  width = "max-w-[580px]",
  noPadding = false,
  height = "max-h-[70vh]",
  overflow = "overflow-y-auto",
}) {
  const modalRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const previousActiveRef = useRef(null);

  // Keep onClose ref fresh without re-triggering effects
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Focus the first focusable element ONCE when modal opens
  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement;

    const focusTimeout = setTimeout(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }
    }, 50);

    return () => clearTimeout(focusTimeout);
  }, [open]);

  // Keyboard handling (Escape + Tab trap) & scroll lock
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCloseRef.current();
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
          )
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Disable body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      if (previousActiveRef.current && previousActiveRef.current.focus) {
        previousActiveRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div 
      ref={modalRef}
      role="dialog" 
      aria-modal="true" 
      aria-label={title || "Bileşen Penceresi"}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-md transition-all duration-300"
      />

      {/* Modal Card container with transparent liquid glass design */}
      <div
        className={`
          relative
          w-full
          ${width}
          rounded-[24px]
          overflow-hidden
          border
          border-white/20
          bg-slate-950/40
          backdrop-blur-3xl
          shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_24px_60px_rgba(0,0,0,0.8)]
          animate-fade-in
          flex
          flex-col
        `}
      >
        {/* Glowing atmospheric liquid lights in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-[var(--color-blue-medium)]/25 blur-[90px]" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-violet-500/22 blur-[90px]" />
        </div>

        {/* Header container */}
        <div className="relative z-10 p-6 flex items-start justify-between border-b border-white/10">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-12 h-12 rounded-[14px] bg-[var(--color-blue-dark)]/30 border border-[var(--color-blue-medium)]/40 flex items-center justify-center text-[var(--color-blue-medium)] shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                <Icon size={22} strokeWidth={2} />
              </div>
            )}
            <div>
              <h3 className="m-0 text-[1.18rem] font-bold text-white tracking-tight leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                {title}
              </h3>
              {subtitle && (
                <p className="m-0 text-[0.82rem] text-slate-200 mt-1 font-bold leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center justify-center border-none cursor-pointer"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className={`relative z-10 ${overflow} ${height} ${noPadding ? "p-0" : "p-6"}`}>
          {children}
        </div>

        {/* Footer Area */}
        {footer && (
          <div className="relative z-10 p-6 border-t border-white/10 bg-white/5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
