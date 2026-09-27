import test from "node:test";
import assert from "node:assert/strict";
import { getAllCaseStudies } from "../lib/case-studies.ts";
import { getAllPortfolioProjects, getPortfolioProjectBySlug } from "../lib/portfolio-projects.ts";
import {
    getHomepageCaseStudies,
    getHomepageEngineeringEvidence,
    getHomepageFlagshipProjects,
} from "../lib/homepage-content.ts";

test("homepage flagship selection is curated and keeps grouped systems singular", () => {
    const projects = getHomepageFlagshipProjects(getAllPortfolioProjects());
    const slugs = projects.map((project) => project.slug);
    const platenPdf = projects.filter((project) => project.slug === "pdfnest");

    assert.deepEqual(slugs, ["termstead", "pdfnest", "banking-platform"]);
    assert.equal(new Set(slugs).size, slugs.length);
    assert.equal(platenPdf.length, 1);
    assert.equal(projects.filter((project) => project.title === "Platen PDF").length, 1);
    assert.equal(platenPdf[0]?.title, "Platen PDF");
    assert.equal(platenPdf[0]?.slug, "pdfnest");
    assert.equal(platenPdf[0]?.liveUrl, "https://platenpdf.com");
    assert.deepEqual(
        platenPdf[0]?.repositories.map((repository) => repository.name),
        ["pdfnest", "pdfnest-backend", "pdfnest-worker", "platen-document"],
    );
    assert.match(platenPdf[0]?.repositories[3]?.role ?? "", /standalone local-first/i);
    assert.equal(projects.filter((project) => project.slug === "banking-platform").length, 1);
    assert.equal(projects.some((project) => project.slug === "polyshop"), false);

    const polyshop = getPortfolioProjectBySlug("polyshop");
    assert.equal(polyshop?.featured, false);
    assert.equal(polyshop?.status, "experimental");
});

test("homepage engineering evidence is derived from curated project records", () => {
    const evidence = getHomepageEngineeringEvidence(getAllPortfolioProjects());

    assert.deepEqual(
        evidence.map((item) => item.projectSlug),
        ["termstead", "pdfnest", "banking-platform"],
    );
    for (const item of evidence) {
        assert.ok(item.boundary.length > 0);
        assert.ok(item.responsibility.length > 0);
        assert.ok(item.decision.length > 0);
        assert.equal(item.href, `/projects/${item.projectSlug}`);
    }
});

test("homepage case studies have unique curated project associations", () => {
    const studies = getHomepageCaseStudies(getAllCaseStudies(), getAllPortfolioProjects());

    assert.deepEqual(
        studies.map((item) => item.study.slug),
        ["modular-document-platform", "pdf-edge-case-handling", "modular-kyc-architecture"],
    );
    assert.equal(new Set(studies.map((item) => item.study.slug)).size, studies.length);
    assert.deepEqual(
        studies.map((item) => item.project.slug),
        ["pdfnest", "pdfnest", "banking-platform"],
    );
    assert.ok(studies
        .filter((item) => item.project.slug === "pdfnest")
        .every((item) => item.project.title === "Platen PDF"));
    assert.ok(getAllCaseStudies()
        .filter((study) => ["modular-document-platform", "pdf-edge-case-handling"].includes(study.slug))
        .every((study) => study.context.includes("Platen PDF")));
});
