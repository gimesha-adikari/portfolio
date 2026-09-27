import Link from "next/link";
import { fetchAllRepos, fetchRecentActivity } from "@/lib/github";
import { HomepageCaseStudies } from "@/components/HomepageCaseStudies";
import { HomepageEngineeringEvidence } from "@/components/HomepageEngineeringEvidence";
import { HomepageHero } from "@/components/HomepageHero";
import { PortfolioProjectCard } from "@/components/PortfolioProjectCard";
import { getHomepageCaseStudies, getHomepageEngineeringEvidence, getHomepageFlagshipProjects } from "@/lib/homepage-content";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllPortfolioProjects } from "@/lib/portfolio-projects";
import Reveal from "@/components/Reveal";
import MotionSection from "@/components/MotionSection";

export default async function HomePage() {
    const [repos, activity] = await Promise.all([
        fetchAllRepos().catch(() => []),
        fetchRecentActivity().catch(() => []),
    ]);

    const allPortfolioProjects = getAllPortfolioProjects();
    const featured = getHomepageFlagshipProjects(allPortfolioProjects);
    const engineeringEvidence = getHomepageEngineeringEvidence(allPortfolioProjects);
    const caseStudies = getHomepageCaseStudies(getAllCaseStudies(), allPortfolioProjects);
    const featuredNames = new Set(
        featured.flatMap((project) => project.repositories.map((repository) => repository.name)),
    );
    const liveDeployments = repos
        .filter((repo) => repo.homepage && repo.homepage.startsWith("http") && !featuredNames.has(repo.name))
        .slice(0, 4);

    return (
        <div className="relative space-y-6 pb-12 md:space-y-8">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-18vh] h-[50vh] bg-[radial-gradient(55%_55%_at_50%_10%,color-mix(in_oklab,var(--accent),transparent_85%)_0%,transparent_64%)] opacity-70"
            />

            <HomepageHero />

            <MotionSection as="section" className="homepage-section" delay={0.08}>
                <div className="container-xl mx-auto max-w-5xl">
                    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Portfolio-owned systems</p>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">Selected systems</h2>
                            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                                A small set of systems where the architecture, ownership boundaries, and engineering decisions are the story.
                            </p>
                        </div>
                        <Link
                            href="/projects"
                            className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            Explore all systems
                            <span className="icon-[tabler--arrow-right] size-4" aria-hidden />
                        </Link>
                    </header>

                    {featured.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((project) => (
                                <Reveal key={project.slug}>
                                    <PortfolioProjectCard project={project} variant="homepage" />
                                </Reveal>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
                            <p className="text-[var(--muted)]">Curated systems are temporarily unavailable.</p>
                        </div>
                    )}
                </div>
            </MotionSection>

            <HomepageEngineeringEvidence evidence={engineeringEvidence} />

            <HomepageCaseStudies caseStudies={caseStudies} />

            {(activity.length > 0 || liveDeployments.length > 0) && (
                <MotionSection as="section" className="homepage-section" delay={0.12}>
                    <div className="container-xl mx-auto max-w-5xl">
                        <header className="mb-8 max-w-3xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Supporting evidence</p>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">Recent engineering activity</h2>
                            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                                Repository activity and external demos are supporting signals. The curated systems above remain the source of portfolio identity.
                            </p>
                        </header>

                        <div className="grid gap-5 md:grid-cols-2">
                            {activity.length > 0 && (
                                <article className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                                    <h3 className="text-lg font-bold text-[var(--fg)]">Recent repository activity</h3>
                                    <ul className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                                        {activity.slice(0, 4).map((event) => (
                                            <li key={event.id} className="flex gap-3 leading-relaxed">
                                                <time dateTime={event.created_at} className="w-20 shrink-0 text-xs font-mono opacity-70">
                                                    {new Date(event.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                                                </time>
                                                <span>
                                                    {event.type === "PushEvent" && <>Pushed code to <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                    {event.type === "PullRequestEvent" && <>{event.payload.action ?? "Updated"} PR in <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                    {event.type === "CreateEvent" && <>Created {event.payload.ref_type ?? "an item"} in <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                    {event.type === "WatchEvent" && <>Starred <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                    {event.type === "ForkEvent" && <>Forked <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                    {!['PushEvent', 'PullRequestEvent', 'CreateEvent', 'WatchEvent', 'ForkEvent'].includes(event.type) && <>Updated <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            )}

                            {liveDeployments.length > 0 && (
                                <article className="rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                                    <h3 className="text-lg font-bold text-[var(--fg)]">Selected external demos</h3>
                                    <div className="mt-5 space-y-3">
                                        {liveDeployments.map((repo) => (
                                            <a
                                                key={repo.fullName || repo.name}
                                                href={repo.homepage!}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="group flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate text-sm font-semibold text-[var(--fg)] group-hover:text-[var(--accent)]">{repo.name}</span>
                                                    {repo.description && <span className="mt-0.5 block truncate text-xs text-[var(--muted)]">{repo.description}</span>}
                                                </span>
                                                <span className="icon-[tabler--external-link] size-4 shrink-0 text-[var(--muted)]" aria-hidden />
                                            </a>
                                        ))}
                                    </div>
                                </article>
                            )}
                        </div>
                    </div>
                </MotionSection>
            )}

            <MotionSection as="section" className="homepage-section" delay={0.16}>
                <div className="container-xl mx-auto max-w-5xl">
                    <div className="rounded-[14px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-6 md:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Next step</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">Start with a system, not a statistic.</h2>
                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--muted)]">
                            Explore the project boundaries first, then read the case studies when you want the reasoning behind them.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/projects"
                                className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            >
                                Browse selected work
                                <span className="icon-[tabler--arrow-right] size-4" aria-hidden />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            >
                                Get in touch
                                <span className="icon-[tabler--mail] size-4" aria-hidden />
                            </Link>
                        </div>
                    </div>
                </div>
            </MotionSection>
        </div>
    );
}
