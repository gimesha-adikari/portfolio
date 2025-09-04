import { fetchAllRepos } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { orderReposWithPinned, isPinned } from "@/lib/pins";
import type { Repo } from "@/lib/github";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
    const repos = await fetchAllRepos().catch(() => [] as any[]);
    const list = Array.isArray(repos) ? orderReposWithPinned(repos) : [];

    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 md:mb-8">
                All Projects
            </h1>

            {list.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {list.map((repo: Repo) => (
                        <RepoCard key={repo.fullName ?? repo.name} repo={repo} />
                    ))}
                </div>
            ) : (
                <p className="mt-4 text-[var(--muted)]">No projects to show right now. Please check back soon.</p>
            )}
        </div>
    );
}
