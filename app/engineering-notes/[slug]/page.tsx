import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RenderMDX } from "@/components/MDX";
import {
    formatEngineeringNoteDate,
    getPublishedEngineeringNoteBySlug,
    getPublishedEngineeringNotes,
} from "@/lib/engineering-notes";
import { absoluteSiteUrl, buildNotFoundMetadata, buildRouteMetadata } from "@/lib/route-metadata";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-projects";
import { siteConfig } from "@/lib/siteConfig";

export const dynamicParams = false;
export const revalidate = 3600;

type Params = { slug: string };

export function generateStaticParams() {
    return getPublishedEngineeringNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    const note = getPublishedEngineeringNoteBySlug(slug);

    if (!note) {
        return buildNotFoundMetadata({ label: "Engineering note", path: `/engineering-notes/${slug}` });
    }

    return buildRouteMetadata({
        title: note.title,
        description: note.description,
        path: `/engineering-notes/${note.slug}`,
        type: "article",
    });
}

export default async function EngineeringNotePage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const note = getPublishedEngineeringNoteBySlug(slug);
    if (!note) notFound();

    const project = getPortfolioProjectBySlug(note.projectSlug);
    const canonicalUrl = absoluteSiteUrl(`/engineering-notes/${note.slug}`);
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: note.title,
        description: note.description,
        datePublished: note.publishedAt,
        ...(note.updatedAt ? { dateModified: note.updatedAt } : {}),
        author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.canonicalUrl,
        },
        url: canonicalUrl,
        keywords: note.tags,
        mainEntityOfPage: canonicalUrl,
    };

    return (
        <article className="max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <Link
                href="/engineering-notes"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--fg)] transition-colors"
            >
                <span className="icon-[tabler--arrow-left] size-4" aria-hidden />
                All Engineering Notes
            </Link>

            <header className="mt-10 max-w-4xl">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
                    <span className="font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Engineering Note</span>
                    <span aria-hidden>·</span>
                    <Link href={`/projects/${note.projectSlug}`} className="hover:text-[var(--fg)] hover:underline">
                        {project?.title ?? note.projectSlug}
                    </Link>
                    <span aria-hidden>·</span>
                    <time dateTime={note.publishedAt}>{formatEngineeringNoteDate(note.publishedAt)}</time>
                </div>
                <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">
                    {note.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg md:text-xl leading-relaxed text-[var(--muted)]">
                    {note.description}
                </p>
                <p className="mt-6 max-w-3xl border-l-2 border-[var(--accent)] pl-4 text-base md:text-lg leading-relaxed text-[var(--fg)]">
                    <span className="font-semibold">Question:</span> {note.question}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {note.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            <div className="mt-12 max-w-3xl min-w-0">
                <RenderMDX source={note.content} />
            </div>

            {note.relatedCaseStudies.length > 0 && (
                <section className="mt-12 max-w-3xl border-t border-[var(--border)] pt-8" aria-labelledby="related-case-studies-title">
                    <h2 id="related-case-studies-title" className="text-xl font-bold text-[var(--fg)]">Related case studies</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {note.relatedCaseStudies.map((caseStudy) => (
                            <Link key={caseStudy} href={`/case-studies/${caseStudy}`} className="min-h-11 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] hover:border-[var(--accent)] transition-colors">
                                {caseStudy}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-12 max-w-3xl border-t border-[var(--border)] pt-8" aria-labelledby="source-title">
                <h2 id="source-title" className="text-xl font-bold text-[var(--fg)]">Source</h2>
                <ul className="mt-4 space-y-3">
                    {note.sourceLinks.map((source) => (
                        <li key={source.url}>
                            <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
                            >
                                <span className="icon-[tabler--brand-github] size-4" aria-hidden />
                                {source.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
        </article>
    );
}
