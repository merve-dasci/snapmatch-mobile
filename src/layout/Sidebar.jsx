import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, matchPath, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Images,
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  UploadCloud,
  Users,
  Cpu,
  BrainCircuit,
  CheckSquare,
  QrCode,
  BarChart3,
  UserCheck,
  ShieldCheck,
  LockKeyhole,
  Building2,
  Settings,
  LogOut,
  ChevronDown,
  MessageSquare
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const role = user ? ROLES[user.role] : null;

  const workspaceStats = useSelector((state) => state.analytics.workspaceStats);
  const stats = {
    storageUsedGB: workspaceStats?.storageUsedGB || 32.4,
    storageLimitGB: workspaceStats?.storageLimitGB || 100.0
  };

  const [expandedGroups, setExpandedGroups] = useState({});

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const groups = [
    {
      id: "general",
      title: "Genel",
      items: [
        { to: "/home", label: "Ana Sayfa", icon: Home },
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/my-photos", label: "Fotoğraflarım", icon: Images },
        { to: "/messages", label: "Mesajlar", icon: MessageSquare },
      ]
    },
    {
      id: "operations",
      title: "Operasyon",
      items: [
        { to: "/events", label: "Etkinlikler", icon: CalendarDays },
        { to: "/events/evt_1", label: "Etkinlik Detay", icon: CalendarClock },
        { to: "/upload", label: "Fotoğraf Yükle", icon: UploadCloud },
        { to: "/participants", label: "Katılımcılar", icon: Users },
        { to: "/qr", label: "QR ve Erişim", icon: QrCode },
      ]
    },
    {
      id: "ai",
      title: "Yapay Zeka (AI)",
      items: [
        { to: "/matching", label: "Yapay Zeka Eşleşme", icon: BrainCircuit },
        { to: "/review", label: "Eşleşme Doğrulama", icon: CheckSquare },
      ]
    },
    {
      id: "management",
      title: "Yönetim & Sistem",
      items: [
        { to: "/analytics", label: "Analitik", icon: BarChart3 },
        { to: "/team", label: "Ekip ve Roller", icon: UserCheck },
        { to: "/roles", label: "Roller", icon: ShieldCheck },
        { to: "/access-matrix", label: "Erişim Matrisi", icon: LockKeyhole },
        { to: "/customers", label: "Müşteriler", icon: Building2 },
        { to: "/settings", label: "Ayarlar", icon: Settings },
      ]
    }
  ];

  // Sadece giriş yapan rolün erişebildiği menü öğelerini göster
  const visibleGroups = groups
    .map(group => {
      const filteredItems = role
        ? group.items.filter((item) =>
            role.allowed.some((pattern) => {
              if (pattern === item.to) return true;
              return !!matchPath(pattern, item.to);
            })
          )
        : group.items;
      return { ...group, items: filteredItems };
    })
    .filter(group => group.items.length > 0);

  // Aktif sayfayı içeren grubu otomatik olarak aç
  useEffect(() => {
    const initialExpanded = {};
    visibleGroups.forEach(group => {
      const hasActiveChild = group.items.some(item => 
        item.to === location.pathname || !!matchPath(item.to, location.pathname)
      );
      if (hasActiveChild) {
        initialExpanded[group.id] = true;
      }
    });
    setExpandedGroups(prev => ({ ...prev, ...initialExpanded }));
  }, [location.pathname]);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // SVG Circular progress math
  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const percentage = (stats.storageUsedGB / stats.storageLimitGB) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <aside className="glass-panel sidebar">
      {/* Brand Header */}
      <div className="brand flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="brand-icon">
            <Cpu size={22} strokeWidth={2.5} />
          </div>
          <span>Snapmatch AI</span>
        </div>
        <ChevronDown size={16} className="text-[var(--text-muted)] opacity-70 mr-1 cursor-pointer hover:text-[var(--text-main)] transition-colors" />
      </div>

      {/* Nav List */}
      <nav className="nav-list">
        {visibleGroups.map((group) => {
          const isExpanded = !!expandedGroups[group.id];
          return (
            <div key={group.id} className="menu-group flex flex-col gap-1">
              {/* Group Header */}
              <div 
                onClick={() => toggleGroup(group.id)}
                className="group-header flex items-center justify-between p-[6px_12px] cursor-pointer rounded-[10px] hover:bg-white/5 transition-colors select-none"
              >
                <span className="text-[var(--text-muted)] text-[0.7rem] uppercase font-bold tracking-wider">{group.title}</span>
                <ChevronDown 
                  size={12} 
                  className={`text-[var(--text-muted)] transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`} 
                />
              </div>

              {/* Group Items Accordion */}
              <div 
                className="group-items flex flex-col gap-1 transition-all duration-200 overflow-hidden"
                style={{
                  maxHeight: isExpanded ? `${group.items.length * 48}px` : "0px",
                  opacity: isExpanded ? 1 : 0
                }}
              >
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/" || item.to === "/dashboard"}
                    className={({ isActive }) => `nav-item pl-6 ${isActive ? "active" : ""}`}
                  >
                    <item.icon size={18} strokeWidth={2.2} />
                    <span className="truncate whitespace-nowrap text-[0.85rem]">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Storage progress widget (Image 1 Overall progress circular ring equivalent for storage) */}
      <div className="storage-widget glass-subpanel">
        <h4>Depolama</h4>
        <div className="storage-ring-wrap">
          <svg viewBox="0 0 100 100" className="storage-ring">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="ring-track"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="ring-progress stroke-[var(--color-blue-medium)]"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className="storage-center">
            <strong>%{percentage.toFixed(0)}</strong>
            <span>Dolu</span>
          </div>
        </div>
        <p className="usage-label">
          {stats.storageUsedGB} GB / {stats.storageLimitGB} GB
        </p>
      </div>

      {/* User Card Bottom */}
      <div className="user-chip flex items-center justify-between w-full">
        <div className="avatar">{user?.initials || "?"}</div>
        <div className="user-info flex-grow ml-2.5">
          <p className="font-bold text-[0.88rem] leading-tight m-0">{user?.name || "Misafir"}</p>
          <small className="text-[var(--text-muted)] text-[0.75rem]">{role?.label || ""}</small>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <ChevronDown size={14} className="text-[var(--text-muted)] opacity-70 cursor-pointer hover:text-[var(--text-main)] transition-colors" />
          <button
            onClick={handleLogout}
            title="Çıkış Yap"
            className="border-none shadow-none bg-transparent w-auto h-auto cursor-pointer flex items-center"
          >
            <LogOut size={16} className="text-[var(--text-muted)]" />
          </button>
        </div>
      </div>
    </aside>
  );
}