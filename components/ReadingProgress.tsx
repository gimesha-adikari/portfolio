"use client";
import { useEffect, useState } from "react";

export default function ReadingProgress() {
    const [p, setP] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const max = h.scrollHeight - h.clientHeight;
            setP(Math.max(0, Math.min(1, (h.scrollTop || 0) / (max || 1))));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div aria-hidden className="fixed top-0 left-0 right-0 h-1 z-50">
            <div
                className="h-full"
                style={{
                    width: `${p * 100}%`,
                    background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
                    transition: "width .1s linear",
                }}
            />
        </div>
    );
}
