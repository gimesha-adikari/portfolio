// file: components/CopyEmailButton.tsx
"use client";
import { useState } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);

    async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault(); // Prevents the parent `<a>` tag from opening the mailto link

        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2 second success state
        } catch {}
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            aria-label={copied ? "Email copied" : "Copy email address"}
            className={`relative inline-flex items-center gap-2 overflow-hidden rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-300 shadow-sm ${
                copied
                    ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_10%,transparent)] text-[var(--success)]"
                    : "border-[var(--border)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            }`}
        >
            <span
                className={`size-4 transition-all duration-300 ${
                    copied ? 'icon-[tabler--check] scale-110' : 'icon-[tabler--copy] scale-100'
                }`}
                aria-hidden
            />
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}