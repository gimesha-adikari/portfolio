import Link from "next/link";
import { buildRouteMetadata } from "@/lib/route-metadata";
import { formatEngineeringNoteDate, getPublishedEngineeringNotes } from "@/lib/engineering-notes";
import { getPortfolioProjectBySlug } from "@/lib/portfolio-projects";

export const metadata = buildRouteMetadata({
    title: "Engineering Notes",
    description: "Focused, source-backed engineering notes about debugging decisions and technical boundaries.",
    path: "/engineering-notes",
    type: "website",
});

export default function EngineeringNotesIndex() {
    const notes = getPublishedEngineeringNotes();

    return (
        <div className="max-w-5xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            <header className="max-w-3xl mb-12 md:mb-16">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Evidence-backed writing</p>
                <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--fg)]">
                    Engineering Notes
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-[var(--muted)]">
                    Narrow technical notes about one engineering question at a time, grounded in public source, debugging evidence, and explicit limitations.
                </p>
            </header>

            <ul className="grid gap-6" aria-label="Published engineering notes">
                {notes.map((note) => {
                    const project = getPortfolioProjectBySlug(note.projectSlug);

                    return (
                        <li key={note.slug}>
                            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 hover:border-[var(--accent)] transition-colors">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)]">
                                    <span className="font-semibold text-[var(--accent)]">Engineering Note</span>
                                    <span aria-hidden>·</span>
                                    <Link href={`/projects/${note.projectSlug}`} className="hover:text-[var(--fg)] hover:underline">
                                        {project?.title ?? note.projectSlug}
                                    </Link>
                                    <span aria-hidden>·</span>
                                    <time dateTime={note.publishedAt}>{formatEngineeringNoteDate(note.publishedAt)}</time>
                                </div>

                                <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-[var(--fg)]">
                                    <Link href={`/engineering-notes/${note.slug}`} className="hover:text-[var(--accent)] transition-colors">
                                        {note.title}
                                    </Link>
                                </h2>
                                <p className="mt-4 text-[var(--muted)] leading-relaxed">{note.description}</p>
                                <p className="mt-4 border-l-2 border-[var(--accent)] pl-4 text-sm sm:text-base leading-relaxed text-[var(--fg)]">
                                    <span className="font-semibold">Question:</span> {note.question}
                                </p>

                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                    {note.tags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
                                            {tag}
                                        </span>
                                    ))}
                                    <Link
                                        href={`/engineering-notes/${note.slug}`}
                                        className="ml-auto inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 transition-opacity"
                                    >
                                        Read the note
                                    </Link>
                                </div>
                            </article>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
