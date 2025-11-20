'use client';

import { useEffect } from 'react';

export default function SidebarWidthSync({
                                             targetId = 'collapsible-mini-sidebar',
                                         }: { targetId?: string }) {
    useEffect(() => {
        const el = document.getElementById(targetId);
        if (!el) return;

        const apply = () => {
            const isDesktop = window.matchMedia('(min-width: 640px)').matches;
            const w = isDesktop ? Math.round(el.getBoundingClientRect().width) : 0;
            document.body.style.setProperty('--sidebar-w', `${w}px`);
        };

        apply();

        const ro = new ResizeObserver(apply);
        ro.observe(el);

        const mo = new MutationObserver(apply);
        mo.observe(el, { attributes: true, attributeFilter: ['class', 'style'] });

        window.addEventListener('resize', apply);

        return () => {
            ro.disconnect();
            mo.disconnect();
            window.removeEventListener('resize', apply);
        };
    }, [targetId]);

    return null;
}
