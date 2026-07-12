import React from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-blue-dark)] opacity-10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-blue-medium)] opacity-10 blur-[120px]" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
        <h1 className="text-8xl font-extrabold text-[var(--color-blue-dark)] mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Sayfa Bulunamadı</h2>
        <p className="text-[var(--text-muted)] mb-8">
          Aradığınız sayfa silinmiş, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
                     bg-[var(--color-blue-dark)] text-white hover:opacity-90 active:scale-95"
        >
          <Home size={20} />
          <span>Ana Sayfa</span>
        </button>
      </div>
    </div>
  );
}
