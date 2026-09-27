export function ProjectLimitations({ limitations }: { limitations: readonly string[] }) {
    return (
        <section aria-labelledby="project-limitations-title" className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-5 md:p-6">
            <h3 id="project-limitations-title" className="text-xl font-bold text-[var(--fg)]">Limitations and deferred evidence</h3>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-[var(--muted)] md:grid-cols-2">
                {limitations.map((limitation) => <li key={limitation} className="border-l-2 border-[var(--accent)] pl-3">{limitation}</li>)}
            </ul>
        </section>
    );
}
