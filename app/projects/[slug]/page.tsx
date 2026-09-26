import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioProjectDetail } from "@/components/PortfolioProjectDetail";
import { RepositoryArchiveDetail } from "@/components/RepositoryArchiveDetail";
import { buildRouteMetadata } from "@/lib/route-metadata";
import { getProjectRouteParams, resolvePortfolioProject } from "@/lib/portfolio-resolver";

export const dynamicParams = false;
export const revalidate = 3600;

type Params = { slug: string };

export async function generateStaticParams() {
    return getProjectRouteParams();
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug } = await params;
    const resolved = await resolvePortfolioProject(slug);

    if (!resolved) return { title: "Not found" };

    if (resolved.kind === "curated") {
        return buildRouteMetadata({
            title: resolved.project.title,
            description: resolved.project.tagline,
            path: `/projects/${resolved.project.slug}`,
            subtitle: "Project",
        });
    }

    const title = resolved.project.story?.title ?? resolved.project.repository.name;
    const description = resolved.project.story?.summary ?? resolved.project.repository.description ?? `Details and links for ${resolved.project.repository.name}`;
    return buildRouteMetadata({
        title,
        description,
        path: `/projects/${resolved.project.repository.name}`,
        subtitle: "Repository archive",
    });
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
    const { slug } = await params;
    const resolved = await resolvePortfolioProject(slug);
    if (!resolved) notFound();

    return resolved.kind === "curated"
        ? <PortfolioProjectDetail project={resolved.project} facts={resolved.facts} />
        : <RepositoryArchiveDetail archive={resolved.project} />;
}
