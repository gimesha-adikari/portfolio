"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navItems";
import { Icon } from "@/components/Icon";

type NavItem = { href: string; label: string; icon: string; hideInHeader?: boolean };

export default function Header() {
    const pathname = usePathname();
    const headerLinks = (NAV_ITEMS as NavItem[]).filter((i) => !i.hideInHeader);

    return (
        <header className="sticky top-0 z-40 sm:ps-[var(--sidebar-w)]">
            <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_94%,transparent)]/95 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="font-semibold tracking-tight text-sm sm:text-base text-[var(--fg)]">
                        gimesha.dev
                    </Link>

                    <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
                        {headerLinks.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                                        isActive
                                            ? "border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] text-[var(--fg)]"
                                            : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]"
                                    }`}
                                >
                                    <Icon name={item.icon} className="size-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="collapsible-mini-sidebar"
                        data-overlay="#collapsible-mini-sidebar"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
}