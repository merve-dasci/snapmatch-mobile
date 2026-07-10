import React, { useState } from "react";
import GlassCard from "../components/ui/GlassCard";
import { Building2, Plus, Search, Users, TrendingUp, HardDrive } from "lucide-react";

const CUSTOMERS = [
    { id: "ws_1", name: "Kadraj Kolektif", sector: "Düğün & Etkinlik", plan: "Pro", used: 68, limit: 100, events: 12, status: "Aktif", joined: "2025-11-02" },
    { id: "ws_2", name: "Momento Wedding", sector: "Düğün Fotoğrafçılığı", plan: "Enterprise", used: 240, limit: 500, events: 34, status: "Aktif", joined: "2025-08-14" },
    { id: "ws_3", name: "Işık Fotoğraf Stüdyosu", sector: "Stüdyo & Portre", plan: "Pro", used: 41, limit: 100, events: 8, status: "Aktif", joined: "2026-01-20" },
    { id: "ws_4", name: "EventPro Ajans", sector: "Kurumsal Etkinlik", plan: "Enterprise", used: 380, limit: 500, events: 51, status: "Aktif", joined: "2025-06-03" },
    { id: "ws_5", name: "Anı Yakala Prodüksiyon", sector: "Mezuniyet & Tören", plan: "Free", used: 4.2, limit: 5, events: 2, status: "Deneme", joined: "2026-06-28" },
    { id: "ws_6", name: "Piksel Düğün Hikayeleri", sector: "Düğün Fotoğrafçılığı", plan: "Pro", used: 92, limit: 100, events: 15, status: "Aktif", joined: "2025-12-11" },
    { id: "ws_7", name: "Festival Lens", sector: "Festival & Konser", plan: "Enterprise", used: 460, limit: 500, events: 40, status: "Askıda", joined: "2025-09-19" },
    { id: "ws_8", name: "Genç Kare Fotoğraf", sector: "Stüdyo & Portre", plan: "Free", used: 1.1, limit: 5, events: 1, status: "Deneme", joined: "2026-07-01" },
];

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
    const [query, setQuery] = useState("");

    const filtered = CUSTOMERS.filter((c) =>
        (c.name + " " + c.sector).toLowerCase().includes(query.trim().toLowerCase())
    );

    // KPI'lar veriden türetilir
    const total = CUSTOMERS.length;
    const active = CUSTOMERS.filter((c) => c.status === "Aktif").length;
    const trial = CUSTOMERS.filter((c) => c.status === "Deneme").length;
    const usedSum = CUSTOMERS.reduce((s, c) => s + c.used, 0);
    const limitSum = CUSTOMERS.reduce((s, c) => s + c.limit, 0);

    const kpis = [
        { label: "Toplam Müşteri", value: total, icon: Building2, color: "var(--color-blue-dark)" },
        { label: "Aktif", value: active, icon: TrendingUp, color: "var(--accent-green)" },
        { label: "Deneme", value: trial, icon: Users, color: "var(--accent-yellow)" },
        { label: "Toplam Storage", value: `${fmtGB(Math.round(usedSum))} / ${fmtGB(limitSum)}`, icon: HardDrive, color: "var(--color-blue-medium)" },
    ];

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="page-head flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h1 className="font-extrabold">Müşteriler</h1>
                    <p>Snapmatch AI platformunu kullanan işletmeler (tenant) ve abonelik durumları.</p>
                </div>
                <button className="primary-btn gap-2" onClick={() => alert("Demo: yeni müşteri ekleme")}>
                    <Plus size={16} />
                    <span>Yeni Müşteri</span>
                </button>
            </div>

            {/* KPI summary */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-[var(--space-md)]">
                {kpis.map((k) => (
                    <GlassCard key={k.label} className="p-[var(--space-md)]">
                        <div className="flex items-center justify-between">
                            <span className="kpi-label">{k.label}</span>
                            <div
                                className="w-9 h-9 rounded-[12px] grid place-items-center shrink-0"
                                style={{ color: k.color, background: `color-mix(in srgb, ${k.color} 14%, transparent)` }}
                            >
                                <k.icon size={18} strokeWidth={2.2} />
                            </div>
                        </div>
                        <div className="kpi-value">{k.value}</div>
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
                    <table className="w-full border-collapse text-left text-[0.85rem]">
                        <thead>
                            <tr className="border-b border-[var(--glass-border)] bg-black/5">
                                {["Müşteri", "Plan", "Storage", "Etkinlik", "Durum", "Katılım"].map((h) => (
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
                                const pct = Math.min(100, Math.round((c.used / c.limit) * 100));
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
                                                    {c.name.slice(0, 2).toUpperCase()}
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
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                                        Sonuç bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}