import React from "react";

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md shadow-lg max-w-[450px] mx-auto my-6 select-none relative">
      {/* Decorative Glow Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[24px] -z-10">
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl" />
      </div>

      {/* Visual Indicator / Icon */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 border border-white/10 flex items-center justify-center text-[var(--color-blue-medium)] mb-5 shadow-inner animate-pulse">
        {Icon ? <Icon size={28} className="stroke-[1.5]" /> : <span>🔍</span>}
      </div>

      {/* Title & Description */}
      <h3 className="text-[1.05rem] font-extrabold text-white m-0 tracking-tight leading-snug">
        {title || "Veri Bulunamadı"}
      </h3>
      <p className="text-xs text-[var(--text-muted)] mt-2 mb-6 max-w-[340px] leading-relaxed font-medium">
        {description || "Görüntülenecek herhangi bir kayıt mevcut değil."}
      </p>

      {/* Optional Action Button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="primary-btn px-6 py-2.5 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-500/10"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
