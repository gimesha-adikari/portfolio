import type { ProjectLifecycleStep } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectLifecycleSequence({
    lifecycle,
}: {
    lifecycle: readonly ProjectLifecycleStep[];
}) {
    return (
        <section aria-labelledby="termstead-lifecycle-title" className="space-y-4">
            <div>
                <h3 id="termstead-lifecycle-title" className="text-xl font-bold text-[var(--fg)]">Session lifecycle and synchronization</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    This sequence follows a GUI detach/reconnect path. Closing a view and terminating a session are intentionally different operations.
                </p>
            </div>
            <figure className="card border border-[var(--border)] bg-[var(--surface)] p-4 md:p-6">
                <figcaption className="sr-only">Termstead session lifecycle sequence from opening a session through synchronization, detach, reconnect, and explicit termination.</figcaption>
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
