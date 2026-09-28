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
                            <path d="M19 22H45M19 42H45M45 22V42M45 32H58M67 32H101" />
                            <path className="project-fingerprint__boundary" d="M58 10V54M58 10H66M58 54H66" />
                        </g>
                        <g className="project-fingerprint__nodes">
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="19" cy="22" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="19" cy="42" r="4" />
                            <circle className="project-fingerprint__node" cx="101" cy="32" r="6" />
                        </g>
                    </>
                )}

                {kind === "platen" && (
                    <>
                        <g className="project-fingerprint__connectors" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M60 13V26M60 36L25 54M60 36L95 54" />
                            <path className="project-fingerprint__boundary" d="M76 42H111V59H76Z" />
                        </g>
                        <g className="project-fingerprint__nodes">
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="60" cy="10" r="4" />
                            <circle className="project-fingerprint__node" cx="60" cy="32" r="6" />
                            <circle className="project-fingerprint__node project-fingerprint__node--secondary" cx="25" cy="54" r="4" />
                            <circle className="project-fingerprint__node project-fingerprint__node--accent" cx="95" cy="54" r="4" />
                            <path className="project-fingerprint__job" d="M90 49V59M95 49V59M100 49V59" />
                        </g>
                    </>
                )}

                {kind === "banking" && (
                    <>
                        <g className="project-fingerprint__connectors" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M25 16L52 29M25 48L52 35M68 32H96" />
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
