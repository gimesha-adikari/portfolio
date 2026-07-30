import Link from "next/link";
import Image from "next/image";
import { fetchAllRepos, fetchProfile, fetchRecentActivity, type Repo } from "@/lib/github";
import { RepoCard } from "@/components/RepoCard";
import { orderReposWithPinned } from "@/lib/pins";
import Reveal from "@/components/Reveal";
import MotionSection from "@/components/MotionSection";
import AnimatedCounter from "@/components/AnimatedCounter";
import StatCard from "@/components/StatCard";
import GithubCalendar from "@/components/GithubCalendar";

export default async function HomePage() {
    const [reposData, profile, activity] = await Promise.all([
        fetchAllRepos().catch(() => []),
        fetchProfile().catch(() => null),
        fetchRecentActivity().catch(() => [])
    ]);

    const repos = reposData as Repo[];
    const ordered = Array.isArray(repos) ? orderReposWithPinned(repos) : [];
    const featured = ordered.slice(0, 4);

    const featuredNames = featured.map(f => f.name);
    const liveDeployments = repos.filter(
        (repo) => repo.homepage && repo.homepage.startsWith("http") && !featuredNames.includes(repo.name)
    );

    const CODING_START_YEAR = 2021;
    const yearsCoding = new Date().getFullYear() - CODING_START_YEAR;

    const isAvailable = profile?.bio?.toLowerCase().includes("available");
    const statusColor = isAvailable ? "bg-[var(--success)]" : "bg-[var(--muted)]";

    const latestPush = activity.find(a => a.type === "PushEvent");
    const currentFocus = latestPush ? `Hacking on ${latestPush.repo.name.split('/').pop()}` : (isAvailable ? "Available for projects" : "Building projects");

    const languageCounts = repos.reduce((acc, repo) => {
        if (repo.language) {
            acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const topLanguages = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 9)
        .map(([lang]) => lang);

    if (!profile) {
        return (
            <div className="container-xl py-20 text-center font-mono text-[var(--muted)]">
                Waking up the server... please refresh.
            </div>
        );
    }

    return (
        <div className="relative space-y-16 md:space-y-24 pb-20 hero-glow">
            {/* Ambient Background Glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-18vh] h-[50vh] bg-[radial-gradient(55%_55%_at_50%_10%,color-mix(in_oklab,var(--accent),transparent_85%)_0%,transparent_64%)] opacity-70"
            />

            <MotionSection as="section" className="section pt-12 md:pt-20" delay={0.03}>
                <div className="container-xl max-w-5xl mx-auto space-y-12">

                    {/* ────────────────────────────────────
                        HERO: PERSONAL & EXPRESSIVE
                    ──────────────────────────────────── */}
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="relative inline-block">
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--success)] opacity-30 blur-md" />
                            <Image
                                src={profile.avatar_url}
                                alt={profile.name || profile.login}
                                width={100}
                                height={100}
                                className="relative rounded-full border-2 border-[var(--surface)] bg-[var(--bg)] object-cover"
                                priority
                            />
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] px-3 py-1 text-xs text-[var(--muted)] backdrop-blur-sm">
                            <span className={`size-2 rounded-full ${statusColor}`} aria-hidden />
                            <span className="truncate max-w-[250px] sm:max-w-none">{profile.name} • {currentFocus}</span>
                        </div>

                        <div className="space-y-4 max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-[var(--fg)]">
                                I build software systems that feel
                                <span className="text-[var(--accent)]"> calm, fast, and dependable.</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-[var(--muted)]">
                                {profile.bio || "Backend & Full-stack engineer focused on resilient architecture and thoughtful interfaces."}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <Link href="/projects" className="rounded-lg bg-[var(--accent)] text-[var(--bg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                                <span className="icon-[tabler--layout-grid] size-4" aria-hidden />
                                View Projects
                            </Link>
                            <Link href="/contact" className="rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--accent)] transition-colors flex items-center gap-2">
                                <span className="icon-[tabler--mail] size-4" aria-hidden />
                                Get in Touch
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--muted)] pt-4">
                            {profile.location && (
                                <span className="inline-flex items-center gap-1.5 bg-[var(--surface)] px-3 py-1.5 rounded-md border border-[var(--border)]">
                                    <span className="icon-[tabler--map-pin] size-4" aria-hidden />
                                    {profile.location}
                                </span>
                            )}
                            {profile.company && (
                                <span className="inline-flex items-center gap-1.5 bg-[var(--surface)] px-3 py-1.5 rounded-md border border-[var(--border)]">
                                    <span className="icon-[tabler--building] size-4" aria-hidden />
                                    {profile.company}
                                </span>
                            )}
                            {profile.blog && (
                                <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 bg-[var(--surface)] px-3 py-1.5 rounded-md border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                                    <span className="icon-[tabler--link] size-4" aria-hidden />
                                    Website
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ────────────────────────────────────
                        BENTO GRID: LIVE GITHUB DATA
                    ──────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* LIVE ACTIVITY TERMINAL */}
                        <div className="md:col-span-2 card p-6 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color-mix(in_oklab,var(--surface)_95%,var(--bg))] to-transparent pointer-events-none z-10" />

                            <div className="flex items-center justify-between mb-4 border-b border-[var(--border)] pb-3">
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)]">
                                    <span className="icon-[tabler--activity] size-4 text-[var(--accent)]" aria-hidden />
                                    Live Activity
                                </div>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
                                </span>
                            </div>

                            <div className="space-y-3 font-mono text-xs md:text-sm pb-4">
                                {activity.length > 0 ? activity.slice(0, 5).map((event: any) => (
                                    <div key={event.id} className="flex gap-3 text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                                        <span className="w-16 shrink-0 opacity-60">
                                            {new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="truncate">
                                            {event.type === "PushEvent" && <>Pushed code to <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                            {event.type === "PullRequestEvent" && <>{event.payload.action} PR in <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                            {event.type === "CreateEvent" && <>Created {event.payload.ref_type} <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                            {event.type === "WatchEvent" && <>Starred <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                            {event.type === "ForkEvent" && <>Forked <span className="text-[var(--accent)]">{event.repo.name}</span></>}
                                        </span>
                                    </div>
                                )) : (
                                    <div>No recent activity detected.</div>
                                )}
                            </div>
                        </div>

                        {/* TECH STACK CHIPS */}
                        <div className="card p-6 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm flex flex-col">
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)] mb-4 border-b border-[var(--border)] pb-3">
                                <span className="icon-[tabler--code] size-4" aria-hidden />
                                Most Used
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto mb-auto">
                                {topLanguages.map((lang, i) => (
                                    <MotionSection
                                        as="span"
                                        key={lang}
                                        delay={0.05 + (i * 0.02)}
                                        className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-xs font-medium text-[var(--fg)] shadow-sm hover:border-[var(--accent)] transition-colors cursor-default"
                                    >
                                        {lang}
                                    </MotionSection>
                                ))}
                            </div>
                        </div>

                        {/* STATS ROW (Balanced 2-Column layout) */}
                        <div className="md:col-span-3 grid grid-cols-2 gap-4">
                            <StatCard title="Public Repositories">
                                <AnimatedCounter value={profile.public_repos} className="text-3xl font-bold tracking-tight text-[var(--fg)]" />
                            </StatCard>
                            <StatCard title="Years Coding">
                                <AnimatedCounter value={yearsCoding} className="text-3xl font-bold tracking-tight text-[var(--fg)]" />
                            </StatCard>
                        </div>

                        {/* CALENDAR */}
                        <div className="md:col-span-3 card p-6 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm">
                            <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--fg)] mb-4">
                                <span className="icon-[tabler--calendar-stats] size-4" aria-hidden />
                                Shipping Consistency
                            </div>
                            <div className="min-w-max flex justify-center overflow-x-auto pb-2">
                                <GithubCalendar username={profile.login} />
                            </div>
                        </div>

                    </div>
                </div>
            </MotionSection>

            {/* ────────────────────────────────────
                PINNED PROJECTS
            ──────────────────────────────────── */}
            <MotionSection as="section" className="section" delay={0.12}>
                <div className="container-xl max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] px-3 py-1 text-xs text-[var(--muted)]">
                                <span className="icon-[tabler--folder-star] size-4" aria-hidden />
                                Pinned Work
                            </div>
                            <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--fg)]">
                                Featured Repositories
                            </h2>
                        </div>

                        <Link href="/projects" className="text-sm inline-flex items-center gap-1 hover:text-[var(--accent)] transition-colors group shrink-0">
                            View all {repos.length}
                            <span className="icon-[tabler--arrow-right] size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                        </Link>
                    </div>

                    {featured.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 items-stretch">
                            {featured.map((repo) => {
                                const key = repo.fullName || repo.name;
                                return (
                                    <Reveal key={key}>
                                        <RepoCard repo={repo} />
                                    </Reveal>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="card p-6 border border-[var(--border)] text-center">
                            <p className="text-[var(--muted)]">No pinned repositories found.</p>
                        </div>
                    )}
                </div>
            </MotionSection>

            {/* ────────────────────────────────────
                LIVE DEPLOYMENTS
            ──────────────────────────────────── */}
            {liveDeployments.length > 0 && (
                <MotionSection as="section" className="section pb-10" delay={0.16}>
                    <div className="container-xl max-w-5xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] px-3 py-1 text-xs text-[var(--muted)]">
                                    <span className="icon-[tabler--rocket] size-4 text-[var(--accent)]" aria-hidden />
                                    Live Demos
                                </div>
                                <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--fg)]">
                                    Active Deployments
                                </h2>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 items-stretch">
                            {liveDeployments.map((repo, i) => {
                                const key = repo.fullName || repo.name;
                                const displayUrl = repo.homepage!.replace(/^https?:\/\//, '').replace(/\/$/, '');

                                return (
                                    <Reveal key={key} delay={i * 0.05}>
                                        <a
                                            href={repo.homepage!}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="card p-5 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-300 group flex flex-col h-full justify-between"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="font-semibold text-[var(--fg)] truncate group-hover:text-[var(--accent)] transition-colors">
                                                        {repo.name}
                                                    </h3>
                                                    <span className="icon-[tabler--external-link] size-5 text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" aria-hidden />
                                                </div>
                                                {repo.description && (
                                                    <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                                                        {repo.description}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[var(--muted)] truncate">
                                                <span className="size-2 rounded-full bg-[var(--success)] animate-pulse shrink-0" aria-hidden />
                                                <span className="truncate group-hover:text-[var(--fg)] transition-colors">{displayUrl}</span>
                                            </div>
                                        </a>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                </MotionSection>
            )}

        </div>
    );
}