import type { PortfolioProject, RepositoryFacts } from "./portfolio-projects";

export type ArchiveStoryImage = {
    src: string;
    alt: string;
    caption?: string;
};

export type ArchiveArchitecture = {
    title?: string;
    items: readonly { label: string; value: string }[];
};

export type ArchiveStory = {
    title?: string;
    summary?: string;
    role?: string;
    duration?: string;
    team?: string;
    category?: string;
    liveUrl?: string;
    githubUrl?: string;
    overview?: string;
    problem?: string;
    solution?: string;
    challenges: readonly string[];
    lessons: readonly string[];
    features: readonly string[];
    screenshots: readonly ArchiveStoryImage[];
    architecture?: ArchiveArchitecture;
    cover?: string;
};

export type ArchiveLanguage = {
    name: string;
    bytes: number;
    pct: number;
};

export type ArchiveRepository = {
    name: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    isPublic: true;
    archived: boolean;
    homepage?: string | null;
    stars: number;
    forks: number;
    license?: string | null;
    createdAt: string;
    updatedAt: string;
    defaultBranch: string;
    topics: readonly string[];
};

export type RepositoryArchiveProject = {
    repository: ArchiveRepository;
    story: ArchiveStory | null;
    languages: readonly ArchiveLanguage[];
    stack: readonly string[];
    cover: string;
    overviewBlocks: readonly string[];
    problemBlocks: readonly string[];
    solutionBlocks: readonly string[];
    totalLanguagePct: number;
};

export type ResolvedProject =
    | {
        kind: "curated";
        project: PortfolioProject;
        facts: readonly RepositoryFacts[];
    }
    | {
        kind: "archive";
        project: RepositoryArchiveProject;
    };

export type ProjectResolverDependencies = {
    getCuratedProject: (slug: string) => PortfolioProject | undefined;
    getCuratedFacts: (project: PortfolioProject) => Promise<readonly RepositoryFacts[]>;
    getArchiveProject: (slug: string) => Promise<RepositoryArchiveProject | null>;
};

export async function resolveProject(
    slug: string,
    dependencies: ProjectResolverDependencies,
): Promise<ResolvedProject | null> {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return null;

    const curated = dependencies.getCuratedProject(normalizedSlug);
    if (curated) {
        const facts = await dependencies.getCuratedFacts(curated).catch(() => []);
        return { kind: "curated", project: curated, facts };
    }

    const archive = await dependencies.getArchiveProject(normalizedSlug).catch(() => null);
    if (!archive || archive.repository.isPublic !== true) return null;

    return { kind: "archive", project: archive };
}
