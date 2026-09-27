import type { PortfolioProject, RepositoryFacts } from "@/lib/portfolio-projects";

function formatDate(value?: string): string {
    if (!value) return "Not available";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" }).format(date);
}

function formatNumber(value?: number): string {
    return typeof value === "number"
        ? new Intl.NumberFormat(undefined, { notation: "compact" }).format(value)
        : "Not available";
}

export function PortfolioProjectRepositories({
    project,
    facts,
}: {
    project: PortfolioProject;
    facts: readonly RepositoryFacts[];
}) {
    const factsByName = new Map(facts.map((fact) => [fact.name, fact]));

    return (
        <section className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl font-bold text-[var(--fg)]">Repository enrichment</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">Mutable public facts are optional; the project identity above is portfolio-owned.</p>
                </div>
                <span className="text-xs text-[var(--muted)]">{facts.length} of {project.repositories.length} enriched</span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {project.repositories.map((repository) => {
                    const fact = factsByName.get(repository.name);
                    return (
                        <div key={repository.name} className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-[var(--fg)]">{repository.name}</h3>
                                    <p className="mt-1 text-xs text-[var(--muted)]">{repository.role}</p>
                                </div>
                                <span className="text-xs text-[var(--muted)]">{fact?.isPublic === true ? "Public" : "Portfolio source"}</span>
                            </div>
                            {fact ? (
                                <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                                    <div><dt className="text-[var(--muted)]">Updated</dt><dd className="mt-1 text-[var(--fg)]">{formatDate(fact.updatedAt)}</dd></div>
                                    <div><dt className="text-[var(--muted)]">Language</dt><dd className="mt-1 text-[var(--fg)]">{fact.language ?? "Not available"}</dd></div>
                                    <div><dt className="text-[var(--muted)]">Stars</dt><dd className="mt-1 text-[var(--fg)]">{formatNumber(fact.stars)}</dd></div>
                                    <div><dt className="text-[var(--muted)]">Forks</dt><dd className="mt-1 text-[var(--fg)]">{formatNumber(fact.forks)}</dd></div>
                                </dl>
                            ) : (
                                <p className="mt-4 text-xs leading-relaxed text-[var(--muted)]">GitHub enrichment is unavailable; curated content remains available.</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
