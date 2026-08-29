"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navItems";
import { Icon } from "@/components/Icon";
import { motion } from "framer-motion";

type NavItem = { href: string; label: string; icon: string; hideInHeader?: boolean };

export default function Header() {
    const pathname = usePathname();
    const headerLinks = (NAV_ITEMS as NavItem[]).filter((i) => !i.hideInHeader);

    return (
        <header className="sticky top-0 z-40 sm:ps-[var(--sidebar-w)]">
            <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)]/95 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 font-semibold tracking-tight text-sm sm:text-base text-[var(--fg)]"
                    >
                        <span className="flex size-6 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] transition-colors group-hover:border-[var(--accent)] group-hover:bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]">
                            <span className="icon-[tabler--code] size-4" aria-hidden />
                        </span>
                        gimesha<span className="text-[var(--muted)]">.com</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
                        {headerLinks.map((item) => {
                            const isActive = item.href === "/"
                                ? pathname === item.href
                                : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? "text-[var(--fg)]"
                                            : "text-[var(--muted)] hover:text-[var(--fg)]"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="header-active-pill"
                                            className="absolute inset-0 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] shadow-sm"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center gap-1.5">
                                        <Icon name={item.icon} className="size-4" />
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden inline-flex items-center justify-center size-9 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] transition-colors"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="collapsible-mini-sidebar"
                        data-overlay="#collapsible-mini-sidebar"
                    >
                        <span className="icon-[tabler--menu-2] size-5" aria-hidden />
                    </button>
                </div>
            </div>
        </header>
    );
}