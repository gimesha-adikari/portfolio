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
        <section aria-labelledby="projects-title" className="relative">
            <div className="hidden lg:block fixed left-4 top-[calc(var(--header-h,56px)+16px)] w-[280px] z-30">
                <ProjectsFilters initialQ={q} initialLang={lang} initialSort={sort} langs={langs} counts={counts} layout="card" />
            </div>

            <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                    <h1 id="projects-title" className="text-3xl md:text-4xl font-bold tracking-tight">All Projects</h1>
                    <p className="mt-1 text-[var(--muted)]">
                        {count} project{count === 1 ? "" : "s"}
                        {q && <> • search: <span className="font-medium">“{q}”</span></>}
                        {lang && <> • language: <span className="font-medium">{lang}</span></>}
                    </p>
                </div>

                <div className="w-full sm:max-w-xl lg:hidden">
                    <ProjectsFilters initialQ={q} initialLang={lang} initialSort={sort} langs={langs} counts={counts} layout="bar" />
                </div>
            </div>

            <div className="mt-6" />

            {count > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {list.map((repo) => {
                        const key =
                            (repo as any).id ??
                            (repo as any).full_name ??
                            (repo as any).fullName ??
                            ((repo as any).owner ? `${(repo as any).owner}/${repo.name}` : undefined) ??
                            repo.name;
                        return (
                            <Reveal key={key}>
                                <RepoCard repo={repo} />
                            </Reveal>
                        );
                    })}
                </div>
            ) : (
                <div className="card p-6 mt-4">
                    <p className="text-[var(--muted)]">No projects match your filters. Try clearing the search or language.</p>
                    <div className="mt-3 flex gap-2">
                        <a href="/projects" className="btn btn-ghost text-sm">Clear filters</a>
                        <a href="/projects?sort=stars" className="btn btn-text text-sm">Sort by stars</a>
                    </div>
                </div>
            )}
        </section>
    );
}
