import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [confirmData, setConfirmData] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = (message, type = "success") => {
    // Eski timer varsa iptal et
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToast({ message, type });

    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, 3000);
  };

  const showConfirm = (message, onConfirm, onCancel = null) => {
    setConfirmData({ message, onConfirm, onCancel });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getToastIcon = (type) => {
    switch (type) {
      case "error":
        return (
          <AlertTriangle
            size={20}
            className="text-red-500 shrink-0"
          />
        );

      case "warning":
        return (
          <AlertTriangle
            size={20}
            className="text-amber-500 shrink-0"
          />
        );

      case "info":
        return (
          <Info
            size={20}
            className="text-blue-500 shrink-0"
          />
        );

      default:
        return (
          <CheckCircle2
            size={20}
            className="text-emerald-500 shrink-0"
          />
        );
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirm }}>
      {children}

      {toast && (
        <div
          className="fixed top-6 right-6 z-[9999] min-w-[280px] max-w-[380px] rounded-2xl border p-4 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 animate-toast-in"
          style={{
            background: "var(--glass-bg-strong)",
            borderColor:
              toast.type === "error"
                ? "rgba(239,68,68,.3)"
                : toast.type === "warning"
                  ? "rgba(245,158,11,.3)"
                  : "var(--glass-border)",
          }}
        >
          <div className="flex items-center gap-3">
            {getToastIcon(toast.type)}

            <span className="text-sm font-semibold text-[var(--text-main)]">
              {toast.message}
            </span>
          </div>

          <button
            onClick={() => setToast(null)}
            className="bg-transparent border-none cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Özel Tasarıma Uygun Onay Modali (Confirm Modal) */}
      {confirmData && (
        <div className="fixed inset-0 z-[9999] bg-black/80 grid place-items-center p-4 backdrop-blur-md animate-fade-in">
          <div 
            className="max-w-[380px] w-full p-6 rounded-[24px] flex flex-col gap-5 text-center relative overflow-hidden"
            style={{
              background: "var(--glass-bg-strong)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
            }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto grid place-items-center border border-amber-500/20">
              <AlertTriangle size={22} className="animate-[pulse_2s_infinite]" />
            </div>
            
            <div className="flex flex-col gap-2">
              <strong className="text-base font-extrabold text-white">Emin misiniz?</strong>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed m-0 px-2">
                {confirmData.message}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  if (confirmData.onCancel) confirmData.onCancel();
                  setConfirmData(null);
                }}
                className="secondary-btn flex-1 py-3 text-xs font-bold rounded-[14px] cursor-pointer border border-white/10"
              >
                İptal
              </button>
              <button 
                onClick={() => {
                  confirmData.onConfirm();
                  setConfirmData(null);
                }}
                className="flex-1 py-3 text-xs font-bold rounded-[14px] cursor-pointer bg-gradient-to-r from-red-500 to-rose-600 text-white border-none shadow-md shadow-red-500/10 hover:from-red-600 hover:to-rose-700"
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};