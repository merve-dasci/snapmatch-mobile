import React from "react";
import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 gap-4">
      {/* Premium blur layout animation skeleton */}
      <div className="w-full max-w-[900px] flex flex-col gap-6 opacity-30 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-48 bg-white/20 rounded-md" />
            <div className="h-4 w-72 bg-white/10 rounded-md" />
          </div>
          <div className="h-10 w-32 bg-white/20 rounded-lg" />
        </div>

        {/* Content Skeleton Card */}
        <div className="w-full h-64 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col gap-4">
          <div className="h-5 w-1/3 bg-white/20 rounded-md" />
          <div className="h-4 w-full bg-white/10 rounded-md" />
          <div className="h-4 w-5/6 bg-white/10 rounded-md" />
          <div className="h-4 w-4/6 bg-white/10 rounded-md" />
        </div>
      </div>

      {/* Floating high-contrast spinner */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19]/35 backdrop-blur-[4px] rounded-[24px]">
        <Loader2 className="animate-spin text-[var(--color-blue-dark)]" size={40} />
        <span className="mt-3 text-[0.82rem] font-bold text-[var(--text-muted)] tracking-wider uppercase">Yükleniyor...</span>
      </div>
    </div>
  );
}
