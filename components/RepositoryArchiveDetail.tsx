import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { RepositoryArchiveProject } from "@/lib/portfolio-resolver-core";

const PALETTE = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#a855f7"];
const dateFormatter = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" });
const numberFormatter = new Intl.NumberFormat(undefined, { notation: "compact" });

function formatDate(value?: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

export function RepositoryArchiveDetail({ archive }: { archive: RepositoryArchiveProject }) {
    const { repository: repo, story } = archive;
    const title = story?.title ?? repo.name;
    const description = story?.summary ?? repo.description ?? `Details and links for ${repo.name}`;
    const safeLicense = repo.license || "No license";
    const architecture = story?.architecture?.items ?? [];
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: title,
        description,
        codeRepository: story?.githubUrl ?? repo.htmlUrl,
        programmingLanguage: archive.languages.map((language) => language.name),
        dateCreated: repo.createdAt,
        dateModified: repo.updatedAt,
        license: safeLicense,
    };

    return (
        <article className="space-y-12 pb-20 container-xl max-w-5xl mx-auto pt-6">
            <Reveal>
                <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)] transition-colors group mb-6">
                    <span className="icon-[tabler--arrow-left] size-4 group-hover:-translate-x-1 transition-transform" aria-hidden />
                    Back to projects
                </Link>
            </Reveal>

            <Reveal delay={0.05}>
                <header className="hero-glow">
                    <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">
                        <div className="flex-1 min-w-0">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border)] bg-[var(--surface)] rounded-full text-xs font-medium text-[var(--fg)] shadow-sm">
                                <span className="icon-[tabler--brand-github] size-4 text-[var(--accent)]" aria-hidden />
                                Repository archive · Public · {safeLicense}
                            </div>
                            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">{title}</h1>
                            <p className="mt-4 text-lg text-[var(--muted)] max-w-2xl leading-relaxed">{description}</p>

                            <div className="mt-6 flex flex-wrap gap-2 text-sm text-[var(--muted)]">
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--clock] size-4" aria-hidden /> Updated {formatDate(repo.updatedAt)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--git-fork] size-4" aria-hidden /> {numberFormatter.format(repo.forks)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--star] size-4" aria-hidden /> {numberFormatter.format(repo.stars)}
                                </span>
                                <span className="border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 shadow-sm">
                                    <span className="icon-[tabler--git-branch] size-4" aria-hidden /> {repo.defaultBranch}
                                </span>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-3">
                                {(story?.liveUrl || repo.homepage) && (
                                    <a className="rounded-lg bg-[var(--accent)] text-[var(--bg)] px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm" href={story?.liveUrl ?? repo.homepage ?? undefined} target="_blank" rel="noopener noreferrer">
                                        <span className="icon-[tabler--external-link] size-5" aria-hidden /> Visit Live Site
                                    </a>
                                )}
                                <a className="rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] px-6 py-3 text-sm font-semibold hover:border-[var(--accent)] transition-colors flex items-center gap-2 shadow-sm" href={story?.githubUrl ?? repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="icon-[tabler--brand-github] size-5" aria-hidden /> View Source
                                </a>
                            </div>

                            {(story?.role || story?.duration || story?.team || story?.category) && (
                                <div className="mt-8 grid gap-4 grid-cols-2 sm:grid-cols-4 border-t border-[var(--border)] pt-8">
                                    {story?.role && <div><div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Role</div><div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.role}</div></div>}
                                    {story?.duration && <div><div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Duration</div><div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.duration}</div></div>}
                                    {story?.team && <div><div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Team</div><div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.team}</div></div>}
                                    {story?.category && <div><div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Category</div><div className="mt-1.5 font-medium text-sm text-[var(--fg)]">{story.category}</div></div>}
                                </div>
                            )}

                            {archive.stack.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {archive.stack.map((item) => <span key={item} className="border border-[var(--border)] bg-[var(--bg)] rounded-md px-2.5 py-1 text-xs font-medium text-[var(--muted)]">{item}</span>)}
                                </div>
                            )}
                        </div>

                        <div className="md:w-[360px] lg:w-[480px] md:shrink-0">
                            <div className="relative aspect-[16/10] rounded-[14px] overflow-hidden border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] shadow-lg group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none" />
                                <Image src={archive.cover} alt={`${title} cover`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(min-width: 1024px) 480px, (min-width: 768px) 360px, 100vw" priority />
                            </div>
                        </div>
                    </div>
                </header>
            </Reveal>

            {archive.overviewBlocks.length > 0 && (
                <Reveal delay={0.1}>
                    <section className="card p-6 md:p-8 border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_60%,transparent)] backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent)] rounded-l-2xl" />
                        <h2 className="text-xl font-bold text-[var(--fg)] flex items-center gap-2"><span className="icon-[tabler--info-circle] text-[var(--accent)] size-5" aria-hidden /> Overview</h2>
                        <div className="mt-4 space-y-4 text-[var(--muted)] leading-relaxed md:text-lg">{archive.overviewBlocks.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                    </section>
                </Reveal>
            )}

            {(archive.problemBlocks.length > 0 || archive.solutionBlocks.length > 0) && (
                <Reveal delay={0.15}>
                    <section className="grid md:grid-cols-2 gap-6">
                        {archive.problemBlocks.length > 0 && <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] flex items-center gap-2"><span className="icon-[tabler--target] text-[var(--accent-2)] size-5" aria-hidden /> The Challenge</h2><div className="mt-4 space-y-3 text-[var(--muted)] leading-relaxed">{archive.problemBlocks.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>}
                        {archive.solutionBlocks.length > 0 && <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] flex items-center gap-2"><span className="icon-[tabler--bulb] text-[var(--success)] size-5" aria-hidden /> The Solution</h2><div className="mt-4 space-y-3 text-[var(--muted)] leading-relaxed">{archive.solutionBlocks.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>}
                    </section>
                </Reveal>
            )}

            {story?.features.length ? <Reveal delay={0.2}><section className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] mb-6">Key Features</h2><ul className="grid sm:grid-cols-2 gap-4 text-sm md:text-base text-[var(--muted)]">{story.features.map((feature) => <li key={feature} className="flex items-start gap-3 bg-[var(--bg)] p-3 rounded-lg border border-[var(--border)]"><span className="mt-0.5 rounded-full bg-[color-mix(in_oklab,var(--success)_20%,transparent)] p-1 shrink-0"><span className="icon-[tabler--check] size-3.5 text-[var(--success)]" aria-hidden /></span><span className="leading-snug">{feature}</span></li>)}</ul></section></Reveal> : null}

            {(story?.challenges.length || story?.lessons.length) ? <Reveal delay={0.25}><section className="grid md:grid-cols-2 gap-6">
                {story?.challenges.length ? <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] mb-5">Hurdles Overcome</h2><ul className="space-y-3 text-sm text-[var(--muted)]">{story.challenges.map((item) => <li key={item} className="flex items-start gap-3"><span className="icon-[tabler--alert-triangle] size-5 mt-0.5 text-[var(--accent-2)] shrink-0" aria-hidden /><span className="leading-relaxed">{item}</span></li>)}</ul></div> : null}
                {story?.lessons.length ? <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] mb-5">What I Learned</h2><ul className="space-y-3 text-sm text-[var(--muted)]">{story.lessons.map((item) => <li key={item} className="flex items-start gap-3"><span className="icon-[tabler--school] size-5 mt-0.5 text-[var(--accent)] shrink-0" aria-hidden /><span className="leading-relaxed">{item}</span></li>)}</ul></div> : null}
            </section></Reveal> : null}

            {story?.screenshots.length ? <Reveal delay={0.3}><section className="space-y-6"><h2 className="text-xl font-bold text-[var(--fg)]">Gallery</h2><div className="grid gap-6 md:grid-cols-2">{story.screenshots.map((shot) => <figure key={shot.src} className="group flex flex-col gap-3"><div className="relative aspect-[16/10] rounded-[14px] overflow-hidden border border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_70%,var(--surface))] shadow-sm"><Image src={shot.src} alt={shot.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(min-width: 768px) 50vw, 100vw" /></div>{shot.caption ? <figcaption className="text-sm text-[var(--muted)] text-center px-4">{shot.caption}</figcaption> : null}</figure>)}</div></section></Reveal> : null}

            {(architecture.length > 0 || archive.languages.length > 0) && <Reveal delay={0.35}><section className="grid md:grid-cols-2 gap-6">
                {architecture.length > 0 ? <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] mb-5">{story?.architecture?.title ?? "Architecture"}</h2><dl className="space-y-4 text-sm">{architecture.map((item) => <div key={item.label} className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr] gap-4 border-b border-[var(--border)] pb-3 last:border-0 last:pb-0"><dt className="text-[var(--muted)] font-medium">{item.label}</dt><dd className="text-[var(--fg)]">{item.value}</dd></div>)}</dl></div> : null}
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] flex flex-col"><h2 className="text-lg font-bold text-[var(--fg)] mb-5">Languages</h2>{archive.languages.length > 0 ? <div className="mt-auto"><div className="h-2.5 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex" role="img" aria-label="Language distribution">{archive.languages.slice(0, 6).map((language, index) => <span key={language.name} style={{ width: `${Math.max(2, Math.round(language.pct))}%`, background: PALETTE[index % PALETTE.length] }} aria-hidden />)}</div><div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm text-[var(--fg)] font-medium">{archive.languages.slice(0, 6).map((language, index) => <span key={language.name} className="flex items-center gap-2"><span className="size-3 rounded-[4px] shrink-0" style={{ background: PALETTE[index % PALETTE.length] }} aria-hidden /><span className="truncate">{language.name}</span><span className="text-[var(--muted)] ml-auto font-mono text-xs">{Math.round(language.pct)}%</span></span>)}</div>{archive.totalLanguagePct !== 100 ? <p className="mt-5 text-[var(--muted)] text-xs border-t border-[var(--border)] pt-4">Percentages are approximate.</p> : null}</div> : <p className="text-[var(--muted)] text-sm">No languages detected via GitHub API.</p>}</div>
            </section></Reveal>}

            <Reveal delay={0.4}><section className="grid sm:grid-cols-2 gap-6">
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)]"><h2 className="text-lg font-bold text-[var(--fg)] mb-4 flex items-center gap-2"><span className="icon-[tabler--database] text-[var(--accent)] size-5" aria-hidden /> Repository Info</h2><dl className="grid grid-cols-[130px_1fr] gap-y-3 text-sm"><dt className="text-[var(--muted)]">Created</dt><dd className="font-medium text-[var(--fg)]">{formatDate(repo.createdAt)}</dd><dt className="text-[var(--muted)]">Default branch</dt><dd className="font-medium text-[var(--fg)] font-mono text-xs">{repo.defaultBranch}</dd><dt className="text-[var(--muted)]">Stars</dt><dd className="font-medium text-[var(--fg)]">★ {numberFormatter.format(repo.stars)}</dd><dt className="text-[var(--muted)]">Forks</dt><dd className="font-medium text-[var(--fg)]">{numberFormatter.format(repo.forks)}</dd><dt className="text-[var(--muted)]">License</dt><dd className="font-medium text-[var(--fg)]">{safeLicense}</dd></dl></div>
                <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] flex flex-col"><h2 className="text-lg font-bold text-[var(--fg)] mb-4 flex items-center gap-2"><span className="icon-[tabler--file-text] text-[var(--accent)] size-5" aria-hidden /> GitHub Description</h2><p className="text-sm text-[var(--muted)] leading-relaxed my-auto">{repo.description || "No GitHub description provided for this repository."}</p></div>
            </section></Reveal>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        </article>
    );
}
