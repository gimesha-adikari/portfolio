import type { ReactNode } from "react";
import type { TOCItem } from "@/lib/toc";
import TOC from "@/components/TOC";
import ReadingProgress from "@/components/ReadingProgress";

export default function ArticleShell({
                                         title,
                                         subtitle,
                                         toc,
                                         children,
                                     }: {
    title: string;
    subtitle?: string;
    toc?: TOCItem[];
    children: ReactNode;
}) {
    return (
        <>
            <ReadingProgress />
            <header className="hero-glow mb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            {title}
          </span>
                </h1>
                {subtitle && <p className="mt-2 text-[var(--muted)] max-w-2xl">{subtitle}</p>}
            </header>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
                <article className="prose max-w-3xl">{children}</article>
                <aside className="hidden lg:block sticky top-24 h-fit">
                    <div className="card p-4">{toc && <TOC items={toc} />}</div>
                </aside>
            </div>
        </>
    );
}
