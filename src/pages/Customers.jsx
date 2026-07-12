import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import GlassModal from "../components/ui/GlassModal";
import { useToast } from "../context/ToastContext";
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from "../features/customers/customersSlice";
import { Building2, Plus, Search, Users, TrendingUp, HardDrive, Pencil, Trash2 } from "lucide-react";

const PLAN_COLOR = {
    Free: "var(--text-muted)",
    Pro: "var(--color-blue-dark)",
    Enterprise: "var(--accent-green)",
};

const STATUS_COLOR = {
    Aktif: "var(--accent-green)",
    Deneme: "var(--accent-yellow)",
    Askıda: "var(--accent-red)",
};

function Badge({ text, color }) {
    return (
        <span
            className="px-2 py-[3px] rounded-full text-[0.7rem] font-bold whitespace-nowrap"
            style={{ color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
        >
            {text}
        </span>
    );
}

function fmtDate(d) {
    try {
        return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" });
    } catch {
        return d;
    }
}

function fmtGB(n) {
    return n >= 1000 ? `${(n / 1000).toFixed(2)} TB` : `${n} GB`;
}

export default function Customers() {
    const { showToast, showConfirm } = useToast();
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.items) || [];
    const loading = useSelector((state) => state.customers.loading);
    const saving = useSelector((state) => state.customers.saving);

    const [query, setQuery] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [form, setForm] = useState({
        name: "",
        sector: "Düğün Fotoğrafçılığı",
        plan: "Pro",
        status: "Aktif",
    });

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const globalSearch = useSelector((state) => state.ui.globalSearchQuery) || "";
    const activeSearchQuery = query || globalSearch;

    const searchLower = activeSearchQuery.trim().toLocaleLowerCase("tr-TR");
    const filtered = customers.filter((c) =>
        ((c.name || "") + " " + (c.sector || "")).toLocaleLowerCase("tr-TR").includes(searchLower)
    );

    // KPI'lar veriden türetilir
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Aktif").length;
    const trial = customers.filter((c) => c.status === "Deneme").length;
    const usedSum = customers.reduce((s, c) => s + (Number(c.used) || 0), 0);
    const limitSum = customers.reduce((s, c) => s + (Number(c.limit) || 0), 0);

    const kpis = [
        { label: "Toplam Müşteri", value: total, icon: Building2, color: "var(--color-blue-dark)" },
        { label: "Aktif", value: active, icon: TrendingUp, color: "var(--accent-green)" },
        { label: "Deneme", value: trial, icon: Users, color: "var(--accent-yellow)" },
        { label: "Toplam Storage", value: `${fmtGB(Math.round(usedSum))} / ${fmtGB(limitSum)}`, icon: HardDrive, color: "var(--color-blue-medium)" },
    ];

    const resetForm = () => {
        setForm({
            name: "",
            sector: "Düğün Fotoğrafçılığı",
            plan: "Pro",
            status: "Aktif",
        });
        setEditingCustomer(null);
        setModalOpen(false);
    };

    const handleNewCustomerClick = () => {
        resetForm();
        setModalOpen(true);
    };

    const handleEditClick = (c) => {
        setEditingCustomer(c);
        setForm({
            name: c.name,
            sector: c.sector,
            plan: c.plan,
            status: c.status,
        });
        setModalOpen(true);
    };

    const handleDelete = (id, name) => {
        showConfirm(
            `"${name}" müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
            () => {
                dispatch(deleteCustomer(id)).unwrap().then(() => {
                    showToast("Müşteri başarıyla silindi.", "success");
                }).catch((err) => {
                    showToast(err || "Müşteri silinemedi.", "error");
                });
            }
        );
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            showToast("Lütfen müşteri adını girin.", "warning");
            return;
        }

        const payload = {
            name: form.name,
            sector: form.sector,
            plan: form.plan,
            status: form.status,
        };

        if (editingCustomer) {
            dispatch(updateCustomer({ id: editingCustomer.id, payload })).unwrap().then(() => {
                showToast("Müşteri başarıyla güncellendi.", "success");
                setModalOpen(false);
                resetForm();
            }).catch((err) => {
                showToast(err || "Müşteri güncellenemedi.", "error");
            });
        } else {
            dispatch(createCustomer(payload)).unwrap().then(() => {
                showToast("Müşteri başarıyla eklendi.", "success");
                setModalOpen(false);
                resetForm();
            }).catch((err) => {
                showToast(err || "Müşteri eklenemedi.", "error");
            });
        }
    };

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="page-head flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-extrabold text-[var(--text-main)]">Müşteriler</h1>
                    <p className="text-[var(--text-muted)]">Snapmatch AI platformunu kullanan işletmeler (tenant) ve abonelik durumları.</p>
                </div>
                <button className="primary-btn gap-2" onClick={handleNewCustomerClick}>
                    <Plus size={16} />
                    <span>Yeni Müşteri</span>
                </button>
            </div>

            {/* KPI summary */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--space-md)]">
                {kpis.map((k) => (
                    <GlassCard key={k.label} className="p-[var(--space-md)]">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{k.label}</span>
                            <div
                                className="w-9 h-9 rounded-[12px] grid place-items-center shrink-0"
                                style={{ color: k.color, background: `color-mix(in srgb, ${k.color} 14%, transparent)` }}
                            >
                                <k.icon size={18} strokeWidth={2.2} />
                            </div>
                        </div>
                        <div className="text-xl font-black text-[var(--text-main)] mt-1">{k.value}</div>
                    </GlassCard>
                ))}
            </div>

            {/* Search */}
            <div className="search-pill max-w-[340px]">
                <Search size={16} className="text-[var(--text-muted)]" />
                <input
                    type="text"
                    placeholder="Müşteri ara..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Table */}
            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading === "loading" ? (
                        <div className="p-12 text-center text-[var(--text-muted)] font-medium">
                            Yükleniyor...
                        </div>
                    ) : (
                        <table className="w-full border-collapse text-left text-[0.85rem]">
                            <thead>
                                <tr className="border-b border-[var(--glass-border)] bg-black/5">
                                    {["Müşteri", "Plan", "Storage", "Etkinlik", "Durum", "Katılım", "İşlemler"].map((h) => (
                                        <th
                                            key={h}
                                            className="p-[12px_16px] text-[0.72rem] uppercase tracking-wide text-[var(--text-muted)] font-bold whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => {
                                    const pct = Math.min(100, Math.round(((c.used || 0) / (c.limit || 5)) * 100));
                                    const barColor = pct >= 90 ? "var(--accent-red)" : "var(--accent-gradient)";
                                    return (
                                        <tr key={c.id} className="border-b border-[var(--glass-border)] theme-card-hover">
                                            {/* Müşteri */}
                                            <td className="p-[12px_16px]">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-9 h-9 rounded-[10px] grid place-items-center shrink-0 font-bold text-[0.8rem]"
                                                        style={{
                                                            color: "var(--color-blue-dark)",
                                                            background: "color-mix(in srgb, var(--color-blue-dark) 14%, transparent)",
                                                        }}
                                                    >
                                                        {(c.name || "XM").slice(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <strong className="block leading-tight">{c.name}</strong>
                                                        <small className="text-[var(--text-muted)] text-[0.76rem]">{c.sector}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Plan */}
                                            <td className="p-[12px_16px]">
                                                <Badge text={c.plan} color={PLAN_COLOR[c.plan]} />
                                            </td>
                                            {/* Storage */}
                                            <td className="p-[12px_16px] min-w-[160px]">
                                                <div className="flex justify-between text-[0.76rem] mb-1">
                                                    <span className="text-[var(--text-main)] font-semibold">
                                                        {c.used} / {c.limit} GB
                                                    </span>
                                                    <span className="text-[var(--text-muted)]">%{pct}</span>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                                                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
                                                </div>
                                            </td>
                                            {/* Etkinlik */}
                                            <td className="p-[12px_16px] font-semibold whitespace-nowrap">{c.events}</td>
                                            {/* Durum */}
                                            <td className="p-[12px_16px]">
                                                <Badge text={c.status} color={STATUS_COLOR[c.status]} />
                                            </td>
                                            {/* Katılım */}
                                            <td className="p-[12px_16px] text-[var(--text-muted)] whitespace-nowrap">{fmtDate(c.joined)}</td>
                                            {/* İşlemler */}
                                            <td className="p-[12px_16px] whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleEditClick(c)}
                                                        title="Müşteriyi Düzenle"
                                                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 cursor-pointer transition-colors"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(c.id, c.name)}
                                                        title="Müşteriyi Sil"
                                                        className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-[var(--accent-red)] flex items-center justify-center border border-red-500/20 cursor-pointer transition-colors"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                                            Sonuç bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </GlassCard>

            {/* Müşteri Ekleme/Düzenleme Modalı */}
            <GlassModal
                open={modalOpen}
                onClose={resetForm}
                title={editingCustomer ? "Müşteri Düzenle" : "Yeni Müşteri Ekle"}
                subtitle={editingCustomer ? "İşletme limitlerini ve abonelik detaylarını güncelleyin." : "Snapmatch AI platformuna yeni bir işletme (tenant) kaydı tanımlayın."}
                icon={Building2}
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4 text-white">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-200">İşletme Adı</label>
                        <input
                            type="text"
                            required
                            placeholder="Örn. Kadraj Ajans"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full glass-input-distinct rounded-[14px] p-3 text-xs outline-none focus:border-blue-500 text-white"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-slate-200">Sektör / Çalışma Alanı</label>
                        <select
                            value={form.sector}
                            onChange={(e) => setForm({ ...form, sector: e.target.value })}
                            className="w-full glass-input-distinct rounded-[14px] p-3 text-xs outline-none cursor-pointer text-white"
                        >
                            {[
                                "Düğün & Etkinlik",
                                "Düğün Fotoğrafçılığı",
                                "Stüdyo & Portre",
                                "Kurumsal Etkinlik",
                                "Mezuniyet & Tören",
                                "Festival & Konser",
                                "Genel / Diğer"
                            ].map(opt => (
                                <option key={opt} value={opt} className="bg-[#151c2c] text-white">{opt}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-200">Abonelik Planı</label>
                            <select
                                value={form.plan}
                                onChange={(e) => setForm({ ...form, plan: e.target.value })}
                                className="w-full glass-input-distinct rounded-[14px] p-3 text-xs outline-none cursor-pointer text-white"
                            >
                                <option value="Free" className="bg-[#151c2c] text-white">Free (5 GB)</option>
                                <option value="Pro" className="bg-[#151c2c] text-white">Pro (100 GB)</option>
                                <option value="Enterprise" className="bg-[#151c2c] text-white">Enterprise (500 GB)</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-slate-200">Hesap Durumu</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full glass-input-distinct rounded-[14px] p-3 text-xs outline-none cursor-pointer text-white"
                            >
                                <option value="Aktif" className="bg-[#151c2c] text-white">Aktif</option>
                                <option value="Deneme" className="bg-[#151c2c] text-white">Deneme</option>
                                <option value="Askıda" className="bg-[#151c2c] text-white">Askıda</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-white/10 pt-4 mt-2">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2.5 rounded-xl border border-white/15 bg-transparent hover:bg-white/5 text-xs text-slate-200 font-bold cursor-pointer"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="primary-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                            {saving ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
}