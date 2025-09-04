import Link from "next/link";

export const metadata = { title: "Case Studies" };

const cases = [
    { slug: "banking-system", title: "Bank System — Multi-Platform Banking" },
    { slug: "bank-app", title: "BankApp — Android Wallet & Payments" },
    { slug: "neurosim", title: "NeuroSim — Brain Network Simulator" },
];

export default function CaseStudiesIndex() {
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Case Studies</h1>
            <p className="mt-2 text-[var(--muted)] max-w-2xl">
                Short, outcome-focused write-ups of flagship projects. Each one shows the problem, approach, and results.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {cases.map((c) => (
                    <Link key={c.slug} href={`/case-studies/${c.slug}`} className="group">
                        <div className="card p-5 h-full">
                            <h2 className="text-lg font-semibold group-hover:underline">{c.title}</h2>
                            <p className="mt-2 text-sm text-[var(--muted)]">2–3 minute read</p>
                            <div className="mt-4 text-sm">
                                <span className="hairline inline-block rounded-full px-3 py-1">Impact</span>{" "}
                                <span className="hairline inline-block rounded-full px-3 py-1">Architecture</span>{" "}
                                <span className="hairline inline-block rounded-full px-3 py-1">Trade-offs</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
