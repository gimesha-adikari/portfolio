"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/navItems";
import { siteConfig } from "@/lib/siteConfig";

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
    if (!root) return [];

    return Array.from(
        root.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
    );
}

export default function MobileNavigation() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);
    const previousPathname = useRef(pathname);
    const titleId = useId();
    const drawerId = "mobile-navigation";

    useEffect(() => {
        setMounted(true);
    }, []);

    const closeMenu = useCallback(() => {
        setOpen(false);
        triggerRef.current?.focus();
    }, []);

    useEffect(() => {
        if (previousPathname.current === pathname) return;
        previousPathname.current = pathname;
        if (open) closeMenu();
    }, [closeMenu, open, pathname]);

    useEffect(() => {
        if (!open) return;

        const drawer = drawerRef.current;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const focusable = getFocusableElements(drawer);
        const focusFrame = requestAnimationFrame(() => {
            (focusable[0] ?? drawer)?.focus();
        });

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key !== "Tab") return;

            const currentFocusable = getFocusableElements(drawerRef.current);
            if (currentFocusable.length === 0) {
                event.preventDefault();
                drawerRef.current?.focus();
                return;
            }

            const first = currentFocusable[0];
            const last = currentFocusable[currentFocusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => {
            cancelAnimationFrame(focusFrame);
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [closeMenu, open]);

    const drawer = (
        <div
            className="fixed inset-0 z-50 lg:hidden"
            data-mobile-navigation
            hidden={!open}
        >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-slate-950/40"
                    onClick={closeMenu}
                />
                <div
                    ref={drawerRef}
                    id={drawerId}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    className="relative z-10 flex h-full w-[min(86vw,320px)] flex-col border-e border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] shadow-2xl"
                >
                    <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-6">
                        <div>
                            <p id={titleId} className="text-lg font-bold tracking-tight">
                                {siteConfig.displayDomain}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-widest text-[var(--muted)]">
                                Main navigation
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={closeMenu}
                            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                            <span className="icon-[tabler--x] size-5" aria-hidden />
                        </button>
                    </div>

                    <nav aria-label="Primary mobile" className="flex-1 overflow-y-auto px-4 py-6">
                        <ul className="flex flex-col gap-1.5">
                            {NAV_ITEMS.map((item) => {
                                const isActive = item.href === "/"
                                    ? pathname === item.href
                                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={closeMenu}
                                            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                                                isActive
                                                    ? "bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]"
                                                    : "text-[var(--muted)] hover:bg-[var(--bg)] hover:text-[var(--fg)]"
                                            }`}
                                        >
                                            <span className={`${item.icon} size-5 shrink-0`} aria-hidden />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
        </div>
    );

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls={drawerId}
                onClick={() => (open ? closeMenu() : setOpen(true))}
                className="lg:hidden inline-flex size-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
                {open ? (
                    <span className="icon-[tabler--x] size-5" aria-hidden />
                ) : (
                    <span className="icon-[tabler--menu-2] size-5" aria-hidden />
                )}
            </button>
            {mounted ? createPortal(drawer, document.body) : drawer}
        </>
    );
}
