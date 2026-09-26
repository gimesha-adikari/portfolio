import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { siteConfig } from "@/lib/siteConfig";

function getAboutData() {
    try {
        const filePath = path.join(process.cwd(), "content/about.yml");
        const fileContents = fs.readFileSync(filePath, "utf8");
        return (yaml.load(fileContents) as Record<string, any>) || {};
    } catch (error) {
        console.error("Failed to load about.yml:", error);
        return {};
    }
}

export const metadata: Metadata = {
    title: "About",
    description: "Software engineer shipping reliable products across web, mobile, and backend.",
    alternates: { canonical: "/about" },
    openGraph: {
        type: "article",
        url: `${siteConfig.canonicalUrl}/about`,
        title: "About — 3 min read",
        description: "Software engineer shipping reliable products across web, mobile, and backend.",
        siteName: siteConfig.siteName,
        images: [{ url: "/og?title=About&subtitle=3%20min%20read" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About — 3 min read",
        description: "Software engineer shipping reliable products across web, mobile, and backend.",
        images: [{ url: "/og?title=About&subtitle=3%20min%20read" }],
    },
};

export default function AboutPage() {
    const aboutData = getAboutData();

    return (
        <section className="relative container-xl max-w-5xl mx-auto pt-10 md:pt-14 pb-20 hero-glow">
            {/* Ambient Background Glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-10vh] h-[40vh] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent),transparent_80%)_0%,transparent_70%)] opacity-40"
            />

            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">
                    <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                        About
                    </span>
                </h1>
                <p className="mt-2 text-[var(--muted)] text-sm md:text-base">{aboutData.subtitle}</p>
            </div>

            {/* Content Body */}
            <div className="space-y-12 text-[var(--muted)]">
                {/* Hero Intro Bento Box */}
                <div className="card p-6 md:p-8 border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--background)] relative overflow-hidden rounded-2xl shadow-xl">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-[var(--accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--fg)] tracking-tight">
                        {aboutData.name}
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--muted)] mt-3 leading-relaxed">
                        Software engineer shipping reliable products across <strong className="text-[var(--fg)]">web</strong>, <strong className="text-[var(--fg)]">mobile</strong>, and <strong className="text-[var(--fg)]">backend</strong>.
                    </p>
                    <blockquote className="my-6 border-l-4 border-[var(--accent)] pl-4 italic text-[var(--fg)]/90 bg-[var(--surface)]/50 py-2 rounded-r-lg">
                        <strong>TL;DR</strong> — {aboutData.tldr}
                    </blockquote>
                    {aboutData.badges && (
                        <ul className="flex flex-wrap gap-2 pt-2">
                            {aboutData.badges.map((badge: any, idx: number) => (
                                <li key={idx} className="border border-[var(--border)] px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-2 bg-[var(--background)] text-[var(--fg)] shadow-sm">
                                    <span className={`${badge.icon} size-4 text-[var(--accent)]`} aria-hidden="true"></span> {badge.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* About & Philosophy Bento Grid */}
                <section id="about" className="grid gap-6 md:grid-cols-2">
                    <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] rounded-2xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--fg)] tracking-tight mb-3 flex items-center gap-2">
                                <span className="icon-[tabler--user-code] size-5 text-[var(--accent)]"></span> Overview
                            </h3>
                            <p className="leading-relaxed text-sm md:text-base">
                                {aboutData.overview?.text}
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-[var(--border)]">
                            <h4 className="text-sm font-semibold text-[var(--fg)] uppercase tracking-wider mb-2">Focus areas</h4>
                            <ul className="space-y-1.5 text-xs md:text-sm">
                                {aboutData.overview?.focus_areas?.map((area: string, idx: number) => (
                                    <li key={idx}>• {area}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="card p-6 border border-[var(--border)] bg-[var(--surface)] rounded-2xl flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-[var(--fg)] tracking-tight mb-3 flex items-center gap-2">
                                <span className="icon-[tabler--compass] size-5 text-[var(--accent)]"></span> Working Style
                            </h3>
                            <ul className="space-y-3 text-sm">
                                {aboutData.working_style?.map((style: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="icon-[tabler--check] size-4 text-[var(--accent)] mt-1 shrink-0"></span>
                                        <span><strong>{style.title}:</strong> {style.desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Stack at a glance */}
                {aboutData.stack && (
                    <section id="stack-at-a-glance">
                        <h3 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-4 flex items-center gap-2">
                            <span className="icon-[tabler--stack] size-6 text-[var(--accent)]"></span> Stack at a glance
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {aboutData.stack.map((s: any, idx: number) => (
                                <div key={idx} className="card p-5 border border-[var(--border)] bg-[var(--surface)] rounded-xl hover:border-[var(--accent)]/50 transition-colors">
                                    <h4 className="text-base font-semibold text-[var(--fg)] mb-2 flex items-center gap-2">
                                        <span className={`${s.icon} size-5 text-[var(--accent)]`}></span> {s.category}
                                    </h4>
                                    <ul className="space-y-1 text-sm">
                                        <li><strong>{s.items?.split(',')[0]}</strong>{s.items?.includes(',') ? s.items.substring(s.items.indexOf(',')) : ''}</li>
                                        {s.subtext && <li className="text-xs text-[var(--muted)]">{s.subtext}</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Selected work */}
                {aboutData.selected_work && (
                    <section id="selected-work">
                        <h3 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-4 flex items-center gap-2">
                            <span className="icon-[tabler--briefcase] size-6 text-[var(--accent)]"></span> Selected work
                        </h3>
                        <div className="grid gap-4 md:grid-cols-3">
                            {aboutData.selected_work.map((work: any, idx: number) => (
                                <div key={idx} className="card p-5 border border-[var(--border)] bg-[var(--surface)] rounded-xl flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-bold text-[var(--fg)] mb-1">{work.title}</h4>
                                        <p className="text-xs md:text-sm text-[var(--muted)]">{work.description}</p>
                                    </div>
                                    {work.link && (
                                        <a className="inline-flex items-center gap-2 text-xs font-semibold underline hover:no-underline mt-4 text-[var(--accent)]" href={work.link}>
                                            <span className="icon-[tabler--file-text] size-4"></span> {work.link_text || "Read more"}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Toolbox & Skills Grid */}
                {aboutData.skills && (
                    <section id="skills" className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                        <h3 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-6 flex items-center gap-2">
                            <span className="icon-[tabler--tools] size-6 text-[var(--accent)]"></span> Technical Skills & Toolbox
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {aboutData.skills.map((skill: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                    <strong className="text-sm font-bold text-[var(--fg)] flex items-center gap-1.5">
                                        <span className={`${skill.icon} size-4 text-[var(--accent)]`}></span> {skill.category}
                                    </strong>
                                    <p className="text-xs leading-relaxed text-[var(--muted)]">{skill.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Dynamic Fallback Mapper: Automatically renders any extra custom node added to YAML */}
                {Object.keys(aboutData).map((key) => {
                    const ignoredKeys = ["name", "subtitle", "role_description", "tldr", "badges", "overview", "working_style", "stack", "selected_work", "skills", "availability", "education"];
                    if (ignoredKeys.includes(key)) return null;

                    const sectionData = aboutData[key];
                    if (!Array.isArray(sectionData)) return null;

                    return (
                        <section key={key} id={key} className="card p-6 md:p-8 border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                            <h3 className="text-2xl font-bold text-[var(--fg)] tracking-tight mb-6 capitalize flex items-center gap-2">
                                <span className="icon-[tabler--folder] size-6 text-[var(--accent)]"></span> {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {sectionData.map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                                        {Object.entries(item).map(([subKey, subVal]: [string, any], subIdx: number) => (
                                            <div key={subIdx} className="text-sm">
                                                {subKey === 'title' ? (
                                                    <strong className="text-[var(--fg)] block text-base mb-1">{subVal}</strong>
                                                ) : typeof subVal === 'string' && subVal.startsWith('http') ? (
                                                    <a
                                                        href={subVal}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--border)] hover:opacity-90 transition-all capitalize"
                                                    >
                                                        View {subKey.replace(/_/g, ' ')}
                                                        <span className="icon-[tabler--external-link] size-3.5"></span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-[var(--muted)] block">
                                                        <strong className="capitalize">{subKey.replace(/_/g, ' ')}:</strong> {subVal}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* Availability & Education Bottom Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <section id="availability" className="card p-6 border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                        <h3 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-2 flex items-center gap-2">
                            <span className="icon-[tabler--circle-check] size-5 text-emerald-400"></span> Availability
                        </h3>
                        <p className="text-sm leading-relaxed">
                            {aboutData.availability}
                        </p>
                    </section>

                    <section id="education" className="card p-6 border border-[var(--border)] bg-[var(--surface)] rounded-2xl">
                        <h3 className="text-lg font-bold text-[var(--fg)] tracking-tight mb-2 flex items-center gap-2">
                            <span className="icon-[tabler--school] size-5 text-[var(--accent)]"></span> Education & Languages
                        </h3>
                        <ul className="text-sm space-y-1">
                            {/* Primary Education */}
                            <li><strong>{aboutData.education?.degree}</strong></li>
                            <li className="text-xs text-[var(--muted)]">{aboutData.education?.institution}</li>

                            {/* Render Additional Education if it exists */}
                            {aboutData.education?.additional?.map((item: string, idx: number) => (
                                <li key={idx} className="text-xs text-[var(--muted)]">{item}</li>
                            ))}

                            {/* Fix: Pull languages from the root object (aboutData.languages) */}
                            <li className="pt-3 text-xs text-[var(--muted)]">
                                <strong className="text-[var(--fg)]">Languages:</strong> {aboutData.languages}
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </section>
    );
}
