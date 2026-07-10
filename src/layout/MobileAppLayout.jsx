import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation, matchPath } from "react-router-dom";
import { 
  Home, 
  CalendarDays, 
  UploadCloud, 
  CheckSquare, 
  Settings, 
  Menu, 
  LogOut, 
  BarChart3, 
  Users, 
  BrainCircuit, 
  QrCode, 
  UserCheck, 
  ShieldCheck, 
  LockKeyhole, 
  LayoutDashboard,
  Smartphone,
  Monitor,
  ChevronLeft
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";
import { useAdaptive } from "../context/AdaptiveContext";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import BottomMobileSheet from "../components/ui/BottomMobileSheet";

export default function MobileAppLayout({ theme, setTheme }) {
  const { user, logout } = useAuth();
  const { overrideMode, setOverrideMode } = useAdaptive();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const role = user ? ROLES[user.role] : null;
  if (!role) return null;

  // Full set of mobile route targets
  const allNavItems = [
    { to: "/home", label: "Ana Sayfa", icon: Home },
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/events", label: "Etkinlikler", icon: CalendarDays },
    { to: "/upload", label: "Yükle", icon: UploadCloud },
    { to: "/review", label: "Eşleşmeler", icon: CheckSquare },
    { to: "/participants", label: "Katılımcılar", icon: Users },
    { to: "/matching", label: "AI Eşleşme", icon: BrainCircuit },
    { to: "/qr", label: "QR Kod", icon: QrCode },
    { to: "/analytics", label: "Analitik", icon: BarChart3 },
    { to: "/team", label: "Ekip", icon: UserCheck },
    { to: "/roles", label: "Roller", icon: ShieldCheck },
    { to: "/access-matrix", label: "Erişim", icon: LockKeyhole },
    { to: "/settings", label: "Ayarlar", icon: Settings },
  ];

  // Filter items based on user role permissions
  const allowedItems = allNavItems.filter((item) =>
    role.allowed.some((pattern) =>
      matchPath({ path: pattern, end: true }, item.to)
    )
  );

  // Setup bottom tabs (max 5 items)
  // If allowedItems count is <= 5, display them all directly
  // If > 5, display the first 4 items, and make the 5th item a "More/Menu" sheet trigger
  const hasMoreMenu = allowedItems.length > 5;
  const bottomTabs = hasMoreMenu ? allowedItems.slice(0, 4) : allowedItems;
  const menuItems = hasMoreMenu ? allowedItems.slice(4) : [];

  // Determine current active page name for header title
  const currentPath = location.pathname;
  const isDetailPage = currentPath !== "/home";
  const isEventDetail = !!matchPath({ path: "/events/:id" }, currentPath);
  
  const getParentPageInfo = (path) => {
    if (matchPath({ path: "/events/:id" }, path)) {
      return { to: "/events", label: "Etkinlikler" };
    }
    if (path === "/events" || path === "/upload" || path === "/") {
      return { to: "/home", label: "Ana Sayfa" };
    }
    if (path === "/settings") {
      return { to: "/home", label: "Profil" };
    }
    if (path === "/team" || path === "/roles" || path === "/access-matrix") {
      return { to: "/settings", label: "Ayarlar" };
    }
    if (path === "/participants") {
      return { to: "/", label: "Dashboard" };
    }
    if (path === "/review" || path === "/matching" || path === "/qr" || path === "/analytics") {
      return { to: "/", label: "Dashboard" };
    }
    return { to: "/home", label: "Geri" };
  };

  const parentPage = isDetailPage ? getParentPageInfo(currentPath) : null;

  const activeItem = allNavItems.find(item => 
    matchPath({ path: item.to, end: true }, currentPath)
  );
  
  // Custom headers for dynamic sub-routes
  let headerTitle = activeItem ? activeItem.label : "Snapmatch AI";
  if (isEventDetail) {
    headerTitle = "Etkinlik Detay";
  }

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (parentPage) {
      navigate(parentPage.to);
    }
  };

  // Gesture Back Support
  useEffect(() => {
    if (!isDetailPage || !parentPage) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      if (e.touches[0].clientX < 40) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (startX === 0) return;
      
      const deltaX = e.changedTouches[0].clientX - startX;
      const deltaY = e.changedTouches[0].clientY - startY;

      if (deltaX > 100 && Math.abs(deltaY) < 60) {
        handleBack();
        showToast("Önceki sayfaya dönülüyor...");
      }

      startX = 0;
      startY = 0;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDetailPage, parentPage, navigate, showToast]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mobile-shell relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col font-sans overflow-x-hidden">
      
      {/* iOS Status Bar + Navigation Header */}
      <header className="mobile-header fixed top-0 left-0 right-0 z-50 bg-[var(--glass-bg-strong)] border-b border-[var(--glass-border)] backdrop-blur-xl px-4 py-3 flex items-center justify-between min-h-[52px]">
        {/* Left Area: Back Button or Brand info */}
        <div className="flex items-center gap-2 z-10">
          {isDetailPage ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-0.5 text-xs font-bold text-[var(--color-blue-dark)] bg-transparent border-none cursor-pointer p-0 active:opacity-60 transition-opacity"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
              <span>{parentPage.label}</span>
            </button>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-[var(--accent-gradient)] text-white flex items-center justify-center font-bold text-xs">
                {user?.initials || "U"}
              </div>
              <div className="flex flex-col">
                <h2 className="text-xs font-bold leading-tight m-0 text-[var(--text-main)]">{headerTitle}</h2>
                <span className="text-[9px] text-[var(--text-muted)] font-medium leading-none block uppercase tracking-wider mt-0.5">{role.label}</span>
              </div>
            </>
          )}
        </div>

        {/* Center Title (standard iOS detail layout) */}
        {isDetailPage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 className="text-xs font-black text-[var(--text-main)]">{headerTitle}</h2>
          </div>
        )}

        {/* View Mode & LogOut Controls */}
        <div className="flex items-center gap-2 z-10">
          {/* Visual tester override toggle */}
          <button 
            onClick={() => setOverrideMode(overrideMode === "mobile" ? "auto" : "mobile")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold border border-[var(--glass-border)] bg-white/10 text-[var(--text-main)] hover:bg-white/20 transition-all cursor-pointer"
            title="Görünüm Modunu Değiştir"
          >
            {overrideMode === "mobile" ? <Monitor size={10} /> : <Smartphone size={10} />}
            <span>{overrideMode === "mobile" ? "Masaüstü Yap" : "Mobil Kilitle"}</span>
          </button>

          <button 
            onClick={handleLogout} 
            className="w-7 h-7 rounded-full bg-red-500/10 border-none text-red-500 flex items-center justify-center cursor-pointer"
            title="Çıkış"
          >
            <LogOut size={13} />
          </button>
        </div>
      </header>

      {/* Main Content View Container with smooth transition */}
      <main className="mobile-content flex-grow pt-[58px] pb-[80px] px-4 w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          <Outlet context={{ theme, setTheme }} />
        </motion.div>
      </main>

      {/* iOS Bottom Navigation Bar */}
      <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-50 bg-[var(--glass-bg-strong)] border-t border-[var(--glass-border)] backdrop-blur-xl flex justify-around items-center py-2 pb-5 px-2">
        {bottomTabs.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => 
              `flex flex-col items-center gap-0.5 flex-1 py-1 text-center transition-all ${
                isActive ? "text-[var(--color-blue-dark)] scale-105 font-semibold" : "text-[var(--text-muted)]"
              }`
            }
          >
            <item.icon size={20} strokeWidth={2.2} />
            <span className="text-[10px] leading-tight tracking-wide">{item.label}</span>
          </NavLink>
        ))}

        {/* More/Menu item trigger */}
        {hasMoreMenu && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`flex flex-col items-center gap-0.5 flex-1 py-1 text-center bg-transparent border-none cursor-pointer transition-all ${
              isMenuOpen ? "text-[var(--color-blue-dark)] scale-105 font-semibold" : "text-[var(--text-muted)]"
            }`}
          >
            <Menu size={20} strokeWidth={2.2} />
            <span className="text-[10px] leading-tight tracking-wide">Menü</span>
          </button>
        )}
      </nav>

      {/* "More" Slide-up Bottom Sheet */}
      <BottomMobileSheet 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        title="Snapmatch AI Modülleri"
      >
        <div className="grid grid-cols-3 gap-3 p-2">
          {menuItems.map((item) => {
            const isTabActive = location.pathname === item.to;
            return (
              <button
                key={item.to}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(item.to);
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                  isTabActive 
                    ? "bg-[var(--color-blue-dark)]/15 border-[var(--color-blue-dark)] text-[var(--color-blue-dark)] font-semibold" 
                    : "bg-white/10 border-[var(--glass-border)] text-[var(--text-main)] hover:bg-white/20"
                }`}
              >
                <div className="mb-1.5 text-[var(--color-blue-dark)]">
                  <item.icon size={20} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] leading-tight font-medium text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </BottomMobileSheet>
      
    </div>
  );
}
