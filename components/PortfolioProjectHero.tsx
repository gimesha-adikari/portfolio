import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio-projects";

function labelForStatus(status: PortfolioProject["status"]): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function PortfolioProjectHero({ project }: { project: PortfolioProject }) {
    return (
        <>
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
        </>
    );
}
