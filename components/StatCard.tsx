import type { ReactNode } from "react";

export default function StatCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="card h-full p-4 text-left transition-transform duration-300 hover:-translate-y-0.5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">{title}</div>
            <div className="mt-2 text-[var(--fg)]">{children}</div>
        </div>
    );
}