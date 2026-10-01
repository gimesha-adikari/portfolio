import type { ProjectFailureBoundary } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectFailureBoundaries({ boundaries }: { boundaries: readonly ProjectFailureBoundary[] }) {
    if (boundaries.length === 0) return null;

    return (
        <section aria-labelledby="project-failure-boundaries-title" className="space-y-4">
            <div>
                <h3 id="project-failure-boundaries-title" className="text-xl font-bold text-[var(--fg)]">Failure boundaries</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    Failure handling is attached to the boundary that owns the response, cleanup, retry, or user-visible state transition.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {boundaries.map((boundary) => (
                    <article key={boundary.boundary} className="card border border-[var(--border)] bg-[var(--surface)] p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="font-semibold text-[var(--fg)]">{boundary.boundary}</h4>
                            <ProjectEvidenceBadge classification={boundary.classification} />
                        </div>
                        <dl className="mt-4 space-y-3 text-sm">
                            <div>
                                <dt className="font-semibold text-[var(--fg)]">Trigger</dt>
                                <dd className="mt-1 leading-relaxed text-[var(--muted)]">{boundary.trigger}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-[var(--fg)]">Behavior</dt>
                                <dd className="mt-1 leading-relaxed text-[var(--muted)]">{boundary.behavior}</dd>
                            </div>
                        </dl>
                    </article>
                ))}
            </div>
        </section>
    );
}
