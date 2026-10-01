import type { EvidenceClassification } from "@/lib/project-evidence";

export function ProjectEvidenceBadge({ classification }: { classification: EvidenceClassification }) {
    return (
        <span className="inline-flex rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            {classification}
        </span>
    );
}
