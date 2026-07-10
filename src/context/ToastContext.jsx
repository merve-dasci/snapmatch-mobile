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
    <ToastContext.Provider value={{ showToast }}>
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
    </ToastContext.Provider>
  );
};