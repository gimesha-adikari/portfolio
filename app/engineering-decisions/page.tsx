import Link from "next/link";
import { buildRouteMetadata } from "@/lib/route-metadata";
import {
    APPROVED_ENGINEERING_DECISION_PROJECTS,
    getEngineeringDecisionsForProject,
    type EngineeringDecision,
} from "@/lib/engineering-decisions";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-projects";

export const metadata = buildRouteMetadata({
    title: "Engineering Decisions",
    description: "A concise collection of evidence-backed engineering decisions across selected systems.",
    path: "/engineering-decisions",
    ogImagePath: "/engineering-decisions/opengraph-image",
    type: "website",
});

function classificationLabel(classification: EngineeringDecision["classification"]): string {
    return classification.toLowerCase().replaceAll(" / ", " · ").replaceAll("-", " ");
}

function DecisionList({ decisionId, title, items }: { decisionId: string; title: string; items?: readonly string[] }) {
    if (!items || items.length === 0) return null;
    const headingId = `${decisionId}-${title.toLowerCase().replaceAll(" ", "-")}-title`;

    return (
        <section aria-labelledby={headingId}>
            <h3 id={headingId} className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {title}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                {items.map((item) => <li key={item} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{item}</li>)}
            </ul>
        </section>
    );
}

function DecisionCard({ decision }: { decision: EngineeringDecision }) {
    return (
        <details className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-2xl p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:p-6 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0">
                    <span className="block text-lg font-semibold text-[var(--fg)]">{decision.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-[var(--muted)]">{decision.question}</span>
                    <span className="mt-3 inline-flex rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                        {classificationLabel(decision.classification)}
                    </span>
                </span>
                <span aria-hidden className="mt-1 shrink-0 text-2xl leading-none text-[var(--accent)] transition-transform group-open:rotate-45">+</span>
            </summary>

            <div className="space-y-7 border-t border-[var(--border)] px-5 pb-6 pt-6 sm:px-6">
                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Decision</h3>
                    <p className="mt-3 text-base leading-relaxed text-[var(--fg)]">{decision.decision}</p>
                </div>

                <div className="grid gap-7 md:grid-cols-2">
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Context</h3>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{decision.context}</p>
                    </div>
                    <DecisionList decisionId={decision.id} title="Constraints" items={decision.constraints} />
                </div>

                <DecisionList decisionId={decision.id} title="Rationale" items={decision.rationale} />
                <DecisionList decisionId={decision.id} title="Trade-offs" items={decision.tradeoffs} />

                {decision.alternatives && decision.alternatives.length > 0 && (
                    <section aria-labelledby={`${decision.id}-alternatives-title`}>
                        <h3 id={`${decision.id}-alternatives-title`} className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Alternative considered</h3>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                            {decision.alternatives.map((alternative) => (
                                <li key={alternative.label} className="flex gap-3"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{alternative.label}{alternative.reasonNotChosen ? ` — ${alternative.reasonNotChosen}` : ""}</li>
                            ))}
                        </ul>
                    </section>
                )}

                <DecisionList decisionId={decision.id} title="Limitations" items={decision.limitations} />

                <section aria-labelledby={`${decision.id}-evidence-title`}>
                    <h3 id={`${decision.id}-evidence-title`} className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Evidence</h3>
                    <ul className="mt-3 space-y-3">
                        {decision.evidence.map((source) => (
                            <li key={source.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                                <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-[var(--fg)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                >
                                    {source.label}
                                </a>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{source.description}</p>
                                <p className="mt-2 break-all font-mono text-xs text-[var(--muted)]">Pinned commit: {source.commit}</p>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </details>
    );
}

export default function EngineeringDecisionsPage() {
    const groups = APPROVED_ENGINEERING_DECISION_PROJECTS.flatMap((slug) => {
        const project = getPortfolioProjectBySlug(slug);
        if (!project) throw new Error(`missing approved project ${slug}`);

        return [{
            project,
            decisions: getEngineeringDecisionsForProject(slug),
        }];
    });

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <header className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Evidence-backed decisions</p>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--fg)] md:text-5xl">Engineering Decisions</h1>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
                    Selected engineering decisions, the constraints behind them, and the public evidence that supports the trade-offs.
                </p>
            </header>

            <nav className="mt-10" aria-label="Engineering decision project sections">
                <ul className="flex flex-wrap gap-3">
                    {groups.map(({ project }) => (
                        <li key={project.slug}>
                            <a
                                href={`#${project.slug}`}
                                className="inline-flex min-h-11 items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            >
                                {project.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mt-14 space-y-14">
                {groups.map(({ project, decisions: projectDecisions }) => (
                    <section key={project.slug} id={project.slug} aria-labelledby={`${project.slug}-title`} className="scroll-mt-24">
                        <header className="max-w-3xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{project.category ?? "Selected system"}</p>
                            <h2 id={`${project.slug}-title`} className="mt-3 text-2xl font-bold tracking-tight text-[var(--fg)] md:text-3xl">{project.title}</h2>
                            <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{project.tagline}</p>
                        </header>

                        <div className="mt-6 space-y-4">
                            {projectDecisions.map((decision) => <DecisionCard key={decision.id} decision={decision} />)}
                        </div>
                    </section>
                ))}
            </div>

            <p className="mt-14 border-t border-[var(--border)] pt-6 text-sm leading-relaxed text-[var(--muted)]">
                These records are a curated view over the portfolio&apos;s existing project evidence. They describe implemented or explicitly accepted boundaries, not production-readiness or outcome guarantees.
            </p>
        </div>
    );
}
