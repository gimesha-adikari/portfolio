import type { PortfolioProject } from "@/lib/portfolio-projects";

export function PlatenProcessingModes({ project }: { project: PortfolioProject }) {
    const workflows = project.technicalEvidence?.workflows ?? [];
    const direct = workflows.filter((workflow) => workflow.mode === "sync" && workflow.title !== "Optional local document engine");
    const asyncMode = workflows.find((workflow) => workflow.mode === "async");
    const preview = workflows.find((workflow) => workflow.mode === "preview");
    const optionalEngine = workflows.find((workflow) => workflow.title === "Optional local document engine");

    if (!direct.length || !asyncMode || !preview || !optionalEngine) return null;

    const modes = [
        {
            label: "Direct response",
            title: direct.map((workflow) => workflow.title).join(" / "),
            detail: direct.map((workflow) => workflow.result).join(" "),
        },
        { label: "Async task / worker", title: asyncMode.title, detail: `${asyncMode.processing} ${asyncMode.result}` },
        { label: "Preview mode", title: preview.title, detail: `${preview.processing} ${preview.result}` },
    ];

    return (
        <section className="platen-processing-modes space-y-7 border-y border-[var(--border)] py-8 sm:space-y-9 sm:py-10" aria-labelledby="platen-processing-modes-title">
            <header className="max-w-3xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">Processing model</p>
                <h2 id="platen-processing-modes-title" className="text-2xl font-semibold tracking-tight text-[var(--fg)] sm:text-3xl">One API, multiple legitimate response modes</h2>
                <p className="text-sm leading-relaxed text-[var(--muted)]">The browser workspace talks to the Go API. Each operation uses a direct, async, or preview mode.</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,0.55fr)_minmax(0,1.65fr)] lg:gap-10">
                <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Browser / workspace</p>
                    <h3 className="text-lg font-semibold text-[var(--fg)]">Workspace ownership</h3>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">Tool selection, file state, preview, and local results remain in the web workspace.</p>
                </div>

                <div className="space-y-3 border-l border-[var(--border)] pl-5 lg:border-x lg:px-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">Request boundary</p>
                    <h3 className="text-lg font-semibold text-[var(--fg)]">Go API</h3>
                    <p className="text-sm leading-relaxed text-[var(--muted)]">Owns the application/file boundary and selects the operation-dependent path.</p>
                </div>

                <div className="space-y-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Alternative modes, not sequential stages</p>
                    <ol className="grid gap-6 lg:grid-cols-3">
                        {modes.map((mode) => (
                            <li key={mode.label} className="relative space-y-2 border-t border-[var(--border)] pt-4">
                                <span aria-hidden="true" className="absolute -top-1.5 left-0 h-2 w-2 rounded-full bg-[var(--accent)]" />
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">{mode.label}</p>
                                <h3 className="text-base font-semibold text-[var(--fg)]">{mode.title}</h3>
                                <p className="text-sm leading-relaxed text-[var(--muted)]">{mode.detail}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="space-y-2 border-t border-dashed border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Optional local engine</p>
                <p><strong className="font-semibold text-[var(--fg)]">{optionalEngine.title}.</strong> Explicit adapter; not a required service.</p>
            </div>
            <p className="text-xs leading-relaxed text-[var(--muted)]">These are alternative operation-dependent modes, not phases of every request.</p>
        </section>
    );
}
