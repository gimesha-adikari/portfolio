import type { ProjectOwnershipBoundary } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectArchitectureDiagram({
    ownership,
    title = "Ownership boundaries",
    description = "The system is easier to reason about when authority, policy, processing, and presentation state have explicit owners.",
    caption = "Project ownership-boundary diagram",
    summary = "Each boundary is shown with its owner and classification. The arrows describe the evidence-oriented relationship, not a claim that every message moves in one direction.",
    id = "project-ownership-title",
}: {
    ownership: readonly ProjectOwnershipBoundary[];
    title?: string;
    description?: string;
    caption?: string;
    summary?: string;
    id?: string;
}) {
    return (
        <section aria-labelledby={id} className="space-y-4">
            <div>
                <h3 id={id} className="text-xl font-bold text-[var(--fg)]">{title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    {description}
                </p>
            </div>
            <figure className="card border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
                <figcaption className="sr-only">{caption}</figcaption>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 md:items-stretch">
                    {ownership.map((item, index) => (
                        <div key={item.boundary} className="relative rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4">
                            {index > 0 && <span className="absolute -left-3 top-1/2 hidden -translate-y-1/2 text-xl text-[var(--accent)] md:block" aria-hidden>→</span>}
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <h4 className="font-semibold text-[var(--fg)]">{item.boundary}</h4>
                                <ProjectEvidenceBadge classification={item.classification} />
                            </div>
                            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{item.owner}</p>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.responsibility}</p>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{summary}</p>
            </figure>
        </section>
    );
}
