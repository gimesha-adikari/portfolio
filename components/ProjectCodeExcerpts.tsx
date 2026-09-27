import type { ProjectCodeExcerpt } from "@/lib/project-evidence";

export function ProjectCodeExcerpts({ excerpts }: { excerpts: readonly ProjectCodeExcerpt[] }) {
    if (excerpts.length === 0) return null;

    return (
        <section aria-labelledby="project-code-excerpts-title" className="space-y-4">
            <div>
                <h3 id="project-code-excerpts-title" className="text-xl font-bold text-[var(--fg)]">Focused code excerpts</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">Short, source-pinned excerpts make one engineering boundary concrete without reproducing a source file.</p>
            </div>
            <div className="grid gap-4">
                {excerpts.map((excerpt) => (
                    <article key={`${excerpt.title}-${excerpt.source}`} className="min-w-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-lg font-semibold text-[var(--fg)]">{excerpt.title}</h4>
                            <span className="rounded-full border border-[var(--border)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">{excerpt.language}</span>
                        </div>
                        <pre tabIndex={0} className="mt-4 w-full min-w-0 max-w-full overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 text-xs leading-relaxed text-[var(--fg)]"><code>{excerpt.code}</code></pre>
                        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{excerpt.explanation}</p>
                        {excerpt.limitation ? <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]"><span className="font-semibold text-[var(--fg)]">Limit:</span> {excerpt.limitation}</p> : null}
                        <p className="mt-4 break-words text-xs leading-relaxed text-[var(--muted)]">
                            <a href={excerpt.source} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]">View exact source</a>
                            {excerpt.sourceCommit ? <span className="ml-2 font-mono">commit {excerpt.sourceCommit}</span> : null}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}
