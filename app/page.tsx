import Link from "next/link";
import { fetchAllRepos, type Repo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { orderReposWithPinned } from "@/lib/pins";
import Reveal from "@/components/Reveal";

import MotionSection from "@/components/MotionSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import StatCard from "@/components/StatCard";

export default async function HomePage() {
    const repos = (await fetchAllRepos().catch(() => [])) as Repo[];
    const ordered = Array.isArray(repos) ? orderReposWithPinned(repos) : [];
    const featured = ordered.slice(0, 3);

    const totalRepos = repos.length;
    const chips = ["Java", "Kotlin", "TypeScript", "React", "Next.js", "Spring Boot", "FastAPI", "MySQL", "Tailwind"];

    return (
        <div className="space-y-24 hero-glow relative">
            {/* soft spotlight background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-20vh] h-[60vh] bg-[radial-gradient(60%_60%_at_50%_10%,color-mix(in_oklab,var(--accent),transparent_70%)_0%,transparent_60%)] opacity-60"
            />

            <MotionSection as="section" className="section pt-12" delay={0.05}>
                <div className="container-xl text-center space-y-7">
                    <div className="inline-flex items-center gap-2 px-3 py-1 hairline rounded-full text-xs text-[var(--muted)]">
                        <span className="icon-[tabler--sparkles] size-4" aria-hidden />
                        Gimesha Nirmal
                    </div>

                    <h1 className="mx-auto max-w-5xl text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent grad-sheen">
              Building clean systems with clarity.
            </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-[var(--muted)]">
                        Full-stack and Android engineering with a focus on clear architecture, resilient APIs, and fast UIs.
                    </p>

                    <div className="flex items-center justify-center gap-3">
                        <Link href="/projects" className="btn btn-primary focus-ring inline-flex items-center gap-2 transition-transform active:scale-[.985]">
                            <span className="icon-[tabler--layout-grid] size-5" aria-hidden />
                            All Projects
                        </Link>
                        <Link href="/cv.pdf" className="btn btn-ghost focus-ring inline-flex items-center gap-2 transition-transform active:scale-[.985]">
                            <span className="icon-[tabler--file-text] size-5" aria-hidden />
                            View CV
                        </Link>
                    </div>

                    {/* Stats with animated counter + hover tilt */}
                    <div className="mx-auto grid grid-cols-2 gap-3 max-w-lg">
                        <StatCard title="Repositories">
                            <AnimatedCounter value={totalRepos} className="text-xl font-semibold" />
                        </StatCard>
                        <StatCard title="Focus">
                            <div className="mt-0.5 text-xl font-semibold">Backend • Android • Web</div>
                        </StatCard>
                    </div>

                    {/* Animated chips (staggered) */}
                    <div className="mx-auto flex flex-wrap justify-center gap-2 max-w-3xl">
                        {chips.map((c) => (
                            <MotionSection as="span" key={c} delay={0.02} className="hairline rounded-full px-3 py-1 text-xs text-[var(--muted)] hover:translate-y-[-1px] transition">
                                {c}
                            </MotionSection>
                        ))}
                    </div>
                </div>
            </MotionSection>

            <MotionSection as="section" className="section" delay={0.1}>
                <div className="container-xl">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold">Featured</h2>
                        <Link href="/projects" className="text-sm inline-flex items-center gap-1 hover:underline group">
                            View all
                            <span className="icon-[tabler--arrow-right] size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </Link>
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                            {featured.map((repo) => {
                                const key =
                                    (repo as any).id ??
                                    (repo as any).full_name ??
                                    (repo as any).fullName ??
                                    ((repo as any).owner ? `${(repo as any).owner}/${repo.name}` : undefined) ??
                                    repo.name;

                                return (
                                    <Reveal key={key}>
                                        <RepoCard repo={repo} />
                                    </Reveal>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="card p-6">
                            <p className="text-[var(--muted)]">No projects to show right now. Please check back soon.</p>
                        </div>
                    )}
                </div>
            </MotionSection>
        </div>
    );
}
