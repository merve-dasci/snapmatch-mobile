import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Plus, Image, QrCode, Cpu, ChevronDown, Smartphone } from "lucide-react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useAdaptive } from "../context/AdaptiveContext";
import { mockApi } from "../services/mockApi";
import { ROLES } from "../auth/roles";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setOverrideMode } = useAdaptive();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const role = user ? ROLES[user.role] : null;

  const allActions = [
    { to: "/events?new=true", label: "Yeni Etkinlik", icon: Plus, path: "/events" },
    { to: "/upload", label: "Fotoğraf Yükle", icon: Image, path: "/upload" },
    { to: "/qr", label: "QR Kod Oluştur", icon: QrCode, path: "/qr" },
    { to: "/matching", label: "AI Eşleştirme Başlat", icon: Cpu, path: "/matching" },
  ];

  const allowedActions = role
    ? allActions.filter(action =>
        role.allowed.some(pattern => {
          if (pattern === action.path) return true;
          return !!matchPath(pattern, action.path);
        })
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pathname = location.pathname;
  const firstName = user?.name ? user.name.split(" ")[0] : "Ezgi";

  const getHeader = () => {
    if (pathname === "/") {
      return {
        title: "Dashboard",
        description: null
      };
    }
    if (pathname === "/home") {
      return {
        title: "Ana Sayfa",
        description: null
      };
    }

    // 2. Event Detail (Dynamic Match)
    const eventDetailMatch = matchPath("/events/:id", pathname);
    if (eventDetailMatch) {
      const eventId = eventDetailMatch.params.id;
      const event = mockApi.getEventById(eventId);
      return {
        title: event?.title || "Etkinlik Detayı",
        description: event ? `${event.date} · ${event.location}` : null
      };
    }

    // 3. Static mappings (Only clean Turkish titles, descriptions removed for cleaner UI)
    const routesMap = {
      "/events": { title: "Etkinlikler" },
      "/upload": { title: "Fotoğraf Yükleme Paneli" },
      "/participants": { title: "Katılımcı Yönetimi" },
      "/matching": { title: "Yapay Zeka Eşleşme" },
      "/review": { title: "AI Eşleşme İncelemesi" },
      "/qr": { title: "QR Kod ve Erişim Denetimi" },
      "/analytics": { title: "Analizler ve Raporlama" },
      "/team": { title: "Ekip ve Rol Yönetimi" },
      "/roles": { title: "Kullanıcı Rolleri" },
      "/access-matrix": { title: "Erişim Matrisi" },
      "/settings": { title: "Workspace Ayarları" },
      "/messages": { title: "Mesajlaşma Paneli" }
    };

    return routesMap[pathname] || { title: "", description: null };
  };

  const headerInfo = getHeader();

  return (
    <header className="topbar">
      {/* Welcoming Text / Page Title (Left) */}
      <div className="page-head">
        <h1 className="flex items-center gap-2 font-extrabold text-[var(--text-main)]">
          {headerInfo.title}
        </h1>
        {headerInfo.description && (
          <p className="font-medium text-[var(--text-muted)] mt-1">{headerInfo.description}</p>
        )}
      </div>

      {/* Actions (Right) */}
      <div className="topbar-actions">
        {/* Search Pill */}
        <div className="search-pill">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input type="text" placeholder="Etkinlik veya fotoğraf ara..." />
        </div>

        {/* Layout Switcher (Mobile Preview) */}
        <button 
          className="icon-btn notify-btn" 
          onClick={() => setOverrideMode("mobile")}
          title="Mobil Sürüme Geç (Önizleme)"
        >
          <Smartphone size={18} className="text-[var(--text-main)]" />
        </button>

        {/* Notifications Icon Button */}
        <button className="icon-btn notify-btn" aria-label="Bildirimler">
          <Bell size={18} className="notify-icon" />
          <span className="dot" />
        </button>

        {/* Quick Actions Dropdown Button */}
        {allowedActions.length > 0 && (
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className="primary-btn flex items-center gap-2 whitespace-nowrap" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Plus size={16} />
              <span>Hızlı Eylemler</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                {allowedActions.map((action, idx) => (
                  <React.Fragment key={action.to}>
                    {idx > 0 && action.path === "/matching" && <div className="dropdown-divider" />}
                    <div 
                      className="dropdown-item" 
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(action.to);
                      }}
                    >
                      <action.icon size={16} className="text-[var(--color-blue-medium)]" />
                      <span>{action.label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
