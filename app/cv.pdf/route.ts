import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const owner  = process.env.CONTENT_OWNER || process.env.GITHUB_USERNAME!;
const repo   = process.env.CONTENT_REPO  || "site-content";
const branch = process.env.CONTENT_BRANCH || "main";
const path   = process.env.CV_PATH || "cv.pdf";

const token =
    process.env.CONTENT_TOKEN ||
    process.env.GITHUB_TOKEN ||
    "";

const REVALIDATE = Number(process.env.CONTENT_REVALIDATE ?? "300");

export async function GET(req: Request) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
        path
    )}?ref=${encodeURIComponent(branch)}`;

    const gh = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.raw+json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "User-Agent": "cv-proxy",
        },
        next: { revalidate: REVALIDATE },
    });

    if (gh.status === 404) {
        return new NextResponse("CV not found in content repo", { status: 404 });
    }
    if (!gh.ok) {
        return new NextResponse("Unable to fetch CV", { status: gh.status });
    }

    const etag = gh.headers.get("etag");
    const lastMod = gh.headers.get("last-modified");
    if (etag && req.headers.get("if-none-match") === etag) {
        return new NextResponse(null, { status: 304 });
    }

    const buf = await gh.arrayBuffer();

    const headers = new Headers({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="cv.pdf"',
        "Cache-Control": `public, s-maxage=${REVALIDATE}, stale-while-revalidate=86400`,
    });
    if (etag) headers.set("ETag", etag);
    if (lastMod) headers.set("Last-Modified", lastMod);

    return new NextResponse(buf, { headers });
}
