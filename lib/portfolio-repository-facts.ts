import type { PortfolioProject, ProjectRepository, RepositoryFacts } from "@/lib/portfolio-projects";

export type GitHubRepositoryRecord = {
    name: string;
    private: boolean;
    htmlUrl: string;
    stars: number;
    forks: number;
    language?: string | null;
    updatedAt?: string;
    defaultBranch?: string;
};

export type RepositoryFetcher = (name: string) => Promise<GitHubRepositoryRecord>;

export function mapRepositoryFacts(
    repository: ProjectRepository,
    record: GitHubRepositoryRecord,
): RepositoryFacts | null {
    if (record.private !== false || record.name !== repository.name) return null;

    return {
        name: repository.name,
        role: repository.role,
        url: repository.url,
        sourceUrl: record.htmlUrl,
        isPublic: true,
        updatedAt: record.updatedAt,
        stars: record.stars,
        forks: record.forks,
        language: record.language,
        defaultBranch: record.defaultBranch,
    };
}

export function selectRepositoryFacts(
    project: PortfolioProject,
    facts: readonly RepositoryFacts[],
): RepositoryFacts[] {
    const allowed = new Map(project.repositories.map((repository) => [repository.name, repository]));

    return facts.flatMap((fact) => {
        const repository = allowed.get(fact.name);
        if (!repository || fact.isPublic !== true) return [];

        return [{
            ...fact,
            name: repository.name,
            role: repository.role,
            url: repository.url,
        }];
    });
}

export async function fetchPortfolioRepositoryFacts(
    project: PortfolioProject,
    fetcher: RepositoryFetcher,
): Promise<RepositoryFacts[]> {
    const facts = await Promise.all(
        project.repositories.map(async (repository) => {
            try {
                const record = await fetcher(repository.name);
                return mapRepositoryFacts(repository, record);
            } catch {
                return null;
            }
        }),
    );

    return selectRepositoryFacts(
        project,
        facts.filter((fact): fact is RepositoryFacts => fact !== null),
    );
}
