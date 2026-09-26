import type { ProjectWorkflow } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

const MODE_LABELS: Record<ProjectWorkflow["mode"], string> = {
    sync: "Synchronous",
    async: "Asynchronous",
    preview: "Preview",
};

export function ProjectWorkflowMatrix({ workflows }: { workflows: readonly ProjectWorkflow[] }) {
    if (workflows.length === 0) return null;

    return (
        <section aria-labelledby="project-workflow-title" className="space-y-4">
            <div>
                <h3 id="project-workflow-title" className="text-xl font-bold text-[var(--fg)]">Workflow modes</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
                    The product keeps immediate responses, queued processing, and page previews as distinct contracts.
                </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <table className="min-w-[920px] w-full border-collapse text-left text-sm">
                    <caption className="sr-only">Workflow modes with entry point, owner, processing boundary, result, and evidence classification.</caption>
                    <thead className="bg-[var(--bg)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                        <tr>
                            <th scope="col" className="p-4">Workflow</th>
                            <th scope="col" className="p-4">Mode</th>
                            <th scope="col" className="p-4">Entry point / owner</th>
                            <th scope="col" className="p-4">Processing and result</th>
                            <th scope="col" className="p-4">Evidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workflows.map((workflow) => (
                            <tr key={workflow.title} className="border-t border-[var(--border)] align-top">
                                <th scope="row" className="p-4 font-semibold text-[var(--fg)]">{workflow.title}</th>
                                <td className="p-4">
                                    <div className="space-y-2">
                                        <span className="inline-flex rounded-full border border-[var(--border)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                                            {MODE_LABELS[workflow.mode]}
                                        </span>
                                        <ProjectEvidenceBadge classification={workflow.classification} />
                                    </div>
                                </td>
                                <td className="p-4 text-xs leading-relaxed text-[var(--muted)]">
                                    <p>{workflow.entryPoint}</p>
                                    <p className="mt-2"><span className="font-semibold text-[var(--fg)]">Owner: </span>{workflow.owner}</p>
                                </td>
                                <td className="p-4 leading-relaxed text-[var(--fg)]">
                                    <p>{workflow.processing}</p>
                                    <p className="mt-2 text-xs text-[var(--muted)]"><span className="font-semibold text-[var(--fg)]">Result: </span>{workflow.result}</p>
                                </td>
                                <td className="p-4 text-xs text-[var(--muted)]">{workflow.sources.join(", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
