import type { EvidenceSource } from "@/lib/project-evidence";

export function ProjectSourceLinks({ sources }: { sources: readonly EvidenceSource[] }) {
    return (
        <section aria-labelledby="termstead-sources-title" className="space-y-4">
            <div>
                <h3 id="termstead-sources-title" className="text-xl font-bold text-[var(--fg)]">Source evidence</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">Links point to the commits inspected for this page. The classification attached to each claim is more important than the existence of a link alone.</p>
            </div>
            <ul className="grid gap-3 md:grid-cols-2">
                {sources.map((source) => (
                    <li key={source.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]">
                            {source.label}
                        </a>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{source.description}</p>
                        <p className="mt-3 break-all font-mono text-[11px] text-[var(--muted)]">commit {source.commit}{source.date ? ` · ${source.date}` : ""}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
