import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getDefaultOgCard } from "@/lib/portfolio-og-content";

export const alt = "Gimesha Nirmal engineering portfolio";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getDefaultOgCard());
}
