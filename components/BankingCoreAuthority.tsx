import type { ProjectTechnicalEvidence } from "@/lib/project-evidence";

export function BankingCoreAuthority({ evidence }: { evidence: ProjectTechnicalEvidence }) {
    const springBoundary = evidence.ownership.find((item) => item.boundary === "Spring backend API and persistence");
    const webBoundary = evidence.ownership.find((item) => item.boundary === "Next.js web client");
    const androidBoundary = evidence.ownership.find((item) => item.boundary === "Android client");
    const kycBoundary = evidence.ownership.find((item) => item.boundary === "Identity-verification service");

    if (!springBoundary || !webBoundary || !androidBoundary || !kycBoundary) return null;

    return (
        <section className="banking-core-authority" aria-labelledby="banking-core-authority-title">
            <header className="banking-core-authority__header">
                <p className="banking-core-authority__eyebrow">Authority map</p>
                <h2 id="banking-core-authority-title" className="banking-core-authority__title">
                    One core, three surrounding boundaries
                </h2>
                <p className="banking-core-authority__intro">
                    BankingSystem owns the authoritative Spring backend, protected API, authentication and authorization, JWT/session validation, banking rules, and persistence. The Next.js web and Android applications are clients; FastAPI KYC remains a bounded service relationship.
                </p>
            </header>

            <figure className="banking-core-authority__figure">
                <figcaption className="banking-core-authority__caption">
                    One authoritative backend with three surrounding boundaries — not a linear processing sequence.
                </figcaption>

                <div className="banking-core-authority__topology">
                    <article className="banking-core-authority__core">
                        <p className="banking-core-authority__label">Core authority</p>
                        <h3 className="banking-core-authority__domain-title">Spring backend</h3>
                        <p className="banking-core-authority__domain-summary">API + authentication + persistence</p>
                        <ul className="banking-core-authority__list">
                            <li>Authentication + roles</li>
                            <li>JWT and session validation</li>
                            <li>Customer, account, KYC, and wallet modules</li>
                            <li>MySQL / Flyway persistence</li>
                        </ul>
                        <p className="banking-core-authority__authority-note">
                            <span className="icon-[tabler--shield-check]" aria-hidden="true" />
                            Protected-resource authorization remains server-owned.
                        </p>
                    </article>

                    <article className="banking-core-authority__domain banking-core-authority__domain--web">
                        <p className="banking-core-authority__label">Client / browser</p>
                        <h3 className="banking-core-authority__domain-title">Next.js web</h3>
                        <p className="banking-core-authority__domain-summary">{webBoundary.responsibility}</p>
                        <ul className="banking-core-authority__list">
                            <li>Next.js App Router</li>
                            <li>Role-aware browser UX</li>
                            <li>Typed / Bearer API boundary</li>
                        </ul>
                        <p className="banking-core-authority__relationship">JSON / multipart API boundary</p>
                    </article>

                    <article className="banking-core-authority__domain banking-core-authority__domain--android">
                        <p className="banking-core-authority__label">Client / device</p>
                        <h3 className="banking-core-authority__domain-title">Android client</h3>
                        <p className="banking-core-authority__domain-summary">{androidBoundary.responsibility}</p>
                        <ul className="banking-core-authority__list">
                            <li>Compose application shell</li>
                            <li>Retrofit / OkHttp API boundary</li>
                            <li>Account, KYC, and wallet flows</li>
                        </ul>
                        <p className="banking-core-authority__relationship">Bearer API boundary</p>
                    </article>

                    <article className="banking-core-authority__domain banking-core-authority__domain--kyc">
                        <p className="banking-core-authority__label">Bounded service</p>
                        <h3 className="banking-core-authority__domain-title">FastAPI KYC</h3>
                        <p className="banking-core-authority__domain-summary">{kycBoundary.responsibility}</p>
                        <ul className="banking-core-authority__list">
                            <li>Document, OCR, face, and liveness checks</li>
                            <li>Aggregate decision policy</li>
                            <li>APPROVE / UNDER_REVIEW / REJECT</li>
                        </ul>
                        <p className="banking-core-authority__relationship">Bounded Spring-to-KYC call</p>
                    </article>
                </div>

                <p className="banking-core-authority__figure-note">
                    Client route guards and device-local token protection support the clients; they do not replace BankingSystem server authorization.
                </p>
            </figure>

            <aside className="banking-core-authority__distinction" aria-labelledby="banking-authority-distinction-title">
                <div>
                    <p className="banking-core-authority__eyebrow">Ownership distinction</p>
                    <h3 id="banking-authority-distinction-title" className="banking-core-authority__distinction-title">
                        Device-local protection <span aria-hidden="true">≠</span><span className="sr-only">does not equal</span> server authority
                    </h3>
                </div>
                <div className="banking-core-authority__distinction-grid">
                    <div>
                        <p className="banking-core-authority__label">Device-local protection</p>
                        <p className="banking-core-authority__distinction-text">Android Keystore-backed token storage and app-lock UI.</p>
                    </div>
                    <div className="banking-core-authority__distinction-mark" aria-hidden="true">≠</div>
                    <div>
                        <p className="banking-core-authority__label">Server authority</p>
                        <p className="banking-core-authority__distinction-text">BankingSystem authorization, JWT/session validation, banking rules, and owner checks.</p>
                    </div>
                </div>
            </aside>
        </section>
    );
}
