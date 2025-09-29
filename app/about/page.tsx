// app/about/page.tsx
import type { Metadata } from "next";
import { getAboutMDX } from "@/lib/content";
import { buildTOC } from "@/lib/toc";
import ArticleShell from "@/components/ArticleShell";
import { RenderMDX } from "@/components/MDX";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

function stripMarkdown(md: string) {
    return md
        .replace(/`{1,3}[^`]*`{1,3}/g, "")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/\[[^\]]*\]\([^)]+\)/g, "")
        .replace(/[#>*_~`>-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
function inferDescription(mdx: string, fallback = "") {
    const plain = stripMarkdown(mdx);
    if (!plain) return fallback;
    return plain.length > 220 ? plain.slice(0, 220).trimEnd() + "…" : plain;
}
function estimateReadTime(mdx: string) {
    const words = stripMarkdown(mdx).split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
}

export async function generateMetadata(): Promise<Metadata> {
    const mdx = await getAboutMDX();
    const desc = mdx ? inferDescription(mdx, "About Gimesha Nirmal.") : "About Gimesha Nirmal.";
    const read = mdx ? estimateReadTime(mdx) : undefined;
    const title = "About";
    const ogTitle = read ? `${title} — ${read}` : title;
    const ogImage = `/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(read ?? "About")}`;

    return {
        title,
        description: desc,
        alternates: { canonical: "/about" },
        openGraph: {
            type: "article",
            url: `${siteUrl}/about`,
            title: ogTitle,
            description: desc,
            siteName: "gimesha.dev",
            images: [{ url: ogImage }],
        },
        twitter: {
            card: "summary_large_image",
            title: ogTitle,
            description: desc,
            images: [{ url: ogImage }],
        },
    };
}

export default async function AboutPage() {
    const mdx = await getAboutMDX();

    if (!mdx) {
        return (
            <div className="card p-5">
                <h1 className="text-2xl font-semibold">About</h1>
                <p className="mt-2 text-[var(--muted)]">
                    Create <code>about.mdx</code> in <code>/{process.env.CONTENT_OWNER}/{process.env.CONTENT_REPO}</code>.
                </p>
            </div>
        );
    }

    const toc = buildTOC(mdx);
    const subtitle = estimateReadTime(mdx);

    return (
        <ArticleShell title="About" subtitle={subtitle} toc={toc}>
            <RenderMDX source={mdx} />
        </ArticleShell>
    );
}
