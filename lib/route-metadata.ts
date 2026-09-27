import { siteConfig } from "./siteConfig";
import {
    buildNotFoundMetadataWithConfig,
    buildRouteMetadataWithConfig,
    type NotFoundMetadataInput,
    type RouteMetadataInput,
} from "./route-metadata-core";

export type { NotFoundMetadataInput, RouteMetadataInput } from "./route-metadata-core";

export function absoluteSiteUrl(path: string): string {
    return new URL(path, siteConfig.canonicalUrl).toString();
}

export function buildRouteMetadata(input: RouteMetadataInput) {
    return buildRouteMetadataWithConfig(input, siteConfig);
}

export function buildNotFoundMetadata(input: NotFoundMetadataInput) {
    return buildNotFoundMetadataWithConfig(input, siteConfig);
}
