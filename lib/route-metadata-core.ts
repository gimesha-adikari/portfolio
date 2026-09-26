import type { Metadata } from "next";

export type RouteMetadataInput = {
    title: string;
    description: string;
    path: string;
    subtitle: string;
    type?: "website" | "article";
};

export type MetadataSiteConfig = {
    canonicalUrl: string;
    siteName: string;
};

export function buildRouteMetadataWithConfig(
    { title, description, path, subtitle, type = "article" }: RouteMetadataInput,
    config: MetadataSiteConfig,
): Metadata {
    const url = new URL(path, config.canonicalUrl).toString();
    const image = new URL(
        `/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
        config.canonicalUrl,
    ).toString();

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type,
            title,
            description,
            url,
            siteName: config.siteName,
            images: [{ url: image, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [{ url: image, alt: title }],
        },
    };
}
