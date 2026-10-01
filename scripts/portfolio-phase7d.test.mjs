import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import { fetchAllRepos } from "../lib/github.ts";
import { getHomepageCaseStudies, getHomepageFlagshipProjects } from "../lib/homepage-content.ts";
import { filterArchiveRepositories, buildProjectFilterParams, parseProjectFilterParams } from "../lib/project-filters.ts";
import {
    getAllCaseStudies,
    getCaseStudyBySlug,
} from "../lib/case-studies.ts";
import {
    getAllPortfolioProjects,
    getPortfolioProjectBySlug,
} from "../lib/portfolio-projects.ts";
import { fetchPortfolioRepositoryFacts } from "../lib/portfolio-repository-facts.ts";
import { resolveProject } from "../lib/portfolio-resolver-core.ts";
import {
    buildNotFoundMetadataWithConfig,
    buildRouteMetadataWithConfig,
} from "../lib/route-metadata-core.ts";
import { siteConfig } from "../lib/siteConfig.ts";

const root = process.cwd();
const metadataConfig = {
    canonicalUrl: siteConfig.canonicalUrl,
    siteName: siteConfig.siteName,
};

async function source(relativePath) {
    return readFile(join(root, relativePath), "utf8");
}

function routeInventory() {
    const projects = getAllPortfolioProjects();
    const studies = getAllCaseStudies();
    const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
    const caseStudyRoutes = studies.map((study) => `/case-studies/${study.slug}`);

    return new Set([
        "/",
        "/projects",
        "/case-studies",
        "/about",
        "/contact",
        siteConfig.cvPath,
        "/api/vcard",
        "/sitemap.xml",
        "/robots.txt",
        ...projectRoutes,
        ...caseStudyRoutes,
    ]);
}

test("the canonical route inventory comes from curated and validated content", () => {
    const projects = getAllPortfolioProjects();
    const studies = getAllCaseStudies();
    const routes = routeInventory();

    for (const project of projects) {
        assert.equal(getPortfolioProjectBySlug(project.slug)?.slug, project.slug);
        assert.ok(routes.has(`/projects/${project.slug}`));
    }
    for (const study of studies) {
        assert.equal(getCaseStudyBySlug(study.slug)?.slug, study.slug);
        assert.ok(routes.has(`/case-studies/${study.slug}`));
    }

    assert.ok(routes.has("/"));
    assert.ok(routes.has("/projects"));
    assert.ok(routes.has("/case-studies"));
    assert.ok(routes.has("/about"));
    assert.ok(routes.has("/contact"));
    assert.ok(routes.has("/sitemap.xml"));
    assert.ok(routes.has("/robots.txt"));
});

test("curated project identity and flagship ordering remain stable", () => {
    const projects = getAllPortfolioProjects();
    const flagships = getHomepageFlagshipProjects(projects);

    assert.deepEqual(
        flagships.map((project) => project.slug),
        ["termstead", "pdfnest", "banking-platform"],
    );
    assert.equal(getPortfolioProjectBySlug("termstead")?.title, "Termstead");
    assert.equal(getPortfolioProjectBySlug("pdfnest")?.title, "Platen PDF");
    assert.equal(getPortfolioProjectBySlug("pdfnest")?.slug, "pdfnest");
    assert.equal(getPortfolioProjectBySlug("banking-platform")?.title, "Banking Platform");
    assert.equal(getPortfolioProjectBySlug("polyshop")?.featured, false);
    assert.equal(
        getPortfolioProjectBySlug("pdfnest")?.repositories.map((repository) => repository.name).join(","),
        "pdfnest,pdfnest-backend,pdfnest-worker,platen-document",
    );
    assert.equal(
        getPortfolioProjectBySlug("banking-platform")?.repositories.map((repository) => repository.name).join(","),
        "BankingSystem,bank-web,banking-service,BankApp",
    );
    assert.equal(getPortfolioProjectBySlug("definitely-unknown"), undefined);
});

test("every curated project slug resolves before archive fallback", async () => {
    for (const project of getAllPortfolioProjects()) {
        const resolved = await resolveProject(project.slug, {
            getCuratedProject: getPortfolioProjectBySlug,
            getCuratedFacts: async () => [],
            getArchiveProject: async () => null,
        });

        assert.equal(resolved?.kind, "curated");
        assert.equal(resolved?.project.slug, project.slug);
    }
});

test("validated case studies retain their project associations and detail routes", () => {
    const projects = getAllPortfolioProjects();
    const studies = getAllCaseStudies();
    const expectedAssociations = new Map([
        ["modular-document-platform", "pdfnest"],
        ["pdf-edge-case-handling", "pdfnest"],
        ["ocr-document-extraction", "pdfnest"],
        ["modular-kyc-architecture", "banking-platform"],
        ["resilient-mobile-payments", "banking-platform"],
    ]);

    for (const [studySlug, projectSlug] of expectedAssociations) {
        assert.ok(studies.some((study) => study.slug === studySlug));
        assert.ok(getPortfolioProjectBySlug(projectSlug)?.caseStudies?.includes(studySlug));
        assert.ok(getCaseStudyBySlug(studySlug));
    }

    const homepageStudies = getHomepageCaseStudies(studies, projects);
    assert.deepEqual(
        homepageStudies.map(({ study }) => study.slug),
        ["modular-document-platform", "pdf-edge-case-handling", "modular-kyc-architecture"],
    );
    assert.equal(getCaseStudyBySlug("definitely-unknown"), null);
});

test("curated internal links resolve against the route inventory", async () => {
    const routes = routeInventory();
    const sourceFiles = [
        "app/about/page.tsx",
        "app/case-studies/page.tsx",
        "app/case-studies/[slug]/page.tsx",
        "app/contact/page.tsx",
        "app/not-found.tsx",
        "app/page.tsx",
        "app/projects/page.tsx",
        "components/Footer.tsx",
        "components/Header.tsx",
        "components/HomepageCaseStudies.tsx",
        "components/HomepageHero.tsx",
        "components/PortfolioProjectCard.tsx",
        "components/PortfolioProjectDetail.tsx",
        "components/PortfolioProjectHero.tsx",
        "components/RepositoryArchiveDetail.tsx",
        "lib/navItems.ts",
    ];

    for (const relativePath of sourceFiles) {
        const contents = await source(relativePath);
        const pattern = /(?:href|url)\s*=\s*(?:\{)?["'`](\/[^"'`}\s?#]+)(?:[?#][^"'`}\s]*)?["'`]/g;
        for (const match of contents.matchAll(pattern)) {
            const target = match[1];
            assert.ok(routes.has(target), `${relativePath} contains unknown internal path ${target}`);
        }
    }

    const projects = getAllPortfolioProjects();
    for (const project of projects) {
        for (const caseStudySlug of project.caseStudies ?? []) {
            assert.ok(routes.has(`/case-studies/${caseStudySlug}`));
        }
    }
    for (const study of getAllCaseStudies()) {
        for (const link of study.links.filter((item) => !item.is_external)) {
            assert.ok(routes.has(link.url), `${study.slug} contains unknown internal path ${link.url}`);
        }
    }

    assert.equal(siteConfig.cvPath, "/cv.pdf");
});

test("publishable identity and metadata stay on the canonical .com domain", async () => {
    assert.equal(siteConfig.canonicalUrl, "https://www.gimesha.com");
    assert.doesNotMatch(JSON.stringify(siteConfig), /localhost|gimesha\.dev/i);

    const [layout, sitemap, robots] = await Promise.all([
        source("app/layout.tsx"),
        source("app/sitemap.ts"),
        source("app/robots.ts"),
    ]);
    for (const contents of [layout, sitemap, robots]) {
        assert.doesNotMatch(contents, /gimesha\.dev/i);
        assert.doesNotMatch(contents, /localhost/i);
    }
    assert.match(robots, /siteConfig\.canonicalUrl.*sitemap\.xml/s);
    assert.doesNotMatch(`${layout}\n${sitemap}\n${robots}`, /["'`]\/cv["'`]/);
});

test("curated project and case-study metadata matches stable route identity", () => {
    for (const project of getAllPortfolioProjects()) {
        const path = `/projects/${project.slug}`;
        const imagePath = `${path}/opengraph-image`;
        const metadata = buildRouteMetadataWithConfig({
            title: project.title,
            description: project.tagline,
            path,
            ogImagePath: imagePath,
        }, metadataConfig);
        const canonical = `${siteConfig.canonicalUrl}${path}`;

        assert.equal(metadata.alternates.canonical, canonical);
        assert.equal(metadata.openGraph.url, canonical);
        assert.equal(metadata.openGraph.images[0].url, `${siteConfig.canonicalUrl}${imagePath}`);
        assert.equal(metadata.twitter.images[0].url, `${siteConfig.canonicalUrl}${imagePath}`);
        assert.equal(metadata.title, project.title);
        assert.equal(metadata.description, project.tagline);
        assert.doesNotMatch(JSON.stringify(metadata), /localhost|gimesha\.dev/i);
    }

    for (const study of getAllCaseStudies()) {
        const path = `/case-studies/${study.slug}`;
        const imagePath = `${path}/opengraph-image`;
        const description = study.tldr || study.blurb || study.subtitle;
        const metadata = buildRouteMetadataWithConfig({
            title: study.title,
            description,
            path,
            ogImagePath: imagePath,
        }, metadataConfig);
        const canonical = `${siteConfig.canonicalUrl}${path}`;

        assert.equal(metadata.alternates.canonical, canonical);
        assert.equal(metadata.openGraph.url, canonical);
        assert.equal(metadata.openGraph.images[0].url, `${siteConfig.canonicalUrl}${imagePath}`);
        assert.equal(metadata.twitter.images[0].url, `${siteConfig.canonicalUrl}${imagePath}`);
        assert.equal(metadata.title, study.title);
        assert.equal(metadata.description, description);
    }
});

test("unknown route metadata is noindex and image-free", async () => {
    assert.match(await source("app/not-found.tsx"), /dynamic\s*=\s*["']force-dynamic["']/);

    for (const [label, path] of [
        ["Project", "/projects/definitely-unknown"],
        ["Case study", "/case-studies/definitely-unknown"],
    ]) {
        const metadata = buildNotFoundMetadataWithConfig({ label, path }, metadataConfig);
        assert.deepEqual(metadata.robots, { index: false, follow: false });
        assert.deepEqual(metadata.openGraph.images, []);
        assert.deepEqual(metadata.twitter.images, []);
    }
});

test("sitemap and robots sources use the current page inventory only", async () => {
    const sitemap = await source("app/sitemap.ts");
    const robots = await source("app/robots.ts");
    const routes = routeInventory();
    const expectedPageRoutes = [
        "/",
        "/projects",
        "/case-studies",
        "/about",
        "/contact",
        siteConfig.cvPath,
        ...getAllPortfolioProjects().map((project) => `/projects/${project.slug}`),
        ...getAllCaseStudies().map((study) => `/case-studies/${study.slug}`),
    ];

    assert.match(sitemap, /getAllPortfolioProjects/);
    assert.match(sitemap, /getAllCaseStudies/);
    assert.match(sitemap, /siteConfig\.canonicalUrl/);
    assert.doesNotMatch(sitemap, /fetchAllRepos|GITHUB_USERNAME|opengraph-image/);
    assert.doesNotMatch(sitemap, /["'`]\/cv["'`]/);
    assert.doesNotMatch(sitemap, /ai-verification|banking-platform\/ai|\/tools/);
    for (const route of expectedPageRoutes) assert.ok(routes.has(route));

    assert.match(robots, /siteConfig\.canonicalUrl/);
    assert.match(robots, /sitemap\.xml/);
    assert.doesNotMatch(robots, /gimesha\.dev|localhost/i);
});

test("all metadata image conventions are represented without adding image URLs to the sitemap", async () => {
    const expectedFiles = [
        "app/opengraph-image.tsx",
        "app/projects/opengraph-image.tsx",
        "app/projects/[slug]/opengraph-image.tsx",
        "app/case-studies/opengraph-image.tsx",
        "app/case-studies/[slug]/opengraph-image.tsx",
        "app/about/opengraph-image.tsx",
        "app/contact/opengraph-image.tsx",
    ];
    for (const file of expectedFiles) assert.ok(existsSync(join(root, file)), `${file} should exist`);
    assert.doesNotMatch(await source("app/sitemap.ts"), /opengraph-image/);
});

test("GitHub failure remains optional for curated identity and repository facts", async () => {
    const previousUsername = process.env.GITHUB_USERNAME;
    const previousFetch = globalThis.fetch;
    process.env.GITHUB_USERNAME = "gimesha-adikari";
    globalThis.fetch = async () => {
        throw new Error("GitHub unavailable");
    };

    try {
        assert.deepEqual(await fetchAllRepos(), []);

        const project = getPortfolioProjectBySlug("termstead");
        assert.ok(project);
        assert.deepEqual(
            await fetchPortfolioRepositoryFacts(project, async () => {
                throw new Error("GitHub unavailable");
            }),
            [],
        );
        assert.deepEqual(
            getHomepageFlagshipProjects(getAllPortfolioProjects()).map((item) => item.title),
            ["Termstead", "Platen PDF", "Banking Platform"],
        );
    } finally {
        globalThis.fetch = previousFetch;
        if (previousUsername === undefined) delete process.env.GITHUB_USERNAME;
        else process.env.GITHUB_USERNAME = previousUsername;
    }
});

test("archive filtering matches current Labs semantics and supports reset", () => {
    const repos = [
        { name: "Document Worker", description: "Go processing service", language: "Go" },
        { name: "React Notes", description: "A small web notebook", language: "TypeScript" },
        { name: "No Language", description: null, language: null },
    ];

    assert.equal(filterArchiveRepositories(repos, { q: "", lang: "" }).length, 3);
    assert.deepEqual(
        filterArchiveRepositories(repos, { q: "WORKER", lang: "" }).map((repo) => repo.name),
        ["Document Worker"],
    );
    assert.deepEqual(
        filterArchiveRepositories(repos, { q: "", lang: "TypeScript" }).map((repo) => repo.name),
        ["React Notes"],
    );
    assert.deepEqual(
        filterArchiveRepositories(repos, { q: "web", lang: "TypeScript" }).map((repo) => repo.name),
        ["React Notes"],
    );
    assert.deepEqual(filterArchiveRepositories(repos, { q: "missing", lang: "" }), []);

    const current = new globalThis.URLSearchParams("page=2&q=old&lang=Go&sort=stars");
    const reset = buildProjectFilterParams(current, { q: "", lang: "", sort: "recent" });
    assert.equal(reset.toString(), "page=2");
    assert.deepEqual(parseProjectFilterParams(reset), { q: "", lang: "", sort: "recent" });
});

test("navigation and motion smoke invariants remain source-backed", async () => {
    const [layout, mobile, filters, skipLink, reveal, globals] = await Promise.all([
        source("app/layout.tsx"),
        source("components/MobileNavigation.tsx"),
        source("components/ProjectsFilters.tsx"),
        source("components/SkipLink.tsx"),
        source("components/Reveal.tsx"),
        source("app/globals.css"),
    ]);

    assert.match(layout, /<SkipLink\s*\/>/);
    assert.match(layout, /<main\s+id="content"/);
    assert.match(skipLink, /href=\{href\}/);
    assert.match(skipLink, /#content/);
    assert.match(mobile, /aria-expanded=\{open\}/);
    assert.match(mobile, /aria-controls=\{drawerId\}/);
    assert.match(mobile, /role="dialog"/);
    assert.match(mobile, /aria-modal="true"/);
    assert.match(mobile, /event\.key === "Escape"/);
    assert.match(mobile, /triggerRef\.current\?\.focus/);
    assert.match(mobile, /document\.body\.style\.overflow/);
    assert.doesNotMatch(mobile, /data-overlay|data-collapse/);
    assert.doesNotMatch(filters, /\btypingTimer\b|defaultValue|>Apply</i);
    assert.match(filters, /setTimeout/);
    assert.match(filters, /clearTimeout/);
    assert.match(reveal, /useReducedMotion/);
    assert.match(globals, /prefers-reduced-motion/);
});

test("project and case-study cards preserve visible labels in their accessible names", async () => {
    const [projectCard, caseStudyCards] = await Promise.all([
        source("components/PortfolioProjectCard.tsx"),
        source("components/HomepageCaseStudies.tsx"),
    ]);

    assert.doesNotMatch(projectCard, /aria-label=\{`Open details for/);
    assert.doesNotMatch(caseStudyCards, /aria-label=\{`Read \$\{study\.title\}/);
});

test("new-tab links keep rel safety and validated content rejects dangerous protocols", async () => {
    const sourceFiles = [
        "app/about/page.tsx",
        "app/case-studies/[slug]/page.tsx",
        "app/page.tsx",
        "components/ContactCards.tsx",
        "components/Footer.tsx",
        "components/HomepageHero.tsx",
        "components/PortfolioProjectHero.tsx",
        "components/ProjectCodeExcerpts.tsx",
        "components/ProjectEvidenceTable.tsx",
        "components/ProjectSourceLinks.tsx",
        "components/RepositoryArchiveDetail.tsx",
    ];
    for (const relativePath of sourceFiles) {
        const contents = await source(relativePath);
        for (const match of contents.matchAll(/<[^>]*target="_blank"[^>]*>/gs)) {
            assert.match(match[0], /rel=/, `${relativePath} has an unsafe new-tab link`);
        }
    }

    for (const study of getAllCaseStudies()) {
        for (const link of study.links) {
            assert.doesNotMatch(link.url, /^(?:javascript|data):/i);
        }
    }
});
