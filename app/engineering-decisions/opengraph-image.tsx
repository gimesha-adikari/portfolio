import { createPortfolioOgImage, portfolioOgImageSize } from "@/lib/portfolio-og";
import { getEngineeringDecisionsOgCard } from "@/lib/portfolio-og-content";

export const alt = "Evidence-backed engineering decisions from Gimesha Nirmal";
export const size = portfolioOgImageSize;
export const contentType = "image/png";

export default function Image() {
    return createPortfolioOgImage(getEngineeringDecisionsOgCard());
}
