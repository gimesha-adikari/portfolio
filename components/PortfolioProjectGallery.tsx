import Image from "next/image";
import type { PortfolioProject } from "@/lib/portfolio-projects";

export function PortfolioProjectGallery({ project }: { project: PortfolioProject }) {
    if (!project.screenshots || project.screenshots.length === 0) return null;

    return (
        <section className="space-y-6" aria-labelledby="project-gallery-title">
            <h2 id="project-gallery-title" className="text-xl font-bold text-[var(--fg)]">Gallery</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {project.screenshots.map((screenshot) => (
                    <figure key={screenshot.src} className="group flex flex-col gap-3">
                        <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] shadow-sm">
                            <Image
                                src={screenshot.src}
                                alt={screenshot.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                sizes="(min-width: 768px) 50vw, 100vw"
                            />
                        </div>
                        {screenshot.caption && (
                            <figcaption className="text-sm text-[var(--muted)] text-center px-4">{screenshot.caption}</figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </section>
    );
}
