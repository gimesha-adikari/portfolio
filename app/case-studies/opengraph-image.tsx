import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getCaseStudiesOgCard } from "@/lib/portfolio-og-content";

export const alt = "Engineering case studies from Gimesha Nirmal";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getCaseStudiesOgCard());
}
