import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "gimesha.dev";
    const subtitle = searchParams.get("subtitle") || "Case Study";

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 64,
                    background:
                        "linear-gradient(135deg, #0f172a 0%, #111827 45%, #0b1222 100%)",
                    color: "#e6e8ee",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(800px 400px at 20% 20%, rgba(124,58,237,.25), transparent 60%), radial-gradient(700px 350px at 80% 10%, rgba(34,211,238,.25), transparent 60%)",
                    }}
                />
                <div style={{ fontSize: 28, opacity: 0.9 }}>gimesha.dev</div>
                <div
                    style={{
                        fontSize: 74,
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginTop: 20,
                    }}
                >
                    {title}
                </div>
                <div style={{ marginTop: 18, fontSize: 34, opacity: 0.8 }}>
                    {subtitle}
                </div>
                <div
                    style={{
                        marginTop: 36,
                        height: 6,
                        width: 320,
                        borderRadius: 999,
                        background:
                            "linear-gradient(90deg, #7aa2ff 0%, #b794f4 50%, #7aa2ff 100%)",
                    }}
                />
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
