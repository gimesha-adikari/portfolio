import type { EvidenceSource, ProjectEvidenceMeasurement } from "@/lib/project-evidence";
import { ProjectEvidenceBadge } from "./ProjectEvidenceBadge";

export function ProjectEvidenceTable({
    measurements,
    sources,
}: {
    measurements: readonly ProjectEvidenceMeasurement[];
    sources: readonly EvidenceSource[];
}) {
    const sourcesById = new Map(sources.map((source) => [source.id, source]));

    return (
        <section aria-labelledby="project-measurements-title" className="space-y-4">
            <div>
                <h3 id="project-measurements-title" className="text-xl font-bold text-[var(--fg)]">Evidence, measurements, and limits</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">Values retain their context, sample, method, and limits so an implementation detail is not mistaken for universal capacity or outcome evidence.</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <table className="min-w-[960px] w-full border-collapse text-left text-sm">
                    <caption className="sr-only">Project evidence table with classification, result, method, environment, sample, limitations, and source.</caption>
                    <thead className="bg-[var(--bg)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                        <tr>
                            <th scope="col" className="p-4">Evidence</th>
                            <th scope="col" className="p-4">Classification</th>
                            <th scope="col" className="p-4">Result and context</th>
                            <th scope="col" className="p-4">Method / environment / sample</th>
                            <th scope="col" className="p-4">Limitations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {measurements.map((measurement) => (
                            <tr key={measurement.claim} className="border-t border-[var(--border)] align-top">
                                <th scope="row" className="p-4 font-semibold text-[var(--fg)]">{measurement.claim}</th>
                                <td className="p-4"><ProjectEvidenceBadge classification={measurement.classification} /></td>
                                <td className="p-4 leading-relaxed text-[var(--fg)]">
                                    <p>{measurement.result}</p>
                                    <p className="mt-2 text-xs text-[var(--muted)]">{measurement.context}</p>
                                </td>
                                <td className="p-4 text-xs leading-relaxed text-[var(--muted)]">
                                    <p><span className="font-semibold text-[var(--fg)]">Method: </span>{measurement.method}</p>
                                    <p className="mt-2"><span className="font-semibold text-[var(--fg)]">Environment: </span>{measurement.environment}</p>
                                    <p className="mt-2"><span className="font-semibold text-[var(--fg)]">Sample: </span>{measurement.sample}</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {measurement.sources.map((sourceId) => {
                                            const source = sourcesById.get(sourceId);
                                            return source ? <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline decoration-[var(--accent)]/40 underline-offset-2 hover:decoration-[var(--accent)]">{source.label}</a> : null;
                                        })}
                                    </div>
                                </td>
                                <td className="p-4 text-xs leading-relaxed text-[var(--muted)]">
                                    <ul className="space-y-2">
                                        {measurement.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
