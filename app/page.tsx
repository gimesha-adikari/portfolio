import Link from "next/link";
import { fetchAllRepos } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { orderReposWithPinned, isPinned } from "@/lib/pins";
import type { Repo } from "@/lib/github";

export default async function HomePage() {
    const repos = await fetchAllRepos().catch(() => [] as any[]);
    const ordered = Array.isArray(repos) ? orderReposWithPinned(repos) : [];
    const featured = ordered.slice(0, 3);

    return (
        <div className="space-y-16 hero-glow">
            <section className="section">
                <div className="container-xl text-center space-y-6">
                    <p className="text-[var(--muted)] uppercase tracking-wide text-xs md:text-sm">Gimesha Nirmal</p>
                    <h1 className="mx-auto max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              Building clean systems with clarity.
            </span>
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/projects" className="btn btn-primary focus-ring">All Projects</Link>
                        <Link href="/cv.pdf" className="btn btn-ghost focus-ring">View CV</Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container-xl">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold">Featured </h2>
                        <Link href="/projects" className="text-sm underline">View all</Link>
                    </div>
                    {featured.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                            {featured.map((repo: Repo) => (
                                <RepoCard key={repo.fullName ?? repo.name} repo={repo} />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-[var(--muted)]">No projects to show right now. Please check back soon.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
