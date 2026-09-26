import type { PortfolioProject } from "@/lib/portfolio-projects";
import { ProjectArchitectureDiagram } from "./ProjectArchitectureDiagram";
import { ProjectDecisionCards } from "./ProjectDecisionCards";
import { ProjectDebuggingStory } from "./ProjectDebuggingStory";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";
import { ProjectEvidenceTable } from "./ProjectEvidenceTable";
import { ProjectLifecycleSequence } from "./ProjectLifecycleSequence";
import { ProjectLimitations } from "./ProjectLimitations";
import { ProjectFailureBoundaries } from "./ProjectFailureBoundaries";
import { ProjectProcessingPaths } from "./ProjectProcessingPaths";
import { ProjectSourceLinks } from "./ProjectSourceLinks";
import { ProjectWorkflowMatrix } from "./ProjectWorkflowMatrix";

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

            <section aria-labelledby="project-boundaries-title" className="space-y-4">
                <div>
                    <h3 id="project-boundaries-title" className="text-xl font-bold text-[var(--fg)]">Transport and boundary contracts</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">Each boundary describes how data, identity, state, or work crosses between owned parts of the system.</p>
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

            <ProjectWorkflowMatrix workflows={evidence.workflows ?? []} />
            <ProjectDecisionCards decisions={evidence.decisions} />
            <ProjectLifecycleSequence
                lifecycle={evidence.lifecycle}
                title="Primary lifecycle"
                description="The primary sequence follows input, ownership, processing, result, and cleanup transitions without collapsing synchronous and queued work into one claim."
                caption="Primary project lifecycle sequence"
                id="project-primary-lifecycle-title"
            />
            {evidence.fileLifecycles?.map((sequence, index) => (
                <ProjectLifecycleSequence
                    key={sequence.title}
                    lifecycle={sequence.steps}
                    title={sequence.title}
                    description={sequence.description}
                    caption={`${sequence.title} sequence`}
                    id={`project-file-lifecycle-${index}`}
                />
            ))}
            <ProjectProcessingPaths paths={evidence.processingPaths ?? []} />
            <ProjectFailureBoundaries boundaries={evidence.failureBoundaries ?? []} />
            <ProjectEvidenceTable measurements={evidence.measurements} sources={evidence.sources} />
            <ProjectDebuggingStory stories={evidence.debuggingStories} />
            <ProjectLimitations limitations={evidence.limitations} />
            <ProjectSourceLinks sources={evidence.sources} />
        </section>
    );
}
