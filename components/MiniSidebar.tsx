'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NAV_ITEMS } from '@/lib/navItems';
import { siteConfig } from '@/lib/siteConfig';
import { motion, type Variants, type Transition } from 'framer-motion';

export interface MiniSidebarProps {
    id?: string;
    title?: string;
    extraItems?: { href: string; icon: string; label: string }[];
    showExternalTriggerButton?: boolean;
    className?: string;
}

const SPRING: Transition = { type: 'spring', stiffness: 400, damping: 30, mass: 0.5 };

const listVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: SPRING },
};

export default function MiniSidebar({
                                        id = 'collapsible-mini-sidebar',
                                        title = siteConfig.displayDomain,
                                        extraItems = [],
                                        showExternalTriggerButton = false,
                                        className = '',
                                    }: MiniSidebarProps) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const asideRef = useRef<HTMLElement | null>(null);

    const computeOpen = useCallback((el: HTMLElement | null) => {
        if (!el) return false;
        if (el.getAttribute('aria-expanded') === 'true') return true;
        if (el.classList.contains('overlay-open')) return true;
        const style = window.getComputedStyle(el);
        if (style.display !== 'none' && el.getBoundingClientRect().width > 0) return true;
        return false;
    }, []);

    const closeSidebar = useCallback(() => {
        const el = asideRef.current ?? (document.getElementById(id) as HTMLElement | null);
        const w = window as any;
        if (w?.HSOverlay?.hide && el) {
            try {
                w.HSOverlay.hide(el);
                return;
            } catch {}
        }
        if (el) {
            el.classList.remove('overlay-open');
            el.removeAttribute('aria-expanded');
        }
        document.body.classList.remove('overlay-body-open');
        setOpen(false);
    }, [id]);

    useEffect(() => {
        closeSidebar();
        (window as any)?.HSStaticMethods?.autoInit?.();
    }, [pathname, closeSidebar]);

    useEffect(() => {
        const el = (asideRef.current = document.getElementById(id) as HTMLElement | null);
        if (!el) return;

        const update = () => setOpen(computeOpen(el));
        requestAnimationFrame(update);

        const mo = new MutationObserver(update);
        mo.observe(el, { attributes: true, attributeFilter: ['class', 'aria-expanded', 'style'] });

        const bodyMO = new MutationObserver(update);
        bodyMO.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSidebar();
        };
        el.addEventListener('keydown', onKey);

        return () => {
            mo.disconnect();
            bodyMO.disconnect();
            el.removeEventListener('keydown', onKey);
        };
    }, [id, computeOpen, closeSidebar]);

    const headerLabel = useMemo(() => (title?.length > 28 ? `${title.slice(0, 28)}…` : title), [title]);
    const linkProps = { onClick: () => closeSidebar() };

    return (
        <>
            {showExternalTriggerButton && (
                <button
                    type="button"
                    className="btn btn-text max-sm:btn-square sm:hidden hover:bg-[var(--surface)] transition-colors"
                    aria-haspopup="dialog"
                    aria-controls={id}
                    data-overlay={`#${id}`}
                >
                    <span className="icon-[tabler--menu-2] size-6 text-[var(--fg)]" aria-hidden />
                </button>
            )}

            <aside
                id={id}
                role="dialog"
                tabIndex={-1}
                ref={asideRef as any}
                className={[
                    'overlay [--auto-close:sm] overlay-open:translate-x-0',
                    'drawer drawer-start hidden w-[280px] bg-[var(--background)]', // Slightly wider, solid bg
                    'border-e border-[var(--border)]/60 shadow-2xl md:shadow-none gn-sidebar',
                    'md:hidden flex flex-col',
                    className,
                ].join(' ')}
            >
                {/* Refined Header with "App Logo" feel */}
                <div className="drawer-header px-5 py-6 w-full flex items-center justify-between gap-3 border-b border-[var(--border)]/40">
                    <Link
                        href="/"
                        className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-xl"
                        {...linkProps}
                        aria-label="Go home"
                    >
                        <div className="size-9 rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 border border-[var(--accent)]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                            <span className="text-[var(--accent)] font-extrabold text-lg leading-none mt-0.5">
                                {title.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="drawer-title text-xl font-bold tracking-tight text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors overlay-minified:hidden">
                            {headerLabel}
                        </span>
                    </Link>

                    <div className="hidden sm:flex items-center">
                        <button
                            type="button"
                            className="p-2 rounded-lg text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                            aria-haspopup="dialog"
                            aria-label="Minify navigation"
                            data-overlay-minifier={`#${id}`}
                            title="Minify sidebar"
                        >
                            <span className="icon-[tabler--layout-sidebar-left-collapse] size-5" aria-hidden />
                            <span className="sr-only">Minify</span>
                        </button>
                    </div>
                </div>

                {/* Spaced Menu Body */}
                <div className="drawer-body flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent">

                    {/* Optional: Tiny section label for structure */}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]/70 mb-3 px-3 block overlay-minified:hidden">
                        Main Menu
                    </span>

                    <motion.ul
                        role="list"
                        className="flex flex-col gap-1.5"
                        variants={listVariants}
                        initial="hidden"
                        animate={open ? 'show' : 'hidden'}
                    >
                        {NAV_ITEMS.map((it) => {
                            const isActive = pathname === it.href || (it.href !== '/' && pathname.startsWith(`${it.href}/`));

                            return (
                                <motion.li key={it.href} variants={itemVariants} className="relative">
                                    {/* Edge Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="msb-active-edge"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-[var(--accent)] rounded-r-full shadow-[0_0_10px_var(--accent)]"
                                            aria-hidden
                                        />
                                    )}

                                    <Link
                                        href={it.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={[
                                            'group flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                                            isActive
                                                ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-semibold'
                                                : 'text-[var(--muted)] font-medium hover:bg-[var(--surface)] hover:text-[var(--fg)]',
                                        ].join(' ')}
                                        {...linkProps}
                                    >
                                        <motion.span
                                            className={`${it.icon} size-5 shrink-0 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--muted)] group-hover:text-[var(--fg)]'} transition-colors`}
                                            aria-hidden
                                            whileHover={{ scale: 1.1, rotate: isActive ? 0 : 4 }}
                                            transition={SPRING}
                                        />
                                        <span className="overlay-minified:hidden tracking-wide text-sm">{it.label}</span>
                                    </Link>
                                </motion.li>
                            );
                        })}

                        {extraItems.length > 0 && (
                            <div className="mt-6 mb-2 border-t border-[var(--border)]/40 pt-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]/70 mb-3 px-3 block overlay-minified:hidden">
                                    External
                                </span>
                                {extraItems.map((it) => (
                                    <motion.li key={it.href} variants={itemVariants} className="relative">
                                        <Link
                                            href={it.href}
                                            className="group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[var(--muted)] font-medium transition-all duration-300 hover:bg-[var(--surface)] hover:text-[var(--fg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                                            {...linkProps}
                                        >
                                            <span className={`${it.icon} size-5 shrink-0 text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors`} aria-hidden />
                                            <span className="overlay-minified:hidden tracking-wide text-sm">{it.label}</span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </div>
                        )}
                    </motion.ul>
                </div>
            </aside>
        </>
    );
}
