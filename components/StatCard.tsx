"use client";
import { useRef } from "react";

export default function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement | null>(null);

    const onMouseMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = ((y / r.height) - 0.5) * -4;
        const ry = ((x / r.width) - 0.5) * 4;
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
        el.style.setProperty("--gx", `${x}px`);
        el.style.setProperty("--gy", `${y}px`);
    };
    const reset = () => {
        const el = ref.current;
        if (!el) return;
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
        el.style.removeProperty("--gx");
        el.style.removeProperty("--gy");
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={reset}
            className="relative card px-4 py-3 text-left col-span-1 transition-transform will-change-transform"
            style={{
                transform: "perspective(800px) rotateX(var(--rx,0)) rotateY(var(--ry,0))",
            }}
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{
                    background:
                        "radial-gradient(200px 120px at var(--gx, -100px) var(--gy, -100px), color-mix(in oklab, var(--accent) 25%, transparent) 0%, transparent 60%)",
                    maskImage: "radial-gradient(180px 120px at var(--gx, -100px) var(--gy, -100px), black, transparent 70%)",
                }}
            />
            <div className="text-xs text-[var(--muted)]">{title}</div>
            <div className="mt-0.5">{children}</div>
        </div>
    );
}
