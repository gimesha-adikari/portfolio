import Link from "next/link";
import { fetchAllRepos, type Repo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { PortfolioProjectCard } from "@/components/PortfolioProjectCard";
import { orderReposWithPinned } from "@/lib/pins";
import Reveal from "@/components/Reveal";
import MotionSection from "@/components/MotionSection";
import ProjectsFilters from "@/components/ProjectsFilters";
import { mapRepositoryFacts } from "@/lib/portfolio-repository-facts";
import { filterArchiveRepositories, parseProjectFilterParams, type SortKey } from "@/lib/project-filters";
import {
    getAllPortfolioProjects,
    getCuratedRepositoryNames,
    type RepositoryFacts,
} from "@/lib/portfolio-projects";
import { buildRouteMetadata } from "@/lib/route-metadata";

export const metadata = buildRouteMetadata({
    title: "Projects",
    description: "Selected portfolio-owned systems followed by a public repository archive.",
    path: "/projects",
    type: "website",
});

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
    const filterParams = new URLSearchParams();
    if (params.q) filterParams.set("q", params.q);
    if (params.lang) filterParams.set("lang", params.lang);
    if (params.sort) filterParams.set("sort", params.sort);
    const { q, lang, sort } = parseProjectFilterParams(filterParams);

    const curatedProjects = getAllPortfolioProjects();
    const repos = (await fetchAllRepos().catch(() => [])) as Repo[];
    const ordered = orderReposWithPinned(repos);
    const curatedRepositoryNames = getCuratedRepositoryNames();
    const archive = ordered.filter((repo) => !curatedRepositoryNames.has(repo.name));
    const factsBySlug = new Map<string, readonly RepositoryFacts[]>(
        curatedProjects.map((project) => [
            project.slug,
            project.repositories.flatMap((repository) => {
                const repo = repos.find((candidate) => candidate.name === repository.name);
                const facts = repo ? mapRepositoryFacts(repository, repo) : null;
                return facts ? [facts] : [];
            }),
        ]),
    );

    const featuredProjects = curatedProjects.filter((project) => project.featured);
    const secondaryProjects = curatedProjects.filter((project) => !project.featured);

    const langs = uniqueLanguages(archive);
    const counts = languageCounts(archive);

    const filtered = filterArchiveRepositories(archive, { q, lang });

    const list = sortRepos(filtered, sort);
    const count = list.length;
    const totalCount = curatedProjects.length + count;

    return (
        <section aria-labelledby="projects-title" className="relative hero-glow">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-10vh] h-[40vh] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent),transparent_85%)_0%,transparent_70%)] opacity-50"
            />

            <div className="container-xl max-w-7xl mx-auto pt-10 md:pt-14 pb-20">
                <div className="space-y-8">

                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 id="projects-title" className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--fg)]">
                                    Projects
                                </h1>
                                <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 text-[var(--muted)] leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
                                    <span>Selected work and experiments</span>
                                    {totalCount > 0 && <span className="opacity-50">•</span>}
                                    {totalCount > 0 && <span>{curatedProjects.length} curated project{curatedProjects.length === 1 ? "" : "s"}{count > 0 ? ` · ${count} archive entr${count === 1 ? "y" : "ies"}` : ""}</span>}
                                    {q && <span className="opacity-50">•</span>}
                                    {q && <span>search: <span className="font-medium text-[var(--fg)]">“{q}”</span></span>}
                                    {lang && <span className="opacity-50">•</span>}
                                    {lang && <span>language: <span className="font-medium text-[var(--fg)]">{lang}</span></span>}
                                </p>
                            </div>

                        </div>

                        {featuredProjects.length > 0 && (
                            <section aria-labelledby="curated-projects-title" className="space-y-4">
                                <div>
                                    <h2 id="curated-projects-title" className="text-xl font-bold text-[var(--fg)]">
                                        Curated projects
                                    </h2>
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        Portfolio-owned identity, narrative, order, and repository grouping.
                                    </p>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                                    {featuredProjects.map((project, index) => (
                                        <Reveal key={project.slug} delay={(index % 10) * 0.05}>
                                            <PortfolioProjectCard project={project} facts={factsBySlug.get(project.slug)} />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>
                        )}

                        {secondaryProjects.length > 0 && (
                            <section aria-labelledby="secondary-projects-title" className="space-y-4">
                                <div>
                                    <h2 id="secondary-projects-title" className="text-xl font-bold text-[var(--fg)]">
                                        Experiments and secondary projects
                                    </h2>
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        Additional portfolio-owned experiments and technical lab work with direct project pages.
                                    </p>
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                                    {secondaryProjects.map((project, index) => (
                                        <Reveal key={project.slug} delay={((featuredProjects.length + index) % 10) * 0.05}>
                                            <PortfolioProjectCard
                                                project={project}
                                                facts={factsBySlug.get(project.slug)}
                                                variant="secondary"
                                            />
                                        </Reveal>
                                    ))}
                                </div>
                            </section>
                        )}

                        <MotionSection className="projects-archive-motion" y={8}>
                            <section aria-labelledby="repository-archive-title" className="projects-archive-section space-y-4">
                                <div>
                                    <h2 id="repository-archive-title" className="text-xl font-bold text-[var(--fg)]">
                                        Labs / repository archive
                                    </h2>
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        Public repositories not assigned to a curated project. They do not define portfolio identity or featured status.
                                    </p>
                                </div>

                            <div className="w-full sm:max-w-xl">
                                <ProjectsFilters initialQ={q} initialLang={lang} initialSort={sort} langs={langs} counts={counts} totalCount={archive.length} />
                            </div>

                            {count > 0 ? (
                                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
                                    {list.map((repo, i) => {
                                        const key = repo.fullName || repo.name;
                                        return (
                                            <Reveal
                                                key={key}
                                                className="projects-archive-card__reveal"
                                                delay={(i % 10) * 0.04}
                                                duration={0.4}
                                                fade
                                                y={8}
                                            >
                                                <RepoCard repo={repo} featured={false} variant="archive" />
                                            </Reveal>
                                        );
                                    })}
                                </div>
                            ) : (
                                <Reveal>
                                    <div className="card flex flex-col items-center justify-center p-12 text-center border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm rounded-[14px]">
                                        <div className="size-16 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
                                            <span className="icon-[tabler--search-off] size-8 text-[var(--muted)]" aria-hidden />
                                        </div>
                                        <h3 className="text-lg font-semibold text-[var(--fg)] mb-2">No archive entries found</h3>
                                        <p className="text-[var(--muted)] max-w-sm mb-6">
                                            We couldn't find any unassigned repositories matching the current filters.
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
                            </section>
                        </MotionSection>
                </div>
            </div>
        </section>
    );
}
