import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Bell, Plus, Image, QrCode, Cpu, ChevronDown, Smartphone, Sparkles, UserPlus, AlertTriangle, MessageSquare } from "lucide-react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useAdaptive } from "../context/AdaptiveContext";
import { mockApi } from "../services/mockApi";
import { ROLES } from "../auth/roles";
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead
} from "../features/notifications/notificationsSlice";
import { setGlobalSearchQuery } from "../features/ui/uiSlice";

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setOverrideMode } = useAdaptive();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items) || [];
  const unreadCount = useSelector((state) => state.notifications.unreadCount) || 0;
  const globalSearchQuery = useSelector((state) => state.ui.globalSearchQuery);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

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
    dispatch(fetchNotifications());

    const handleNewMessageNotification = () => {
      dispatch(fetchNotifications());
    };
    window.addEventListener("sm_new_message_received", handleNewMessageNotification);
    return () => {
      window.removeEventListener("sm_new_message_received", handleNewMessageNotification);
    };
  }, [dispatch, user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleItemKeyDown = (e, callback) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

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

  const searchLower = globalSearchQuery.trim().toLocaleLowerCase("tr-TR");
  const matchingEvents = searchLower 
    ? mockApi.getEvents().filter(e => 
        (e.title || "").toLocaleLowerCase("tr-TR").includes(searchLower) ||
        (e.location || "").toLocaleLowerCase("tr-TR").includes(searchLower)
      ).slice(0, 3)
    : [];
    
  const matchingParticipants = searchLower
    ? mockApi.getParticipants().filter(p =>
        (p.display_name || "").toLocaleLowerCase("tr-TR").includes(searchLower) ||
        (p.email || "").toLocaleLowerCase("tr-TR").includes(searchLower)
      ).slice(0, 3)
    : [];

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
        <div className="relative z-50" ref={searchContainerRef}>
          <div className="search-pill">
            <Search size={18} className="text-[var(--text-muted)]" />
            <input 
              type="text" 
              placeholder="Etkinlik veya fotoğraf ara..." 
              value={globalSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => dispatch(setGlobalSearchQuery(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchFocused(false);
                  if (location.pathname !== "/events") navigate("/events");
                }
              }}
            />
          </div>
          
          {/* Autocomplete Dropdown */}
          {isSearchFocused && searchLower && (
            <div className="absolute top-[110%] left-0 w-full min-w-[320px] bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl shadow-lg backdrop-blur-xl overflow-hidden py-2 max-h-[400px] overflow-y-auto">
              
              {matchingEvents.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1 text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">Etkinlikler</div>
                  {matchingEvents.map(ev => (
                    <button 
                      key={ev.id}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 dark:hover:bg-black/10 transition-colors flex flex-col gap-1 border-none cursor-pointer bg-transparent"
                      onClick={() => {
                        dispatch(setGlobalSearchQuery(ev.title));
                        setIsSearchFocused(false);
                        navigate(`/events/${ev.id}`);
                      }}
                    >
                      <span className="text-[0.85rem] font-bold text-[var(--text-main)] truncate block">{ev.title}</span>
                      <span className="text-[0.7rem] text-[var(--text-muted)] truncate block">{ev.location}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchingParticipants.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[0.7rem] font-bold text-[var(--text-muted)] uppercase tracking-wider">Katılımcılar</div>
                  {matchingParticipants.map(p => (
                    <button 
                      key={p.id}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 dark:hover:bg-black/10 transition-colors flex flex-col gap-1 border-none cursor-pointer bg-transparent"
                      onClick={() => {
                        dispatch(setGlobalSearchQuery(p.display_name));
                        setIsSearchFocused(false);
                        navigate(`/participants`);
                      }}
                    >
                      <span className="text-[0.85rem] font-bold text-[var(--text-main)] truncate block">{p.display_name}</span>
                      <span className="text-[0.7rem] text-[var(--text-muted)] truncate block">{p.email}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchingEvents.length === 0 && matchingParticipants.length === 0 && (
                <div className="px-4 py-3 text-[0.8rem] text-[var(--text-muted)] italic">Eşleşen sonuç bulunamadı.</div>
              )}
            </div>
          )}
        </div>

        {/* Layout Switcher (Mobile Preview) */}
        <button 
          className="icon-btn notify-btn" 
          onClick={() => setOverrideMode("mobile")}
          title="Mobil Sürüme Geç (Önizleme)"
        >
          <Smartphone size={18} className="text-[var(--text-main)]" />
        </button>

        {/* Notifications Icon Button with popover */}
        <div className="dropdown-container" ref={notificationsRef}>
          <button 
            className="icon-btn notify-btn relative" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Bildirimler"
            aria-haspopup="menu"
            aria-expanded={notificationsOpen}
            aria-controls="notifications-menu"
          >
            <Bell size={18} className="notify-icon" />
            {unreadCount > 0 && <span className="dot" />}
          </button>

          {notificationsOpen && (
            <div 
              id="notifications-menu"
              role="menu"
              className="dropdown-menu notifications-dropdown z-50"
            >
              <div className="notifications-header">
                <h3>Bildirimler ({unreadCount})</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => dispatch(markAllAsRead())}
                  >
                    Tümünü Okundu Yap
                  </button>
                )}
              </div>
              <div className="notification-list">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[var(--text-muted)] font-medium">
                    Yeni bildirim bulunmuyor.
                  </div>
                ) : (
                  notifications.map((not) => (
                    <div 
                      key={not.id}
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => handleItemKeyDown(e, () => {
                        if (!not.read) {
                          dispatch(markAsRead(not.id));
                        }
                        if (not.type === "message") {
                          navigate("/messages");
                          setNotificationsOpen(false);
                        }
                      })}
                      onClick={() => {
                        if (!not.read) {
                          dispatch(markAsRead(not.id));
                        }
                        if (not.type === "message") {
                          navigate("/messages");
                          setNotificationsOpen(false);
                        }
                      }}
                      className={`notification-item ${not.read ? "read" : "unread"}`}
                    >
                      <div className={`notification-icon-wrapper ${not.type || "system"}`}>
                        {not.type === "match" && <Sparkles size={14} />}
                        {not.type === "team" && <UserPlus size={14} />}
                        {not.type === "warning" && <AlertTriangle size={14} />}
                        {not.type === "message" && <MessageSquare size={14} />}
                        {not.type !== "match" && not.type !== "team" && not.type !== "warning" && not.type !== "message" && <Cpu size={14} />}
                      </div>
                      <div className="notification-content">
                        <strong className="notification-title">{not.title}</strong>
                        <p className="notification-msg m-0">{not.message}</p>
                        <span className="notification-time">
                          {new Date(not.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {!not.read && <div className="notification-badge-dot" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Dropdown Button */}
        {allowedActions.length > 0 && (
          <div className="dropdown-container" ref={dropdownRef}>
            <button 
              className="primary-btn flex items-center gap-2 whitespace-nowrap" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="menu"
              aria-expanded={dropdownOpen}
              aria-controls="quick-actions-menu"
            >
              <Plus size={16} />
              <span>Hızlı Eylemler</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : "rotate-0"}`} />
            </button>

            {dropdownOpen && (
              <div 
                id="quick-actions-menu"
                role="menu"
                className="dropdown-menu"
              >
                {allowedActions.map((action, idx) => (
                  <React.Fragment key={action.to}>
                    {idx > 0 && action.path === "/matching" && <div className="dropdown-divider" />}
                    <div 
                      className="dropdown-item" 
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => handleItemKeyDown(e, () => {
                        setDropdownOpen(false);
                        navigate(action.to);
                      })}
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
