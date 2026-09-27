import Link from "next/link";
import type { HomepageEngineeringEvidence as EngineeringEvidence } from "@/lib/homepage-content";
import Reveal from "@/components/Reveal";

export function HomepageEngineeringEvidence({
    evidence,
}: {
    evidence: readonly EngineeringEvidence[];
}) {
    return (
        <section className="homepage-section" aria-labelledby="homepage-engineering-evidence-title">
            <div className="container-xl mx-auto max-w-5xl">
                <header className="mb-8 max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">How I build</p>
                    <h2 id="homepage-engineering-evidence-title" className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">
                        Make boundaries visible.
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                        The strongest project stories start with ownership, lifecycle, and failure boundaries—not a list of tools.
                    </p>
                </header>

                <div className="grid gap-5 md:grid-cols-3">
                    {evidence.map((item) => (
                        <Reveal key={item.projectSlug}>
                            <article className="flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{item.projectTitle}</p>
                                <h3 className="mt-4 text-lg font-bold tracking-tight text-[var(--fg)]">{item.boundary}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.responsibility}</p>
                                <div className="mt-5 border-t border-[var(--border)] pt-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Decision</p>
                                    <p className="mt-2 text-sm leading-relaxed text-[var(--fg)]">{item.decision}</p>
                                </div>
                                <Link
                                    href={item.href}
                                    className="mt-auto inline-flex min-h-11 items-center gap-1 pt-6 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
