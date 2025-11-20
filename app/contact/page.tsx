import type { Metadata } from "next";
import { getContactMDX } from "@/lib/content";
import { RenderMDX } from "@/components/MDX";
import ContactCards from "@/components/ContactCards";

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const NAME = "Gimesha Nirmal";
const EMAIL = "gimeshanirmal23@gmail.com";
const GITHUB = "https://github.com/gimesha-adikari";
const LINKEDIN = "https://linkedin.com/in/gimesha-nirmal-490245343";

export const metadata: Metadata = {
    title: "Contact",
    description: `Get in touch with ${NAME} — email or connect on GitHub and LinkedIn.`,
    alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
    const mdx = await getContactMDX();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: NAME,
        url: `${siteUrl}/contact`,
        email: `mailto:${EMAIL}`,
        sameAs: [GITHUB, LINKEDIN],
        contactPoint: [{
            "@type": "ContactPoint",
            contactType: "Business",
            email: EMAIL,
            url: `${siteUrl}/contact`
        }]
    };

    return (
        <section aria-labelledby="contact-title" className="max-w-3xl">
            <h1 id="contact-title" className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
        <span className="bg-gradient-to-r from-[var(--fg)] via-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
          Contact
        </span>
            </h1>

            <p className="mt-3 text-[var(--muted)]">
                For opportunities or questions, email me or connect on socials.
            </p>

            <div className="mt-6">
                <ContactCards
                    email={EMAIL}
                    githubUrl={GITHUB}
                    linkedinUrl={LINKEDIN}
                    vcardHref="/api/vcard"
                />
            </div>

            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </section>
    );
}
