import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
const defaultTitle = "Gimesha Nirmal — Software Engineer";

export const metadata: Metadata = {
    title: { default: defaultTitle, template: "%s | Gimesha Nirmal" },
    description: "Banking systems, ML verifications, and pragmatic full-stack work.",
    metadataBase: new URL(siteUrl),
    icons: { icon: "/favicon.svg" },
    alternates: { canonical: "/" },
    openGraph: {
        type: "website",
        url: siteUrl,
        title: defaultTitle,
        description: "Banking systems, ML verifications, and pragmatic full-stack work.",
        siteName: "gimesha.dev",
        images: [{ url: `/og?title=${encodeURIComponent(defaultTitle)}&subtitle=${encodeURIComponent("Portfolio")}` }],
    },
    twitter: {
        card: "summary_large_image",
        title: defaultTitle,
        description: "Banking systems, ML verifications, and pragmatic full-stack work.",
        images: [{ url: `/og?title=${encodeURIComponent(defaultTitle)}&subtitle=${encodeURIComponent("Portfolio")}` }],
    },
    robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get("theme")?.value;
    const theme = themeCookie === "light" || themeCookie === "dark" ? themeCookie : undefined;

    return (
        <html lang="en" data-theme={theme} className={inter.className}>
        <body className="min-h-[100svh] flex flex-col antialiased">
        <a
            href="#content"
            className="sr-only focus:not-sr-only focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] px-3 py-2 bg-white rounded text-black"
        >
            Skip to content
        </a>
        <Header />
        <main id="content" className="flex-1 section">
            <div className="container-xl">{children}</div>
        </main>
        <Footer />
        </body>
        </html>
    );
}
