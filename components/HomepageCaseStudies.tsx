import Link from "next/link";
import type { HomepageCaseStudy } from "@/lib/homepage-content";
import Reveal from "@/components/Reveal";

export function HomepageCaseStudies({
    caseStudies,
}: {
    caseStudies: readonly HomepageCaseStudy[];
}) {
    return (
        <section className="section" aria-labelledby="homepage-case-studies-title">
            <div className="container-xl mx-auto max-w-5xl">
                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Selected case studies</p>
                        <h2 id="homepage-case-studies-title" className="mt-3 text-2xl font-semibold tracking-tight text-[var(--fg)] md:text-3xl">
                            Read the decisions behind the systems.
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
                            Short technical write-ups on the problems, boundaries, and trade-offs behind selected work.
                        </p>
                    </div>
                    <Link
                        href="/case-studies"
                        className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                        View all case studies
                        <span className="icon-[tabler--arrow-right] size-4" aria-hidden />
                    </Link>
                </header>

                <div className="grid gap-5 md:grid-cols-3">
                    {caseStudies.map(({ study, project, focus }) => (
                        <Reveal key={study.slug}>
                            <Link
                                href={`/case-studies/${study.slug}`}
                                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            >
                                <article className="flex h-full flex-col rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5 transition-transform duration-300 group-hover:-translate-y-1 md:p-6">
                                    <div className="flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
                                        <span className="font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{project.title}</span>
                                        <span>{study.read_time}</span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold tracking-tight text-[var(--fg)] group-hover:text-[var(--accent)]">{study.title}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{study.blurb}</p>
                                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--border)] pt-5">
                                        <span className="text-xs font-medium text-[var(--muted)]">{focus}</span>
                                        <span className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[var(--fg)]">
                                            Read study
                                            <span className="icon-[tabler--arrow-up-right] size-4" aria-hidden />
                                        </span>
                                    </div>
                                </article>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
