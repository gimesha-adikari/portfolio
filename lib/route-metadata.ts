import { siteConfig } from "./siteConfig";
import {
    buildRouteMetadataWithConfig,
    type RouteMetadataInput,
} from "./route-metadata-core";

export type { RouteMetadataInput } from "./route-metadata-core";

export function absoluteSiteUrl(path: string): string {
    return new URL(path, siteConfig.canonicalUrl).toString();
}

export function buildRouteMetadata(input: RouteMetadataInput) {
    return buildRouteMetadataWithConfig(input, siteConfig);
}
