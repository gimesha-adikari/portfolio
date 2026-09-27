import assert from "node:assert/strict";
import test from "node:test";

import {
    getCaseStudyBySlug,
    getAllCaseStudies,
    validateCaseStudy,
} from "../lib/case-studies.ts";
import { parseAboutData } from "../lib/about-content.ts";
import { parseCaseIndex } from "../lib/content.ts";
import {
    getPortfolioProjectBySlug,
} from "../lib/portfolio-projects.ts";
import { resolveProject } from "../lib/portfolio-resolver-core.ts";
import { buildRouteMetadataWithConfig } from "../lib/route-metadata-core.ts";

function archiveProject(name, isPublic = true) {
    return {
        repository: {
            name,
            fullName: `gimesha-adikari/${name}`,
            description: null,
            htmlUrl: `https://github.com/gimesha-adikari/${name}`,
            isPublic,
            archived: false,
            homepage: null,
            stars: 0,
            forks: 0,
            license: null,
            createdAt: "2025-01-01T00:00:00Z",
            updatedAt: "2025-01-01T00:00:00Z",
            defaultBranch: "main",
            topics: [],
        },
        story: null,
        languages: [],
        stack: [],
        cover: "https://opengraph.githubassets.com/1/gimesha-adikari/example",
        overviewBlocks: [],
        problemBlocks: [],
        solutionBlocks: [],
        totalLanguagePct: 0,
    };
}

function dependencies(overrides = {}) {
    return {
        getCuratedProject: (slug) => getPortfolioProjectBySlug(slug),
        getCuratedFacts: async () => [],
        getArchiveProject: async () => null,
        ...overrides,
    };
}

test("resolver returns curated Termstead, Platen PDF, and Banking Platform records first", async () => {
    for (const slug of ["termstead", "pdfnest", "banking-platform"]) {
        const result = await resolveProject(slug, dependencies());
        assert.equal(result?.kind, "curated");
        assert.equal(result?.project.slug, slug);
    }
});

test("resolver returns a known public archive entry and never a private entry", async () => {
    const publicResult = await resolveProject(
        "i-shop",
        dependencies({ getArchiveProject: async () => archiveProject("i-shop") }),
    );
    assert.equal(publicResult?.kind, "archive");

    const privateResult = await resolveProject(
        "private-repo",
        dependencies({ getArchiveProject: async () => archiveProject("private-repo", false) }),
    );
    assert.equal(privateResult, null);
});

test("resolver returns null for unknown slugs and preserves curated identity on GitHub failure", async () => {
    assert.equal(await resolveProject("definitely-unknown", dependencies()), null);

    const result = await resolveProject(
        "termstead",
        dependencies({ getCuratedFacts: async () => { throw new Error("GitHub unavailable"); } }),
    );
    assert.equal(result?.kind, "curated");
    assert.equal(result?.project.title, "Termstead");
    assert.deepEqual(result?.facts, []);
});

test("archive data cannot override a curated project identity", async () => {
    const result = await resolveProject(
        "pdfnest",
        dependencies({ getArchiveProject: async () => archiveProject("pdfnest") }),
    );
    assert.equal(result?.kind, "curated");
    assert.equal(result?.project.title, "Platen PDF");
});

test("case-study YAML files validate and unknown slugs do not load", () => {
    const cases = getAllCaseStudies();
    assert.equal(cases.length, 8);
    assert.ok(cases.every((item) => item.title && Number.isInteger(item.order)));
    assert.ok(cases.every((item) => item.links.every((link) => link.url.trim().length > 0)));
    assert.equal(getCaseStudyBySlug("definitely-unknown"), null);
});

test("case-study validator filters empty links and rejects unsafe URLs", () => {
    const base = {
        order: 1,
        title: "Validation example",
        blurb: "A valid example",
        read_time: "1 min",
        main_icon: "icon-[tabler--file]",
        tags: ["Testing"],
        subtitle: "TypeScript",
        tldr: "A short summary",
        context: "A context",
        problem: ["A problem"],
        architecture: ["An architecture decision"],
        stack: [{ name: "TypeScript", icon: "icon-[tabler--brand-typescript]" }],
        challenges: ["A challenge"],
        results: ["A result"],
        next_steps: ["A next step"],
        links: [{ label: "Empty", url: "", icon: "icon-[tabler--link]", is_external: false }],
    };

    assert.deepEqual(validateCaseStudy(base, "validation-example").links, []);
    assert.throws(
        () => validateCaseStudy({ ...base, links: [{ ...base.links[0], url: "javascript:alert(1)" }] }, "validation-example"),
        /links.*url/i,
    );
    assert.throws(
        () => validateCaseStudy({ ...base, order: 1.5 }, "validation-example"),
        /order/i,
    );
});

test("legacy remote case indexes keep only validated entries", () => {
    const parsed = parseCaseIndex(JSON.stringify([
        { slug: "valid-case", title: "Valid case", description: "A description" },
        { slug: "missing-title" },
        { slug: "", title: "Empty slug" },
        { slug: "wrong-description", title: "Wrong description", description: 42 },
        "not an item",
    ]));

    assert.deepEqual(parsed, [
        { slug: "valid-case", title: "Valid case", description: "A description" },
    ]);
    assert.deepEqual(parseCaseIndex("not json"), []);
});

test("about YAML normalization keeps typed sections and ignores malformed entries", () => {
    const parsed = parseAboutData({
        name: "Gimesha Nirmal",
        badges: [
            { label: "Backend", icon: "icon-[tabler--server]" },
            { label: "Missing icon" },
        ],
        working_style: [
            { title: "Clear", desc: "Useful boundaries" },
            { title: "Missing description" },
        ],
        selected_work: [
            { title: "Platen PDF", description: "Documents", link: "/projects/pdfnest" },
            { title: "Missing description", link: 42 },
        ],
        certifications: [{ title: "CS50x", issuer: "HarvardX" }],
    });

    assert.equal(parsed.name, "Gimesha Nirmal");
    assert.deepEqual(parsed.badges, [{ label: "Backend", icon: "icon-[tabler--server]" }]);
    assert.deepEqual(parsed.working_style, [{ title: "Clear", desc: "Useful boundaries" }]);
    assert.deepEqual(parsed.selected_work, [{
        title: "Platen PDF",
        description: "Documents",
        link: "/projects/pdfnest",
    }]);
    assert.deepEqual(parsed.certifications, [{ title: "CS50x", issuer: "HarvardX" }]);
    assert.deepEqual(parseAboutData(null), {});
});

test("route metadata uses the canonical domain for projects and case studies", () => {
    const config = { canonicalUrl: "https://www.gimesha.com", siteName: "Gimesha Nirmal" };
    const projectMetadata = buildRouteMetadataWithConfig({
        title: "Termstead",
        description: "A systems project",
        path: "/projects/termstead",
        ogImagePath: "/projects/termstead/opengraph-image",
    }, config);
    const caseMetadata = buildRouteMetadataWithConfig({
        title: "Modular Document Platform",
        description: "A case study",
        path: "/case-studies/modular-document-platform",
        ogImagePath: "/case-studies/modular-document-platform/opengraph-image",
    }, config);

    assert.equal(projectMetadata.alternates.canonical, "https://www.gimesha.com/projects/termstead");
    assert.equal(caseMetadata.alternates.canonical, "https://www.gimesha.com/case-studies/modular-document-platform");
    assert.equal(projectMetadata.title, "Termstead");
    assert.equal(caseMetadata.title, "Modular Document Platform");
    assert.equal(projectMetadata.openGraph.images[0].url, "https://www.gimesha.com/projects/termstead/opengraph-image");
    assert.equal(caseMetadata.twitter.images[0].url, "https://www.gimesha.com/case-studies/modular-document-platform/opengraph-image");
    assert.ok(!JSON.stringify({ projectMetadata, caseMetadata }).match(/localhost|gimesha\.dev/i));
});
