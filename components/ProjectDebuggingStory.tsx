import type { ProjectDebuggingStory as DebuggingStory } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectDebuggingStory({
    stories,
}: {
    stories: readonly DebuggingStory[];
}) {
    return (
        <section aria-labelledby="termstead-debugging-title" className="space-y-4">
            <div>
                <h3 id="termstead-debugging-title" className="text-xl font-bold text-[var(--fg)]">Debugging story</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">A concrete renderer defect shows how a boundary was tested without overstating the visual proof.</p>
            </div>
            <div className="space-y-4">
                {stories.map((story) => (
                    <article key={story.title} className="card border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold text-[var(--fg)]">{story.title}</h4>
                            <ProjectEvidenceBadge classification={story.classification} />
                        </div>
                        <dl className="mt-5 grid gap-4 md:grid-cols-2">
                            <div><dt className="font-semibold text-[var(--fg)]">Symptom</dt><dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{story.symptom}</dd></div>
                            <div><dt className="font-semibold text-[var(--fg)]">Root cause</dt><dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{story.rootCause}</dd></div>
                            <div><dt className="font-semibold text-[var(--fg)]">Correction</dt><dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{story.correction}</dd></div>
                            <div><dt className="font-semibold text-[var(--fg)]">Verification</dt><dd className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{story.verification}</dd></div>
                        </dl>
                        <div className="mt-5 border-t border-[var(--border)] pt-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Limitations</p>
                            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                                {story.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
