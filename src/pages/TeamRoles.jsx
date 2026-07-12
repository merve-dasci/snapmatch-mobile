import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../context/ToastContext";
import { useAdaptive } from "../context/AdaptiveContext";
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser 
} from "../features/team/teamSlice";
import { 
  Shield, 
  UserPlus, 
  Copy, 
  Check, 
  Users, 
  Mail,
  CheckCircle2,
  XCircle,
  FileText,
  ChevronDown,
  Loader2,
  Trash2
} from "lucide-react";

const FALLBACK_EVENT_ID = "1f8c751d-79fa-4a6e-b916-da387d98e301";

const roleLabels = {
  platform_admin: "Platform Admin",
  business_admin: "Business Admin",
  event_owner: "Event Owner",
  uploader: "Uploader",
};

const roleOptions = Object.entries(roleLabels).map(([value, label]) => ({
  value,
  label,
}));

const statusLabels = {
  active: "Aktif",
  invited: "Davetli",
  disabled: "Pasif",
};

export default function TeamRoles() {
  const { user } = useAuth();
  const { showToast, showConfirm } = useToast();
  const { isMobile } = useAdaptive();
  const dispatch = useDispatch();

  const teamMembers = useSelector((state) => state.team.users) || [];
  const loading = useSelector((state) => state.team.loading);
  const saving = useSelector((state) => state.team.saving);

  const [eventId, setEventId] = useState(
    () => import.meta.env.VITE_EVENT_ID || localStorage.getItem("snapmatch_event_id") || FALLBACK_EVENT_ID
  );
  
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [selectedRole, setSelectedRole] = useState("uploader");
  const [lastInviteLink, setLastInviteLink] = useState(() => localStorage.getItem("sm_last_invite_link") || "");
  const [inviteLoading, setInviteLoading] = useState(false);

  const isAdmin = ["platform_admin", "business_admin", "admin"].includes(user?.role);
  const eventTitle = "Seçili Etkinlik";

  const assignableRoleOptions = useMemo(() => {
    if (user?.role === "platform_admin") {
      return roleOptions;
    }
    return roleOptions.filter((role) => role.value !== "platform_admin");
  }, [user?.role]);

  const loadMembers = () => {
    localStorage.setItem("snapmatch_event_id", eventId.trim());
    dispatch(fetchUsers());
  };

  useEffect(() => {
    loadMembers();
  }, [eventId]);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    loadMembers();
  };

  const handleCopyLink = async () => {
    if (!lastInviteLink) {
      showToast("Önce bir davet linki oluşturun.", "warning");
      return;
    }
    await navigator.clipboard.writeText(lastInviteLink);
    setCopied(true);
    showToast("Davet bağlantısı kopyalandi.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteLoading(true);
    dispatch(createUser({ 
      email: inviteEmail, 
      role: selectedRole, 
      name: inviteName || inviteEmail.split("@")[0],
      assigned: eventTitle
    })).unwrap().then((newUser) => {
      showToast(`${inviteEmail} adresi için davet başarıyla oluşturuldu!`, "success");
      setInviteEmail("");
      setInviteName("");
      setSelectedRole("uploader");
      if (newUser.inviteUrl) {
        setLastInviteLink(newUser.inviteUrl);
        localStorage.setItem("sm_last_invite_link", newUser.inviteUrl);
      }
      dispatch(fetchUsers());
    }).catch(err => {
      showToast("Davetiye oluşturulamadı: " + err, "error");
    }).finally(() => {
      setInviteLoading(false);
    });
  };

  const handleUpdateMember = (member, patch) => {
    if (patch.role && !isAdmin) {
      showToast("Rol atamasını sadece admin kullanıcılar yapabilir.", "warning");
      return;
    }
    dispatch(updateUser({ 
      id: member.id, 
      payload: patch 
    })).unwrap().then(() => {
      showToast("Üye güncellendi.", "success");
      dispatch(fetchUsers());
    }).catch(err => {
      showToast("Üye güncellenemedi: " + err, "error");
    });
  };

  const handleRemoveMember = (member) => {
    showConfirm(
      `"${member.name || member.email}" üyesini ekipten kaldırmak istediğinizden emin misiniz?`,
      () => {
        dispatch(deleteUser(member.id)).unwrap().then(() => {
          showToast("Üye ekipten kaldırıldı.", "success");
          dispatch(fetchUsers());
        }).catch(err => {
          showToast("Üye silinemedi: " + err, "error");
        });
      }
    );
  };

  const getInitial = (member) => {
    return (member.name || member.email || "?").charAt(0).toUpperCase();
  };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 pt-2 pb-16">
        {/* Event context picker on mobile */}
        <div className="glass-panel p-4 flex flex-col gap-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] m-0">Aktif Etkinlik ID</h3>
          <form onSubmit={handleEventSubmit} className="flex gap-2">
            <input
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="flex-grow p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-xs text-[var(--text-main)] outline-none"
            />
            <button type="submit" className="primary-btn px-4 text-xs font-bold rounded-xl">Seç</button>
          </form>
        </div>

        {/* Simple Invite Section */}
        <div className="glass-panel p-4 flex flex-col gap-3 bg-[var(--glass-bg-strong)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] m-0">Yeni Üye Davet Et</h3>
          <form onSubmit={handleSendInvite} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="E-posta adresi girin..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="p-2.5 rounded-xl border border-[var(--glass-border)] bg-white/10 text-xs text-[var(--text-main)] outline-none"
            />
            <button
              type="submit"
              disabled={inviteLoading}
              className="primary-btn py-2.5 text-xs font-bold justify-center rounded-xl disabled:opacity-60"
            >
              {inviteLoading ? "Hazırlanıyor..." : "Davet Gönder"}
            </button>
          </form>
        </div>

        {/* Team list */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 px-1">Ekip Üyeleri</h3>
          <div className="flex flex-col gap-2.5">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="glass-panel p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover border border-[var(--glass-border)]" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[var(--accent-gradient)] text-white flex items-center justify-center font-bold text-xs">
                      {getInitial(member)}
                    </div>
                  )}
                  <div>
                    <strong className="text-xs font-bold text-[var(--text-main)] block">{member.name}</strong>
                    <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">{member.roleName} &bull; {member.assigned}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                  member.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                }`}>
                  {member.status === "active" ? "Aktif" : "Davet Edildi"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <div className="page-head flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-extrabold text-2xl">Ekip ve Rol Yönetimi</h1>
          <p>Ekip arkadaşlarınızı davet edin, yetkilendirmeleri yapın ve sistem üzerindeki eylemlerini denetleyin.</p>
        </div>
        
        {/* Desktop Event Selector ID Form */}
        <form onSubmit={handleEventSubmit} className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-[var(--glass-border)]">
          <input 
            type="text" 
            value={eventId} 
            onChange={(e) => setEventId(e.target.value)} 
            placeholder="Etkinlik ID girin"
            className="p-2 text-xs rounded-xl bg-white/5 border border-[var(--glass-border)] outline-none text-[var(--text-main)]"
          />
          <button type="submit" className="primary-btn text-xs px-3 py-1.5 rounded-xl">Event Yükle</button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[var(--space-lg)]">
        <div className="flex flex-col gap-[var(--space-lg)]">
          <GlassCard title={`Ekip Üyeleri - ${eventTitle}`} className="glass-panel p-0 overflow-hidden">
            {loading ? (
              <div className="p-5 flex items-center gap-3 text-[var(--text-muted)]">
                <Loader2 size={18} className="animate-spin" />
                <span>Ekip üyeleri yükleniyor...</span>
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="p-6 text-center text-[var(--text-muted)]">
                <Users size={28} className="mx-auto mb-2 opacity-70" />
                <strong className="block text-[var(--text-main)]">Bu event için ekip üyesi yok.</strong>
                <span className="text-sm">Sağ taraftan uploader daveti oluşturabilirsiniz.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--glass-border)] bg-black/5">
                      <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Üye</th>
                      <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Rol</th>
                      <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Durum</th>
                      <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">Etkinlik</th>
                      <th className="p-[12px_16px] text-[0.8rem] uppercase text-[var(--text-muted)] font-bold">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => {
                      return (
                        <tr key={member.id} className="border-b border-[var(--glass-border)] theme-card-hover">
                          <td className="p-[12px_16px]">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[var(--glass-border)] grid place-items-center text-[0.8rem] font-bold">
                                {getInitial(member)}
                              </div>
                              <div>
                                <strong className="text-[0.88rem] block">{member.name}</strong>
                                <small className="text-[var(--text-muted)] text-[0.75rem]">{member.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="p-[12px_16px]">
                            <select
                              value={member.role}
                              disabled={!isAdmin}
                              onChange={(e) => handleUpdateMember(member, { role: e.target.value })}
                              className="p-2 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.82rem] font-semibold outline-none disabled:opacity-60"
                              title={isAdmin ? "Rol değiştir" : "Rol atamasını sadece admin kullanıcılar yapabilir"}
                            >
                              {assignableRoleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-[12px_16px]">
                            <select
                              value={member.status}
                              onChange={(e) => handleUpdateMember(member, { status: e.target.value })}
                              className="p-2 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] text-[0.82rem] font-semibold outline-none"
                            >
                              <option value="active">{statusLabels.active}</option>
                              <option value="invited">{statusLabels.invited}</option>
                              <option value="disabled">{statusLabels.disabled}</option>
                            </select>
                          </td>
                          <td className="p-[12px_16px]">
                            <div className="flex flex-col">
                              <span className="text-[0.78rem] font-semibold">{member.assigned || "-"}</span>
                            </div>
                          </td>
                          <td className="p-[12px_16px]">
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member)}
                              className="icon-btn w-9 h-9 hover:text-red-500"
                              title="Üyeyi sil"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>

          <GlassCard title="Son Oluşturulan Davet Linki" className="glass-panel">
            <div className="flex flex-col gap-2.5">
              <p className="text-[var(--text-muted)] text-[0.85rem] m-0">
                Davet oluşturulduktan sonra link burada görünür. MVP'de mail gönderimi yerine linki manuel kopyalayabilirsiniz.
              </p>

              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={lastInviteLink}
                  placeholder="Henüz davet linki oluşturulmadı"
                  className="flex-grow p-2.5 rounded-[10px] bg-white/5 border border-[var(--glass-border)] text-[0.8rem] text-[var(--text-main)] outline-none"
                />
                <button className="icon-btn w-10 h-10 cursor-pointer" onClick={handleCopyLink} title="Linki Kopyala">
                  {copied ? <Check size={16} className="text-[var(--accent-green)]" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-[var(--space-lg)]">
          {/* Invite Form */}
          <GlassCard title="Ekip Arkadaşı Davet Et" className="glass-panel">
            <form onSubmit={handleSendInvite} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[0.82rem] font-bold">Ad Soyad</label>
                <input
                  type="text"
                  placeholder="Örn. Kemal Altın"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[0.82rem] font-bold">E-posta Adresi</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full p-2.5 pl-9 rounded-[10px] border border-[var(--glass-border)] bg-white/15 text-[var(--text-main)] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[0.82rem] font-bold">Rol</label>
                <select
                  value={selectedRole}
                  disabled={!isAdmin}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="p-2.5 rounded-[10px] border border-[var(--glass-border)] bg-white/10 text-[var(--text-main)] font-semibold outline-none opacity-80"
                  title={isAdmin ? "Davet rolü seç" : "Admin olmayan kullanıcı sadece uploader daveti oluşturabilir"}
                >
                  {assignableRoleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={inviteLoading} className="primary-btn justify-center p-2.5 gap-2 disabled:opacity-60">
                <UserPlus size={16} />
                <span>{inviteLoading ? "Davet Hazırlanıyor..." : "Davet Gönder"}</span>
              </button>
            </form>
          </GlassCard>

          {/* Role matrix summary */}
          <GlassCard title="Rol Yetki Matrisi (Permission Matrix)" className="glass-panel">
            <div className="flex flex-col gap-3.5">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-blue-dark)]">
                  <Shield size={14} />
                  <strong className="text-[0.85rem]">Backend Rol Sınırı</strong>
                </div>
                <p className="mt-1 mb-0 text-[0.76rem] text-[var(--text-muted)] leading-[1.35]">
                  Bu endpoint sistem rolleriyle çalışır: <strong>platform_admin</strong>, <strong>business_admin</strong>, <strong>event_owner</strong> ve <strong>uploader</strong>.
                  Platform Admin rolünü sadece Platform Admin atayabilir.
                  Rol atamasını sadece admin kullanıcılar yapabilir; atanan rol kullanıcının login sonrası sayfa erişimini de belirler.
                </p>
              </div>

              <div className="flex flex-col gap-2 border-t border-[var(--glass-border)] pt-3.5 text-[0.78rem] text-[var(--text-muted)]">
                <div className="flex gap-2">
                  <CheckCircle2 size={14} className="text-[var(--accent-green)] shrink-0" />
                  <span>Platform/Business Admin: Tüm rolleri atayabilir.</span>
                </div>
                <div className="flex gap-2">
                  <CheckCircle2 size={14} className="text-[var(--accent-green)] shrink-0" />
                  <span>Event Owner ve Uploader: Kendi yetki matrisine göre sayfalara erişir.</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
