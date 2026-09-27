import {
    getAllPortfolioProjects,
    getPortfolioProjectBySlug,
} from "./portfolio-projects";
import { fetchRepoByName } from "./github";
import { fetchPortfolioRepositoryFacts } from "./portfolio-repository-facts";
import { getPublicArchiveParams, loadRepositoryArchiveProject } from "./portfolio-archive";
import {
    resolveProject,
    type ResolvedProject,
} from "./portfolio-resolver-core";

export type { ResolvedProject } from "./portfolio-resolver-core";

export async function resolvePortfolioProject(slug: string): Promise<ResolvedProject | null> {
    return resolveProject(slug, {
        getCuratedProject: getPortfolioProjectBySlug,
        getCuratedFacts: (project) => fetchPortfolioRepositoryFacts(project, fetchRepoByName),
        getArchiveProject: loadRepositoryArchiveProject,
    });
}

export async function getProjectRouteParams(): Promise<{ slug: string }[]> {
    const curated = getAllPortfolioProjects().map((project) => ({ slug: project.slug }));
    const archive = await getPublicArchiveParams();
    const seen = new Set<string>();

    return [...curated, ...archive].filter(({ slug }) => {
        if (seen.has(slug)) return false;
        seen.add(slug);
        return true;
    });
}
