import type { ProjectOwnershipBoundary } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectArchitectureDiagram({
    ownership,
}: {
    ownership: readonly ProjectOwnershipBoundary[];
}) {
    return (
        <section aria-labelledby="termstead-ownership-title" className="space-y-4">
            <div>
                <h3 id="termstead-ownership-title" className="text-xl font-bold text-[var(--fg)]">Ownership boundaries</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    The system is easier to reason about when session authority, workspace policy, and rendering state have explicit owners.
                </p>
            </div>
            <figure className="card border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
                <figcaption className="sr-only">Termstead ownership diagram showing the daemon, GUI shell, and IPC/renderer boundaries.</figcaption>
                <div className="grid gap-3 md:grid-cols-3 md:items-stretch">
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
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                    In order: the daemon owns terminal/session state, the GUI owns view composition, and IPC plus the renderer carry and validate state for display. The arrows describe the evidence-oriented boundary, not a claim that all messages move in one direction.
                </p>
            </figure>
        </section>
    );
}
