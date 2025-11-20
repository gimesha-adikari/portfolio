"use client";

import * as React from "react";
import type { TOCItem } from "@/lib/toc";

export default function TOC({ items }: { items: TOCItem[] }) {
    const [active, setActive] = React.useState<string | null>(items?.[0]?.id ?? null);

    React.useEffect(() => {
        const headings = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
        if (headings.length === 0) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const vis = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => (a.target as HTMLElement).offsetTop - (b.target as HTMLElement).offsetTop);
                if (vis[0]) setActive((vis[0].target as HTMLElement).id);
            },
            { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
        );

        headings.forEach((h) => obs.observe(h));
        return () => obs.disconnect();
    }, [items]);

    if (!items?.length) return null;

    return (
        <nav className="text-sm">
            <p className="mb-2 font-medium text-[var(--muted)]">On this page</p>
            <ul className="space-y-1">
                {items.map((i) => (
                    <li key={i.id} className={i.depth > 2 ? "pl-3" : ""}>
                        <a
                            href={`#${i.id}`}
                            className={
                                "block rounded px-2 py-1 hover:bg-[var(--surface)] " +
                                (active === i.id ? "bg-[var(--surface)] text-[var(--fg)]" : "text-[var(--muted)]")
                            }
                        >
                            {i.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
