// file: app/contact/page.tsx
import type { Metadata } from "next";
import ContactCards from "@/components/ContactCards";
import Reveal from "@/components/Reveal";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
    title: "Contact",
    description: `Get in touch with ${siteConfig.name} — email or connect on GitHub and LinkedIn.`,
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: siteConfig.name,
        url: `${siteConfig.canonicalUrl}/contact`,
        email: `mailto:${siteConfig.email}`,
        sameAs: [siteConfig.github, siteConfig.linkedin],
        contactPoint: [{
            "@type": "ContactPoint",
            contactType: "Business",
            email: siteConfig.email,
            url: `${siteConfig.canonicalUrl}/contact`
        }]
    };

    return (
        <section aria-labelledby="contact-title" className="relative container-xl max-w-4xl mx-auto pt-10 md:pt-14 pb-20 hero-glow">
            {/* Ambient Background Glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[-10vh] h-[40vh] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--accent),transparent_80%)_0%,transparent_70%)] opacity-40"
            />

            <Reveal>
                <div className="max-w-2xl">
                    <h1 id="contact-title" className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-[var(--fg)]">
                        Let's build something <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                            incredible together.
                        </span>
                    </h1>
                    <p className="mt-5 text-lg text-[var(--muted)] leading-relaxed">
                        For opportunities, collaborations, or just a quick question, feel free to reach out via email or connect with me on social media.
                    </p>
                </div>
            </Reveal>

            {/* Hardcoded Contact Cards Component */}
            <Reveal delay={0.2}>
                <div className="mt-12">
                    <ContactCards
                        email={siteConfig.email}
                        githubUrl={siteConfig.github}
                        linkedinUrl={siteConfig.linkedin}
                        vcardHref="/api/vcard"
                    />
                </div>
            </Reveal>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </section>
    );
}
