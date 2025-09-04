import Link from "next/link";
import Image from "next/image";
import type { Repo } from "@/lib/github";
import { getRepoCardExtras } from "@/lib/github";

function formatDate(s: string) {
    try {
        return new Date(s).toLocaleDateString();
    } catch {
        return s;
    }
}

export async function RepoCard({ repo }: { repo: Repo }) {
    let cover: string | null = null;
    let bullets: string[] = [];
    let stack: string[] = [];
    let topLangs: { name: string; pct: number }[] = [];

    try {
        const extras = await getRepoCardExtras(repo);
        cover = extras.cover ?? null;
        bullets = extras.bullets ?? [];
        stack = extras.stack ?? [];
        topLangs = extras.topLangs ?? [];
    } catch {}

    const uniqueStack = Array.from(new Set(stack.filter(Boolean))).slice(0, 4);
    const showFooterLangs = uniqueStack.length === 0;
    const updated = formatDate((repo.pushedAt as any) || (repo.updatedAt as any));

    return (
        <Link href={`/projects/${repo.name}`} className="group block h-full">
            <div className="relative rounded-2xl p-[1px] transition-transform duration-300 group-hover:-translate-y-0.5 h-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] opacity-30 group-hover:opacity-60 blur-[0.5px]" />
                <div className="relative card rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[16/10] bg-[var(--surface)]">
                        {cover ? (
                            <Image
                                src={cover}
                                alt={`Cover image for ${repo.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                priority={false}
                                unoptimized
                            />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center text-[var(--muted)]">No image</div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--surface)]/85 to-transparent" />
                    </div>

                    <div className="p-5 md:p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight line-clamp-1">{repo.name}</h3>
                            <span className="hairline rounded-full px-2 py-0.5 text-xs text-[var(--muted)] whitespace-nowrap shrink-0">
                Updated {updated}
              </span>
                        </div>

                        {repo.description && (
                            <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{repo.description}</p>
                        )}

                        {bullets.length > 0 && (
                            <ul className="mt-3 space-y-1 text-sm list-disc pl-5 text-[var(--fg)]">
                                {bullets.slice(0, 2).map((b, i) => (
                                    <li key={i} className="line-clamp-1">{b}</li>
                                ))}
                            </ul>
                        )}

                        {uniqueStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {uniqueStack.map((t) => (
                                    <span key={t} className="hairline rounded-lg px-2 py-1 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[var(--muted)] border-t border-[var(--border)]">
                            <span>★ {repo.stars ?? 0}</span>
                            {showFooterLangs && topLangs.length > 0 && (
                                <div className="flex items-center gap-2">
                                    {topLangs.slice(0, 3).map((l) => (
                                        <span key={l.name} className="hairline rounded-lg px-2 py-1">
                      {l.name} {Math.round(l.pct)}%
                    </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
