import Link from "next/link";
import type { HomepageEngineeringEvidence as EngineeringEvidence } from "@/lib/homepage-content";
import Reveal from "@/components/Reveal";

export function HomepageEngineeringEvidence({
    evidence,
}: {
    evidence: readonly EngineeringEvidence[];
}) {
    return (
        <section className="homepage-section homepage-engineering-evidence" aria-labelledby="homepage-engineering-evidence-title">
            <div className="container-xl mx-auto max-w-5xl">
                <header className="homepage-engineering-evidence__header mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">How I build</p>
                    <h2 id="homepage-engineering-evidence-title" className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">
                        Make boundaries visible.
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                        The strongest project stories start with ownership, lifecycle, and failure boundaries—not a list of tools.
                    </p>
                </header>

                <div className="homepage-engineering-evidence__grid">
                    {evidence.map((item, index) => (
                        <Reveal key={item.projectSlug} className="homepage-engineering-evidence__reveal">
                            <article
                                className="homepage-engineering-evidence__item"
                                aria-labelledby={item.projectSlug + "-engineering-evidence-title"}
                            >
                                <div className="homepage-engineering-evidence__project">
                                    <p className="homepage-engineering-evidence__project-name">{item.projectTitle}</p>
                                    <span className="homepage-engineering-evidence__index" aria-hidden="true">0{index + 1}</span>
                                </div>

                                <div className="homepage-engineering-evidence__boundary">
                                    <p className="homepage-engineering-evidence__label">Boundary</p>
                                    <h3
                                        id={item.projectSlug + "-engineering-evidence-title"}
                                        className="homepage-engineering-evidence__boundary-title"
                                    >
                                        {item.boundary}
                                    </h3>
                                    <p className="homepage-engineering-evidence__responsibility">
                                        <span className="homepage-engineering-evidence__responsibility-label">Responsibility</span>
                                        {item.responsibility}
                                    </p>
                                </div>

                                <div className="homepage-engineering-evidence__connector" aria-hidden="true">
                                    <span className="homepage-engineering-evidence__connector-dot" />
                                    <span className="homepage-engineering-evidence__connector-line" />
                                </div>

                                <div className="homepage-engineering-evidence__decision">
                                    <p className="homepage-engineering-evidence__label homepage-engineering-evidence__label--decision">Decision</p>
                                    <p className="homepage-engineering-evidence__decision-text">{item.decision}</p>
                                </div>

                                <Link
                                    href={item.href}
                                    className="homepage-engineering-evidence__link inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                >
                                    Explore {item.projectTitle}
                                    <span className="icon-[tabler--arrow-up-right] size-4" aria-hidden />
                                </Link>
                            </article>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
