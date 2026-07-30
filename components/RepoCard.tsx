// file: components/RepoCard.tsx
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import type { Repo } from "@/lib/github";
import { getRepoCardExtras } from "@/lib/github";

const dtf = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const nf = new Intl.NumberFormat(undefined, { notation: "compact" });

const getExtrasCached = cache(getRepoCardExtras);

function fmtDate(v?: string | null) {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : dtf.format(d);
}

function getInitials(name: string) {
    return name
        .split(/[-_\s]+/g)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

export async function RepoCard({ repo }: { repo: Repo }) {
    let cover: string | null = null;
    let bullets: string[] = [];
    let stack: string[] = [];
    let topLangs: { name: string; pct: number }[] = [];

    try {
        const extras = await getExtrasCached(repo);
        cover = extras.cover ?? null;
        bullets = extras.bullets ?? [];
        stack = extras.stack ?? [];
        topLangs = extras.topLangs ?? [];
    } catch {
        // Silently fail extras fetch; component will render gracefully with fallbacks
    }

    const topics = Array.isArray(repo.topics) ? repo.topics : [];
    const techStack = Array.from(new Set((stack.length ? stack : topics).filter(Boolean))).slice(0, 4);
    const showLangBar = techStack.length === 0 && topLangs.length > 0;

    const updated = fmtDate(repo.pushedAt || repo.updatedAt);
    const stars = nf.format(repo.stars ?? 0);
    const forks = nf.format(repo.forks ?? 0);
    const language = repo.language ?? topLangs[0]?.name ?? "Code";

    const href = `/projects/${repo.name}`;
    const title = `Open details for ${repo.name}`;
    const initials = getInitials(repo.name);

    // Sanitize repo name for a valid HTML ID (removes dots/special chars)
    const titleId = `${repo.name.replace(/[^a-zA-Z0-9-]/g, '-')}-title`;

    return (
        <Link
            href={href}
            className="group block h-full"
            aria-label={`Open details for ${repo.name}`}
            title={title}
            prefetch={false}
        >
            <div className="relative h-full rounded-[14px] p-[1px] transition-transform duration-300 group-hover:-translate-y-1">
                {/* Glowing Outer Border */}
                <div className="absolute inset-0 rounded-[14px] border border-transparent bg-gradient-to-br from-[var(--accent)] via-[color-mix(in_oklab,var(--accent)_45%,var(--success))] to-[var(--accent)] opacity-15 blur-[1px] transition-opacity duration-300 group-hover:opacity-35" />

                <article
                    className="relative card rounded-[14px] overflow-hidden h-full flex flex-col bg-[var(--surface)]"
                    aria-labelledby={titleId}
                >
                    <div className="relative aspect-[16/10] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] overflow-hidden border-b border-[var(--border)]">
                        {cover ? (
                            <Image
                                src={cover}
                                alt={`Cover image for ${repo.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                priority={false}
                            />
                        ) : (
                            /* Premium Technical Blueprint Fallback */
                            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:16px_16px]">
                                <div className="flex flex-col items-center gap-3 text-center bg-[var(--surface)]/80 p-4 rounded-xl backdrop-blur-sm border border-[var(--border)] shadow-sm">
                                    <div className="grid place-items-center size-14 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] text-[var(--fg)]">
                                        <span className="text-lg font-bold tracking-tight">{initials || "P"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-2.5 py-1 text-xs text-[var(--fg)] backdrop-blur-md shadow-sm">
                            <span className="icon-[tabler--sparkles] size-3.5 text-[var(--accent)]" aria-hidden />
                            Featured
                        </div>

                        <div
                            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-2.5 py-1 text-xs text-[var(--fg)] backdrop-blur-md shadow-sm"
                            aria-label={`${stars} stars`}
                        >
                            <span className="icon-[tabler--star] size-3.5 text-[var(--accent)]" aria-hidden />
                            {stars}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                            <div className="max-w-[70%]">
                                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bg)] bg-[var(--fg)] px-2 py-0.5 rounded shadow-sm inline-block">
                                    {language}
                                </div>
                            </div>
                            {updated && (
                                <div className="rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-2.5 py-1 text-xs font-mono text-[var(--muted)] backdrop-blur-md whitespace-nowrap shadow-sm">
                                    {updated}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <h3
                                id={titleId}
                                className="text-base sm:text-lg md:text-xl font-bold tracking-tight line-clamp-1 text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors"
                            >
                                {repo.name}
                            </h3>
                        </div>

                        {repo.description ? (
                            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2" title={repo.description}>
                                {repo.description}
                            </p>
                        ) : (
                            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] italic">
                                No description provided.
                            </p>
                        )}

                        {bullets.length > 0 && (
                            <ul className="mt-4 space-y-2 text-sm text-[var(--fg)]">
                                {bullets.slice(0, 2).map((b, i) => (
                                    <li key={`${repo.name}-b-${i}`} className="flex items-start gap-2 line-clamp-1">
                                        <span className="icon-[tabler--circle-check] size-4 mt-0.5 text-[var(--success)] shrink-0" aria-hidden />
                                        <span title={b} className="text-[var(--muted)]">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                                {techStack.map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[11px] font-medium text-[var(--muted)]"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        {showLangBar && (
                            <div className="mt-4">
                                <div
                                    className="h-1.5 rounded-full overflow-hidden bg-[var(--border)]"
                                    role="img"
                                    aria-label="Language distribution"
                                >
                                    <div className="flex h-full w-full">
                                        {topLangs.slice(0, 3).map((l, i) => (
                                            <span
                                                key={l.name}
                                                style={{
                                                    width: `${Math.max(2, Math.round(l.pct))}%`,
                                                    background:
                                                        i === 0
                                                            ? "var(--accent)"
                                                            : i === 1
                                                                ? "var(--success)"
                                                                : "color-mix(in oklab, var(--accent) 55%, var(--surface))",
                                                    transition: "width .4s ease",
                                                }}
                                                aria-hidden
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-medium text-[var(--muted)]">
                                    {topLangs.slice(0, 3).map((l, i) => (
                                        <span key={l.name} className="inline-flex items-center gap-1.5">
                                            <span
                                                className="inline-block size-2 rounded-full"
                                                style={{
                                                    background:
                                                        i === 0
                                                            ? "var(--accent)"
                                                            : i === 1
                                                                ? "var(--success)"
                                                                : "color-mix(in oklab, var(--accent) 55%, var(--surface))",
                                                }}
                                                aria-hidden
                                            />
                                            {l.name} {Math.round(l.pct)}%
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* `mt-auto` forces this footer to the bottom, aligning all cards perfectly */}
                        <div className="mt-auto pt-5 flex items-center justify-between text-xs text-[var(--muted)]">
                            <span className="inline-flex items-center gap-1.5 font-mono" aria-label={`${forks} forks`}>
                                <span className="icon-[tabler--git-fork] size-4" aria-hidden />
                                {forks}
                            </span>

                            <span className="inline-flex items-center gap-1 group-hover:text-[var(--accent)] transition-colors">
                                View details
                                <span className="icon-[tabler--arrow-up-right] size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden />
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </Link>
    );
}