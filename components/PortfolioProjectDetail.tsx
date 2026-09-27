import Link from "next/link";
import { formatEngineeringNoteDate, getEngineeringNotesForProject } from "@/lib/engineering-notes";
import type { PortfolioProject, RepositoryFacts } from "@/lib/portfolio-projects";
import { siteConfig } from "@/lib/siteConfig";
import { PortfolioProjectContext } from "./PortfolioProjectContext";
import { PortfolioProjectEvidence } from "./PortfolioProjectEvidence";
import { PortfolioProjectGallery } from "./PortfolioProjectGallery";
import { PortfolioProjectHero } from "./PortfolioProjectHero";
import { PortfolioProjectRepositories } from "./PortfolioProjectRepositories";
import { PortfolioProjectTechnicalEvidence } from "./PortfolioProjectTechnicalEvidence";

export function PortfolioProjectDetail({
    project,
    facts = [],
}: {
    project: PortfolioProject;
    facts?: readonly RepositoryFacts[];
}) {
    const engineeringNotes = getEngineeringNotesForProject(project.slug);
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.tagline,
        url: project.liveUrl ?? project.repositories[0]?.url,
        codeRepository: project.repositories.map((repository) => repository.url),
        author: {
            "@type": "Person",
            name: siteConfig.name,
            url: siteConfig.canonicalUrl,
        },
    };

    return (
        <article className="space-y-12 pb-20 container-xl max-w-5xl mx-auto pt-6">
            <PortfolioProjectHero project={project} />
            <PortfolioProjectContext project={project} />
            {project.technicalEvidence
                ? <PortfolioProjectTechnicalEvidence project={project} />
                : <PortfolioProjectEvidence project={project} />}
            <PortfolioProjectGallery project={project} />
            <PortfolioProjectRepositories project={project} facts={facts} />

            {project.caseStudies && project.caseStudies.length > 0 && (
                <section className="space-y-4" aria-labelledby="related-case-studies-title">
                    <h2 id="related-case-studies-title" className="text-xl font-bold text-[var(--fg)]">Related case studies</h2>
                    <div className="flex flex-wrap gap-3">
                        {project.caseStudies.map((slug) => (
                            <Link
                                key={slug}
                                href={`/case-studies/${slug}`}
                                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
                            >
                                {slug}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {engineeringNotes.length > 0 && (
                <section className="space-y-4" aria-labelledby="related-engineering-notes-title">
                    <h2 id="related-engineering-notes-title" className="text-xl font-bold text-[var(--fg)]">Related Engineering Notes</h2>
                    <div className="grid gap-4">
                        {engineeringNotes.map((note) => (
                            <Link
                                key={note.slug}
                                href={`/engineering-notes/${note.slug}`}
                                className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)] transition-colors"
                            >
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
                                    <span className="font-semibold uppercase tracking-wider text-[var(--accent)]">Engineering Note</span>
                                    <span aria-hidden>·</span>
                                    <time dateTime={note.publishedAt}>{formatEngineeringNoteDate(note.publishedAt)}</time>
                                </div>
                                <h3 className="mt-2 font-semibold text-[var(--fg)]">{note.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{note.question}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {project.contentNotes && project.contentNotes.length > 0 && (
                <section className="card p-6 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Content notes</h2>
                    <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                        {project.contentNotes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                </section>
            )}

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        </article>
    );
}
