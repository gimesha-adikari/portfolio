import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import Header from "@/components/Header";
import SkipLink from "@/components/SkipLink";
import { siteConfig } from "@/lib/siteConfig";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const defaultOgImage = new URL("/opengraph-image", siteConfig.canonicalUrl).toString();

export const metadata: Metadata = {
    title: { default: siteConfig.metadata.defaultTitle, template: siteConfig.metadata.titleTemplate },
    description: siteConfig.metadata.description,
    metadataBase: new URL(siteConfig.canonicalUrl),
    icons: { icon: "/favicon.svg" },
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: siteConfig.canonicalUrl,
        title: siteConfig.metadata.defaultTitle,
        description: siteConfig.metadata.description,
        siteName: siteConfig.siteName,
        images: [{ url: defaultOgImage, alt: `${siteConfig.name} engineering portfolio` }],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.metadata.defaultTitle,
        description: siteConfig.metadata.description,
        images: [{ url: defaultOgImage, alt: `${siteConfig.name} engineering portfolio` }],
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f6f8ff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
        <body className="min-h-[100svh] antialiased">
        <SkipLink />

        <div className="min-h-full bg-[var(--bg)]">
            <Header />
            <main id="content" tabIndex={-1} className="flex-1 section">
                <div className="container-xl">
                    {children}
                </div>
            </main>
            <Footer />
        </div>

        <div className="fixed bottom-4 right-4 z-40">
            <ThemeToggle />
        </div>

        </body>
        </html>
    );
}
