import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCaseStudies, getCaseStudyBySlug } from "@/lib/case-studies";
import { siteConfig } from "@/lib/siteConfig";
import { absoluteSiteUrl, buildNotFoundMetadata, buildRouteMetadata } from "@/lib/route-metadata";

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
    return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const data = getCaseStudyBySlug(slug);
    if (!data) {
        return buildNotFoundMetadata({ label: "Case study", path: `/case-studies/${slug}` });
    }

    return buildRouteMetadata({
        title: data.title,
        description: data.tldr || data.blurb || data.subtitle,
        path: `/case-studies/${data.slug}`,
    });
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = getCaseStudyBySlug(slug);
    if (!data) notFound();

    const list = getAllCaseStudies();
    const idx = list.findIndex((x) => x.slug === slug);
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;
    const validLinks = data.links;
    const canonicalUrl = absoluteSiteUrl(`/case-studies/${data.slug}`);
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: data.title,
        description: data.tldr || data.blurb || data.subtitle,
        url: canonicalUrl,
        author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.canonicalUrl,
        },
        keywords: data.tags,
        mainEntityOfPage: canonicalUrl,
    };

    return (
        <article className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Top Navigation */}
            <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] mb-10 transition-colors bg-[var(--surface)] border border-[var(--border)] px-4 py-2 rounded-full hover:border-[var(--accent)]"
            >
                <span className="icon-[tabler--arrow-left] size-4"></span> All Case Studies
            </Link>

            {/* Hero Header */}
            <header className="mb-12 md:mb-16">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                        <span className={`${data.main_icon || "icon-[tabler--folder]"} size-8 text-[var(--accent)]`}></span>
                    </div>
                    <span className="text-sm font-medium text-[var(--accent)] tracking-wider uppercase">
                        Case Study
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--fg)] mb-4 max-w-4xl">
                    {data.title}
                </h1>
                <p className="text-[var(--muted)] text-lg md:text-xl max-w-3xl leading-relaxed">
                    {data.subtitle}
                </p>
            </header>

            {/* TL;DR Highlight Card */}
            <div className="bg-[var(--surface)] border border-[var(--accent)]/30 rounded-2xl p-6 md:p-8 mb-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--accent)]"></div>
                <h2 className="text-sm font-bold tracking-wider text-[var(--accent)] uppercase mb-2 flex items-center gap-2">
                    <span className="icon-[tabler--bolt] size-4"></span> Executive Summary
                </h2>
                <p className="text-[var(--fg)] md:text-lg leading-relaxed font-medium">
                    {data.tldr}
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                {/* Main Content (Left Column) */}
                <div className="lg:col-span-8 space-y-12">

                    {/* Problem Section */}
                    {data.problem && (
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                                    <span className="icon-[tabler--target] size-5 text-[var(--accent)]"></span>
                                </div>
                                The Problem
                            </h2>
                            <ul className="grid gap-4">
                                {data.problem.map((item, i) => (
                                    <li key={i} className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50">
                                        <span className="icon-[tabler--alert-circle] size-5 text-[var(--muted)] shrink-0 mt-0.5"></span>
                                        <span className="text-[var(--muted)] leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Architecture & Approach */}
                    {data.architecture && (
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                                    <span className="icon-[tabler--binary-tree] size-5 text-[var(--accent)]"></span>
                                </div>
                                Architecture & Approach
                            </h2>
                            <ul className="space-y-4">
                                {data.architecture.map((item, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="size-6 rounded-full bg-[var(--surface)] border border-[var(--accent)]/50 flex items-center justify-center shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-[var(--accent)]">{i + 1}</span>
                                        </div>
                                        <span className="text-[var(--muted)] leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Challenges */}
                    {data.challenges && (
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                                    <span className="icon-[tabler--mountain] size-5 text-[var(--accent)]"></span>
                                </div>
                                Challenges & Trade-offs
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {data.challenges.map((item, i) => (
                                    <div key={i} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                                        <span className="icon-[tabler--flag] size-5 text-[var(--accent)] mb-3 block"></span>
                                        <p className="text-sm text-[var(--muted)] leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Results */}
                    {data.results && (
                        <section>
                            <h2 className="text-2xl font-bold text-[var(--fg)] flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                                    <span className="icon-[tabler--rosette-discount-check] size-5 text-[var(--accent)]"></span>
                                </div>
                                Outcomes & Results
                            </h2>
                            <ul className="grid gap-3">
                                {data.results.map((item, i) => (
                                    <li key={i} className="flex gap-3 items-center p-4 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 text-[var(--fg)]">
                                        <span className="icon-[tabler--check] size-5 text-[var(--accent)] shrink-0"></span>
                                        <span className="font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Sidebar (Right Column) */}
                <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-8">

                    {/* Context Box */}
                    {data.context && (
                        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] mb-3">Context & Role</h3>
                            <p className="text-[var(--muted)] text-sm leading-relaxed">
                                {data.context}
                            </p>
                        </div>
                    )}

                    {/* Tech Stack */}
                    {data.stack && (
                        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {data.stack.map((tech, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-medium text-[var(--muted)] inline-flex items-center gap-2">
                                        <span className={`${tech.icon} size-4 text-[var(--accent)]`}></span> {tech.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    {validLinks.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] mb-3 px-1">Resources</h3>
                            {validLinks.map((link, i) => (
                                <a
                                    key={i}
                                    href={link.url}
                                    target={link.is_external ? "_blank" : undefined}
                                    rel={link.is_external ? "noopener noreferrer" : undefined}
                                    className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md transition-all group"
                                >
                                    <span className="inline-flex items-center gap-3">
                                        <span className={`${link.icon} size-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors`}></span>
                                        <span className="font-medium text-[var(--fg)] text-sm">{link.label}</span>
                                    </span>
                                    <span className={`icon-[tabler--${link.is_external ? 'arrow-up-right' : 'chevron-right'}] size-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5`}></span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* What's Next */}
                    {data.next_steps && (
                        <div className="p-6 rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] to-[var(--background)]">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)] mb-4">What's Next</h3>
                            <ul className="space-y-3">
                                {data.next_steps.map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-[var(--muted)]">
                                        <span className="icon-[tabler--arrow-right] size-4 mt-0.5 text-[var(--accent)] shrink-0"></span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </aside>
            </div>

            {/* Pagination / Prev & Next */}
            <hr className="my-16 border-[var(--border)]" />
            <nav className="grid gap-4 sm:grid-cols-2">
                {prev ? (
                    <Link href={`/case-studies/${prev.slug}`} className="group flex items-center gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md transition-all">
                        <div className="p-2 rounded-full border border-[var(--border)] bg-[var(--background)] group-hover:border-[var(--accent)] transition-colors">
                            <span className="icon-[tabler--chevron-left] size-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors block" />
                        </div>
                        <span className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Previous Case</span>
                            <span className="font-semibold text-[var(--fg)] truncate">{prev.title}</span>
                        </span>
                    </Link>
                ) : <div />}

                {next ? (
                    <Link href={`/case-studies/${next.slug}`} className="group flex items-center justify-end text-right gap-4 p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md transition-all">
                        <span className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1">Next Case</span>
                            <span className="font-semibold text-[var(--fg)] truncate">{next.title}</span>
                        </span>
                        <div className="p-2 rounded-full border border-[var(--border)] bg-[var(--background)] group-hover:border-[var(--accent)] transition-colors">
                            <span className="icon-[tabler--chevron-right] size-5 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors block" />
                        </div>
                    </Link>
                ) : <div />}
            </nav>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
        </article>
    );
}
