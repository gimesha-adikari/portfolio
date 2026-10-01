import type { ProjectDecisionCard } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectDecisionCards({
    decisions,
}: {
    decisions: readonly ProjectDecisionCard[];
}) {
    return (
        <section aria-labelledby="termstead-decisions-title" className="space-y-4">
            <div>
                <h3 id="termstead-decisions-title" className="text-xl font-bold text-[var(--fg)]">Architecture decisions</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">Each decision records the boundary it protects and the alternative that was deliberately not chosen.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {decisions.map((decision) => (
                    <article key={decision.title} className="card border border-[var(--border)] bg-[var(--surface)] p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold text-[var(--fg)]">{decision.title}</h4>
                            <ProjectEvidenceBadge classification={decision.classification} />
                        </div>
                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="font-semibold text-[var(--fg)]">Decision</dt>
                                <dd className="mt-1 leading-relaxed text-[var(--muted)]">{decision.choice}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-[var(--fg)]">Why</dt>
                                <dd className="mt-1 leading-relaxed text-[var(--muted)]">{decision.rationale}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold text-[var(--fg)]">Alternative considered</dt>
                                <dd className="mt-1 leading-relaxed text-[var(--muted)]">{decision.alternative}</dd>
                            </div>
                        </dl>
                    </article>
                ))}
            </div>
        </section>
    );
}
