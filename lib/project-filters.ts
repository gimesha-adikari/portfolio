export type SortKey = "recent" | "stars" | "name";

export type ProjectFilterState = {
    q: string;
    lang: string;
    sort: SortKey;
};

export type ProjectFilterPatch = Partial<ProjectFilterState>;

const SORT_KEYS: readonly SortKey[] = ["recent", "stars", "name"];

function isSortKey(value: string): value is SortKey {
    return SORT_KEYS.includes(value as SortKey);
}

export function parseProjectFilterParams(params: URLSearchParams): ProjectFilterState {
    const q = params.get("q")?.trim() ?? "";
    const lang = params.get("lang")?.trim() ?? "";
    const sort = params.get("sort") ?? "recent";

    return {
        q,
        lang,
        sort: isSortKey(sort) ? sort : "recent",
    };
}

export function buildProjectFilterParams(
    current: URLSearchParams,
    patch: ProjectFilterPatch,
): URLSearchParams {
    const next = new URLSearchParams(current);

    if (patch.q !== undefined) {
        const value = patch.q.trim();
        if (value) next.set("q", value);
        else next.delete("q");
    }

    if (patch.lang !== undefined) {
        const value = patch.lang.trim();
        if (value) next.set("lang", value);
        else next.delete("lang");
    }

    if (patch.sort !== undefined) {
        if (patch.sort === "recent") next.delete("sort");
        else next.set("sort", patch.sort);
    }

    return next;
}

export type LanguageFilterOption = {
    label: string;
    value: string;
    count: number;
};

export function buildLanguageFilterOptions(
    langs: readonly string[],
    counts: Readonly<Record<string, number>>,
    totalCount: number,
): LanguageFilterOption[] {
    return ["", ...langs].map((lang) => ({
        label: lang || "All",
        value: lang,
        count: lang ? counts[lang] ?? 0 : totalCount,
    }));
}
