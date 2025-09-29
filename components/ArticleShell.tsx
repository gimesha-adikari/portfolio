import { ReactNode } from "react";
import TOC from "@/components/TOC";
import type { TOCItem } from "@/lib/toc";

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
            <header className="hero-glow mb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            {title}
          </span>
                </h1>
                {subtitle && <p className="mt-2 text-[var(--muted)] max-w-2xl">{subtitle}</p>}
            </header>

            <div className="relative">
                {/* Wider article; keeps clear space for floating TOC on lg+ */}
                <article
                    className={[
                        "prose max-w-none w-full card p-6",
                        "mx-auto",
                        "max-w-[min(72rem,calc(100vw-2rem))]",                     // mobile/tablet cap
                        "lg:max-w-[min(80rem,calc(100vw-2rem-316px))]",             // leave room for TOC (300 + 16 gap)
                        "lg:mr-[316px]",                                            // reserve right margin for TOC
                    ].join(" ")}
                >
                    {children}
                </article>

                {toc && (
                    <aside
                        className="hidden lg:block fixed right-4 top-[calc(var(--header-h,56px)+16px)] w-[300px] max-h-[calc(100svh-var(--header-h,56px)-32px)] overflow-auto z-30"
                        aria-label="On this page"
                    >
                        <div className="card p-4">
                            <TOC items={toc} />
                        </div>
                    </aside>
                )}
            </div>
        </>
    );
}
