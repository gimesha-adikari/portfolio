import { notFound } from "next/navigation";
import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getCaseStudyOgCard } from "@/lib/portfolio-og-content";
import { getAllCaseStudies } from "@/lib/case-studies";

export const alt = "Gimesha Nirmal engineering case study";
export const size = portfolioOgImageSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
    return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const card = getCaseStudyOgCard(slug);
    if (!card) notFound();

    return createPortfolioOgImage(card);
}
