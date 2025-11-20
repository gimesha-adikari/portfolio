'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function FlyonuiScript() {
    const path = usePathname();

    useEffect(() => {
        let mounted = true;

        (async () => {
            if (typeof window === 'undefined' || !mounted) return;

            const jq = await import('jquery');
            const $ = (jq as any).default ?? (jq as any);
            (window as any).$ = $;
            (window as any).jQuery = $;

            try {
                const [lodashMod, nouiMod] = await Promise.all([
                    import('lodash'),
                    import('nouislider'),
                ]);
                (window as any)._ = (lodashMod as any).default ?? lodashMod;
                (window as any).noUiSlider = (nouiMod as any).default ?? nouiMod;
            } catch {
            }

            try {
                await import('datatables.net');              // attaches to window.jQuery
                (window as any).DataTable = (window as any).jQuery?.fn?.dataTable;
            } catch {
            }
            try {
                const dz = await import('dropzone');
                (window as any).Dropzone = (dz as any).default ?? dz;
                (window as any).Dropzone = (window as any).Dropzone ?? (globalThis as any).Dropzone;
            } catch {
            }

            await import('flyonui/flyonui');
            (window as any).HSStaticMethods?.autoInit?.();
        })();

        return () => { mounted = false; };
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            (window as any).HSStaticMethods?.autoInit?.();
        }, 100);
        return () => clearTimeout(t);
    }, [path]);

    return null;
}
