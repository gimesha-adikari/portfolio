import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getProjectsOgCard } from "@/lib/portfolio-og-content";

export const alt = "Selected systems and repository archive from Gimesha Nirmal";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getProjectsOgCard());
}
