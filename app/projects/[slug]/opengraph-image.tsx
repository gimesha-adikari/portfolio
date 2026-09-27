import { notFound } from "next/navigation";
import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getPortfolioProjectOgCard } from "@/lib/portfolio-og-content";
import { getAllPortfolioProjects } from "@/lib/portfolio-projects";

export const alt = "Gimesha Nirmal portfolio project";
export const size = portfolioOgImageSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
    return getAllPortfolioProjects().map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const card = getPortfolioProjectOgCard(slug);
    if (!card) notFound();

    return createPortfolioOgImage(card);
}
