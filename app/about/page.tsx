import type { Metadata } from "next";
import { getAboutMDX } from "@/lib/content";
import { buildTOC } from "@/lib/toc";
import ArticleShell from "@/components/ArticleShell";
import { RenderMDX } from "@/components/MDX";

export const metadata: Metadata = { title: "About" };

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

    return (
        <ArticleShell title="About" subtitle="" toc={toc}>
            <RenderMDX source={mdx} />
        </ArticleShell>
    );
}
