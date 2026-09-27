import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

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
                            {siteConfig.displayDomain}
                        </div>
                        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>

                    </div>

                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                            <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                            <Link href="/projects" className="hover:text-[var(--accent)] transition-colors">Projects</Link>
                            <Link href="/contact" className="hover:text-[var(--accent)] transition-colors">Contact</Link>
                            <Link href={siteConfig.cvPath} className="hover:text-[var(--accent)] transition-colors">CV</Link>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                            <a
                                href={siteConfig.github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:-translate-y-0.5 transition-all"
                                aria-label="GitHub Profile"
                            >
                                <span className="icon-[tabler--brand-github] size-5" />
                            </a>
                            <a
                                href={siteConfig.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--muted)] hover:text-[#0a66c2] hover:-translate-y-0.5 transition-all"
                                aria-label="LinkedIn Profile"
                            >
                                <span className="icon-[tabler--brand-linkedin] size-5" />
                            </a>
                            <a
                                href={`mailto:${siteConfig.email}`}
                                className="inline-flex min-h-11 min-w-11 items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] hover:-translate-y-0.5 transition-all"
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
