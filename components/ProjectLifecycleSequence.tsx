import type { ProjectLifecycleStep } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectLifecycleSequence({
    lifecycle,
    title = "Lifecycle and synchronization",
    description = "The sequence keeps ownership, state transitions, and evidence classifications visible at each boundary.",
    caption = "Project lifecycle sequence",
    id = "project-lifecycle-title",
}: {
    lifecycle: readonly ProjectLifecycleStep[];
    title?: string;
    description?: string;
    caption?: string;
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
                <ol className="space-y-3">
                    {lifecycle.map((step, index) => (
                        <li key={step.phase} className="grid gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4 md:grid-cols-[auto_1fr_auto] md:items-start">
                            <div className="flex items-center gap-3">
                                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--bg)]" aria-hidden>{index + 1}</span>
                                <h4 className="font-semibold text-[var(--fg)] md:hidden">{step.phase}</h4>
                            </div>
                            <div>
                                <h4 className="hidden font-semibold text-[var(--fg)] md:block">{step.phase}</h4>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{step.actor}</p>
                                <p className="mt-3 text-sm leading-relaxed text-[var(--fg)]">{step.action}</p>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]"><span className="font-semibold text-[var(--fg)]">Result: </span>{step.result}</p>
                            </div>
                            <ProjectEvidenceBadge classification={step.classification} />
                        </li>
                    ))}
                </ol>
            </figure>
        </section>
    );
}
