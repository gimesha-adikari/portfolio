const API = "https://api.github.com";

const TIMEOUT_MS = Number(process.env.GITHUB_TIMEOUT_MS || 2500);
const README_TIMEOUT_MS = Number(process.env.GITHUB_README_TIMEOUT_MS || 1500);
const MAX_PAGES = Math.max(1, Number(process.env.GITHUB_MAX_PAGES || 5));
const ENABLE_README_EXTRAS =
    (process.env.GITHUB_ENABLE_README_EXTRAS ?? "false").toLowerCase() === "true";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback = "") {
    return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function booleanValue(value: unknown, fallback = false) {
    return typeof value === "boolean" ? value : fallback;
}

function ghHeaders() {
    const h: Record<string, string> = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "gn-portfolio",
    };
    if (process.env.GITHUB_TOKEN)
        h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    return h;
}

function publicHeaders() {
    return {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "gn-portfolio",
    };
}

async function fetchWithTimeout(
    url: string,
    init: RequestInit & { revalidate?: number } = {},
    ms = TIMEOUT_MS
) {
    const { revalidate = 900, ...rest } = init;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);
    try {
        return await fetch(url, {...rest, signal: ac.signal, next: {revalidate}});
    } finally {
        clearTimeout(t);
    }
}

async function gh<T>(path: string, init?: RequestInit & { revalidate?: number }) {
    const res = await fetchWithTimeout(`${API}${path}`, { headers: ghHeaders(), ...init });
    if (!res.ok) throw new Error(`GitHub ${res.status}: ${path}`);
    return await res.json() as Promise<T>;
}

async function ghPublic<T>(path: string, revalidate = 900) {
    const res = await fetchWithTimeout(`${API}${path}`, {
        headers: publicHeaders(),
        revalidate,
    });
    if (!res.ok) throw new Error(`GitHub public ${res.status}: ${path}`);
    return await res.json() as Promise<T>;
}

export type Repo = {
    name: string;
    fullName: string;
    description: string | null;
    private: boolean;
    fork: boolean;
    archived: boolean;
    htmlUrl: string;
    homepage?: string | null;
    stars: number;
    forks: number;
    watchers: number;
    language?: string | null;
    topics?: string[];
    license?: string | null;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    defaultBranch: string;
    owner?: { login: string };
};

export interface GitHubProfile {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    company: string | null;
    blog: string;
    location: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

export type GitHubActivityEvent = {
    id: string;
    type: string;
    created_at: string;
    repo: { name: string };
    payload: { action?: string; ref_type?: string };
};

function mapRepo(value: unknown): Repo {
    const r = isRecord(value) ? value : {};
    const owner = isRecord(r.owner) && typeof r.owner.login === "string"
        ? { login: r.owner.login }
        : undefined;
    const license = isRecord(r.license)
        ? stringValue(r.license.spdx_id || r.license.key) || null
        : null;

    return {
        name: stringValue(r.name),
        fullName: stringValue(r.full_name),
        description: typeof r.description === "string" ? r.description : null,
        // Missing privacy metadata is treated as private so malformed responses fail closed.
        private: typeof r.private === "boolean" ? r.private : true,
        fork: booleanValue(r.fork),
        archived: booleanValue(r.archived),
        htmlUrl: stringValue(r.html_url),
        homepage: typeof r.homepage === "string" ? r.homepage : null,
        stars: numberValue(r.stargazers_count),
        forks: numberValue(r.forks_count),
        watchers: numberValue(r.watchers_count),
        language: typeof r.language === "string" ? r.language : null,
        topics: Array.isArray(r.topics) ? r.topics.filter((topic): topic is string => typeof topic === "string") : [],
        license,
        createdAt: stringValue(r.created_at),
        updatedAt: stringValue(r.updated_at),
        pushedAt: stringValue(r.pushed_at),
        defaultBranch: stringValue(r.default_branch, "main"),
        owner,
    };
}

export async function fetchAllRepos(): Promise<Repo[]> {
    const username = process.env.GITHUB_USERNAME!;
    const includeForks = (process.env.GITHUB_INCLUDE_FORKS ?? "false").toLowerCase() === "true";
    const includeArchived = (process.env.GITHUB_INCLUDE_ARCHIVED ?? "false").toLowerCase() === "true";

    const publicRepos: Repo[] = [];
    try {
        let page = 1;
        while (page <= MAX_PAGES) {
            const publicList = await ghPublic<unknown>(
                `/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=pushed&direction=desc`
            );
            if (!Array.isArray(publicList)) break;
            publicRepos.push(...publicList.flatMap((repo) => {
                try {
                    return [mapPublicRepo(repo)];
                } catch {
                    return [];
                }
            }));
            if (publicList.length < 100) break;
            page++;
        }
    } catch {
        // Keep any complete pages already collected if a later page fails.
    }

    let all = publicRepos.filter(
        (r) => (r.owner?.login ?? username).toLowerCase() === username.toLowerCase()
    );
    if (!includeForks) all = all.filter((r) => !r.fork);
    if (!includeArchived) all = all.filter((r) => !r.archived);

    all.sort(
        (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
    );
    return all;
}

function mapPublicRepo(value: unknown): Repo {
    const repo = mapRepo(value);
    if (repo.private !== false || !repo.name || !repo.fullName || !repo.owner?.login) {
        throw new Error(`Invalid or private repository rejected: ${repo.fullName || repo.name || "unknown"}`);
    }
    return repo;
}

export async function fetchRepoByName(name: string): Promise<Repo> {
    const owner = process.env.GITHUB_USERNAME!;
    try {
        const repo = await gh<unknown>(`/repos/${owner}/${encodeURIComponent(name)}`);
        return mapPublicRepo(repo);
    } catch {
        const repo = await ghPublic<unknown>(`/repos/${owner}/${encodeURIComponent(name)}`);
        return mapPublicRepo(repo);
    }
}

export type RepositoryLanguage = { name: string; bytes: number; pct: number };

export async function fetchRepoLanguages(name: string): Promise<RepositoryLanguage[]> {
    const owner = process.env.GITHUB_USERNAME!;
    try {
        const payload = await gh<unknown>(
            `/repos/${owner}/${encodeURIComponent(name)}/languages`,
            { revalidate: 900 }
        );
        if (!isRecord(payload)) return [];
        const langs = Object.fromEntries(
            Object.entries(payload).filter((entry): entry is [string, number] =>
                typeof entry[1] === "number" && Number.isFinite(entry[1])
            ),
        );
        const total = Object.values(langs).reduce((a, b) => a + b, 0) || 1;
        return Object.entries(langs)
            .map(([k, v]) => ({ name: k, bytes: v, pct: (v / total) * 100 }))
            .sort((a, b) => b.bytes - a.bytes);
    } catch {
        return [];
    }
}

export async function fetchRepoReadmeRaw(name: string): Promise<string | null> {
    if (!ENABLE_README_EXTRAS) return null;
    const owner = process.env.GITHUB_USERNAME!;
    const res = await fetchWithTimeout(
        `${API}/repos/${owner}/${encodeURIComponent(name)}/readme`,
        {
            headers: { ...ghHeaders(), Accept: "application/vnd.github.raw" },
            revalidate: 900,
        },
        README_TIMEOUT_MS
    ).catch(() => null);

    if (!res || !res.ok) return null;
    return res.text();
}

function absolutizeReadmeUrl(url: string, owner: string, repo: string, branch: string) {
    if (/^https?:\/\//i.test(url)) return url;
    const clean = url.replace(/^\.?\//, "");
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${clean}`;
}

export function extractReadmeMeta(md: string | null, owner: string, repo: string, branch: string) {
    let cover: string | null = null;
    const bullets: string[] = [];

    if (md) {
        const imgRe = /!\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
        let m: RegExpExecArray | null;
        while ((m = imgRe.exec(md))) {
            const candidate = (m[1] || "").trim();
            if (!candidate) continue;
            if (/shields\.io|badgen\.net|badge|visitor|coverage|workflow/i.test(candidate)) continue;
            cover = absolutizeReadmeUrl(candidate, owner, repo, branch);
            break;
        }

        const lines = md.split(/\r?\n/);
        for (let i = 0; i < Math.min(lines.length, 80); i++) {
            const mm = lines[i].match(/^\s*[-*]\s+(.+?)\s*$/);
            if (mm && mm[1] && mm[1].length < 140) bullets.push(mm[1]);
            if (bullets.length >= 2) break;
        }
    }
    return { cover, bullets };
}

export async function getRepoCardExtras(repo: Repo) {
    const [langs, readme] = await Promise.allSettled([
        fetchRepoLanguages(repo.name),
        fetchRepoReadmeRaw(repo.name),
    ]);

    const langList =
        langs.status === "fulfilled" && Array.isArray(langs.value) ? langs.value : [];

    let cover: string | null = null;
    let bullets: string[] = [];
    if (readme.status === "fulfilled") {
        const meta = extractReadmeMeta(
            readme.value,
            process.env.GITHUB_USERNAME!,
            repo.name,
            repo.defaultBranch
        );
        cover = meta.cover;
        bullets = meta.bullets;
    }

    const fromTopics = Array.isArray(repo.topics) && repo.topics.length > 0;
    const stackBase = fromTopics ? repo.topics! : langList.map((l) => l.name);
    const stack = Array.from(
        new Set([repo.language, ...stackBase].filter(Boolean))
    ).slice(0, 4) as string[];

    const topLangs = langList.slice(0, 3).map((l) => ({ name: l.name, pct: l.pct }));

    return { cover, bullets, stack, topLangs };
}

export async function fetchProfile(): Promise<GitHubProfile> {
    const username = process.env.GITHUB_USERNAME!;
    try {
        return await gh<GitHubProfile>(`/users/${encodeURIComponent(username)}`, { revalidate: 3600 });
    } catch {
        return await ghPublic<GitHubProfile>(`/users/${encodeURIComponent(username)}`, 3600);
    }
}

function mapActivity(value: unknown): GitHubActivityEvent | null {
    if (!isRecord(value)) return null;
    const repo = isRecord(value.repo) && typeof value.repo.name === "string"
        ? { name: value.repo.name }
        : null;
    if (!repo || typeof value.id !== "string" || typeof value.type !== "string" || typeof value.created_at !== "string") {
        return null;
    }

    const payload = isRecord(value.payload)
        ? {
            action: typeof value.payload.action === "string" ? value.payload.action : undefined,
            ref_type: typeof value.payload.ref_type === "string" ? value.payload.ref_type : undefined,
        }
        : {};

    return { id: value.id, type: value.type, created_at: value.created_at, repo, payload };
}

export async function fetchRecentActivity(): Promise<GitHubActivityEvent[]> {
    const username = process.env.GITHUB_USERNAME!;
    try {
        const events = await gh<unknown>(`/users/${encodeURIComponent(username)}/events/public?per_page=10`, { revalidate: 3600 });
        return Array.isArray(events) ? events.flatMap((event) => {
            const mapped = mapActivity(event);
            return mapped ? [mapped] : [];
        }) : [];
    } catch {
        const events = await ghPublic<unknown>(`/users/${encodeURIComponent(username)}/events/public?per_page=10`, 3600);
        return Array.isArray(events) ? events.flatMap((event) => {
            const mapped = mapActivity(event);
            return mapped ? [mapped] : [];
        }) : [];
    }
}
