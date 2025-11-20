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
    return isNaN(d.getTime()) ? v : dtf.format(d);
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
    const uniqueStack = Array.from(new Set((stack.length ? stack : topics).filter(Boolean))).slice(0, 4);

    const showFooterLangs = uniqueStack.length === 0 && topLangs.length > 0;
    const updated = fmtDate((repo as any).pushedAt || (repo as any).updatedAt);

    const langColors = ["var(--accent)", "var(--accent-2)", "color-mix(in oklab, var(--accent) 55%, var(--surface))"];

    const stars = nf.format(repo.stars ?? 0);
    const forks = nf.format(repo.forks ?? 0);

    const href = `/projects/${repo.name}`;
    const title = `View ${repo.name}`;

    return (
        <Link
            href={href}
            className="group block h-full"
            aria-label={`Open details for ${repo.name}`}
            title={title}
            prefetch={false}
        >
            <div className="relative rounded-2xl p-[1px] transition-transform duration-300 group-hover:-translate-y-0.5 h-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] opacity-25 group-hover:opacity-60 blur-[0.5px]" />
                <article className="relative card rounded-2xl overflow-hidden h-full flex flex-col" aria-labelledby={`${repo.name}-title`}>
                    <div className="relative aspect-[16/10] bg-[var(--surface)]">
                        {cover ? (
                            <Image
                                src={cover}
                                alt={`Cover image for ${repo.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                priority={false}
                            />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center text-[var(--muted)]">
                                <span className="icon-[tabler--photo] size-6" aria-hidden />
                                <span className="sr-only">No image</span>
                            </div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--surface)]/85 to-transparent" />
                        <div
                            className="absolute top-3 right-3 hairline rounded-full px-2 py-1 text-xs backdrop-blur-md bg-[var(--surface)]/70 flex items-center gap-1"
                            aria-label={`${stars} stars`}
                        >
                            <span className="icon-[tabler--star] size-4" aria-hidden />
                            {stars}
                        </div>
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <h3 id={`${repo.name}-title`} className="text-base sm:text-lg md:text-xl font-semibold tracking-tight line-clamp-1">
                                {repo.name}
                            </h3>
                            <span className="hairline rounded-full px-2 py-0.5 text-xs text-[var(--muted)] whitespace-nowrap shrink-0">
                <span className="inline-flex items-center gap-1">
                  <span className="icon-[tabler--clock] size-4" aria-hidden />
                    {updated}
                </span>
              </span>
                        </div>

                        {repo.description && (
                            <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3" title={repo.description}>
                                {repo.description}
                            </p>
                        )}

                        {bullets.length > 0 && (
                            <ul className="mt-3 space-y-1.5 text-sm text-[var(--fg)]">
                                {bullets.slice(0, 2).map((b, i) => (
                                    <li key={`${repo.name}-b-${i}`} className="line-clamp-1 flex items-start gap-2">
                                        <span className="icon-[tabler--circle-check] size-4 mt-0.5 text-[var(--accent)]" aria-hidden />
                                        <span title={b}>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {uniqueStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                                {uniqueStack.map((t) => (
                                    <span key={t} className="hairline rounded-lg px-2 py-1 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                                ))}
                            </div>
                        )}

                        {showFooterLangs && (
                            <div className="mt-4">
                                <div className="h-2 rounded-full overflow-hidden hairline bg-[var(--surface)]" role="img" aria-label="Language distribution">
                                    <div className="flex h-full w-full">
                                        {topLangs.slice(0, 3).map((l, i) => (
                                            <span
                                                key={l.name}
                                                style={{
                                                    width: `${Math.max(2, Math.round(l.pct))}%`,
                                                    background: langColors[i] ?? langColors[0],
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
                          style={{ background: langColors[i] ?? langColors[0] }}
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
