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
    } catch {}

    const topics = Array.isArray((repo as any).topics) ? ((repo as any).topics as string[]) : [];
    const techStack = Array.from(new Set((stack.length ? stack : topics).filter(Boolean))).slice(0, 4);
    const showLangBar = techStack.length === 0 && topLangs.length > 0;

    const updated = fmtDate((repo as any).pushedAt || (repo as any).updatedAt);
    const stars = nf.format(repo.stars ?? 0);
    const forks = nf.format(repo.forks ?? 0);
    const language = (repo as any).language ?? topLangs[0]?.name ?? "Code";

    const href = `/projects/${repo.name}`;
    const title = `Open details for ${repo.name}`;
    const initials = getInitials(repo.name);

    return (
        <Link
            href={href}
            className="group block h-full"
            aria-label={`Open details for ${repo.name}`}
            title={title}
            prefetch={false}
        >
            <div className="relative h-full rounded-[14px] p-[1px] transition-transform duration-300 group-hover:-translate-y-1">
                <div className="absolute inset-0 rounded-[14px] border border-transparent bg-gradient-to-br from-[var(--accent)] via-[color-mix(in_oklab,var(--accent)_45%,var(--success))] to-[var(--accent)] opacity-15 blur-[1px] transition-opacity duration-300 group-hover:opacity-35" />

                <article
                    className="relative card rounded-[14px] overflow-hidden h-full flex flex-col"
                    aria-labelledby={`${repo.name}-title`}
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
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3 text-center">
                                    <div className="grid place-items-center size-16 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] text-[var(--fg)]">
                                        <span className="text-xl font-bold tracking-tight">{initials || "P"}</span>
                                    </div>
                                    <div className="text-xs text-[var(--muted)]">Project preview unavailable</div>
                                </div>
                            </div>
                        )}

                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)] backdrop-blur-md">
                            <span className="icon-[tabler--sparkles] size-4" aria-hidden />
                            Featured
                        </div>

                        <div
                            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-2.5 py-1 text-xs text-[var(--fg)] backdrop-blur-md"
                            aria-label={`${stars} stars`}
                        >
                            <span className="icon-[tabler--star] size-4" aria-hidden />
                            {stars}
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                            <div className="max-w-[70%]">
                                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                                    {language}
                                </div>
                                <div className="mt-1 text-sm text-[var(--fg)]/90 line-clamp-1">
                                    {repo.private ? "Private repository" : "Public repository"}
                                </div>
                            </div>
                            {updated && (
                                <div className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)] backdrop-blur-md whitespace-nowrap">
                                    {updated}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <h3
                                id={`${repo.name}-title`}
                                className="text-base sm:text-lg md:text-xl font-semibold tracking-tight line-clamp-1 text-[var(--fg)]"
                            >
                                {repo.name}
                            </h3>

                            {forks !== "0" && (
                                <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)] whitespace-nowrap shrink-0">
                                    <span className="inline-flex items-center gap-1">
                                        <span className="icon-[tabler--git-fork] size-4" aria-hidden />
                                        {forks}
                                    </span>
                                </span>
                            )}
                        </div>

                        {repo.description && (
                            <p className="mt-2 text-sm leading-6 text-[var(--muted)] line-clamp-3" title={repo.description}>
                                {repo.description}
                            </p>
                        )}

                        {bullets.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm text-[var(--fg)]">
                                {bullets.slice(0, 2).map((b, i) => (
                                    <li key={`${repo.name}-b-${i}`} className="flex items-start gap-2 line-clamp-1">
                                        <span className="icon-[tabler--circle-check] size-4 mt-0.5 text-[var(--success)]" aria-hidden />
                                        <span title={b}>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                                {techStack.map((t) => (
                                    <span
                                        key={t}
                                        className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}

                        {showLangBar && (
                            <div className="mt-4">
                                <div
                                    className="h-2 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface)]"
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

                                <div className="mt-2 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                                    {topLangs.slice(0, 3).map((l, i) => (
                                        <span key={l.name} className="inline-flex items-center gap-1">
                                            <span
                                                className="inline-block size-2 rounded-[3px]"
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

                        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)]">
                            <span className="inline-flex items-center gap-1" aria-label={`${forks} forks`}>
                                <span className="icon-[tabler--git-fork] size-4" aria-hidden />
                                {forks}
                            </span>

                            <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                <span className="icon-[tabler--arrow-up-right] size-4" aria-hidden />
                                View details
                            </span>
                        </div>
                    </div>
                </article>
            </div>
        </Link>
    );
}