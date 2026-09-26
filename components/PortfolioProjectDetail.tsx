import Link from "next/link";
import type { PortfolioProject, RepositoryFacts } from "@/lib/portfolio-projects";

function labelForStatus(status: PortfolioProject["status"]) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(value?: string) {
    if (!value) return "Not available";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

function formatNumber(value?: number) {
    return typeof value === "number" ? new Intl.NumberFormat(undefined, { notation: "compact" }).format(value) : "Not available";
}

export function PortfolioProjectDetail({
    project,
    facts = [],
}: {
    project: PortfolioProject;
    facts?: readonly RepositoryFacts[];
}) {
    const factsByName = new Map(facts.map((fact) => [fact.name, fact]));

    return (
        <article className="space-y-12 pb-20 container-xl max-w-5xl mx-auto pt-6">
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors group"
            >
                <span className="icon-[tabler--arrow-left] size-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
                Back to projects
            </Link>

            <header className="hero-glow">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    {project.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-[var(--fg)]">
                            <span className="icon-[tabler--sparkles] size-3.5 text-[var(--accent)]" aria-hidden />
                            Featured
                        </span>
                    )}
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1">
                        {labelForStatus(project.status)}
                    </span>
                    {project.category && <span>{project.category}</span>}
                </div>

                <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">
                    {project.title}
                </h1>
                <p className="mt-4 text-lg text-[var(--muted)] max-w-3xl leading-relaxed">
                    {project.tagline}
                </p>

                <dl className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-3 border-t border-[var(--border)] pt-8">
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Role</dt>
                        <dd className="mt-1.5 font-medium text-sm text-[var(--fg)]">{project.role}</dd>
                    </div>
                    {project.period && (
                        <div>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Period</dt>
                            <dd className="mt-1.5 font-medium text-sm text-[var(--fg)]">{project.period}</dd>
                        </div>
                    )}
                    <div>
                        <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Sources</dt>
                        <dd className="mt-1.5 font-medium text-sm text-[var(--fg)]">{project.repositories.length} grouped repositories</dd>
                    </div>
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                    {project.liveUrl && (
                        <a
                            className="rounded-lg bg-[var(--accent)] text-[var(--bg)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="icon-[tabler--external-link] size-5" aria-hidden />
                            Visit project site
                        </a>
                    )}
                    {project.repositories.map((repository) => (
                        <a
                            key={repository.name}
                            className="rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] px-4 py-3 text-sm font-semibold hover:border-[var(--accent)] transition-colors flex items-center gap-2"
                            href={repository.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className="icon-[tabler--brand-github] size-5" aria-hidden />
                            {repository.name}
                        </a>
                    ))}
                </div>
            </header>

            <section className="card p-6 md:p-8 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-l-2xl" />
                <h2 className="text-xl font-bold text-[var(--fg)] flex items-center gap-2">
                    <span className="icon-[tabler--target] text-[var(--accent)] size-5" aria-hidden />
                    Problem
                </h2>
                <p className="mt-4 text-[var(--muted)] leading-relaxed md:text-lg">{project.problem}</p>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Constraints</h2>
                    <ul className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                        {project.constraints.map((constraint) => (
                            <li key={constraint} className="flex items-start gap-3">
                                <span className="icon-[tabler--check] size-5 mt-0.5 text-[var(--accent-2)] shrink-0" aria-hidden />
                                <span className="leading-relaxed">{constraint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Architecture</h2>
                    <div className="mt-5 space-y-5">
                        {project.architecture.map((block) => (
                            <div key={block.boundary} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                                <h3 className="font-semibold text-[var(--fg)]">{block.boundary}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{block.responsibility}</p>
                                {block.technologies.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {block.technologies.map((technology) => (
                                            <span key={technology} className="rounded-md bg-[var(--bg)] px-2 py-1 text-[11px] text-[var(--muted)]">
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Decisions</h2>
                    <div className="mt-5 space-y-5">
                        {project.decisions.map((decision) => (
                            <div key={decision.decision}>
                                <h3 className="font-semibold text-[var(--fg)]">{decision.decision}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{decision.rationale}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Evidence and outcomes</h2>
                    <div className="mt-5 space-y-5">
                        {project.outcomes.map((outcome) => (
                            <div key={outcome.label}>
                                <h3 className="font-semibold text-[var(--fg)]">{outcome.label}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{outcome.description}</p>
                                {outcome.source && <p className="mt-2 text-xs font-mono text-[var(--muted)]">Source: {outcome.source}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)]">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--fg)]">Repository enrichment</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">Mutable public facts are optional; the project identity above is portfolio-owned.</p>
                    </div>
                    <span className="text-xs text-[var(--muted)]">{facts.length} of {project.repositories.length} enriched</span>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.repositories.map((repository) => {
                        const fact = factsByName.get(repository.name);
                        return (
                            <div key={repository.name} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-[var(--fg)]">{repository.name}</h3>
                                        <p className="mt-1 text-xs text-[var(--muted)]">{repository.role}</p>
                                    </div>
                                    <span className="text-xs text-[var(--muted)]">{fact?.isPublic === true ? "Public" : "Portfolio source"}</span>
                                </div>
                                {fact ? (
                                    <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                        <div><dt className="text-[var(--muted)]">Updated</dt><dd className="mt-1 text-[var(--fg)]">{formatDate(fact.updatedAt)}</dd></div>
                                        <div><dt className="text-[var(--muted)]">Language</dt><dd className="mt-1 text-[var(--fg)]">{fact.language ?? "Not available"}</dd></div>
                                        <div><dt className="text-[var(--muted)]">Stars</dt><dd className="mt-1 text-[var(--fg)]">{formatNumber(fact.stars)}</dd></div>
                                        <div><dt className="text-[var(--muted)]">Forks</dt><dd className="mt-1 text-[var(--fg)]">{formatNumber(fact.forks)}</dd></div>
                                    </dl>
                                ) : (
                                    <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">GitHub enrichment is unavailable; curated content remains available.</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {project.caseStudies && project.caseStudies.length > 0 && (
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-[var(--fg)]">Related case studies</h2>
                    <div className="flex flex-wrap gap-3">
                        {project.caseStudies.map((slug) => (
                            <Link
                                key={slug}
                                href={`/case-studies/${slug}`}
                                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
                            >
                                {slug}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {project.contentNotes && project.contentNotes.length > 0 && (
                <section className="card p-6 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Content notes</h2>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                        {project.contentNotes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                </section>
            )}
        </article>
    );
}
