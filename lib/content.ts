const RAW = "https://raw.githubusercontent.com";
const API = "https://api.github.com";

const OWNER = process.env.CONTENT_OWNER!;
const REPO = process.env.CONTENT_REPO!;
const BRANCH = process.env.CONTENT_BRANCH || "main";
const TOKEN = process.env.CONTENT_TOKEN || process.env.GITHUB_TOKEN || "";

const REVALIDATE = Number(process.env.CONTENT_REVALIDATE ?? 300);
const IS_DEV = process.env.NODE_ENV !== "production";
const DEBUG = process.env.CONTENT_DEBUG === "true";

function publicHeaders(): HeadersInit {
    return { "User-Agent": "gn-portfolio" };
}

function apiHeaders(): HeadersInit {
    const h: Record<string, string> = {
        "User-Agent": "gn-portfolio",
        Accept: "application/vnd.github+json",
    };
    if (TOKEN) h.Authorization = `Bearer ${TOKEN}`;
    return h;
}

async function fetchWithTimeout(
    url: string,
    init: RequestInit & { revalidate?: number } = {},
    ms = 5000
) {
    const { revalidate = REVALIDATE, ...rest } = init;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), ms);

    const opts: any = {
        ...rest,
        signal: ac.signal,
    };
    if (IS_DEV) {
        opts.cache = "no-store";
    } else {
        opts.next = { revalidate };
    }

    try {
        const res = await fetch(url, opts);
        return res;
    } finally {
        clearTimeout(t);
    }
}

async function fetchText(path: string, revalidate = REVALIDATE): Promise<string | null> {
    const clean = path.replace(/^\/+/, "");

    if (TOKEN) {
        const apiUrl = `${API}/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(clean)}?ref=${encodeURIComponent(
            BRANCH
        )}`;
        try {
            const res = await fetchWithTimeout(apiUrl, { headers: apiHeaders(), revalidate }, 7000);
            if (res?.ok) {
                const json: any = await res.json();
                const b64 = (json?.content as string | undefined)?.replace(/\n/g, "");
                if (b64) {
                    const text =
                        typeof Buffer !== "undefined"
                            ? Buffer.from(b64, "base64").toString("utf-8")
                            : decodeURIComponent(
                                escape(
                                    Array.from(atob(b64))
                                        .map((c) => String.fromCharCode(c.charCodeAt(0)))
                                        .join("")
                                )
                            );
                    if (DEBUG) console.log("[content] API OK:", clean);
                    return text;
                }
                if (DEBUG) console.warn("[content] API JSON missing content:", clean);
            } else if (DEBUG) {
                console.warn("[content] API not OK:", clean, res?.status, res?.statusText);
            }
        } catch (e) {
            if (DEBUG) console.warn("[content] API error:", clean, e);
        }
    }

    try {
        const rawUrl = `${RAW}/${OWNER}/${REPO}/${BRANCH}/${clean}`;
        const res = await fetchWithTimeout(rawUrl, { headers: publicHeaders(), revalidate }, 5000);
        if (res?.ok) {
            if (DEBUG) console.log("[content] RAW OK:", clean);
            return await res.text();
        }
        if (DEBUG) console.warn("[content] RAW not OK:", clean, res?.status, res?.statusText);
    } catch (e) {
        if (DEBUG) console.warn("[content] RAW error:", clean, e);
    }

    return null;
}

export type CaseIndexItem = { slug: string; title: string; description?: string };

export async function getAboutMDX() {
    return fetchText("about.mdx");
}
export async function getContactMDX() {
    return fetchText("contact.mdx");
}
export async function getCaseIndex(): Promise<CaseIndexItem[]> {
    const json = await fetchText("case-studies/index.json");
    if (!json) return [];
    try {
        const parsed = JSON.parse(json);
        return Array.isArray(parsed) ? (parsed as CaseIndexItem[]) : [];
    } catch {
        return [];
    }
}
export async function getCaseMDX(slug: string) {
    return fetchText(`case-studies/${encodeURIComponent(slug)}.mdx`);
}
