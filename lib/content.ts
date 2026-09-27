const RAW = "https://raw.githubusercontent.com";
const API = "https://api.github.com";

type ContentConfig = Readonly<{
    owner: string | null;
    repo: string | null;
    branch: string;
    token: string;
    revalidate: number;
    isDev: boolean;
    debug: boolean;
}>;

type UnknownRecord = Record<string, unknown>;

function nonEmptyString(value: string | undefined): string | null {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}

function positiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const config: ContentConfig = {
    owner: nonEmptyString(process.env.CONTENT_OWNER),
    repo: nonEmptyString(process.env.CONTENT_REPO),
    branch: nonEmptyString(process.env.CONTENT_BRANCH) ?? "main",
    token: process.env.CONTENT_TOKEN || process.env.GITHUB_TOKEN || "",
    revalidate: positiveInteger(process.env.CONTENT_REVALIDATE, 300),
    isDev: process.env.NODE_ENV !== "production",
    debug: process.env.CONTENT_DEBUG === "true",
};

function publicHeaders(): HeadersInit {
    return { "User-Agent": "gn-portfolio" };
}

function apiHeaders(): HeadersInit {
    const headers: Record<string, string> = {
        "User-Agent": "gn-portfolio",
        Accept: "application/vnd.github+json",
    };
    if (config.token) headers.Authorization = `Bearer ${config.token}`;
    return headers;
}

async function fetchWithTimeout(
    url: string,
    init: RequestInit & { revalidate?: number } = {},
    ms = 5000,
): Promise<Response> {
    const { revalidate = config.revalidate, ...rest } = init;
    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), ms);

    const options: RequestInit = {
        ...rest,
        signal: abortController.signal,
    };
    if (config.isDev) {
        options.cache = "no-store";
    } else {
        options.next = { revalidate };
    }

    try {
        return await fetch(url, options);
    } finally {
        clearTimeout(timeout);
    }
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readBase64Content(value: unknown): string | null {
    if (!isRecord(value) || typeof value.content !== "string") return null;
    const content = value.content.replace(/\n/g, "");
    return content || null;
}

function decodeBase64(content: string): string {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(content, "base64").toString("utf-8");
    }

    const binary = atob(content);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

async function fetchText(path: string, revalidate = config.revalidate): Promise<string | null> {
    const clean = path.replace(/^\/+/, "");

    if (!config.owner || !config.repo) {
        if (config.debug) console.warn("[content] remote content repository is not configured");
        return null;
    }

    if (config.token) {
        const apiUrl = `${API}/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(clean)}?ref=${encodeURIComponent(
            config.branch,
        )}`;
        try {
            const response = await fetchWithTimeout(apiUrl, { headers: apiHeaders(), revalidate }, 7000);
            if (response.ok) {
                const encoded = readBase64Content(await response.json() as unknown);
                if (encoded) {
                    if (config.debug) console.log("[content] API OK:", clean);
                    return decodeBase64(encoded);
                }
                if (config.debug) console.warn("[content] API JSON missing content:", clean);
            } else if (config.debug) {
                console.warn("[content] API not OK:", clean, response.status, response.statusText);
            }
        } catch (error) {
            if (config.debug) console.warn("[content] API error:", clean, error);
        }
    }

    try {
        const rawUrl = `${RAW}/${config.owner}/${config.repo}/${config.branch}/${clean}`;
        const response = await fetchWithTimeout(rawUrl, { headers: publicHeaders(), revalidate }, 5000);
        if (response.ok) {
            if (config.debug) console.log("[content] RAW OK:", clean);
            return await response.text();
        }
        if (config.debug) console.warn("[content] RAW not OK:", clean, response.status, response.statusText);
    } catch (error) {
        if (config.debug) console.warn("[content] RAW error:", clean, error);
    }

    return null;
}

export type CaseIndexItem = {
    slug: string;
    title: string;
    description?: string;
};

function isCaseIndexItem(value: unknown): value is CaseIndexItem {
    if (!isRecord(value)) return false;
    if (typeof value.slug !== "string" || value.slug.trim().length === 0) return false;
    if (typeof value.title !== "string" || value.title.trim().length === 0) return false;
    return value.description === undefined || typeof value.description === "string";
}

export function parseCaseIndex(json: string): CaseIndexItem[] {
    try {
        const parsed: unknown = JSON.parse(json);
        return Array.isArray(parsed) ? parsed.filter(isCaseIndexItem) : [];
    } catch {
        return [];
    }
}

export async function getAboutMDX(): Promise<string | null> {
    return fetchText("about.mdx");
}

export async function getContactMDX(): Promise<string | null> {
    return fetchText("contact.mdx");
}

export async function getCaseIndex(): Promise<CaseIndexItem[]> {
    const json = await fetchText("case-studies/index.json");
    return json ? parseCaseIndex(json) : [];
}

export async function getCaseMDX(slug: string): Promise<string | null> {
    return fetchText(`case-studies/${encodeURIComponent(slug)}.mdx`);
}
