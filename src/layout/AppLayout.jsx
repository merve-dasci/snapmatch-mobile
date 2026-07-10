import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import MobileAppLayout from "./MobileAppLayout";
import { useAdaptive } from "../context/AdaptiveContext";
import { setTheme as setThemeAction } from "../features/ui/uiSlice";

export default function AppLayout() {
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  const setTheme = (newTheme) => {
    dispatch(setThemeAction(newTheme));
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  useEffect(() => {
    const classes = [
      "theme-soft-light",
      "theme-midnight",
      "theme-aurora",
      "theme-rose-quartz",
      "theme-forest",
      "theme-amoled-black"
    ];
    document.body.classList.remove(...classes);
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  if (isMobile) {
    return <MobileAppLayout theme={theme} setTheme={setTheme} />;
  }



  return (
    <div className="dashboard-shell relative">
      {/* Premium background gradient shapes */}
      <div className="bg-blur-shape shape-1" />
      <div className="bg-blur-shape shape-2" />

      {/* Left Sidebar Menu */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="main-area relative z-[1]">
        {/* Top Header Controls */}
        <Topbar />

        {/* Dynamic Page Views */}
        <main className="px-[var(--space-xs)]">
          <Outlet context={{ theme, setTheme }} />
        </main>
      </div>
    </div>
  );
}
