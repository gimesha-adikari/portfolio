import type { Metadata, Viewport } from "next";
import "./globals.css";
import MiniSidebar from "@/components/MiniSidebar";
import FlyonuiScript from "@/components/FlyonuiScript";
import { Footer } from "@/components/Footer";
import { Inter } from "next/font/google";
import { ThemeToggle } from "@/components/ThemeToggle";
import Header from "@/components/Header";
import SidebarWidthSync from "@/components/SidebarWidthSync";
import GlobalPointerGlow from "@/components/GlobalPointerGlow";
import ReadingProgress from "@/components/ReadingProgress";
import MotionWrapper from "@/app/(motion)/motion-wrapper";

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

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f6f8ff" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={inter.className}>
        <body className="overlay-body-open overlay-body-open:overflow-hidden min-h-[100svh] antialiased">
        <GlobalPointerGlow />
        <ReadingProgress />

        <MiniSidebar id="collapsible-mini-sidebar" title="gimesha.dev" />
        <SidebarWidthSync targetId="collapsible-mini-sidebar" />

        <div className="sm:ps-[var(--sidebar-w)] min-h-full bg-[var(--bg)] duration-300 transition-[padding]">
            <Header />
            <main id="content" className="flex-1 section">
                <div className="container-xl">
                    <MotionWrapper>
                        {children}
                    </MotionWrapper>
                </div>
            </main>
            <Footer />
        </div>

        <div className="fixed bottom-4 right-4 z-40">
            <ThemeToggle />
        </div>

        <FlyonuiScript />
        </body>
        </html>
    );
}
