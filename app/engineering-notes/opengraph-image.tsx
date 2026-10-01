import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getEngineeringNotesOgCard } from "@/lib/portfolio-og-content";

export const alt = "Gimesha Nirmal engineering notes";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getEngineeringNotesOgCard());
}
