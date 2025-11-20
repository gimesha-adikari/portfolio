"use client";
import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type SortKey = "recent" | "stars" | "name";

export default function ProjectsFilters({
                                            initialQ,
                                            initialLang,
                                            initialSort,
                                            langs,
                                            counts,
                                            layout = "bar",
                                        }: {
    initialQ: string;
    initialLang: string;
    initialSort: SortKey;
    langs: string[];
    counts: Record<string, number>;
    layout?: "bar" | "card";
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [q, setQ] = useState(initialQ);
    const [lang, setLang] = useState(initialLang);
    const [sort, setSort] = useState<SortKey>(initialSort);

    function update(next: Partial<{ q: string; lang: string; sort: SortKey }>, replace = true) {
        const params = new URLSearchParams(searchParams?.toString());
        if ("q" in next) {
            const v = (next.q ?? "").trim();
            v ? params.set("q", v) : params.delete("q");
            setQ(v);
        }
        if ("lang" in next) {
            const v = next.lang ?? "";
            v ? params.set("lang", v) : params.delete("lang");
            setLang(v);
        }
        if ("sort" in next) {
            const v = next.sort ?? "recent";
            v === "recent" ? params.delete("sort") : params.set("sort", v);
            setSort(v);
        }
        startTransition(() => {
            const url = params.toString() ? `${pathname}?${params}` : pathname;
            replace ? router.replace(url) : router.push(url);
        });
    }

    const classRoot =
        layout === "card"
            ? "card p-3 rounded-xl flex flex-col gap-3 w-full"
            : "card p-3 rounded-xl flex flex-col gap-3 w-full";

    const langChips = useMemo(
        () =>
            ["", ...langs].map((l) => ({
                label: l || "All",
                value: l,
                count: l ? counts[l] ?? 0 : Object.values(counts).reduce((a, b) => a + b, 0),
            })),
        [langs, counts]
    );

    let typingTimer: any;
    function onType(value: string) {
        setQ(value);
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => update({ q: value }), 280);
    }

    function reset() {
        setQ("");
        setLang("");
        setSort("recent");
        startTransition(() => router.replace(pathname));
    }

    return (
        <div className={classRoot}>
            <label htmlFor="q" className="text-xs font-medium text-[var(--muted)]">Search projects…</label>
            <div className="relative">
                <input
                    id="q"
                    type="search"
                    name="q"
                    placeholder="Search projects…"
                    defaultValue={q}
                    onChange={(e) => onType(e.target.value)}
                    className="gn-input w-full pr-8"
                />
                <span
                    aria-hidden
                    className={`icon-[tabler--search] size-4 absolute right-2 top-1/2 -translate-y-1/2 ${
                        isPending ? "animate-pulse" : "opacity-70"
                    }`}
                />
            </div>

            <div>
                <div className="mb-1 block text-xs font-medium text-[var(--muted)]">Language</div>
                <div className="flex flex-wrap gap-1.5">
                    {langChips.map((chip) => {
                        const active = (lang || "") === chip.value;
                        return (
                            <button
                                key={chip.label}
                                type="button"
                                aria-current={active ? "true" : undefined}
                                className={[
                                    "px-2.5 py-1 rounded-lg text-xs hairline",
                                    active
                                        ? "bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] outline outline-1 outline-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
                                        : "hover:bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)]",
                                ].join(" ")}
                                onClick={() => update({ lang: chip.value })}
                            >
                                {chip.label}
                                <span className="ms-1 text-[var(--muted)]">{chip.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label htmlFor="sort" className="mb-1 block text-xs font-medium text-[var(--muted)]">Sort by</label>
                <div className="gn-select-wrapper w-full">
                    <select
                        id="sort"
                        name="sort"
                        defaultValue={sort}
                        onChange={(e) => update({ sort: e.target.value as SortKey })}
                        className="gn-select w-full"
                    >
                        <option value="recent">Recently updated</option>
                        <option value="stars">Most stars</option>
                        <option value="name">Name (A–Z)</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => update({ q, lang, sort })} className="btn btn-ghost text-sm">
                    Apply
                </button>
                {(q || lang || sort !== "recent") && (
                    <button type="button" onClick={reset} className="btn btn-text text-sm">
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
