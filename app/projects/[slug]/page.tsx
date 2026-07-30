import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import {
    fetchAllRepos,
    fetchRepoByName,
    fetchRepoLanguages,
    type Repo,
} from "@/lib/github";
import Reveal from "@/components/Reveal";

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
    return (process.env.GITHUB_USERNAME as string) || repo.owner?.login || "github";
}

function formatDate(v?: string | null) {
    if (!v) return "";
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : dtf.format(d);
}

function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitParagraphs(text?: string | null) {
    if (!text) return [];
    return text
        .split(/\n\s*\n/g)
        .map((part) => part.trim())
        .filter(Boolean);
}


function cleanMarkdownText(text?: string | null) {
    if (!text) return "";
    return text
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // Strip ![alt](url)
        .replace(/<img[^>]*>/gi, "")          // Strip <img ...>
        .replace(/^#+\s+/gm, "")               // Strip headers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert [text](url) -> text
        .trim();
}

function firstParagraph(text?: string | null) {
    if (!text) return "";
    const paragraphs = splitParagraphs(text);
    for (const p of paragraphs) {
        const cleaned = cleanMarkdownText(p);
        if (cleaned.length > 0) return cleaned;
    }
    return "";
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
    const branch = repo.defaultBranch || process.env.CONTENT_BRANCH || "main";
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
    const branch = repo.defaultBranch || process.env.CONTENT_BRANCH || "main";
    const token = process.env.CONTENT_TOKEN || process.env.GITHUB_TOKEN || "";

    const url = `https://api.github.com/repos/${owner}/${repo.name}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;

    try {
        const res = await fetch(url, {
            headers: {
                Accept: "application/vnd.github.raw+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "User-Agent": "portfolio-story-loader",
            },
            next: { revalidate },
        });

        if (res.status === 404) return null;
        if (!res.ok) return null;

        return await res.text();
    } catch {
        return null;
    }
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
        repo.description ||
        firstParagraph(readmeMarkdown ?? "") ||
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
            : Array.isArray(repo.topics)
                ? repo.topics.slice(0, 6)
                : [];

    const cover =
        story?.cover ||
        screenshots[0]?.src ||
        `https://opengraph.githubassets.com/1/${encodeURIComponent(
            pickRepoOwner(repo)
        )}/${encodeURIComponent(repo.name)}`;

    const safeLicense = repo.license || "No license";

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

    const displayOverview = story?.overview || repo.description || null;
    const overviewBlocks = splitParagraphs(displayOverview);
    const problemBlocks = splitParagraphs(story?.problem);
    const solutionBlocks = splitParagraphs(story?.solution);

    return (
        <article className="space-y-12 pb-20 container-xl max-w-5xl mx-auto pt-6">

            <Reveal>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors group mb-6"
                >
                    <span className="icon-[tabler--arrow-left] size-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
                    Back to projects
                </Link>
            </Reveal>

            <Reveal delay={0.05}>
                <header className="hero-glow">
                    <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border)] bg-[var(--surface)] rounded-full text-xs font-medium text-[var(--fg)] shadow-sm">
                                <span className="icon-[tabler--brand-github] size-4 text-[var(--accent)]" aria-hidden />
                                {repo.private ? "Private" : "Public"} • {safeLicense}
                            </div>

                            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">
                                {story?.title ?? repo.name}
                            </h1>

                            <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
                                {story?.summary ?? repo.description ?? "A project page with live repository data and a repo-owned story file."}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--clock] size-4" aria-hidden />
                                    Updated {formatDate(repo.updatedAt)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--git-fork] size-4" aria-hidden />
                                    {nf.format(repo.forks ?? 0)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--star] size-4" aria-hidden />
                                    {nf.format(repo.stars ?? 0)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--git-branch] size-4" aria-hidden />
                                    {repo.defaultBranch}
                                </span>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {(story?.liveUrl || repo.homepage) && (
                                    <a
                                        className="rounded-lg bg-[var(--accent)] text-[var(--bg)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
                                        href={story?.liveUrl ?? repo.homepage!}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="icon-[tabler--external-link] size-5" aria-hidden />
                                        Visit Live Site
                                    </a>
                                )}
                                <a
                                    className="rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] px-6 py-3 text-sm font-semibold hover:border-[var(--accent)] transition-colors flex items-center gap-2 shadow-sm"
                                    href={story?.githubUrl ?? repo.htmlUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="icon-[tabler--brand-github] size-5" aria-hidden />
                                    View Source
                                </a>
                            </div>

                            {(story?.role || story?.duration || story?.team || story?.category) && (
                                <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-4 border-t border-[var(--border)] pt-8">
                                    {story?.role && (
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Role</div>
                                            <div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.role}</div>
                                        </div>
                                    )}
                                    {story?.duration && (
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Duration</div>
                                            <div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.duration}</div>
                                        </div>
                                    )}
                                    {story?.team && (
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Team</div>
                                            <div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.team}</div>
                                        </div>
                                    )}
                                    {story?.category && (
                                        <div>
                                            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Category</div>
                                            <div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.category}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {stack.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {stack.map((item) => (
                                        <span key={item} className="border border-[var(--border)] bg-[var(--bg)] rounded-md px-2.5 py-1 text-xs font-medium text-[var(--muted)]">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="md:w-[360px] lg:w-[480px] md:shrink-0">
                            <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] shadow-lg group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                                <Image
                                    src={cover}
                                    alt={`${story?.title ?? repo.name} cover`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 480px, (min-width: 768px) 360px, 100vw"
                                    priority={true}
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </header>
            </Reveal>

            {overviewBlocks.length > 0 && (
                <Reveal delay={0.1}>
                    <section className="card p-6 md:p-8 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-l-2xl" />
                        <h2 className="text-xl font-bold text-[var(--fg)] flex items-center gap-2">
                            <span className="icon-[tabler--info-circle] text-[var(--accent)] size-5" aria-hidden />
                            Overview
                        </h2>
                        <div className="mt-4 space-y-4 text-[var(--muted)] leading-relaxed md:text-lg">
                            {overviewBlocks.map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </section>
                </Reveal>
            )}

            {(story?.problem || story?.solution) && (
                <Reveal delay={0.15}>
                    <section className="grid md:grid-cols-2 gap-6">
                        {story?.problem && (
                            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                                <h3 className="text-lg font-bold text-[var(--fg)] flex items-center gap-2">
                                    <span className="icon-[tabler--target] text-[var(--accent-2)] size-5" aria-hidden />
                                    The Challenge
                                </h3>
                                <div className="mt-4 space-y-3 text-[var(--muted)] leading-relaxed">
                                    {problemBlocks.map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {story?.solution && (
                            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                                <h3 className="text-lg font-bold text-[var(--fg)] flex items-center gap-2">
                                    <span className="icon-[tabler--bulb] text-[var(--success)] size-5" aria-hidden />
                                    The Solution
                                </h3>
                                <div className="mt-4 space-y-3 text-[var(--muted)] leading-relaxed">
                                    {solutionBlocks.map((p, i) => (
                                        <p key={i}>{p}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </Reveal>
            )}

            {story?.features?.length ? (
                <Reveal delay={0.2}>
                    <section className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)]">
                        <h3 className="text-lg font-bold text-[var(--fg)] mb-6">Key Features</h3>
                        <ul className="grid sm:grid-cols-2 gap-4 text-sm md:text-base text-[var(--muted)]">
                            {story.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]">
                                    <div className="mt-0.5 rounded-full bg-[color-mix(in_oklab,var(--success)_20%,transparent)] p-1 shrink-0">
                                        <span className="icon-[tabler--check] size-3.5 text-[var(--success)]" aria-hidden />
                                    </div>
                                    <span className="leading-snug">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </Reveal>
            ) : null}

            {(story?.challenges?.length || story?.lessons?.length) ? (
                <Reveal delay={0.25}>
                    <section className="grid md:grid-cols-2 gap-6">
                        {story?.challenges?.length ? (
                            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                                <h3 className="text-lg font-bold text-[var(--fg)] mb-5">Hurdles Overcome</h3>
                                <ul className="space-y-3 text-sm text-[var(--muted)]">
                                    {story.challenges.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="icon-[tabler--alert-triangle] size-5 mt-0.5 text-[var(--accent-2)] shrink-0" aria-hidden />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {story?.lessons?.length ? (
                            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                                <h3 className="text-lg font-bold text-[var(--fg)] mb-5">What I Learned</h3>
                                <ul className="space-y-3 text-sm text-[var(--muted)]">
                                    {story.lessons.map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <span className="icon-[tabler--school] size-5 mt-0.5 text-[var(--accent)] shrink-0" aria-hidden />
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </section>
                </Reveal>
            ) : null}

            {screenshots.length > 0 ? (
                <Reveal delay={0.3}>
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-[var(--fg)]">Gallery</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            {screenshots.map((shot) => (
                                <figure key={shot.src} className="group flex flex-col gap-3">
                                    <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] shadow-sm">
                                        <Image
                                            src={shot.src}
                                            alt={shot.alt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                            sizes="(min-width: 768px) 50vw, 100vw"
                                            unoptimized
                                        />
                                    </div>
                                    {shot.caption ? (
                                        <figcaption className="text-sm text-[var(--muted)] text-center px-4">
                                            {shot.caption}
                                        </figcaption>
                                    ) : null}
                                </figure>
                            ))}
                        </div>
                    </section>
                </Reveal>
            ) : null}

            {(architecture.length > 0 || langs.length > 0) && (
                <Reveal delay={0.35}>
                    <section className="grid md:grid-cols-2 gap-6">
                        {architecture.length > 0 ? (
                            <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                                <h3 className="text-lg font-bold text-[var(--fg)] mb-5">
                                    {story?.architecture?.title ?? "Architecture"}
                                </h3>
                                <dl className="space-y-4 text-sm">
                                    {architecture.map((item) => (
                                        <div key={item.label} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                                            <dt className="text-[var(--muted)] font-medium">{item.label}</dt>
                                            <dd className="text-[var(--fg)]">{item.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        ) : null}

                        <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] flex flex-col">
                            <h3 className="text-lg font-bold text-[var(--fg)] mb-5">Languages</h3>

                            {langs.length > 0 ? (
                                <div className="mt-auto">
                                    <div
                                        className="h-2.5 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex"
                                        role="img"
                                        aria-label="Language distribution"
                                    >
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

                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm text-[var(--fg)] font-medium">
                                        {langs.slice(0, 6).map((l, i) => (
                                            <span key={l.name} className="flex items-center gap-2">
                                                <span
                                                    className="size-3 rounded-[4px] shrink-0"
                                                    style={{ background: PALETTE[i % PALETTE.length] }}
                                                    aria-hidden
                                                />
                                                <span className="truncate">{l.name}</span>
                                                <span className="text-[var(--muted)] ml-auto font-mono text-xs">{Math.round(l.pct)}%</span>
                                            </span>
                                        ))}
                                    </div>

                                    {totalPct !== 100 ? (
                                        <p className="mt-5 text-[var(--muted)] text-xs border-t border-[var(--border)] pt-4">
                                            Percentages are approximate.
                                        </p>
                                    ) : null}
                                </div>
                            ) : (
                                <p className="text-[var(--muted)] text-sm">No languages detected via GitHub API.</p>
                            )}
                        </div>
                    </section>
                </Reveal>
            )}

            {/* Always-rendered Repository Info & Description */}
            <Reveal delay={0.4}>
                <section className="grid sm:grid-cols-2 gap-6">
                    <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]">
                        <h3 className="text-lg font-bold text-[var(--fg)] mb-4 flex items-center gap-2">
                            <span className="icon-[tabler--database] text-[var(--accent)] size-5" aria-hidden />
                            Repository Info
                        </h3>
                        <dl className="grid grid-cols-[130px_1fr] gap-y-3 text-sm">
                            <dt className="text-[var(--muted)]">Created</dt>
                            <dd className="font-medium text-[var(--fg)]">{formatDate(repo.createdAt)}</dd>

                            <dt className="text-[var(--muted)]">Default branch</dt>
                            <dd className="font-medium text-[var(--fg)] font-mono text-xs">{repo.defaultBranch}</dd>

                            <dt className="text-[var(--muted)]">Stars</dt>
                            <dd className="font-medium text-[var(--fg)]">★ {nf.format(repo.stars ?? 0)}</dd>

                            <dt className="text-[var(--muted)]">Forks</dt>
                            <dd className="font-medium text-[var(--fg)]">{nf.format(repo.forks ?? 0)}</dd>

                            <dt className="text-[var(--muted)]">License</dt>
                            <dd className="font-medium text-[var(--fg)]">{safeLicense}</dd>
                        </dl>
                    </div>

                    <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] flex flex-col">
                        <h3 className="text-lg font-bold text-[var(--fg)] mb-4 flex items-center gap-2">
                            <span className="icon-[tabler--file-text] text-[var(--accent)] size-5" aria-hidden />
                            GitHub Description
                        </h3>
                        <p className="text-sm text-[var(--muted)] leading-relaxed my-auto">
                            {repo.description || "No GitHub description provided for this repository."}
                        </p>
                    </div>
                </section>
            </Reveal>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </article>
    );
}