// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
}
function setCookie(name: string, value: string) {
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const [light, setLight] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fromCookie = getCookie("theme");
        const fromLS = (() => {
            try { return localStorage.getItem("theme"); } catch { return null; }
        })();
        const systemDark =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initial = (fromCookie || fromLS || (systemDark ? "dark" : "light")) as "light" | "dark";
        document.documentElement.dataset.theme = initial;
        try { localStorage.setItem("theme", initial); } catch {}
        setCookie("theme", initial);
        setLight(initial === "light");
    }, []);

    if (!mounted) return null;

    const toggle = () => {
        const next = light ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch {}
        setCookie("theme", next);
        setLight(!light);
    };

    return (
        <button onClick={toggle} className="btn btn-ghost focus-ring" aria-label="Toggle theme">
            {light ? "🌞" : "🌙"}
        </button>
    );
}
