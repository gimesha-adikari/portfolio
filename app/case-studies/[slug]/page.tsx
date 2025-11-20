import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseIndex, getCaseMDX } from "@/lib/content";
import { buildTOC } from "@/lib/toc";
import ArticleShell from "@/components/ArticleShell";
import { RenderMDX } from "@/components/MDX";

export const dynamicParams = true;
export const revalidate = 3600;

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";


export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const list = await getCaseIndex();
    const idx = list.findIndex((x) => x.slug === slug);
    if (idx === -1) notFound();

    const hit = list[idx];
    const mdx = await getCaseMDX(slug);
    if (!mdx) notFound();

    const toc = buildTOC(mdx);
    const words = mdx.split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    const subtitle = `${mins} min read`;

    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx < list.length - 1 ? list[idx + 1] : null;

    return (
        <ArticleShell title={hit?.title ?? slug} subtitle={subtitle} toc={toc}>
            <RenderMDX source={mdx} />

            <hr className="my-10 border-[var(--border)]" />

            <nav className="grid gap-3 sm:grid-cols-2" aria-label="Case pagination">
                {prev ? (
                    <Link
                        href={`/case-studies/${prev.slug}`}
                        rel="prev"
                        prefetch={false}
                        className="card group flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius)] hover:shadow-md transition-shadow"
                    >
            <span className="inline-flex items-center gap-2 min-w-0">
              <span className="icon-[tabler--chevron-left] size-5 text-[var(--muted)]" aria-hidden="true" />
              <span className="truncate">
                <span className="block text-xs text-[var(--muted)]">Previous</span>
                <span className="block font-medium truncate">{prev.title}</span>
              </span>
            </span>
                    </Link>
                ) : (
                    <span className="hidden sm:block" />
                )}

                {next ? (
                    <Link
                        href={`/case-studies/${next.slug}`}
                        rel="next"
                        prefetch={false}
                        className="card group flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius)] hover:shadow-md transition-shadow"
                    >
            <span className="inline-flex items-center gap-2 min-w-0">
              <span className="truncate">
                <span className="block text-xs text-[var(--muted)] text-right">Next</span>
                <span className="block font-medium truncate">{next.title}</span>
              </span>
            </span>
                        <span className="icon-[tabler--chevron-right] size-5 text-[var(--muted)]" aria-hidden="true" />
                    </Link>
                ) : (
                    <span className="hidden sm:block" />
                )}
            </nav>
        </ArticleShell>
    );
}
