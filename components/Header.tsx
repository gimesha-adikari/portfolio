"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
    const [open, setOpen] = useState(false);

    // Close the drawer if user navigates with back/forward
    useEffect(() => {
        const onPop = () => setOpen(false);
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    // Robust scroll lock: fix body at current scroll position, then restore on close
    useEffect(() => {
        if (!open) return;

        const html = document.documentElement;
        const body = document.body;
        const scrollY = window.scrollY || html.scrollTop;

        const prev = {
            bodyPosition: body.style.position,
            bodyTop: body.style.top,
            bodyLeft: body.style.left,
            bodyRight: body.style.right,
            bodyWidth: body.style.width,
            bodyPaddingRight: body.style.paddingRight,
            htmlOverflow: html.style.overflow,
        };

        // Avoid layout shift when hiding the scrollbar on desktop
        const scrollbarWidth = window.innerWidth - html.clientWidth; // usually 0 on mobile
        if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

        // Lock the document at the current position
        body.style.position = "fixed";
        body.style.top = `-${scrollY}px`;
        body.style.left = "0";
        body.style.right = "0";
        body.style.width = "100%";
        html.style.overflow = "hidden";

        return () => {
            const y = -parseInt(body.style.top || "0", 10) || 0;
            // Restore styles
            body.style.position = prev.bodyPosition || "";
            body.style.top = prev.bodyTop || "";
            body.style.left = prev.bodyLeft || "";
            body.style.right = prev.bodyRight || "";
            body.style.width = prev.bodyWidth || "";
            body.style.paddingRight = prev.bodyPaddingRight || "";
            html.style.overflow = prev.htmlOverflow || "";
            // Return to the exact scroll position
            window.scrollTo(0, y);
        };
    }, [open]);

    return (
        <>
            <header className="sticky top-0 z-40 nav-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                    <Link href="/" className="font-semibold tracking-tight">
                        gimesha.dev
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-4">
                        <Link href="/" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded">
                            Home
                        </Link>
                        <Link href="/projects" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded">
                            Projects
                        </Link>
                        <Link href="/case-studies" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded">
                            Case Studies
                        </Link>
                        <Link href="/about" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded">
                            About
                        </Link>
                        <Link href="/contact" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--accent)] rounded">
                            Contact
                        </Link>
                        <ThemeToggle />
                    </nav>

                    {/* Mobile controls */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            type="button"
                            aria-label="Open menu"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            onClick={() => setOpen(true)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer overlay (fixed to viewport) — SIBLING of header (not inside) */}
            <div
                aria-hidden={!open}
                className={`md:hidden fixed inset-0 z-50 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
                onClick={() => setOpen(false)}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Sliding panel (internally scrollable) */}
                <div
                    className={`absolute inset-y-0 right-0 w-[85%] max-w-sm bg-[var(--bg)] border-l border-[var(--border)] shadow-xl
                    transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"} mobile-panel`}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="h-14 px-4 flex items-center justify-between border-b border-[var(--border)]">
                        <span className="font-semibold">Menu</span>
                        <button
                            type="button"
                            aria-label="Close menu"
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-[var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            onClick={() => setOpen(false)}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    <nav className="px-4 py-3 flex flex-col gap-1">
                        <Link href="/" onClick={() => setOpen(false)} className="card px-3 py-3 rounded-lg">
                            Home
                        </Link>
                        <Link href="/projects" onClick={() => setOpen(false)} className="card px-3 py-3 rounded-lg">
                            Projects
                        </Link>
                        <Link href="/case-studies" onClick={() => setOpen(false)} className="card px-3 py-3 rounded-lg">
                            Case Studies
                        </Link>
                        <Link href="/about" onClick={() => setOpen(false)} className="card px-3 py-3 rounded-lg">
                            About
                        </Link>
                        <Link href="/contact" onClick={() => setOpen(false)} className="card px-3 py-3 rounded-lg">
                            Contact
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
