import type { PortfolioProject } from "@/lib/portfolio-projects";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";
import { ProjectDecisionCards } from "./ProjectDecisionCards";
import { ProjectDebuggingStory } from "./ProjectDebuggingStory";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";
import { ProjectEvidenceTable } from "./ProjectEvidenceTable";
import { ProjectLifecycleSequence } from "./ProjectLifecycleSequence";
import { ProjectLimitations } from "./ProjectLimitations";
import { ProjectSourceLinks } from "./ProjectSourceLinks";

export function PortfolioProjectTechnicalEvidence({ project }: { project: PortfolioProject }) {
    const evidence = project.technicalEvidence;
    if (!evidence) return null;

    return (
        <section aria-labelledby="technical-evidence-title" className="space-y-10">
            <header className="space-y-3 border-b border-[var(--border)] pb-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Evidence record</p>
                    <span className="text-[var(--muted)]">Mixed classifications</span>
                </div>
                <h2 id="technical-evidence-title" className="text-2xl font-bold text-[var(--fg)] md:text-3xl">How the system is split, synchronized, and tested</h2>
                <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)]">{evidence.introduction}</p>
            </header>

            <ProjectArchitectureDiagram ownership={evidence.ownership} />

            <section aria-labelledby="termstead-ipc-title" className="space-y-4">
                <div>
                    <h3 id="termstead-ipc-title" className="text-xl font-bold text-[var(--fg)]">IPC and SessionHub boundary</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">The transport carries identity and wake signals, while snapshots and deltas remain the authority that the renderer validates.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {evidence.ipc.map((item) => (
                        <article key={item.boundary} className="card border border-[var(--border)] bg-[var(--surface)] p-5">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <h4 className="font-semibold text-[var(--fg)]">{item.boundary}</h4>
                                <ProjectEvidenceBadge classification={item.classification} />
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.behavior}</p>
                        </article>
                    ))}
                </div>
            </section>

            <ProjectDecisionCards decisions={evidence.decisions} />
            <ProjectLifecycleSequence lifecycle={evidence.lifecycle} />
            <ProjectEvidenceTable measurements={evidence.measurements} sources={evidence.sources} />
            <ProjectDebuggingStory stories={evidence.debuggingStories} />
            <ProjectLimitations limitations={evidence.limitations} />
            <ProjectSourceLinks sources={evidence.sources} />
        </section>
    );
}
