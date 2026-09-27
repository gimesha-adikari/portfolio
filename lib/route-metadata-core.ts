import type { Metadata } from "next";

export type RouteMetadataInput = {
    title: string;
    description: string;
    path: string;
    ogImagePath?: string;
    type?: "website" | "article";
};

export type MetadataSiteConfig = {
    canonicalUrl: string;
    siteName: string;
};

export type NotFoundMetadataInput = {
    label: string;
    path: string;
};

export function buildRouteMetadataWithConfig(
    { title, description, path, ogImagePath, type = "article" }: RouteMetadataInput,
    config: MetadataSiteConfig,
): Metadata {
    const url = new URL(path, config.canonicalUrl).toString();
    const normalizedPath = path === "/" ? "" : path.replace(/\/+$/, "");
    const image = new URL(ogImagePath ?? `${normalizedPath}/opengraph-image`, config.canonicalUrl).toString();
    const brandedTitle = `${title} | ${config.siteName}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            type,
            title: brandedTitle,
            description,
            url,
            siteName: config.siteName,
            images: [{ url: image, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title: brandedTitle,
            description,
            images: [{ url: image, alt: title }],
        },
    };
}

export function buildNotFoundMetadataWithConfig(
    { label, path }: NotFoundMetadataInput,
    config: MetadataSiteConfig,
): Metadata {
    const title = `${label} not found`;
    const description = `The requested ${label.toLowerCase()} could not be found.`;
    const url = new URL(path, config.canonicalUrl).toString();
    const brandedTitle = `${title} | ${config.siteName}`;

    return {
        title,
        description,
        robots: { index: false, follow: false },
        openGraph: {
            type: "website",
            title: brandedTitle,
            description,
            url,
            siteName: config.siteName,
            images: [],
        },
        twitter: {
            card: "summary",
            title: brandedTitle,
            description,
            images: [],
        },
    };
}
