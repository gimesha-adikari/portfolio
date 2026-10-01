import { ImageResponse } from "next/og";
import { siteConfig } from "./siteConfig";
import type { PortfolioOgCard } from "./portfolio-og-content";

export const portfolioOgImageSize = {
    width: 1200,
    height: 630,
} as const;

function Chip({ children }: { children: string }) {
    return (
        <div
            style={{
                display: "flex",
                border: "1px solid rgba(148,163,184,.35)",
                borderRadius: 999,
                padding: "9px 16px",
                color: "#cbd5e1",
                fontSize: 21,
                lineHeight: 1,
            }}
        >
            {children}
        </div>
    );
}

export function createPortfolioOgImage(card: PortfolioOgCard): ImageResponse {
    const chips = [card.status, card.evidenceLabel, ...(card.technologies ?? [])]
        .filter((value): value is string => Boolean(value))
        .slice(0, 4);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 64,
                    background: "#0f172a",
                    color: "#f8fafc",
                    fontFamily: "Arial, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: -180,
                        right: -100,
                        width: 620,
                        height: 620,
                        borderRadius: 999,
                        background: "rgba(96,165,250,.12)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -260,
                        left: -100,
                        width: 620,
                        height: 620,
                        borderRadius: 999,
                        background: "rgba(167,139,250,.1)",
                    }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", color: "#93c5fd", fontSize: 25, fontWeight: 700 }}>
                        {siteConfig.displayDomain}
                    </div>
                    <div style={{ display: "flex", color: "#94a3b8", fontSize: 24 }}>
                        {card.eyebrow}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", maxWidth: 1010, gap: 20 }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: card.title.length > 34 ? 58 : 72,
                            lineHeight: 1.05,
                            fontWeight: 800,
                            letterSpacing: -1.5,
                        }}
                    >
                        {card.title}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            maxWidth: 940,
                            color: "#cbd5e1",
                            fontSize: 30,
                            lineHeight: 1.3,
                        }}
                    >
                        {card.description}
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", maxWidth: 860 }}>
                        {chips.map((chip) => <Chip key={chip}>{chip}</Chip>)}
                    </div>
                    <div style={{ display: "flex", color: "#94a3b8", fontSize: 22 }}>
                        {card.footer ?? siteConfig.name}
                    </div>
                </div>
            </div>
        ),
        portfolioOgImageSize,
    );
}
