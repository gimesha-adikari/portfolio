import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getContactOgCard } from "@/lib/portfolio-og-content";

export const alt = "Contact Gimesha Nirmal";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getContactOgCard());
}
