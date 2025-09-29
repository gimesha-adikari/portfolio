"use client";
export default function SkipLink({ href = "#content" }: { href?: string }) {
    return (
        <a
            href={href}
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-3 focus:py-2 focus:bg-[var(--surface)] focus:text-[var(--fg)] focus:rounded-lg focus:outline focus:outline-2 focus:outline-[var(--ring)]"
        >
            Skip to content
        </a>
    );
}
