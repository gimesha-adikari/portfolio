"use client";

import * as React from "react";

export default function ReadingProgress() {
    const [pct, setPct] = React.useState(0);
    React.useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            const p = total > 0 ? (el.scrollTop / total) * 100 : 0;
            setPct(Math.max(0, Math.min(100, p)));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent">
            <div className="h-full bg-[var(--accent)] transition-[width] duration-150" style={{ width: `${pct}%` }} />
        </div>
    );
}
