import Link from "next/link";

export const metadata = {title: "Case Studies"};

type Case = {
    slug: string;
    title: string;
    blurb: string;
    read: string;
    icon: string;
    tags: string[];
};

const cases: Case[] = [
    {
        slug: "banking-system",
        title: "Bank System — Multi-Platform Banking",
        blurb:
            "Modular Spring Boot + FastAPI (AI KYC) with React admin and Android wallet. Focus on clean domains and resilient KYC.",
        read: "3–4 min",
        icon: "icon-[tabler--brand-java]",
        tags: ["Impact", "Architecture", "Trade-offs"],
    },
    {
        slug: "bank-app",
        title: "BankApp — Android Wallet & Payments",
        blurb:
            "Compose UI, Retrofit/OkHttp, robust retries and clear flows for reloads, QR pay, and bill-pay on real networks.",
        read: "2–3 min",
        icon: "icon-[tabler--device-mobile]",
        tags: ["UX", "Resilience", "Testing"],
    },
    {
        slug: "neurosim",
        title: "NeuroSim — Brain Network Simulator",
        blurb:
            "Canvas-based neuron visualizer with refractory logic and decoupled sim/render for smooth, stable demos.",
        read: "2–3 min",
        icon: "icon-[tabler--brain]",
        tags: ["Visualization", "Performance", "Teaching"],
    },
];

export default function CaseStudiesIndex() {
    return (
        <section aria-labelledby="cs-title">
            <h1 id="cs-title" className="text-3xl md:text-4xl font-bold tracking-tight">
                Case Studies
            </h1>
            <p className="mt-2 text-[var(--muted)] max-w-2xl">
                Short, outcome-focused write-ups of flagship projects—each highlights the problem, approach, and
                results.
            </p>

            <ul
                className="mt-8 grid gap-6 sm:grid-cols-2"
                role="list"
                aria-label="Case studies list"
            >
                {cases.map((c, idx) => {
                    const gradFrom = idx % 2 === 0 ? "from-[var(--spot-1)]" : "from-[var(--accent)]/18";
                    const gradTo = idx % 2 === 0 ? "to-[var(--spot-2)]" : "to-[var(--accent-2)]/18";

                    return (
                        <li key={c.slug} className="h-full">
                            <Link
                                href={`/case-studies/${c.slug}`}
                                className="group block focus:outline-none"
                                aria-labelledby={`cs-${c.slug}-title`}
                                aria-describedby={`cs-${c.slug}-desc`}
                                prefetch={false}
                            >
                                <article
                                    className="relative rounded-2xl p-[1px] transition-transform duration-300 group-hover:-translate-y-0.5 h-full">
                                    <div
                                        className={[
                                            "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-70 group-hover:opacity-100",
                                            gradFrom,
                                            gradTo,
                                        ].join(" ")}
                                        aria-hidden
                                    />
                                    <div className="relative card rounded-2xl h-full overflow-hidden">
                                        <div className="p-5 md:p-6 flex items-start gap-4">
                                            <div
                                                className="shrink-0 grid place-items-center rounded-xl size-11 bg-[color-mix(in_oklab,var(--accent)20%,transparent)] border border-[var(--border)] transition-transform duration-300 group-hover:rotate-[2deg] group-hover:scale-[1.04]"
                                                aria-hidden
                                            >
                                                <span className={`${c.icon} size-5 text-[var(--accent)]`}/>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h2
                                                    id={`cs-${c.slug}-title`}
                                                    className="text-lg font-semibold tracking-tight line-clamp-1"
                                                >
                          <span
                              className="bg-[linear-gradient(90deg,var(--fg),var(--accent))] [background-clip:text] text-transparent group-hover:underline">
                            {c.title}
                          </span>
                                                </h2>

                                                <p
                                                    id={`cs-${c.slug}-desc`}
                                                    className="mt-1 text-sm text-[var(--muted)] line-clamp-2"
                                                >
                                                    {c.blurb}
                                                </p>

                                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                                    {c.tags.map((t) => (
                                                        <span
                                                            key={t}
                                                            className="hairline rounded-full px-2.5 py-1 transition-colors hover:bg-[color-mix(in_oklab,var(--surface)_92%,var(--accent)_8%)]"
                                                        >
                              {t}
                            </span>
                                                    ))}
                                                    <span className="text-[var(--muted)] ms-auto">⏱ {c.read}</span>
                                                </div>
                                            </div>

                                            <span
                                                className="icon-[tabler--chevron-right] size-5 text-[var(--muted)] transition-transform duration-200 group-hover:translate-x-0.5"
                                                aria-hidden
                                            />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
