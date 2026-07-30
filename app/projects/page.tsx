// file: app/projects/page.tsx
import Link from "next/link";
import { fetchAllRepos, type Repo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { orderReposWithPinned } from "@/lib/pins";
import Reveal from "@/components/Reveal";
import ProjectsFilters from "@/components/ProjectsFilters";

export const metadata = { title: "Projects" };

type SortKey = "recent" | "stars" | "name";

const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

function sortRepos(repos: Repo[], by: SortKey) {
    switch (by) {
        case "stars":
            return [...repos].sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
        case "name":
            return [...repos].sort((a, b) => collator.compare(a.name, b.name));
        case "recent":
        default:
            return [...repos].sort((a, b) => {
                const bt = new Date(b.pushedAt ?? b.updatedAt ?? 0).getTime();
                const at = new Date(a.pushedAt ?? a.updatedAt ?? 0).getTime();
                return bt - at;
            });
    }
}

function uniqueLanguages(repos: Repo[]) {
    const set = new Set<string>();
    for (const r of repos) if (r.language) set.add(r.language);
    return Array.from(set).sort((a, b) => collator.compare(a, b));
}

function languageCounts(repos: Repo[]) {
    const map = new Map<string, number>();
    for (const r of repos) if (r.language) map.set(r.language, (map.get(r.language) ?? 0) + 1);
    return Object.fromEntries([...map.entries()].sort((a, b) => collator.compare(a[0], b[0])));
}

export default async function ProjectsPage({
                                               searchParams,
                                           }: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const lang = (params.lang ?? "").trim();
    const sort = ((params.sort as SortKey) || "recent") as SortKey;

    const repos = (await fetchAllRepos().catch(() => [])) as Repo[];
    const ordered = orderReposWithPinned(repos);

    const langs = uniqueLanguages(ordered);
    const counts = languageCounts(ordered);

    const filtered = ordered.filter((r) => {
        const matchesQ =
            !q ||
            r.name.toLowerCase().includes(q.toLowerCase()) ||
            (r.description ?? "").toLowerCase().includes(q.toLowerCase());
        const matchesLang = !lang || (r.language ?? "") === lang;
        return matchesQ && matchesLang;
    });

    const list = sortRepos(filtered, sort);
    const count = list.length;

    return (
        <section aria-labelledby="projects-title" className="relative hero-glow">
            {/* Ambient Background Glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-10vh] h-[40vh] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent),transparent_85%)_0%,transparent_70%)] opacity-50"
            />

            <div className="container-xl max-w-7xl mx-auto pt-10 md:pt-14 pb-20">
                {/* Flex layout for Sticky Sidebar + Main Content */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Desktop Sidebar: Sticky instead of Fixed ensures it respects the container max-width */}
                    <aside className="hidden lg:block sticky top-[calc(var(--header-h,56px)+32px)] w-[280px] shrink-0 z-10">
                        <ProjectsFilters initialQ={q} initialLang={lang} initialSort={sort} langs={langs} counts={counts} layout="card" />
                    </aside>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full min-w-0 space-y-8">

                        {/* Header & Mobile Filters */}
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 id="projects-title" className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
                                    Projects
                                </h1>
                                <p className="mt-2 text-[var(--muted)] leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span>Selected work and experiments</span>
                                    {count > 0 && <span className="opacity-50">•</span>}
                                    {count > 0 && <span>{count} project{count === 1 ? "" : "s"}</span>}
                                    {q && <span className="opacity-50">•</span>}
                                    {q && <span>search: <span className="font-medium text-[var(--fg)]">“{q}”</span></span>}
                                    {lang && <span className="opacity-50">•</span>}
                                    {lang && <span>language: <span className="font-medium text-[var(--fg)]">{lang}</span></span>}
                                </p>
                            </div>

                            {/* Mobile Filters (Hidden on Desktop) */}
                            <div className="w-full sm:max-w-xl lg:hidden">
                                <ProjectsFilters initialQ={q} initialLang={lang} initialSort={sort} langs={langs} counts={counts} layout="bar" />
                            </div>
                        </div>

                        {/* Projects Grid */}
                        {count > 0 ? (
                            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                                {list.map((repo, i) => {
                                    // Clean TypeScript key extraction
                                    const key = repo.fullName || repo.name;
                                    return (
                                        <Reveal key={key} delay={(i % 10) * 0.05}>
                                            <RepoCard repo={repo} />
                                        </Reveal>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Premium Empty State */
                            <Reveal>
                                <div className="card flex flex-col items-center justify-center p-12 text-center border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm rounded-[14px]">
                                    <div className="size-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
                                        <span className="icon-[tabler--search-off] size-8 text-[var(--muted)]" aria-hidden />
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--fg)] mb-2">No projects found</h3>
                                    <p className="text-[var(--muted)] max-w-sm mb-6">
                                        We couldn't find any projects matching your current filters. Try adjusting your search term or language.
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        <Link href="/projects" className="rounded-lg bg-[var(--accent)] text-[var(--bg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                                            Clear all filters
                                        </Link>
                                        <Link href="/projects?sort=stars" className="rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--accent)] transition-colors">
                                            Sort by stars
                                        </Link>
                                    </div>
                                </div>
                            </Reveal>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}