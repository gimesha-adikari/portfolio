import type { PortfolioProject } from "@/lib/portfolio-projects";

export function PortfolioProjectEvidence({ project }: { project: PortfolioProject }) {
    return (
        <section className="grid md:grid-cols-2 gap-6">
            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                <h2 className="text-lg font-bold text-[var(--fg)]">Decisions</h2>
                <div className="mt-5 space-y-5">
                    {project.decisions.map((decision) => (
                        <div key={decision.decision}>
                            <h3 className="font-semibold text-[var(--fg)]">{decision.decision}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{decision.rationale}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                <h2 className="text-lg font-bold text-[var(--fg)]">Evidence and outcomes</h2>
                <div className="mt-5 space-y-5">
                    {project.outcomes.map((outcome) => (
                        <div key={outcome.label}>
                            <h3 className="font-semibold text-[var(--fg)]">{outcome.label}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{outcome.description}</p>
                            {outcome.source && <p className="mt-2 text-xs font-mono text-[var(--muted)]">Source: {outcome.source}</p>}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
