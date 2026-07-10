import React, { createContext, useContext, useEffect, useState } from "react";

const AdaptiveContext = createContext(null);
const STORAGE_KEY = "snapmatch_layout_override";

export function AdaptiveProvider({ children }) {
  const [width, setWidth] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1024));
  const [overrideMode, setOverrideMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "auto";
    } catch {
      return "auto";
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, overrideMode);
    } catch {
      // ignore storage errors
    }
  }, [overrideMode]);

  // Determine if it is mobile:
  // If overrideMode is 'mobile', force mobile.
  // If overrideMode is 'desktop', force desktop.
  // Otherwise, use viewport width < 768px.
  const isMobile = 
    overrideMode === "mobile" 
      ? true 
      : overrideMode === "desktop" 
        ? false 
        : width < 768;

  return (
    <AdaptiveContext.Provider value={{ isMobile, overrideMode, setOverrideMode, width }}>
      {children}
    </AdaptiveContext.Provider>
  );
}

export function useAdaptive() {
  const ctx = useContext(AdaptiveContext);
  if (!ctx) {
    throw new Error("useAdaptive must be used within an AdaptiveProvider");
  }
  return ctx;
}
