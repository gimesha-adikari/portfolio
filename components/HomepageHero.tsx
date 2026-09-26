import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export function HomepageHero() {
    return (
        <section className="section pt-12 md:pt-20" aria-labelledby="homepage-hero-title">
            <div className="container-xl mx-auto max-w-5xl">
                <div className="max-w-4xl space-y-7">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                        {siteConfig.name} · Systems and platform engineering
                    </p>

                    <h1 id="homepage-hero-title" className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-[var(--fg)] md:text-6xl">
                        Building software systems with clear ownership boundaries.
                    </h1>

                    <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-xl">
                        I work across backend platforms, developer tooling, document-processing systems, and multi-client products—making state, service, and failure boundaries explicit.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                            href="/projects"
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            <span className="icon-[tabler--layout-grid] size-4" aria-hidden />
                            View selected work
                        </Link>
                        <Link
                            href="/case-studies"
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            <span className="icon-[tabler--book-2] size-4" aria-hidden />
                            Read engineering case studies
                        </Link>
                        <a
                            href={siteConfig.cvPath}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            <span className="icon-[tabler--file-cv] size-4" aria-hidden />
                            Download CV
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
