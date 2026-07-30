import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import {
    fetchAllRepos,
    fetchRepoByName,
    fetchRepoLanguages,
    type Repo,
} from "@/lib/github";

export const dynamicParams = true;
export const revalidate = 3600;

type Params = { slug: string };

type StoryImage = {
    src: string;
    alt: string;
    caption?: string;
};

type StoryArchitecture = {
    title?: string;
    items: { label: string; value: string }[];
};

type StoryData = {
    title?: string;
    summary?: string;
    role?: string;
    duration?: string;
    team?: string;
    category?: string;
    featured?: boolean;
    liveUrl?: string;
    githubUrl?: string;
    overview?: string;
    problem?: string;
    solution?: string;
    challenges?: string[];
    lessons?: string[];
    features?: string[];
    screenshots?: StoryImage[];
    architecture?: StoryArchitecture;
    cover?: string;
};

const PALETTE = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];
const dtf = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
});
const nf = new Intl.NumberFormat(undefined, { notation: "compact" });

const STORY_PATH = ".portfolio/story.md";
const README_PATH = "README.md";

function pickRepoOwner(repo: Repo) {
    return (process.env.GITHUB_USERNAME as string) || (repo as any)?.owner?.login || "github";
}

function formatDate(v?: string | null) {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : dtf.format(d);
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitParagraphs(text?: string) {
    if (!text) return [];
    return text
        .split(/\n\s*\n/g)
        .map((part) => part.trim())
        .filter(Boolean);
}

function firstParagraph(text?: string) {
    return splitParagraphs(text)[0] ?? "";
}

function extractSection(markdown: string, heading: string) {
    const lines = markdown.split(/\r?\n/);
    const needle = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "i");

    const start = lines.findIndex((line) => needle.test(line.trim()));
    if (start === -1) return "";

    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^#{1,2}\s+/.test(line)) {
            end = i;
            break;
        }
    }

    return lines.slice(start + 1, end).join("\n").trim();
}

function parseBulletList(section: string) {
    if (!section) return [];
    return section
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter((line) => /^[-*+]\s+/.test(line))
        .map((line) => line.replace(/^[-*+]\s+/, "").trim())
        .filter(Boolean);
}

function parseKeyValueList(section: string) {
    if (!section) return [];
    return section
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const match = line.match(/^(.+?)[\s]*[:\-–—][\s]*(.+)$/);
            if (match) {
                return {
                    label: match[1].replace(/^[-*+]\s+/, "").trim(),
                    value: match[2].trim(),
                };
            }
            return null;
        })
        .filter(Boolean) as { label: string; value: string }[];
}

function parseScreenshots(section: string): StoryImage[] {
    if (!section) return [];
    const shots: StoryImage[] = [];

    for (const rawLine of section.split(/\r?\n/g)) {
        const line = rawLine.trim();
        const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (!match) continue;

        shots.push({
            alt: match[1]?.trim() || "Project screenshot",
            src: match[2].trim(),
        });
    }

    return shots;
}

function extractFirstImage(markdown?: null | string): StoryImage | null {
    if (!markdown) return null;

    const mdMatch = markdown.match(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
    if (mdMatch) {
        return {
            alt: mdMatch[1]?.trim() || "Project cover",
            src: mdMatch[2].trim(),
        };
    }

    const htmlMatch = markdown.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (htmlMatch) {
        const altMatch = markdown.match(/<img[^>]+alt=["']([^"']*)["'][^>]*src=["'][^"']+["'][^>]*>/i);
        return {
            alt: altMatch?.[1]?.trim() || "Project cover",
            src: htmlMatch[1].trim(),
        };
    }

    return null;
}

function resolveRepoAssetUrl(repo: Repo, input: string, sourcePath = STORY_PATH) {
    const value = input.trim();

    if (/^https?:\/\//i.test(value)) return value;

    const cleaned = value.replace(/^\.?\//, "");
    const baseDir = sourcePath.includes("/") ? sourcePath.split("/").slice(0, -1).join("/") : "";
    const relativePath = value.startsWith("/") ? cleaned : baseDir ? `${baseDir}/${cleaned}` : cleaned;

    const owner = pickRepoOwner(repo);
    const branch = (repo as any).defaultBranch || process.env.CONTENT_BRANCH || "main";
    const encodedPath = relativePath
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

    return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/${encodeURIComponent(branch)}/${encodedPath}`;
}

function normalizeScreenshots(repo: Repo, shots: StoryImage[], sourcePath = STORY_PATH) {
    return shots
        .map((shot) => ({
            ...shot,
            src: resolveRepoAssetUrl(repo, shot.src, sourcePath),
        }))
        .filter((shot) => Boolean(shot.src));
}

async function fetchRepoFileText(repo: Repo, filePath: string) {
    const owner = pickRepoOwner(repo);
    const branch = (repo as any).defaultBranch || process.env.CONTENT_BRANCH || "main";
    const token = process.env.CONTENT_TOKEN || process.env.GITHUB_TOKEN || "";

    const url = `https://api.github.com/repos/${owner}/${repo.name}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;

    const res = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.raw+json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "User-Agent": "portfolio-story-loader",
        },
        next: { revalidate },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Unable to fetch ${filePath} for ${repo.name}`);

    return await res.text();
}

async function loadStory(repo: Repo): Promise<StoryData | null> {
    const [storyMarkdown, readmeMarkdown] = await Promise.all([
        fetchRepoFileText(repo, STORY_PATH),
        fetchRepoFileText(repo, README_PATH),
    ]);

    if (!storyMarkdown && !readmeMarkdown) return null;

    const parsed = storyMarkdown ? matter(storyMarkdown) : { data: {}, content: "" };
    const fm = (parsed.data ?? {}) as Record<string, any>;
    const body = parsed.content ?? "";

    const overview = fm.overview ?? extractSection(body, "Overview");
    const problem = fm.problem ?? extractSection(body, "Problem");
    const solution = fm.solution ?? extractSection(body, "Solution");

    const featuresSection = extractSection(body, "Features");
    const challengesSection = extractSection(body, "Challenges");
    const lessonsSection =
        extractSection(body, "What I Learned") ||
        extractSection(body, "Lessons") ||
        extractSection(body, "Key Learnings");

    const screenshotsFromFm = Array.isArray(fm.screenshots) ? fm.screenshots : [];
    const screenshotsFromBody = parseScreenshots(extractSection(body, "Screenshots"));

    const architectureFromFm = fm.architecture?.items?.length
        ? {
            title: fm.architecture.title,
            items: fm.architecture.items,
        }
        : undefined;

    const architectureSection = extractSection(body, "Architecture");
    const architectureFromBody = parseKeyValueList(architectureSection);

    const readmeCover = extractFirstImage(readmeMarkdown);
    const storyCover =
        typeof fm.cover === "string" && fm.cover.trim().length > 0
            ? resolveRepoAssetUrl(repo, fm.cover, STORY_PATH)
            : undefined;

    const screenshots = normalizeScreenshots(
        repo,
        (screenshotsFromFm.length ? screenshotsFromFm : screenshotsFromBody).map((shot: any) => ({
            src: String(shot.src ?? "").trim(),
            alt: String(shot.alt ?? shot.caption ?? "Project screenshot").trim(),
            caption: shot.caption ? String(shot.caption).trim() : undefined,
        })),
        STORY_PATH
    );

    const architecture =
        architectureFromFm ??
        (architectureFromBody.length
            ? {
                title: "Architecture snapshot",
                items: architectureFromBody,
            }
            : undefined);

    const features =
        Array.isArray(fm.features) && fm.features.length
            ? fm.features.map((item: any) => String(item).trim()).filter(Boolean)
            : parseBulletList(featuresSection);

    const challenges =
        Array.isArray(fm.challenges) && fm.challenges.length
            ? fm.challenges.map((item: any) => String(item).trim()).filter(Boolean)
            : parseBulletList(challengesSection);

    const lessons =
        Array.isArray(fm.lessons) && fm.lessons.length
            ? fm.lessons.map((item: any) => String(item).trim()).filter(Boolean)
            : parseBulletList(lessonsSection);

    const summary =
        fm.summary ||
        firstParagraph(overview) ||
        firstParagraph(readmeMarkdown ?? "") ||
        repo.description ||
        `Details and links for ${repo.name}`;

    return {
        title: fm.title || repo.name,
        summary,
        role: fm.role,
        duration: fm.duration,
        team: fm.team,
        category: fm.category,
        featured: Boolean(fm.featured),
        liveUrl: fm.liveUrl,
        githubUrl: fm.githubUrl,
        overview: overview || undefined,
        problem: problem || undefined,
        solution: solution || undefined,
        challenges,
        lessons,
        features,
        screenshots,
        architecture,
        cover: readmeCover
            ? resolveRepoAssetUrl(repo, readmeCover.src, README_PATH)
            : storyCover || screenshots[0]?.src,
    };
}

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

        const story = await loadStory(repo);
        const title = story?.title ?? repo.name;
        const desc = story?.summary ?? repo.description ?? `Details and links for ${repo.name}`;
        const owner = pickRepoOwner(repo);
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

    const story = await loadStory(repo);
    const langs = await fetchRepoLanguages(slug).catch(() => []);
    const totalPct = Math.round(langs.reduce((a, b) => a + b.pct, 0));

    const screenshots = story?.screenshots ?? [];
    const architecture = story?.architecture?.items ?? [];
    const stack =
        architecture.length > 0
            ? architecture.map((item) => item.value).filter(Boolean).slice(0, 6)
            : Array.isArray((repo as any).topics)
                ? ((repo as any).topics as string[]).slice(0, 6)
                : [];

    const cover =
        story?.cover ||
        screenshots[0]?.src ||
        `https://opengraph.githubassets.com/1/${encodeURIComponent(
            pickRepoOwner(repo)
        )}/${encodeURIComponent(repo.name)}`;

    const safeLicense =
        typeof (repo as any).license === "string"
            ? ((repo as any).license as string)
            : (repo as any)?.license?.spdx_id || (repo as any)?.license?.key || "No license";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: story?.title ?? repo.name,
        description: story?.summary ?? repo.description ?? undefined,
        codeRepository: story?.githubUrl ?? repo.htmlUrl,
        programmingLanguage: langs.map((l) => l.name),
        dateCreated: repo.createdAt,
        dateModified: repo.updatedAt,
        license: safeLicense,
    };

    const overviewBlocks = splitParagraphs(story?.overview);
    const problemBlocks = splitParagraphs(story?.problem);
    const solutionBlocks = splitParagraphs(story?.solution);

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
                                {story?.title ?? repo.name}
                            </span>
                        </h1>

                        <p className="mt-2 text-[var(--muted)] max-w-2xl">
                            {story?.summary ?? repo.description ?? "A project page with live repository data and a repo-owned story file."}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                            <span className="hairline rounded-lg px-2 py-1 inline-flex items-center gap-1">
                                <span className="icon-[tabler--clock] size-4" aria-hidden />
                                Updated {formatDate(repo.updatedAt)}
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
                                href={story?.githubUrl ?? repo.htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="icon-[tabler--brand-github] size-5" aria-hidden />
                                GitHub
                            </a>

                            {(story?.liveUrl || repo.homepage) && (
                                <a
                                    className="btn btn-primary focus-ring inline-flex items-center gap-2"
                                    href={story?.liveUrl ?? repo.homepage!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="icon-[tabler--external-link] size-5" aria-hidden />
                                    Live
                                </a>
                            )}
                        </div>

                        {(story?.role || story?.duration || story?.team || story?.category) && (
                            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {story?.role && (
                                    <div className="card p-4">
                                        <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Role</div>
                                        <div className="mt-1 font-medium">{story.role}</div>
                                    </div>
                                )}
                                {story?.duration && (
                                    <div className="card p-4">
                                        <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Duration</div>
                                        <div className="mt-1 font-medium">{story.duration}</div>
                                    </div>
                                )}
                                {story?.team && (
                                    <div className="card p-4">
                                        <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Team</div>
                                        <div className="mt-1 font-medium">{story.team}</div>
                                    </div>
                                )}
                                {story?.category && (
                                    <div className="card p-4">
                                        <div className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Category</div>
                                        <div className="mt-1 font-medium">{story.category}</div>
                                    </div>
                                )}
                            </div>
                        )}

                        {stack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {stack.map((item) => (
                                    <span key={item} className="hairline rounded-full px-3 py-1 text-xs text-[var(--muted)]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="md:w-[360px] lg:w-[420px] md:shrink-0">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--surface)] card">
                            <Image
                                src={cover}
                                alt={`${story?.title ?? repo.name} cover`}
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

            {story?.overview && (
                <section className="card p-5">
                    <h2 className="text-lg font-semibold">Overview</h2>
                    <div className="mt-3 space-y-3 text-[var(--muted)] leading-7">
                        {overviewBlocks.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </section>
            )}

            {(story?.problem || story?.solution) && (
                <section className="grid sm:grid-cols-2 gap-5">
                    {story?.problem && (
                        <div className="card p-5">
                            <h3 className="font-semibold">Problem</h3>
                            <div className="mt-3 space-y-3 text-[var(--muted)] leading-7">
                                {problemBlocks.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    )}
                    {story?.solution && (
                        <div className="card p-5">
                            <h3 className="font-semibold">Solution</h3>
                            <div className="mt-3 space-y-3 text-[var(--muted)] leading-7">
                                {solutionBlocks.map((p, i) => (
                                    <p key={i}>{p}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {story?.features?.length ? (
                <section className="card p-5">
                    <h3 className="font-semibold">Features</h3>
                    <ul className="mt-3 space-y-2 text-sm">
                        {story.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                                <span className="icon-[tabler--circle-check] size-4 mt-0.5 text-[var(--accent)]" aria-hidden />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            ) : null}

            {(story?.challenges?.length || story?.lessons?.length) ? (
                <section className="grid sm:grid-cols-2 gap-5">
                    {story?.challenges?.length ? (
                        <div className="card p-5">
                            <h3 className="font-semibold">Challenges</h3>
                            <ul className="mt-3 space-y-2 text-sm">
                                {story.challenges.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="icon-[tabler--alert-circle] size-4 mt-0.5 text-[var(--accent-2)]" aria-hidden />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {story?.lessons?.length ? (
                        <div className="card p-5">
                            <h3 className="font-semibold">What I learned</h3>
                            <ul className="mt-3 space-y-2 text-sm">
                                {story.lessons.map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <span className="icon-[tabler--bulb] size-4 mt-0.5 text-[var(--accent)]" aria-hidden />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </section>
            ) : null}

            {screenshots.length > 0 ? (
                <section className="card p-5">
                    <h3 className="font-semibold">Screenshots</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        {screenshots.map((shot) => (
                            <figure key={shot.src} className="space-y-2">
                                <div className="relative aspect-[16/10] rounded-xl overflow-hidden hairline bg-[var(--surface)]">
                                    <Image
                                        src={shot.src}
                                        alt={shot.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(min-width: 768px) 50vw, 100vw"
                                        unoptimized
                                    />
                                </div>
                                {shot.caption ? (
                                    <figcaption className="text-xs text-[var(--muted)]">{shot.caption}</figcaption>
                                ) : null}
                            </figure>
                        ))}
                    </div>
                </section>
            ) : null}

            {(architecture.length > 0 || langs.length > 0) && (
                <section className="grid sm:grid-cols-2 gap-5">
                    {architecture.length > 0 ? (
                        <div className="card p-5">
                            <h3 className="font-semibold">{story?.architecture?.title ?? "Architecture snapshot"}</h3>
                            <dl className="mt-3 space-y-3 text-sm">
                                {architecture.map((item) => (
                                    <div key={item.label} className="grid grid-cols-[120px_1fr] gap-3">
                                        <dt className="text-[var(--muted)]">{item.label}</dt>
                                        <dd className="font-medium">{item.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    ) : null}

                    <div className="card p-5">
                        <h3 className="font-semibold">Languages</h3>

                        {langs.length > 0 ? (
                            <div className="mt-4">
                                <div
                                    className="h-2 rounded-full overflow-hidden hairline bg-[var(--surface)]"
                                    role="img"
                                    aria-label="Language distribution"
                                >
                                    <div className="flex h-full w-full">
                                        {langs.slice(0, 6).map((l, i) => (
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
                                    {langs.slice(0, 6).map((l, i) => (
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

                                {totalPct !== 100 ? (
                                    <p className="mt-2 text-[var(--muted)] text-xs">Percentages are approximate.</p>
                                ) : null}
                            </div>
                        ) : (
                            <p className="mt-2 text-[var(--muted)]">No languages detected.</p>
                        )}
                    </div>
                </section>
            )}

            <section className="grid sm:grid-cols-2 gap-5">
                <div className="card p-5">
                    <h3 className="font-semibold">Repository</h3>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        <dt className="text-[var(--muted)]">Created</dt>
                        <dd>{formatDate(repo.createdAt)}</dd>
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