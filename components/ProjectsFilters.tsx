"use client";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    buildLanguageFilterOptions,
    buildProjectFilterParams,
    parseProjectFilterParams,
    type ProjectFilterPatch,
    type SortKey,
} from "@/lib/project-filters";

export default function ProjectsFilters({
                                            initialQ,
                                            initialLang,
                                            initialSort,
                                            langs,
                                            counts,
                                            totalCount,
                                        }: {
    initialQ: string;
    initialLang: string;
    initialSort: SortKey;
    langs: string[];
    counts: Record<string, number>;
    totalCount: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [q, setQ] = useState(initialQ);
    const [lang, setLang] = useState(initialLang);
    const [sort, setSort] = useState<SortKey>(initialSort);

    const urlState = useMemo(
        () => parseProjectFilterParams(new URLSearchParams(searchParams.toString())),
        [searchParams],
    );

    useEffect(() => {
        setQ(urlState.q);
        setLang(urlState.lang);
        setSort(urlState.sort);
    }, [urlState.lang, urlState.q, urlState.sort]);

    const updateUrl = useCallback((next: ProjectFilterPatch) => {
        const params = buildProjectFilterParams(new URLSearchParams(searchParams.toString()), next);
        const url = params.toString() ? `${pathname}?${params}` : pathname;

        startTransition(() => {
            router.replace(url);
        });
    }, [pathname, router, searchParams]);

    useEffect(() => {
        const value = q.trim();
        if (value === urlState.q) return;

        const timeout = window.setTimeout(() => updateUrl({ q: value }), 280);
        return () => window.clearTimeout(timeout);
    }, [q, updateUrl, urlState.q]);

    function update(next: ProjectFilterPatch) {
        if (next.lang !== undefined) setLang(next.lang);
        if (next.sort !== undefined) setSort(next.sort);
        updateUrl(next);
    }

    const classRoot = "projects-archive-filters card p-3 rounded-xl flex flex-col gap-3 w-full";

    const langChips = useMemo(
        () => buildLanguageFilterOptions(langs, counts, totalCount),
        [counts, langs, totalCount],
    );

    function reset() {
        setQ("");
        setLang("");
        setSort("recent");
        updateUrl({ q: "", lang: "", sort: "recent" });
    }

    const queryId = "archive-filters-query";
    const sortId = "archive-filters-sort";

    return (
        <div className={classRoot}>
            <label htmlFor={queryId} className="text-xs font-medium text-[var(--muted)]">Search repository archive…</label>
            <div className="relative">
                <input
                    id={queryId}
                    type="search"
                    name="q"
                    placeholder="Search repository archive…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="gn-input min-h-11 h-11 w-full pr-8"
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
                                aria-pressed={active}
                                className={[
                                    "min-h-11 px-3 rounded-lg text-xs hairline",
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
                    <label htmlFor={sortId} className="mb-1 block text-xs font-medium text-[var(--muted)]">Sort repository archive by</label>
                    <div className="gn-select-wrapper w-full">
                        <select
                        id={sortId}
                        name="sort"
                        value={sort}
                        onChange={(e) => update({ sort: e.target.value as SortKey })}
                        className="gn-select min-h-11 h-11 w-full"
                    >
                        <option value="recent">Recently updated</option>
                        <option value="stars">Most stars</option>
                        <option value="name">Name (A–Z)</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-2 pt-1">
                {(q || lang || sort !== "recent") && (
                    <button type="button" onClick={reset} className="btn btn-text min-h-11 text-sm">
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
}
