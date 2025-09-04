import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseIndex, getCaseMDX, type CaseIndexItem } from "@/lib/content";
import { buildTOC } from "@/lib/toc";
import ArticleShell from "@/components/ArticleShell";
import { RenderMDX } from "@/components/MDX";

export const dynamicParams = true;

export async function generateStaticParams() {
    const list = await getCaseIndex();
    return list.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const list: CaseIndexItem[] = await getCaseIndex();
    const hit = list.find((x) => x.slug === slug);
    return { title: hit?.title ?? slug, description: hit?.description };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const list = await getCaseIndex();
    const hit = list.find((x) => x.slug === slug);

    const mdx = await getCaseMDX(slug);
    if (!mdx) notFound();

    const toc = buildTOC(mdx);

    return (
        <ArticleShell title={hit?.title ?? slug} subtitle={hit?.description} toc={toc}>
            <RenderMDX source={mdx} />
        </ArticleShell>
    );
}
