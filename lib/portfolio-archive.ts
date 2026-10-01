import matter from "gray-matter";
import {
    fetchAllRepos,
    fetchRepoByName,
    fetchRepoLanguages,
    type Repo,
} from "./github";
import type {
    ArchiveArchitecture,
    ArchiveLanguage,
    ArchiveRepository,
    ArchiveStory,
    ArchiveStoryImage,
    RepositoryArchiveProject,
} from "./portfolio-resolver-core";

const STORY_PATH = ".portfolio/story.md";
const README_PATH = "README.md";
const ARCHIVE_REVALIDATE_SECONDS = 3600;

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textValue(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function safeHttpUrl(value: unknown): string | undefined {
    const candidate = textValue(value);
    if (!candidate) return undefined;
    try {
        const parsed = new URL(candidate);
        return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : undefined;
    } catch {
        return undefined;
    }
}

function pickRepoOwner(repo: Repo): string {
    return process.env.GITHUB_USERNAME || repo.owner?.login || "github";
}

function splitParagraphs(text?: string | null): string[] {
    if (!text) return [];
    return text
        .split(/\n\s*\n/g)
        .map((part) => part.trim())
        .filter(Boolean);
}

function cleanMarkdownText(text?: string | null): string {
    if (!text) return "";
    return text
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/<img[^>]*>/gi, "")
        .replace(/^#+\s+/gm, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .trim();
}

function firstParagraph(text?: string | null): string {
    for (const paragraph of splitParagraphs(text)) {
        const cleaned = cleanMarkdownText(paragraph);
        if (cleaned) return cleaned;
    }
    return "";
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSection(markdown: string, heading: string): string {
    const lines = markdown.split(/\r?\n/);
    const needle = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, "i");
    const start = lines.findIndex((line) => needle.test(line.trim()));
    if (start === -1) return "";

    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
        if (/^#{1,2}\s+/.test(lines[index].trim())) {
            end = index;
            break;
        }
    }

    return lines.slice(start + 1, end).join("\n").trim();
}

function parseBulletList(section: string): string[] {
    if (!section) return [];
    return section
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter((line) => /^[-*+]\s+/.test(line))
        .map((line) => line.replace(/^[-*+]\s+/, "").trim())
        .filter(Boolean);
}

function parseKeyValueList(section: string): { label: string; value: string }[] {
    if (!section) return [];
    return section
        .split(/\r?\n/g)
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => {
            const match = line.match(/^(.+?)[\s]*[:\-–—][\s]*(.+)$/);
            return match
                ? [{ label: match[1].replace(/^[-*+]\s+/, "").trim(), value: match[2].trim() }]
                : [];
        });
}

function parseScreenshots(section: string): ArchiveStoryImage[] {
    if (!section) return [];
    return section.split(/\r?\n/g).flatMap((rawLine) => {
        const match = rawLine.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        return match
            ? [{ alt: match[1]?.trim() || "Project screenshot", src: match[2].trim() }]
            : [];
    });
}

function extractFirstImage(markdown?: string | null): ArchiveStoryImage | null {
    if (!markdown) return null;

    const markdownMatch = markdown.match(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
    if (markdownMatch) {
        return {
            alt: markdownMatch[1]?.trim() || "Project cover",
            src: markdownMatch[2].trim(),
        };
    }

    const htmlMatch = markdown.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (!htmlMatch) return null;
    const altMatch = markdown.match(/<img[^>]+alt=["']([^"']*)["'][^>]*src=["'][^"']+["'][^>]*>/i);
    return {
        alt: altMatch?.[1]?.trim() || "Project cover",
        src: htmlMatch[1].trim(),
    };
}

function resolveRepoAssetUrl(repo: Repo, input: string, sourcePath = STORY_PATH): string {
    const value = input.trim();
    if (/^https?:\/\//i.test(value)) return value;

    const cleaned = value.replace(/^\.?\//, "");
    const baseDir = sourcePath.includes("/") ? sourcePath.split("/").slice(0, -1).join("/") : "";
    const relativePath = value.startsWith("/") ? cleaned : baseDir ? `${baseDir}/${cleaned}` : cleaned;
    const owner = pickRepoOwner(repo);
    const branch = repo.defaultBranch || process.env.CONTENT_BRANCH || "main";
    const encodedPath = relativePath.split("/").map((part) => encodeURIComponent(part)).join("/");

    return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/${encodeURIComponent(branch)}/${encodedPath}`;
}

function normalizeScreenshots(repo: Repo, shots: readonly ArchiveStoryImage[], sourcePath = STORY_PATH): ArchiveStoryImage[] {
    return shots
        .map((shot) => ({ ...shot, src: resolveRepoAssetUrl(repo, shot.src, sourcePath) }))
        .filter((shot) => Boolean(shot.src));
}

function parseStoryImages(value: unknown): ArchiveStoryImage[] {
    if (!Array.isArray(value)) return [];
    return value.flatMap((item) => {
        if (!isRecord(item)) return [];
        const src = textValue(item.src);
        if (!src) return [];
        const alt = textValue(item.alt) || textValue(item.caption) || "Project screenshot";
        const caption = textValue(item.caption);
        return [{ src, alt, ...(caption ? { caption } : {}) }];
    });
}

function parseArchitecture(value: unknown): ArchiveArchitecture | undefined {
    if (!isRecord(value) || !Array.isArray(value.items)) return undefined;
    const items = value.items.flatMap((item) => {
        if (!isRecord(item)) return [];
        const label = textValue(item.label);
        const itemValue = textValue(item.value);
        return label && itemValue ? [{ label, value: itemValue }] : [];
    });
    if (items.length === 0) return undefined;
    const title = textValue(value.title);
    return { items, ...(title ? { title } : {}) };
}

function listFromFrontmatter(value: unknown, fallback: string[]): string[] {
    if (!Array.isArray(value)) return fallback;
    return value.flatMap((item) => {
        const text = textValue(item);
        return text ? [text] : [];
    });
}

async function fetchRepoFileText(repo: Repo, filePath: string): Promise<string | null> {
    const owner = pickRepoOwner(repo);
    const branch = repo.defaultBranch || process.env.CONTENT_BRANCH || "main";
    const token = process.env.CONTENT_TOKEN || process.env.GITHUB_TOKEN || "";
    const url = `https://api.github.com/repos/${owner}/${repo.name}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(branch)}`;

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github.raw+json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "User-Agent": "portfolio-archive-loader",
            },
            next: { revalidate: ARCHIVE_REVALIDATE_SECONDS },
        });
        if (!response.ok) return null;
        return await response.text();
    } catch {
        return null;
    }
}

async function loadStory(repo: Repo): Promise<ArchiveStory | null> {
    const [storyMarkdown, readmeMarkdown] = await Promise.all([
        fetchRepoFileText(repo, STORY_PATH),
        fetchRepoFileText(repo, README_PATH),
    ]);
    if (!storyMarkdown && !readmeMarkdown) return null;

    const parsed = storyMarkdown ? matter(storyMarkdown) : null;
    const frontmatter = parsed && isRecord(parsed.data) ? parsed.data : {};
    const body = parsed?.content ?? "";
    const overview = textValue(frontmatter.overview) || extractSection(body, "Overview");
    const problem = textValue(frontmatter.problem) || extractSection(body, "Problem");
    const solution = textValue(frontmatter.solution) || extractSection(body, "Solution");
    const featuresSection = extractSection(body, "Features");
    const challengesSection = extractSection(body, "Challenges");
    const lessonsSection = extractSection(body, "What I Learned") || extractSection(body, "Lessons") || extractSection(body, "Key Learnings");
    const screenshotsFromFrontmatter = parseStoryImages(frontmatter.screenshots);
    const screenshotsFromBody = parseScreenshots(extractSection(body, "Screenshots"));
    const architectureFromFrontmatter = parseArchitecture(frontmatter.architecture);
    const architectureFromBody = parseKeyValueList(extractSection(body, "Architecture"));
    const readmeCover = extractFirstImage(readmeMarkdown);
    const storyCover = textValue(frontmatter.cover);
    const screenshots = normalizeScreenshots(
        repo,
        screenshotsFromFrontmatter.length > 0 ? screenshotsFromFrontmatter : screenshotsFromBody,
    );
    const architecture = architectureFromFrontmatter || (architectureFromBody.length > 0
        ? { title: "Architecture snapshot", items: architectureFromBody }
        : undefined);
    const features = listFromFrontmatter(frontmatter.features, parseBulletList(featuresSection));
    const challenges = listFromFrontmatter(frontmatter.challenges, parseBulletList(challengesSection));
    const lessons = listFromFrontmatter(frontmatter.lessons, parseBulletList(lessonsSection));
    const summary = textValue(frontmatter.summary) || firstParagraph(overview) || repo.description || firstParagraph(readmeMarkdown) || `Details and links for ${repo.name}`;

    return {
        title: textValue(frontmatter.title),
        summary,
        role: textValue(frontmatter.role),
        duration: textValue(frontmatter.duration),
        team: textValue(frontmatter.team),
        category: textValue(frontmatter.category),
        liveUrl: safeHttpUrl(frontmatter.liveUrl),
        githubUrl: safeHttpUrl(frontmatter.githubUrl),
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
            : storyCover
                ? resolveRepoAssetUrl(repo, storyCover, STORY_PATH)
                : screenshots[0]?.src,
    };
}

function normalizeArchiveRepository(repo: Repo): ArchiveRepository | null {
    if (repo.private !== false || !repo.name || !repo.fullName || !/^https:\/\/github\.com\//i.test(repo.htmlUrl)) return null;
    return {
        name: repo.name,
        fullName: repo.fullName,
        description: repo.description,
        htmlUrl: repo.htmlUrl,
        isPublic: true,
        archived: repo.archived,
        homepage: safeHttpUrl(repo.homepage) ?? null,
        stars: repo.stars,
        forks: repo.forks,
        license: repo.license,
        createdAt: repo.createdAt,
        updatedAt: repo.updatedAt,
        defaultBranch: repo.defaultBranch,
        topics: repo.topics ?? [],
    };
}

export async function loadRepositoryArchiveProject(slug: string): Promise<RepositoryArchiveProject | null> {
    const repo = await fetchRepoByName(slug).catch(() => null);
    if (!repo) return null;

    const repository = normalizeArchiveRepository(repo);
    if (!repository) return null;

    const [story, languages] = await Promise.all([
        loadStory(repo),
        fetchRepoLanguages(repo.name).catch(() => []),
    ]);
    const architecture = story?.architecture?.items ?? [];
    const stack = architecture.length > 0
        ? architecture.map((item) => item.value).filter(Boolean).slice(0, 6)
        : (repo.topics ?? []).slice(0, 6);
    const cover = story?.cover || `https://opengraph.githubassets.com/1/${encodeURIComponent(pickRepoOwner(repo))}/${encodeURIComponent(repo.name)}`;

    return {
        repository,
        story,
        languages,
        stack,
        cover,
        overviewBlocks: splitParagraphs(story?.overview || repo.description),
        problemBlocks: splitParagraphs(story?.problem),
        solutionBlocks: splitParagraphs(story?.solution),
        totalLanguagePct: Math.round(languages.reduce((total, language) => total + language.pct, 0)),
    };
}

export async function getPublicArchiveParams(): Promise<{ slug: string }[]> {
    const repositories = await fetchAllRepos().catch(() => []);
    return repositories
        .filter((repository) => repository.private === false)
        .map((repository) => ({ slug: repository.name }));
}
