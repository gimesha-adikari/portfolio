
import CopyEmailButton from "./CopyEmailButton";
import Reveal from "@/components/Reveal";

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
        <div className="grid gap-4 sm:grid-cols-2 text-[var(--fg)]">

            {/* Bento Box 1: Email (Spans Full Width) */}
            <Reveal delay={0.1} className="sm:col-span-2">
                <div className="group relative overflow-hidden rounded-[16px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-md p-5 sm:p-6 hover:border-[var(--accent)] transition-colors shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <a href={mailto} className="relative z-10 flex items-center gap-4 flex-1 min-w-0" aria-label={`Email ${email}`}>
                        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] group-hover:scale-105 transition-transform duration-500 shadow-sm">
                            <span className="icon-[tabler--mail-filled] size-7" aria-hidden />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Email Me</h2>
                            <p className="mt-1 truncate text-lg sm:text-xl font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                                {email}
                            </p>
                        </div>
                    </a>

                    <div className="relative z-10 flex items-center gap-3 sm:ml-auto">
                        {vcardHref && (
                            <a
                                href={vcardHref}
                                download
                                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                            >
                                <span className="icon-[tabler--address-book] size-4" aria-hidden />
                                Save Contact
                            </a>
                        )}
                        <CopyEmailButton email={email} />
                    </div>
                </div>
            </Reveal>

            {/* Bento Box 2: GitHub */}
            <Reveal delay={0.2}>
                <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-md p-6 h-40 hover:border-[var(--fg)] transition-colors shadow-sm"
                    aria-label="GitHub profile"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] group-hover:scale-110 transition-transform duration-500 shadow-sm">
                            <span className="icon-[tabler--brand-github-filled] size-6" aria-hidden />
                        </div>
                        <span className="icon-[tabler--arrow-up-right] size-6 text-[var(--muted)] group-hover:text-[var(--fg)] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">GitHub</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">Check out my open source projects</p>
                    </div>
                </a>
            </Reveal>

            {/* Bento Box 3: LinkedIn */}
            <Reveal delay={0.3}>
                <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="group relative flex flex-col justify-between overflow-hidden rounded-[16px] border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-md p-6 h-40 hover:border-[#0a66c2] transition-colors shadow-sm"
                    aria-label="LinkedIn profile"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative z-10 flex items-start justify-between">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[#0a66c2] group-hover:scale-110 transition-transform duration-500 shadow-sm">
                            <span className="icon-[tabler--brand-linkedin] size-6" aria-hidden />
                        </div>
                        <span className="icon-[tabler--arrow-up-right] size-6 text-[var(--muted)] group-hover:text-[#0a66c2] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" aria-hidden />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold">LinkedIn</h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">Connect with me professionally</p>
                    </div>
                </a>
            </Reveal>

        </div>
    );
}