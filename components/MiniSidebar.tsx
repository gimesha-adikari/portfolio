'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NAV_ITEMS } from '@/lib/navItems';
import { motion, type Variants, type Transition } from 'framer-motion';

export interface MiniSidebarProps {
    id?: string;
    title?: string;
    extraItems?: { href: string; icon: string; label: string }[];
    showExternalTriggerButton?: boolean;
    className?: string;
}

const SPRING: Transition = { type: 'spring', stiffness: 420, damping: 32, mass: 0.3 };

const listVariants: Variants = {
    hidden: { opacity: 0, y: 6 },
    show: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.045, delayChildren: 0.05 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: SPRING },
};

export default function MiniSidebar({
                                        id = 'collapsible-mini-sidebar',
                                        title = 'gimesha.dev',
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
                    className="btn btn-text max-sm:btn-square sm:hidden"
                    aria-haspopup="dialog"
                    aria-controls={id}
                    data-overlay={`#${id}`}
                >
                    <span className="icon-[tabler--menu-2] size-5" aria-hidden />
                </button>
            )}

            <aside
                id={id}
                role="dialog"
                tabIndex={-1}
                ref={asideRef as any}
                className={[
                    'overlay [--auto-close:sm] overlay-open:translate-x-0',
                    'drawer drawer-start hidden w-[264px]',
                    'border-e border-[var(--border)] gn-sidebar',
                    'md:hidden',
                    className,
                ].join(' ')}
            >
                <div className="drawer-header py-2 w-full flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="drawer-title text-xl font-semibold outline-none focus-visible:outline-2 focus-visible:outline-[var(--ring)] rounded-md px-1"
                        {...linkProps}
                        aria-label="Go home"
                    >
                        {headerLabel}
                    </Link>

                    <div className="hidden sm:flex items-center">
                        <button
                            type="button"
                            className="btn btn-circle btn-text"
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

                <div className="drawer-body px-2 pt-4">
                    <motion.ul
                        role="list"
                        className="menu p-0"
                        variants={listVariants}
                        initial="hidden"
                        animate={open ? 'show' : 'hidden'}
                    >
                        {NAV_ITEMS.map((it) => {
                            const isActive = pathname === it.href || (it.href !== '/' && pathname.startsWith(`${it.href}/`));
                            return (
                                <motion.li key={it.href} variants={itemVariants}>
                                    <Link
                                        href={it.href}
                                        aria-current={isActive ? 'page' : undefined}
                                        className={[
                                            'group relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 transition',
                                            isActive
                                                ? 'bg-[color-mix(in_oklab,var(--accent)18%,transparent)] outline outline-1 outline-[color-mix(in_oklab,var(--accent)35%,transparent)]'
                                                : 'hover:bg-[color-mix(in_oklab,var(--surface)90%,var(--accent)10%)]',
                                            'focus-visible:outline-2 focus-visible:outline-[var(--ring)]',
                                        ].join(' ')}
                                        {...linkProps}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="msb-active"
                                                className="absolute inset-y-1 left-1.5 w-1.5 rounded-full bg-[var(--accent)]/85"
                                                aria-hidden
                                            />
                                        )}
                                        <motion.span
                                            className={`${it.icon} size-5`}
                                            aria-hidden
                                            whileHover={{ rotate: 3, scale: 1.05 }}
                                            transition={SPRING}
                                        />
                                        <span className="overlay-minified:hidden">{it.label}</span>
                                    </Link>
                                </motion.li>
                            );
                        })}

                        {extraItems.map((it) => (
                            <motion.li key={it.href} variants={itemVariants}>
                                <Link
                                    href={it.href}
                                    className="group relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 hover:bg-[color-mix(in_oklab,var(--surface)90%,var(--accent)10%)] focus-visible:outline-2 focus-visible:outline-[var(--ring)]"
                                    {...linkProps}
                                >
                                    <span className={`${it.icon} size-5`} aria-hidden />
                                    <span className="overlay-minified:hidden">{it.label}</span>
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </aside>
        </>
    );
}
