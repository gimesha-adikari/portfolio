'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/case-studies", label: "Case Studies" }, // <— added
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Header() {
    const pathname = usePathname();
    return (
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[#0f1116]/60 border-b border-[var(--border)]">
            <div className="container-xl h-14 flex items-center justify-between">
                <Link href="/" className="font-semibold tracking-tight">gimesha.dev</Link>
                <nav className="flex items-center gap-2">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-3 py-2 rounded-lg hover:bg-white/5 ${pathname === l.href ? "bg-white/5" : ""}`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
