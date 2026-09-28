type FingerprintKind = "termstead" | "platen" | "banking";

function fingerprintKindForSlug(slug: string): FingerprintKind | null {
    if (slug === "termstead") return "termstead";
    if (slug === "pdfnest") return "platen";
    if (slug === "banking-platform") return "banking";
    return null;
}

export function ProjectFingerprint({ projectSlug }: { projectSlug: string }) {
    const kind = fingerprintKindForSlug(projectSlug);
    if (!kind) return null;

    return (
        <div className={`project-fingerprint project-fingerprint--${kind}`} aria-hidden="true">
            <svg
                viewBox="0 0 120 64"
                role="presentation"
                focusable="false"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid meet"
            >
                {kind === "termstead" && (
                    <>
                        <g className="project-fingerprint__connectors" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path className="project-fingerprint__connector project-fingerprint__connector--source" d="M19 22H45M19 42H45M45 22V42" />
                            <path className="project-fingerprint__connector project-fingerprint__connector--handoff" d="M45 32H58" />
                            <path className="project-fingerprint__connector project-fingerprint__connector--authority" d="M67 32H101" />
                            <path className="project-fingerprint__boundary" d="M58 10V54M58 10H66M58 54H66" />
                        </g>
                        <path className="project-fingerprint__signal project-fingerprint__signal--handoff" d="M45 32H58" pathLength="1" />
                        <g className="project-fingerprint__nodes">
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="19" cy="22" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="19" cy="42" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--authority" cx="101" cy="32" r="6" />
                        </g>
                    </>
                )}

                {kind === "platen" && (
                    <>
                        <g className="project-fingerprint__connectors" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path className="project-fingerprint__connector project-fingerprint__connector--source" d="M60 13V26" />
                            <path className="project-fingerprint__connector project-fingerprint__connector--branch-direct" d="M60 36L25 54" />
                            <path className="project-fingerprint__connector project-fingerprint__connector--branch-worker" d="M60 36L95 54" />
                            <path className="project-fingerprint__boundary project-fingerprint__boundary--worker" d="M76 42H111V59H76Z" />
                        </g>
                        <path className="project-fingerprint__signal project-fingerprint__signal--direct" d="M60 36L25 54" pathLength="1" />
                        <path className="project-fingerprint__signal project-fingerprint__signal--worker" d="M60 36L95 54" pathLength="1" />
                        <g className="project-fingerprint__nodes">
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="60" cy="10" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--api" cx="60" cy="32" r="6" />
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary project-fingerprint__node--direct" cx="25" cy="54" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--accent project-fingerprint__node--worker" cx="95" cy="54" r="4" />
                            <path className="project-fingerprint__job" d="M90 49V59M95 49V59M100 49V59" />
                        </g>
                    </>
                )}

                {kind === "banking" && (
                    <>
                        <g className="project-fingerprint__connectors" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path className="project-fingerprint__connector project-fingerprint__connector--relationship" d="M25 16L52 29M25 48L52 35M68 32H96" />
                            <circle className="project-fingerprint__boundary" cx="60" cy="32" r="13" />
                        </g>
                        <g className="project-fingerprint__nodes">
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="25" cy="16" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="25" cy="48" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--core" cx="60" cy="32" r="7" />
                            <circle className="project-fingerprint__node project-fingerprint__node--accent" cx="96" cy="32" r="4" />
                        </g>
                    </>
                )}
            </svg>
        </div>
    );
}
