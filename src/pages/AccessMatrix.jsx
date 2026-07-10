import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { useAdaptive } from "../context/AdaptiveContext";
import { fetchAccessMatrix } from "../features/team/teamSlice";

// Google Doc "6.2 Rol Bazlı Erişim Matrisi" bölümünün uygulama içi karşılığı.
// Her hücre: metin + yetki seviyesi (full | limited | none).
const roles = [
    "Platform Yöneticisi",
    "İşletme Yöneticisi",
    "Etkinlik Sorumlusu",
    "Yükleyici",
    "Katılımcı",
];

const levelColor = {
    full: "var(--accent-green)",
    limited: "var(--accent-yellow)",
    none: "var(--text-muted)",
};

const legend = [
    { l: "full", label: "Tam yetki" },
    { l: "limited", label: "Sınırlı / görüntüleme" },
    { l: "none", label: "Yetki yok" },
];

function Dot({ level }) {
    return (
        <span
            className="w-[7px] h-[7px] rounded-full shrink-0"
            style={{ background: levelColor[level] }}
        />
    );
}

export default function AccessMatrix() {
    const { isMobile } = useAdaptive();
    const dispatch = useDispatch();
    const rows = useSelector((state) => state.team.accessMatrix) || [];

    useEffect(() => {
        dispatch(fetchAccessMatrix());
    }, [dispatch]);

    if (rows.length === 0) {
        return <div className="p-10 text-center text-[var(--text-muted)] font-semibold">Yükleniyor...</div>;
    }

    if (isMobile) {
        return (
            <div className="flex flex-col gap-4 pt-2 pb-16">
                {/* Legend */}
                <div className="glass-panel p-3.5 flex justify-around text-[10px] bg-[var(--glass-bg-strong)]">
                    {legend.map(item => (
                        <div key={item.l} className="flex items-center gap-1.5 font-bold">
                            <Dot level={item.l} />
                            <span className="text-[var(--text-muted)]">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Modules List */}
                <div className="flex flex-col gap-3">
                    {rows.map((row, idx) => (
                        <div key={idx} className="glass-panel p-4 flex flex-col gap-2.5">
                            <h3 className="text-xs font-black text-[var(--text-main)] m-0 pb-2 border-b border-[var(--glass-border)]/30">{row.module}</h3>
                            <div className="flex flex-col gap-2 text-[10px]">
                                {row.cells.map((cell, cIdx) => (
                                    <div key={cIdx} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                                        <span className="text-[var(--text-muted)] font-semibold">{roles[cIdx]}:</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-[var(--text-main)]">{cell.t}</span>
                                            <Dot level={cell.l} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">

            {/* Legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
                {legend.map((item) => (
                    <div key={item.l} className="flex items-center gap-2">
                        <Dot level={item.l} />
                        <span className="text-[0.82rem] text-[var(--text-muted)] font-semibold">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-[0.85rem]">
                        <thead>
                            <tr className="border-b border-[var(--glass-border)] bg-black/5">
                                <th className="sticky left-0 z-10 bg-[var(--glass-bg-strong)] p-[12px_16px] text-[0.72rem] uppercase tracking-wide text-[var(--text-muted)] font-bold whitespace-nowrap">
                                    Modül
                                </th>
                                {roles.map((role) => (
                                    <th
                                        key={role}
                                        className="p-[12px_16px] text-[0.72rem] uppercase tracking-wide text-[var(--text-muted)] font-bold whitespace-nowrap"
                                    >
                                        {role}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr
                                    key={row.module}
                                    className="border-b border-[var(--glass-border)] theme-card-hover"
                                >
                                    <td className="sticky left-0 z-10 bg-[var(--glass-bg-strong)] p-[12px_16px] font-bold whitespace-nowrap">
                                        {row.module}
                                    </td>
                                    {row.cells.map((cell, idx) => (
                                        <td key={idx} className="p-[12px_16px] align-top">
                                            <span className="inline-flex items-center gap-2">
                                                <Dot level={cell.l} />
                                                <span
                                                    className={
                                                        cell.l === "none"
                                                            ? "text-[var(--text-muted)]"
                                                            : "text-[var(--text-main)]"
                                                    }
                                                >
                                                    {cell.t}
                                                </span>
                                            </span>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}