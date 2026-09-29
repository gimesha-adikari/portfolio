import Link from "next/link";
import type { PortfolioProject } from "@/lib/portfolio-projects";
import { ProjectFingerprint } from "@/components/ProjectFingerprint";

function labelForStatus(status: PortfolioProject["status"]) {
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function ProjectsFlagshipRow({ project }: { project: PortfolioProject }) {
    const titleId = `${project.slug}-flagship-project-title`;
    const primaryBoundary = project.architecture[0]?.boundary ?? "System architecture";
    const caseStudyCount = project.caseStudies?.length ?? 0;

    return (
        <Link
            href={`/projects/${project.slug}`}
            className="group projects-flagship-row"
            prefetch={false}
        >
            <article className="projects-flagship-row__surface" aria-labelledby={titleId}>
                <div className="projects-flagship-row__identity">
                    <div className="projects-flagship-row__eyebrow">
                        <span>{labelForStatus(project.status)}</span>
                        {project.category && (
                            <>
                                <span aria-hidden="true">·</span>
                                <span>{project.category}</span>
                            </>
                        )}
                    </div>
                    <h3 id={titleId} className="projects-flagship-row__title">
                        {project.title}
                    </h3>
                    <p className="projects-flagship-row__tagline">{project.tagline}</p>
                </div>

                <div className="projects-flagship-row__reasoning">
                    <div>
                        <div className="projects-flagship-row__label">Engineering problem</div>
                        <p>{project.problem}</p>
                    </div>
                    <div>
                        <div className="projects-flagship-row__label">Primary boundary</div>
                        <p>{primaryBoundary}</p>
                    </div>
                </div>

                <div className="projects-flagship-row__fingerprint" aria-hidden="true">
                    <ProjectFingerprint projectSlug={project.slug} />
                </div>

                <div className="projects-flagship-row__footer">
                    {caseStudyCount > 0 && (
                        <span className="projects-flagship-row__evidence">
                            {caseStudyCount} associated case studies
                        </span>
                    )}
                    <span className="projects-flagship-row__cta">
                        View project
                        <span className="icon-[tabler--arrow-up-right] size-4" aria-hidden="true" />
                    </span>
                </div>
            </article>
        </Link>
    );
}
