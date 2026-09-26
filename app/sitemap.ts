import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/case-studies";
import { getAllPortfolioProjects } from "@/lib/portfolio-projects";
import { siteConfig } from "@/lib/siteConfig";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = siteConfig.canonicalUrl;
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}${siteConfig.cvPath}`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ];

    const caseStudyRoutes: MetadataRoute.Sitemap = getAllCaseStudies().map((caseStudy) => ({
        url: `${base}/case-studies/${caseStudy.slug}`,
        lastModified: now,
        changeFrequency: "yearly" as const,
        priority: 0.6,
    }));

    const projectRoutes: MetadataRoute.Sitemap = getAllPortfolioProjects().map((project) => ({
        url: `${base}/projects/${project.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: project.featured ? 0.8 : 0.5,
    }));

    return [...staticRoutes, ...projectRoutes, ...caseStudyRoutes];
}
