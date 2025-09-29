import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
    fetchAllRepos,
    fetchRepoByName,
    fetchRepoLanguages,
    getRepoCardExtras,
    type Repo,
} from "@/lib/github";

export const dynamicParams = true;
export const revalidate = 3600;

type Params = { slug: string };

const PALETTE = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];
const dtf = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" });
const nf = new Intl.NumberFormat(undefined, { notation: "compact" });

const getExtras = cache(getRepoCardExtras);

export async function generateStaticParams() {
    try {
        const repos = await fetchAllRepos();
        return repos.slice(0, 100).map((r) => ({ slug: r.name }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const repo = await fetchRepoByName(slug);
        if (!repo) return { title: slug };
        const title = repo.name;
        const desc = repo.description ?? `Details and links for ${repo.name}`;
        const owner = (process.env.GITHUB_USERNAME as string) || (repo as any)?.owner?.login || "github";
        const og = `https://opengraph.githubassets.com/1/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}`;
        return {
            title,
            description: desc,
            alternates: { canonical: `/projects/${slug}` },
            openGraph: {
                type: "article",
                title,
                description: desc,
                url: `/projects/${slug}`,
                images: [{ url: og }],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description: desc,
                images: [{ url: og }],
            },
        };
    } catch {
        return { title: slug };
    }
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;

    const repo = await fetchRepoByName(slug).catch(() => null);
    if (!repo) notFound();

    const langs = await fetchRepoLanguages(slug).catch(() => []);
    const totalPct = Math.round(langs.reduce((a, b) => a + b.pct, 0));

    let cover: string | null = null;
    let bullets: string[] = [];
    let stack: string[] = [];
    let topLangs: { name: string; pct: number }[] = [];
    try {
        const extras = await getExtras(repo);
        cover = extras.cover ?? null;
        bullets = extras.bullets ?? [];
        stack = Array.from(new Set((extras.stack ?? []).filter(Boolean))).slice(0, 6);
        topLangs = extras.topLangs ?? [];
    } catch {}

    if (!cover) {
        const owner = (process.env.GITHUB_USERNAME as string) || (repo as any)?.owner?.login || "github";
        cover = `https://opengraph.githubassets.com/1/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}`;
    }

    const stackedBar = (topLangs.length ? topLangs : langs).slice(0, 6);
    const safeLicense =
        typeof (repo as any).license === "string"
            ? ((repo as any).license as string)
            : (repo as any)?.license?.spdx_id || (repo as any)?.license?.key || "No license";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: repo.name,
        description: repo.description ?? undefined,
        codeRepository: repo.htmlUrl,
        programmingLanguage: stackedBar.map((l) => l.name),
        dateCreated: repo.createdAt,
        dateModified: repo.updatedAt,
        license: safeLicense,
    };

    return (
        <article className="space-y-10">
            <header className="hero-glow">
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 hairline rounded-full text-xs text-[var(--muted)]">
                            <span className="icon-[tabler--brand-github] size-4" aria-hidden />
                            {repo.private ? "Private" : "Public"} • {safeLicense}
                        </div>

                        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                {repo.name}
              </span>
                        </h1>

                        {repo.description && (
                            <p className="mt-2 text-[var(--muted)] max-w-2xl">{repo.description}</p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
              <span className="hairline rounded-lg px-2 py-1 inline-flex items-center gap-1">
                <span className="icon-[tabler--clock] size-4" aria-hidden />
                Updated {dtf.format(new Date(repo.updatedAt))}
              </span>
                            <span className="hairline rounded-lg px-2 py-1 inline-flex items-center gap-1">
                <span className="icon-[tabler--git-fork] size-4" aria-hidden />
                                {nf.format(repo.forks ?? 0)}
              </span>
                            <span className="hairline rounded-lg px-2 py-1 inline-flex items-center gap-1">
                <span className="icon-[tabler--star] size-4" aria-hidden />
                                {nf.format(repo.stars ?? 0)}
              </span>
                            <span className="hairline rounded-lg px-2 py-1 inline-flex items-center gap-1">
                <span className="icon-[tabler--git-branch] size-4" aria-hidden />
                                {repo.defaultBranch}
              </span>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                            <a
                                className="btn btn-ghost focus-ring inline-flex items-center gap-2"
                                href={repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="icon-[tabler--brand-github] size-5" aria-hidden />
                                GitHub
                            </a>
                            {repo.homepage && (
                                <a
                                    className="btn btn-primary focus-ring inline-flex items-center gap-2"
                                    href={repo.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="icon-[tabler--external-link] size-5" aria-hidden />
                                    Live
                                </a>
                            )}
                        </div>

                        {stack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {stack.map((t) => (
                                    <span key={t} className="hairline rounded-full px-3 py-1 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:w-[360px] lg:w-[420px] md:shrink-0">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--surface)] card">
                            <Image
                                src={cover}
                                alt={`${repo.name} cover`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 100vw"
                                priority={false}
                                unoptimized
                            />
                        </div>
                    </div>
                </div>
            </header>

            <section className="card p-5">
                <h2 className="text-lg font-semibold">Languages</h2>

                {stackedBar.length > 0 ? (
                    <div className="mt-4">
                        <div className="h-2 rounded-full overflow-hidden hairline bg-[var(--surface)]" role="img" aria-label="Language distribution">
                            <div className="flex h-full w-full">
                                {stackedBar.map((l, i) => (
                                    <span
                                        key={l.name}
                                        style={{
                                            width: `${Math.max(2, Math.round(l.pct))}%`,
                                            background: PALETTE[i % PALETTE.length],
                                        }}
                                        aria-hidden
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                            {stackedBar.map((l, i) => (
                                <span key={l.name} className="inline-flex items-center gap-1.5">
                  <span
                      className="inline-block size-2 rounded-[3px]"
                      style={{ background: PALETTE[i % PALETTE.length] }}
                      aria-hidden
                  />
                                    {l.name} {Math.round(l.pct)}%
                </span>
                            ))}
                        </div>
                        {totalPct !== 100 && (
                            <p className="mt-2 text-[var(--muted)] text-xs">Percentages are approximate.</p>
                        )}
                    </div>
                ) : (
                    <p className="mt-2 text-[var(--muted)]">No languages detected.</p>
                )}
            </section>

            {(bullets.length > 0 || repo.topics?.length) && (
                <section className="grid sm:grid-cols-2 gap-5">
                    <div className="card p-5">
                        <h3 className="font-semibold">Highlights</h3>
                        {bullets.length > 0 ? (
                            <ul className="mt-3 space-y-2 text-sm">
                                {bullets.slice(0, 4).map((b, i) => (
                                    <li key={`${repo.name}-hl-${i}`} className="flex items-start gap-2">
                                        <span className="icon-[tabler--circle-check] size-4 mt-0.5 text-[var(--accent)]" aria-hidden />
                                        <span>{b}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-3 text-[var(--muted)]">—</p>
                        )}
                    </div>

                    <div className="card p-5">
                        <h3 className="font-semibold">Topics</h3>
                        {Array.isArray(repo.topics) && repo.topics.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {repo.topics.slice(0, 12).map((t) => (
                                    <span key={t} className="hairline rounded-full px-3 py-1 text-xs text-[var(--muted)]">
                    {t}
                  </span>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-[var(--muted)]">—</p>
                        )}
                    </div>
                </section>
            )}

            <section className="grid sm:grid-cols-2 gap-5">
                <div className="card p-5">
                    <h3 className="font-semibold">Repository</h3>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-[var(--muted)]">Created</dt>
                        <dd>{dtf.format(new Date(repo.createdAt))}</dd>
                        <dt className="text-[var(--muted)]">Default branch</dt>
                        <dd>{repo.defaultBranch}</dd>
                        <dt className="text-[var(--muted)]">Stars</dt>
                        <dd>★ {nf.format(repo.stars ?? 0)}</dd>
                        <dt className="text-[var(--muted)]">Forks</dt>
                        <dd>{nf.format(repo.forks ?? 0)}</dd>
                    </dl>
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold">Description</h3>
                    <p className="mt-3 text-[var(--muted)]">{repo.description || "—"}</p>
                </div>
            </section>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </article>
    );
}
