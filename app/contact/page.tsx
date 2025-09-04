// app/contact/page.tsx
import type { Metadata } from "next";
import { getContactMDX } from "@/lib/content";
import { RenderMDX } from "@/components/MDX";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
    const mdx = await getContactMDX();

    return (
        <article className="prose max-w-2xl">
            {mdx ? (
                <RenderMDX source={mdx} />
            ) : (
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contact</h1>
                    <p className="mt-3 text-[var(--muted)]">
                        For opportunities or questions, email me or connect on socials.
                    </p>

                    <div className="mt-6 space-y-4">
                        <a
                            href="mailto:gimeshanirmal23@gmail.com"
                            className="card block px-4 py-3 hover:shadow-md transition-shadow"
                        >
                            gimeshanirmal23@gmail.com
                        </a>

                        <a
                            href="https://github.com/gimesha-adikari"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card block px-4 py-3 hover:shadow-md transition-shadow"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://linkedin.com/in/gimesha-nirmal-490245343"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card block px-4 py-3 hover:shadow-md transition-shadow"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            )}
        </article>
    );
}
