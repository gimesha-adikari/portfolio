import assert from "node:assert/strict";
import test from "node:test";

import {
    getAboutOgCard,
    getCaseStudiesOgCard,
    getCaseStudyOgCard,
    getDefaultOgCard,
    getPortfolioProjectOgCard,
    getProjectsOgCard,
} from "../lib/portfolio-og-content.ts";
import { getHomepageFlagshipProjects } from "../lib/homepage-content.ts";
import { getAllPortfolioProjects } from "../lib/portfolio-projects.ts";
import {
    buildNotFoundMetadataWithConfig,
    buildRouteMetadataWithConfig,
} from "../lib/route-metadata-core.ts";

const config = {
    canonicalUrl: "https://www.gimesha.com",
    siteName: "Gimesha Nirmal",
};

test("project OG cards use curated identity and preserve repository boundaries", () => {
    const expected = new Map([
        ["termstead", "Termstead"],
        ["pdfnest", "Platen PDF"],
        ["banking-platform", "Banking Platform"],
        ["polyshop", "PolyShop"],
    ]);

    for (const [slug, title] of expected) {
        const card = getPortfolioProjectOgCard(slug);
        assert.ok(card, `${slug} should have a project card`);
        assert.equal(card.title, title);
        assert.ok(card.description.length > 0);
        assert.ok(card.eyebrow.length > 0);
    }

    assert.equal(getPortfolioProjectOgCard("definitely-unknown"), null);
    assert.equal(getPortfolioProjectOgCard("pdfnest")?.title, "Platen PDF");
    assert.match(getPortfolioProjectOgCard("pdfnest")?.description ?? "", /web workspace|Go API|processing/i);
    assert.doesNotMatch(getPortfolioProjectOgCard("polyshop")?.description ?? "", /production-ready|proven scalable/i);
}
);

test("homepage flagships remain portfolio-owned and PolyShop stays secondary", () => {
    const projects = getAllPortfolioProjects();
    assert.deepEqual(
        getHomepageFlagshipProjects(projects).map((project) => project.slug),
        ["termstead", "pdfnest", "banking-platform"],
    );
    assert.equal(projects.find((project) => project.slug === "polyshop")?.featured, false);
    assert.deepEqual(
        projects.find((project) => project.slug === "pdfnest")?.repositories.map((repository) => repository.name),
        ["pdfnest", "pdfnest-backend", "pdfnest-worker", "platen-document"],
    );
}
);

test("default, listing, and case-study cards use local content", () => {
    assert.equal(getDefaultOgCard().title, "Gimesha Nirmal");
    assert.match(getDefaultOgCard().description, /systems architecture|backend platforms/i);
    assert.match(getProjectsOgCard().description, /portfolio-owned systems/i);
    assert.match(getCaseStudiesOgCard().description, /engineering decisions/i);

    const caseCard = getCaseStudyOgCard("modular-document-platform");
    assert.ok(caseCard);
    assert.equal(caseCard.eyebrow, "Platen PDF case study");
    assert.ok(caseCard.description.length > 0);
    assert.equal(getCaseStudyOgCard("definitely-unknown"), null);
    assert.match(getAboutOgCard().description, /web, mobile, and backend/i);
}
);

test("route metadata uses branded absolute canonical and social image URLs", () => {
    const metadata = buildRouteMetadataWithConfig({
        title: "Termstead",
        description: "A systems project",
        path: "/projects/termstead",
        ogImagePath: "/projects/termstead/opengraph-image",
        type: "article",
    }, config);

    assert.equal(metadata.alternates.canonical, "https://www.gimesha.com/projects/termstead");
    assert.equal(metadata.openGraph.url, "https://www.gimesha.com/projects/termstead");
    assert.equal(metadata.openGraph.title, "Termstead | Gimesha Nirmal");
    assert.equal(metadata.twitter.title, "Termstead | Gimesha Nirmal");
    assert.equal(metadata.openGraph.images[0].url, "https://www.gimesha.com/projects/termstead/opengraph-image");
    assert.equal(metadata.twitter.images[0].url, "https://www.gimesha.com/projects/termstead/opengraph-image");
    assert.doesNotMatch(JSON.stringify(metadata), /localhost|gimesha\.dev/i);
}
);

test("unknown route metadata is noindex and has no misleading social image", () => {
    const metadata = buildNotFoundMetadataWithConfig({
        label: "Project",
        path: "/projects/definitely-unknown",
    }, config);

    assert.equal(metadata.title, "Project not found");
    assert.deepEqual(metadata.robots, { index: false, follow: false });
    assert.deepEqual(metadata.openGraph.images, []);
    assert.deepEqual(metadata.twitter.images, []);
});
