"use client";
import { useEffect, useState } from "react";

const options = [
    { key: "violet", label: "Violet" },
    { key: "ocean", label: "Ocean" },
];

export default function AccentSwitcher() {
    const [accent, setAccent] = useState<string>(() => {
        if (typeof document !== "undefined") {
            return document.documentElement.getAttribute("data-accent") || "violet";
        }
        return "violet";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-accent", accent);
        try {
            localStorage.setItem("accent", accent);
        } catch {}
    }, [accent]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("accent");
            if (saved) setAccent(saved);
        } catch {}
    }, []);

    return (
        <div className="hairline rounded-xl bg-[var(--surface)]/80 backdrop-blur px-2 py-1.5 flex items-center gap-1">
            {options.map((o) => (
                <button
                    key={o.key}
                    type="button"
                    onClick={() => setAccent(o.key)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition ${
                        accent === o.key
                            ? "bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] outline outline-1 outline-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
                            : "hover:bg-[color-mix(in_oklab,var(--surface)_90%,var(--accent)_10%)]"
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}
