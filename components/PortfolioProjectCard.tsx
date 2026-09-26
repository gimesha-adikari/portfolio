import Link from "next/link";
import type { PortfolioProject, RepositoryFacts } from "@/lib/portfolio-projects";

function labelForStatus(status: PortfolioProject["status"]) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function PortfolioProjectCard({
    project,
    facts = [],
}: {
    project: PortfolioProject;
    facts?: readonly RepositoryFacts[];
}) {
    const technologies = Array.from(
        new Set(project.architecture.flatMap((block) => block.technologies)),
    ).slice(0, 5);
    const titleId = `${project.slug}-portfolio-project-title`;

    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group block h-full"
            aria-label={`Open details for ${project.title}`}
            prefetch={false}
        >
            <article
                className="relative h-full rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6 transition-transform duration-300 group-hover:-translate-y-1"
                aria-labelledby={titleId}
            >
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    {project.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[var(--fg)]">
                            <span className="icon-[tabler--sparkles] size-3.5 text-[var(--accent)]" aria-hidden />
                            Featured
                        </span>
                    )}
                    <span className="rounded-full border border-[var(--border)] px-2.5 py-1">
                        {labelForStatus(project.status)}
                    </span>
                    {project.category && <span>{project.category}</span>}
                </div>

                <h3
                    id={titleId}
                    className="mt-5 text-xl font-bold tracking-tight text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors"
                >
                    {project.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {project.tagline}
                </p>

                <div className="mt-5 grid gap-3 text-xs text-[var(--muted)] sm:grid-cols-2">
                    <div>
                        <div className="font-semibold uppercase tracking-[0.16em]">Role</div>
                        <div className="mt-1 text-sm text-[var(--fg)]">{project.role}</div>
                    </div>
                    <div>
                        <div className="font-semibold uppercase tracking-[0.16em]">Repositories</div>
                        <div className="mt-1 text-sm text-[var(--fg)]">
                            {project.repositories.length} grouped source{project.repositories.length === 1 ? "" : "s"}
                            {facts.length > 0 ? ` · ${facts.length} public fact${facts.length === 1 ? "" : "s"}` : ""}
                        </div>
                    </div>
                </div>

                {technologies.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2" aria-label="Project technologies">
                        {technologies.map((technology) => (
                            <span
                                key={technology}
                                className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[11px] font-medium text-[var(--muted)]"
                            >
                                {technology}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex items-center justify-between text-xs text-[var(--muted)]">
                    <span>{project.caseStudies?.length ?? 0} associated case studies</span>
                    <span className="inline-flex items-center gap-1 group-hover:text-[var(--accent)] transition-colors">
                        View project
                        <span className="icon-[tabler--arrow-up-right] size-4" aria-hidden />
                    </span>
                </div>
            </article>
        </Link>
    );
}
