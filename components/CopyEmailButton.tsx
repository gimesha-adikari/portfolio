"use client";
import { useState } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);

    async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        const anchorAncestor = (e.currentTarget as HTMLElement).closest("a");
        if (anchorAncestor) e.preventDefault();

        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label="Copy email address"
            className={`hairline rounded-lg px-2 py-1 text-xs transition ${
                copied
                    ? "bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]"
                    : "hover:bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)]"
            }`}
        >
            {copied ? "Copied" : "Copy"}
        </button>
    );
}
