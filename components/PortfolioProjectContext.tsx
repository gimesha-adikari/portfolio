import type { PortfolioProject } from "@/lib/portfolio-projects";

export function PortfolioProjectContext({ project }: { project: PortfolioProject }) {
    return (
        <>
            <section className="card p-6 md:p-8 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-l-2xl" />
                <h2 className="text-xl font-bold text-[var(--fg)] flex items-center gap-2">
                    <span className="icon-[tabler--target] text-[var(--accent)] size-5" aria-hidden />
                    Problem
                </h2>
                <p className="mt-4 text-[var(--muted)] leading-relaxed md:text-lg">{project.problem}</p>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Constraints</h2>
                    <ul className="mt-5 space-y-3 text-sm text-[var(--muted)]">
                        {project.constraints.map((constraint) => (
                            <li key={constraint} className="flex items-start gap-3">
                                <span className="icon-[tabler--check] size-5 mt-0.5 text-[var(--accent-2)] shrink-0" aria-hidden />
                                <span className="leading-relaxed">{constraint}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                    <h2 className="text-lg font-bold text-[var(--fg)]">Architecture</h2>
                    <div className="mt-5 space-y-5">
                        {project.architecture.map((block) => (
                            <div key={block.boundary} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                                <h3 className="font-semibold text-[var(--fg)]">{block.boundary}</h3>
                                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{block.responsibility}</p>
                                {block.technologies.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                        {block.technologies.map((technology) => (
                                            <span key={technology} className="rounded-md bg-[var(--bg)] px-2 py-1 text-[11px] text-[var(--muted)]">
                                                {technology}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
