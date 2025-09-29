"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navItems";
import { Icon } from "@/components/Icon";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string; icon: string; hideInHeader?: boolean };

export default function Header() {
    const pathname = usePathname();
    const headerLinks = (NAV_ITEMS as NavItem[]).filter((i) => !i.hideInHeader);
    const reduce = useReducedMotion();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-40 nav-blur sm:ps-[var(--sidebar-w)] transition-[padding] duration-300 ${
                scrolled ? "shadow-[0_1px_0_0_var(--border)]" : ""
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                <Link href="/" className="font-semibold tracking-tight">
                    gimesha.dev
                </Link>

                <nav className="relative hidden md:flex items-center gap-1" aria-label="Primary">
                    {headerLinks.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive ? "page" : undefined}
                                className="relative rounded-lg group"
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="absolute inset-0 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]"
                                        transition={
                                            reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40, mass: 0.3 }
                                        }
                                    />
                                )}
                                <span className="relative inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition hover:bg-[var(--surface)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
                  <Icon name={item.icon} className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span>{item.label}</span>
                  <span
                      aria-hidden
                      className={`pointer-events-none absolute left-2 right-2 -bottom-[3px] h-[2px] rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] origin-left transition-transform duration-300 ease-out ${
                          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                  />
                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Open menu"
                        className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
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
