import type { MetadataRoute } from "next";
import { fetchAllRepos } from "@/lib/github";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = process.env.SITE_URL || "http://localhost:3000";
    const now = new Date();

    const repos = await fetchAllRepos().catch(() => []);

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
        { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
        { url: `${base}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
        { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
        { url: `${base}/cv`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
        { url: `${base}/case-studies/banking-system`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
        { url: `${base}/case-studies/bank-app`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
        { url: `${base}/case-studies/neurosim`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    ];

    const projectRoutes: MetadataRoute.Sitemap = repos.slice(0, 200).map((r: any) => ({
        url: `${base}/projects/${r.name}`,
        lastModified: new Date(r.updatedAt || r.pushedAt || now),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticRoutes, ...projectRoutes];
}
