import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GlassCard from "../components/ui/GlassCard";
import { fetchRoles } from "../features/team/teamSlice";
import {
    ShieldCheck,
    Camera,
    CalendarCheck,
    UploadCloud,
    UserRound,
    BrainCircuit,
    CheckCircle2,
} from "lucide-react";
import { useAdaptive } from "../context/AdaptiveContext";

const iconMap = {
  "platform-admin": ShieldCheck,
  "business-admin": Camera,
  "event-owner": CalendarCheck,
  "uploader": UploadCloud,
  "guest": UserRound,
  "ai-service": BrainCircuit
};

export default function SystemRoles() {
    const { isMobile } = useAdaptive();
    const dispatch = useDispatch();
    const roles = useSelector((state) => state.team.roles) || [];

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    if (isMobile) {
        return (
            <div className="flex flex-col gap-4 pt-2 pb-16">
                <div className="flex flex-col gap-3">
                    {roles.map((r, idx) => {
                        const Icon = iconMap[r.id] || ShieldCheck;
                        return (
                            <div key={idx} className="glass-panel p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-xl grid place-items-center"
                                        style={{
                                            color: r.color,
                                            background: `color-mix(in srgb, ${r.color} 15%, transparent)`,
                                        }}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold text-[var(--text-main)] m-0 leading-tight">{r.title}</h3>
                                        <span className="text-[9px] text-[var(--text-muted)] mt-1 m-0 block">{r.summary}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5 pt-2 border-t border-[var(--glass-border)]/30 text-[10px] text-[var(--text-muted)] leading-relaxed">
                                    {r.permissions.map((p, pIdx) => (
                                        <div key={pIdx} className="flex items-start gap-1.5">
                                            <span className="text-blue-500">•</span>
                                            <span>{p}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[var(--space-lg)]">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--space-lg)]">
                {roles.map((role) => {
                    const Icon = iconMap[role.id] || ShieldCheck;
                    return (
                        <GlassCard key={role.id} className="p-[var(--space-lg)]">
                            {/* Card header: icon tile + title + type tag */}
                            <div className="flex items-start gap-3.5">
                                <div
                                    className="w-12 h-12 rounded-[14px] grid place-items-center shrink-0"
                                    style={{
                                        color: role.color,
                                        background: `color-mix(in srgb, ${role.color} 15%, transparent)`,
                                    }}
                                >
                                    <Icon size={22} strokeWidth={2.2} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-[1.02rem] font-bold m-0 leading-tight">
                                            {role.title}
                                        </h2>
                                        <span
                                            className="px-2 py-[3px] rounded-full text-[0.68rem] font-bold uppercase tracking-wide shrink-0"
                                            style={{
                                                color: role.color,
                                                background: `color-mix(in srgb, ${role.color} 13%, transparent)`,
                                            }}
                                        >
                                            {role.tag}
                                        </span>
                                    </div>
                                    <p className="mt-1 mb-0 text-[0.85rem] text-[var(--text-muted)]">
                                        {role.summary}
                                    </p>
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
                                <span className="text-[0.72rem] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                                    MVP Yetkileri / Davranışı
                                </span>
                                <ul className="mt-2.5 flex flex-col gap-2 list-none p-0 m-0">
                                    {role.permissions.map((perm, idx) => (
                                        <li key={idx} className="flex gap-2 items-start">
                                            <CheckCircle2
                                                size={15}
                                                className="text-[var(--accent-green)] shrink-0 mt-[2px]"
                                            />
                                            <span className="text-[0.85rem] leading-[1.4] text-[var(--text-main)]">
                                                {perm}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </div>
    );
}