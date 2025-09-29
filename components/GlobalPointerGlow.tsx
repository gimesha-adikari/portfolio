"use client";
import { useEffect, useRef } from "react";

export default function GlobalPointerGlow() {
    const raf = useRef<number | null>(null);

    useEffect(() => {
        const root = document.documentElement;

        let targetX = -100, targetY = -100;
        const onMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            root.style.setProperty("--mop", "0.6");
            if (raf.current == null) raf.current = requestAnimationFrame(tick);
        };
        const onLeave = () => {
            root.style.setProperty("--mop", "0");
        };

        const tick = () => {
            raf.current = null;
            root.style.setProperty("--mx", `${targetX}px`);
            root.style.setProperty("--my", `${targetY}px`);
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        window.addEventListener("mouseleave", onLeave);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseleave", onLeave);
            if (raf.current) cancelAnimationFrame(raf.current);
        };
    }, []);

    return null;
}
