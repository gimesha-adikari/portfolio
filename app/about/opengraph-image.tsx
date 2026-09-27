import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getAboutOgCard } from "@/lib/portfolio-og-content";

export const alt = "About Gimesha Nirmal";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getAboutOgCard());
}
