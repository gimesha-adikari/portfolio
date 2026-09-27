import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";
import { buildRouteMetadata } from "@/lib/route-metadata";

export const metadata = buildRouteMetadata({
    title: "Case Studies",
    description: "Selected engineering case studies covering architecture, trade-offs, failure boundaries, and verified evidence.",
    path: "/case-studies",
    type: "website",
});

export default function CaseStudiesIndex() {
    const cases = getAllCaseStudies();

    return (
        <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <header className="mb-16 md:mb-20 max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--fg)] mb-6">
                    Case Studies
                </h1>
                <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
                    Short, outcome-focused write-ups of flagship projects. Exploring the problem space, architectural decisions, and results.
                </p>
            </header>

            <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                    <li key={c.slug} className="flex">
                        <Link
                            href={`/case-studies/${c.slug}`}
                            className="group relative flex flex-col justify-between w-full p-6 sm:p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xl hover:shadow-[var(--accent)]/5 transition-all duration-500 focus:outline-none overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 flex flex-col grow">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="size-12 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 group-hover:border-[var(--accent)]/50 transition-all duration-500 shadow-sm">
                                        <span className={`${c.main_icon} size-6 text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors`} />
                                    </div>

                                    <span className="text-xs font-semibold tracking-wider text-[var(--muted)] uppercase flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--background)] shadow-sm">
                                        <span className="icon-[tabler--clock] size-3.5"></span> {c.read_time}
                                    </span>
                                </div>

                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--fg)] mb-4 group-hover:text-[var(--accent)] transition-colors leading-snug">
                                    {c.title}
                                </h2>

                                <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed mb-8 line-clamp-3">
                                    {c.blurb}
                                </p>
                            </div>

                            <div className="relative z-10 mt-auto pt-6 border-t border-[var(--border)]/60 flex flex-wrap gap-2">
                                {c.tags?.map((t) => (
                                    <span key={t} className="px-3 py-1 text-xs font-medium rounded-lg bg-[var(--background)] text-[var(--muted)] border border-[var(--border)]/50">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
