import Link from "next/link";

export function Footer() {
    return (
        <footer className="relative border-t border-[var(--border)] overflow-hidden bg-[var(--bg)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-20" />

            <div className="container-xl py-8 md:py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    <div className="flex flex-col items-center md:items-start gap-3 text-sm text-[var(--muted)]">
                        <div className="flex items-center gap-2 font-medium text-[var(--fg)]">
                            <span className="flex size-5 items-center justify-center rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
                                <span className="icon-[tabler--code] size-3" aria-hidden />
                            </span>
                            gimesha.dev
                        </div>
                        <p>© {new Date().getFullYear()} Gimesha Nirmal. All rights reserved.</p>

                        <div className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] mt-1">
                            <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-[var(--success)]"></span>
                            </span>
                            All systems operational
                        </div>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                            <Link href="/projects" className="hover:text-[var(--accent)] transition-colors">Projects</Link>
                            <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <a
                                href="https://github.com/gimesha-adikari"
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--muted)] hover:text-[var(--fg)] hover:-translate-y-0.5 transition-all"
                                aria-label="GitHub Profile"
                            >
                                <span className="icon-[tabler--brand-github] size-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/gimesha-adikari"
                                target="_blank"
                                rel="noreferrer"
                                className="text-[var(--muted)] hover:text-[#0a66c2] hover:-translate-y-0.5 transition-all"
                                aria-label="LinkedIn Profile"
                            >
                                <span className="icon-[tabler--brand-linkedin] size-5" />
                            </a>
                            <a
                                href="mailto:contact@gimesha.dev"
                                className="text-[var(--muted)] hover:text-[var(--accent)] hover:-translate-y-0.5 transition-all"
                                aria-label="Email Me"
                            >
                                <span className="icon-[tabler--mail] size-5" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}