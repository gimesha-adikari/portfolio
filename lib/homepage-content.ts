import type { CaseStudy } from "./case-studies";
import type { PortfolioProject } from "./portfolio-projects";

type HomepageCaseStudySelection = {
    slug: string;
    projectSlug: string;
    focus: string;
};

export type HomepageCaseStudy = {
    study: CaseStudy;
    project: PortfolioProject;
    focus: string;
};

export type HomepageEngineeringEvidence = {
    projectSlug: string;
    projectTitle: string;
    boundary: string;
    responsibility: string;
    decision: string;
    href: string;
};

const homepageCaseStudySelection: readonly HomepageCaseStudySelection[] = [
    {
        slug: "modular-document-platform",
        projectSlug: "pdfnest",
        focus: "Platform architecture",
    },
    {
        slug: "pdf-edge-case-handling",
        projectSlug: "pdfnest",
        focus: "Validation and failure handling",
    },
    {
        slug: "modular-kyc-architecture",
        projectSlug: "banking-platform",
        focus: "Cross-stack service boundaries",
    },
];

/**
 * Returns the portfolio-owned flagship records used by the homepage.
 * This is a selector over the canonical project model, not a second project source.
 */
export function getHomepageFlagshipProjects(
    projects: readonly PortfolioProject[],
): PortfolioProject[] {
    return [...projects]
        .filter((project) => project.featured)
        .sort((a, b) => a.order - b.order);
}

/**
 * Turns the first verified architecture and decision records into compact homepage evidence.
 */
export function getHomepageEngineeringEvidence(
    projects: readonly PortfolioProject[],
): HomepageEngineeringEvidence[] {
    return getHomepageFlagshipProjects(projects).flatMap((project) => {
        const architecture = project.architecture[0];
        const decision = project.decisions[0];
        if (!architecture || !decision) return [];

        return [{
            projectSlug: project.slug,
            projectTitle: project.title,
            boundary: architecture.boundary,
            responsibility: architecture.responsibility,
            decision: decision.decision,
            href: `/projects/${project.slug}`,
        }];
    });
}

/**
 * Selects a small, curated set of validated case studies and associates each with a project.
 */
export function getHomepageCaseStudies(
    studies: readonly CaseStudy[],
    projects: readonly PortfolioProject[],
): HomepageCaseStudy[] {
    const studiesBySlug = new Map(studies.map((study) => [study.slug, study]));
    const projectsBySlug = new Map(getHomepageFlagshipProjects(projects).map((project) => [project.slug, project]));

    return homepageCaseStudySelection.flatMap(({ slug, projectSlug, focus }) => {
        const study = studiesBySlug.get(slug);
        const project = projectsBySlug.get(projectSlug);
        if (!study || !project) return [];
        return [{ study, project, focus }];
    });
}
