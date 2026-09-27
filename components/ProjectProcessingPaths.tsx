import type { ProjectProcessingPath } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectProcessingPaths({ paths }: { paths: readonly ProjectProcessingPath[] }) {
    if (paths.length === 0) return null;

    return (
        <section aria-labelledby="project-processing-paths-title" className="space-y-4">
            <div>
                <h3 id="project-processing-paths-title" className="text-xl font-bold text-[var(--fg)]">Processing paths</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    Processing choices are shown with their boundary and limits instead of being collapsed into one generic pipeline claim.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                {paths.map((path) => (
                    <article key={path.title} className="card border border-[var(--border)] bg-[var(--surface)] p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="font-semibold text-[var(--fg)]">{path.title}</h4>
                            <ProjectEvidenceBadge classification={path.classification} />
                        </div>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{path.boundary}</p>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{path.behavior}</p>
                        <div className="mt-4 border-t border-[var(--border)] pt-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Limits</p>
                            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                                {path.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
