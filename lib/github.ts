const API = "https://api.github.com";

const TIMEOUT_MS = Number(process.env.GITHUB_TIMEOUT_MS || 2500);
const README_TIMEOUT_MS = Number(process.env.GITHUB_README_TIMEOUT_MS || 1500);
const MAX_PAGES = Math.max(1, Number(process.env.GITHUB_MAX_PAGES || 5));
const ENABLE_README_EXTRAS =
    (process.env.GITHUB_ENABLE_README_EXTRAS ?? "false").toLowerCase() === "true";


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

function mapRepo(r: any): Repo {
    return {
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        private: r.private,
        fork: r.fork,
        archived: r.archived,
        htmlUrl: r.html_url,
        homepage: r.homepage,
        stars: r.stargazers_count,
        forks: r.forks_count,
        watchers: r.watchers_count,
        language: r.language,
        topics: r.topics,
        license: r.license?.spdx_id ?? r.license?.key ?? null,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
        defaultBranch: r.default_branch,
        owner: r.owner ? { login: r.owner.login } : undefined,
    };
}


export async function fetchAllRepos(): Promise<Repo[]> {
    const username = process.env.GITHUB_USERNAME!;
    const includePrivate = (process.env.GITHUB_INCLUDE_PRIVATE ?? "true").toLowerCase() === "true";
    const includeForks = (process.env.GITHUB_INCLUDE_FORKS ?? "false").toLowerCase() === "true";
    const includeArchived = (process.env.GITHUB_INCLUDE_ARCHIVED ?? "false").toLowerCase() === "true";
    const ownerOnly = (process.env.GITHUB_OWNER_ONLY ?? "true").toLowerCase() === "true";

    const authed: Repo[] = [];
    try {
        let page = 1;
        while (page <= MAX_PAGES) {
            const data = await gh<any[]>(
                `/user/repos?per_page=100&page=${page}&sort=pushed&direction=desc`
            );
            if (!data.length) break;
            authed.push(...data.map(mapRepo));
            if (data.length < 100) break;
            page++;
        }
    } catch {
    }

    let publicRepos: Repo[];
    try {
        const publicList = await ghPublic<any[]>(
            `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&direction=desc`
        );
        publicRepos = publicList.map(mapRepo);
    } catch {
        publicRepos = [];
    }

    const byKey = new Map<string, Repo>();
    for (const r of publicRepos) byKey.set(r.fullName.toLowerCase(), r);
    for (const r of authed) byKey.set(r.fullName.toLowerCase(), r);

    let all = Array.from(byKey.values());
    if (ownerOnly)
        all = all.filter(
            (r) => (r.owner?.login ?? username).toLowerCase() === username.toLowerCase()
        );
    if (!includePrivate) all = all.filter((r) => !r.private);
    if (!includeForks) all = all.filter((r) => !r.fork);
    if (!includeArchived) all = all.filter((r) => !r.archived);

    all.sort(
        (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
    );
    return all;
}

export async function fetchRepoByName(name: string): Promise<Repo> {
    const owner = process.env.GITHUB_USERNAME!;
    try {
        const repo = await gh<any>(`/repos/${owner}/${encodeURIComponent(name)}`);
        return mapRepo(repo);
    } catch {
        // Fallback to public endpoint
        const repo = await ghPublic<any>(`/repos/${owner}/${encodeURIComponent(name)}`);
        return mapRepo(repo);
    }
}

export async function fetchRepoLanguages(name: string) {
    const owner = process.env.GITHUB_USERNAME!;
    try {
        const langs = await gh<Record<string, number>>(
            `/repos/${owner}/${encodeURIComponent(name)}/languages`,
            { revalidate: 900 }
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
    ).catch(() => null as any);

    if (!res || !res.ok) return null;
    return res.text();
}

function absolutizeReadmeUrl(url: string, owner: string, repo: string, branch: string) {
    if (/^https?:\/\//i.test(url)) return url;
    const clean = url.replace(/^\.?\//, "");
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${clean}`;
}

export function extractReadmeMeta(md: {
    name: string;
    bytes: number;
    pct: number
}[] | any[] | null extends ((value: infer V, ...args: infer _) => any) ? Awaited<V> : never | string | null, owner: string, repo: string, branch: string) {
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
