import CopyEmailButton from "./CopyEmailButton";

export default function ContactCards({
                                         email,
                                         githubUrl,
                                         linkedinUrl,
                                         vcardHref,
                                     }: {
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    vcardHref?: string;
}) {
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Hello Gimesha")}`;

    return (
        <ul className="grid gap-3 sm:gap-4" role="list">
            {/* Email row: container is a DIV (not <a>) to avoid nested anchors */}
            <li>
                <div
                    className="card group flex items-center justify-between px-4 py-3 rounded-[var(--radius)] hover:shadow-md transition-shadow"
                    role="group"
                    aria-label={`Email ${email}`}
                >
                    <a href={mailto} className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="icon-[tabler--mail] size-5 text-[var(--muted)]" aria-hidden />
                        <span className="font-medium truncate">{email}</span>
                    </a>

                    <div className="flex items-center gap-2">
                        {vcardHref ? (
                            <a
                                href={vcardHref}
                                download
                                className="hairline rounded-lg px-2 py-1 text-xs hover:bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)]"
                            >
                                Add to contacts
                            </a>
                        ) : null}
                        <CopyEmailButton email={email} />
                    </div>
                </div>
            </li>

            {/* GitHub */}
            <li>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="card group flex items-center justify-between px-4 py-3 rounded-[var(--radius)] hover:shadow-md transition-shadow"
                    aria-label="GitHub profile"
                >
          <span className="flex items-center gap-3">
            <span className="icon-[tabler--brand-github] size-5 text-[var(--muted)]" aria-hidden />
            <span className="font-medium">GitHub</span>
          </span>
                    <span className="icon-[tabler--arrow-up-right] size-5 text-[var(--muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden />
                </a>
            </li>

            {/* LinkedIn */}
            <li>
                <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="card group flex items-center justify-between px-4 py-3 rounded-[var(--radius)] hover:shadow-md transition-shadow"
                    aria-label="LinkedIn profile"
                >
          <span className="flex items-center gap-3">
            <span className="icon-[tabler--brand-linkedin] size-5 text-[var(--muted)]" aria-hidden />
            <span className="font-medium">LinkedIn</span>
          </span>
                    <span className="icon-[tabler--arrow-up-right] size-5 text-[var(--muted)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden />
                </a>
            </li>
        </ul>
    );
}
