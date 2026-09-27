import { notFound } from "next/navigation";
import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getEngineeringNoteOgCard } from "@/lib/portfolio-og-content";
import { getPublishedEngineeringNotes } from "@/lib/engineering-notes";

export const alt = "Gimesha Nirmal engineering note";
export const size = portfolioOgImageSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
    return getPublishedEngineeringNotes().map((note) => ({ slug: note.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const card = getEngineeringNoteOgCard(slug);
    if (!card) notFound();

    return createPortfolioOgImage(card);
}
