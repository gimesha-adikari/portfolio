import Link from "next/link";
import { buildNotFoundMetadata } from "@/lib/route-metadata";

export const metadata = buildNotFoundMetadata({ label: "Page", path: "/" });

export default function NotFound() {
    return (
        <section className="mx-auto max-w-2xl py-20 text-center" aria-labelledby="not-found-title">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">404</p>
            <h1 id="not-found-title" className="mt-3 text-3xl font-bold text-[var(--fg)] md:text-4xl">
                Page not found
            </h1>
            <p className="mt-4 text-[var(--muted)]">
                The requested page does not exist in this portfolio.
            </p>
            <Link
                href="/"
                className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
                Return home
            </Link>
        </section>
    );
}
