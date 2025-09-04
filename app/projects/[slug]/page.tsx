import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    fetchAllRepos,
    fetchRepoByName,
    fetchRepoLanguages,
    getRepoCardExtras,
    type Repo,
} from "@/lib/github";

export const dynamicParams = true;

export async function generateStaticParams() {
    try {
        const repos = await fetchAllRepos();
        return repos.slice(0, 100).map((r) => ({ slug: r.name }));
    } catch {
        return [];
    }
}

type Params = { slug: string };

const PALETTE = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];

function fmt(d: string) {
    try {
        return new Date(d).toLocaleDateString();
    } catch {
        return d;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<Params> }
): Promise<Metadata> {
    const { slug } = await params;
    return { title: slug };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;

    let repo: Repo | null = null;
    try {
        repo = await fetchRepoByName(slug);
    } catch {
        notFound();
    }
    if (!repo) notFound();

    const langs = await fetchRepoLanguages(slug).catch(() => []);
    const totalPct = Math.round(langs.reduce((a, b) => a + b.pct, 0));

    // SAME cover as RepoCard
    let cover: string | null = null;
    try {
        const extras = await getRepoCardExtras(repo);
        cover = extras?.cover ?? null;
    } catch {}
    const owner =
        (process.env.GITHUB_USERNAME as string) ||
        (repo as any)?.owner?.login ||
        "github";
    const ogCover = `https://opengraph.githubassets.com/1/${encodeURIComponent(owner)}/${encodeURIComponent(
        repo.name
    )}`;
    const displayCover = cover || ogCover;

    return (
        <article className="space-y-10">
            {/* HEADER with right-side image */}
            <header className="hero-glow relative overflow-hidden">
                {/* Pad the right side so text never sits under the image on md+ */}
                <div className="md:pr-[500px]">
                    <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              {repo.name}
            </span>
                    </h1>
                    <p className="mt-2 text-[var(--muted)]">
                        {repo.private ? "Private" : "Public"} • {repo.license || "No license"} • Updated {fmt(repo.updatedAt)}
                    </p>
                    <div className="mt-4 flex gap-3">
                        <a className="btn btn-ghost focus-ring" href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                            GitHub
                        </a>
                        {repo.homepage && (
                            <a className="btn btn-primary focus-ring" href={repo.homepage} target="_blank" rel="noopener noreferrer">
                                Live
                            </a>
                        )}
                    </div>
                </div>

                {/* Right-side image (shown on md+). Change `hidden md:block` -> `block` to show on mobile too */}
                <div className="pointer-events-none hidden md:block absolute inset-y-4 right-0 w-[460px]">
                    <div className="relative h-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm">
                        {displayCover ? (
                            <Image
                                src={displayCover}
                                alt={`${repo.name} cover`}
                                fill
                                className="object-cover"
                                sizes="(min-width: 1536px) 460px, (min-width: 1280px) 420px, (min-width: 1024px) 380px, 100vw"
                                priority={false}
                                unoptimized
                            />
                        ) : (
                            <div className="absolute inset-0 grid place-items-center text-[var(--muted)]">No image</div>
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[color:var(--surface)]/80 to-transparent" />
                    </div>
                </div>
            </header>

            {/* Languages chart */}
            <section className="card p-5">
                <h2 className="text-lg font-semibold">Languages</h2>
                <div className="mt-4 space-y-2">
                    {langs.length === 0 ? (
                        <p className="text-[var(--muted)]">No languages detected.</p>
                    ) : (
                        langs.map((l: any, i: number) => (
                            <div key={l.name}>
                                <div className="flex justify-between text-sm">
                                    <span>{l.name}</span>
                                    <span>{Math.round(l.pct)}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-[var(--border)] overflow-hidden">
                                    <div
                                        className="h-full"
                                        style={{ width: `${l.pct}%`, background: PALETTE[i % PALETTE.length] }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                    {totalPct !== 100 && langs.length > 0 && (
                        <p className="text-[var(--muted)] text-xs">Note: percentages are approximate.</p>
                    )}
                </div>
            </section>

            {/* Meta */}
            <section className="grid sm:grid-cols-2 gap-5">
                <div className="card p-5">
                    <h3 className="font-semibold">Repository</h3>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-[var(--muted)]">Created</dt>
                        <dd>{fmt(repo.createdAt)}</dd>
                        <dt className="text-[var(--muted)]">Default branch</dt>
                        <dd>{repo.defaultBranch}</dd>
                        <dt className="text-[var(--muted)]">Stars</dt>
                        <dd>★ {repo.stars}</dd>
                        <dt className="text-[var(--muted)]">Forks</dt>
                        <dd>{repo.forks}</dd>
                    </dl>
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold">Description</h3>
                    <p className="mt-3 text-[var(--muted)]">{repo.description || "—"}</p>
                </div>
            </section>
        </article>
    );
}
