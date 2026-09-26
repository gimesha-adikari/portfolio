import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getFeaturedPortfolioProjects, getPortfolioProjectBySlug } from "../lib/portfolio-projects.ts";
import { validateProjectTechnicalEvidence } from "../lib/project-evidence.ts";

const platenPdf = getPortfolioProjectBySlug("pdfnest");

test("Platen PDF has a verified multi-service technical evidence record", () => {
    assert.ok(platenPdf);
    assert.equal(platenPdf.title, "Platen PDF");
    assert.equal(platenPdf.slug, "pdfnest");
    assert.ok(platenPdf.technicalEvidence);

    const evidence = platenPdf.technicalEvidence;
    assert.deepEqual(
        evidence.ownership.map((item) => item.owner),
        ["pdfnest web application", "pdfnest-backend", "pdfnest-worker", "platen-document SDK"],
    );
    assert.ok(evidence.workflows?.some((workflow) => workflow.mode === "sync"));
    assert.ok(evidence.workflows?.some((workflow) => workflow.mode === "async"));
    assert.ok(evidence.workflows?.some((workflow) => workflow.mode === "preview"));
    assert.ok(evidence.fileLifecycles?.length);
    assert.ok(evidence.processingPaths?.some((path) => /native|scanned|OCR/i.test(path.title)));
    assert.ok(evidence.failureBoundaries?.length);
    assert.ok(evidence.debuggingStories.length);
});

test("Platen PDF keeps repository roles and the standalone SDK boundary explicit", () => {
    assert.ok(platenPdf);
    assert.deepEqual(
        platenPdf.repositories.map((repository) => repository.name),
        ["pdfnest", "pdfnest-backend", "pdfnest-worker", "platen-document"],
    );
    assert.match(platenPdf.repositories.at(-1)?.role ?? "", /standalone|related/i);
    assert.match(JSON.stringify(platenPdf.technicalEvidence).toLowerCase(), /does not own|without.*redis|standalone/);
});

test("Platen PDF evidence does not publish unsupported performance or production claims", () => {
    assert.ok(platenPdf?.technicalEvidence);
    const serialized = JSON.stringify(platenPdf.technicalEvidence);

    assert.doesNotMatch(serialized, /production-ready|production ready|proven scalability|high-performance/i);
    assert.ok(platenPdf.technicalEvidence.measurements.some((item) => item.classification === "NOT TESTED"));
    assert.ok(platenPdf.technicalEvidence.measurements.some((item) => /no .*quantitative|no .*throughput|no .*benchmark/i.test(`${item.result} ${item.limitations.join(" ")}`)));
});

test("Platen PDF evidence remains protected by the workflow runtime validator", () => {
    assert.ok(platenPdf?.technicalEvidence);
    const malformed = JSON.parse(JSON.stringify(platenPdf.technicalEvidence));
    malformed.workflows[0].mode = "batch";

    assert.throws(
        () => validateProjectTechnicalEvidence(malformed),
        /supported workflow mode/,
    );
});

test("Platen PDF is one featured system and Termstead remains first", () => {
    const featured = getFeaturedPortfolioProjects();

    assert.equal(featured[0]?.slug, "termstead");
    assert.equal(featured.filter((project) => project.slug === "pdfnest").length, 1);
    assert.equal(featured.filter((project) => project.slug === "polyshop").length, 0);
});

test("Platen PDF detail rendering exposes the reusable Phase 6 evidence blocks", () => {
    const detail = readFileSync("components/PortfolioProjectTechnicalEvidence.tsx", "utf8");

    for (const component of [
        "ProjectArchitectureDiagram",
        "ProjectWorkflowMatrix",
        "ProjectLifecycleSequence",
        "ProjectDecisionCards",
        "ProjectEvidenceTable",
        "ProjectProcessingPaths",
        "ProjectFailureBoundaries",
        "ProjectDebuggingStory",
        "ProjectLimitations",
        "ProjectSourceLinks",
    ]) {
        assert.match(detail, new RegExp(component));
    }
});

test("Platen PDF case-study copy avoids the unsupported performance headline", () => {
    const pipelineStudy = readFileSync("content/case-studies/high-performance-file-processing.yml", "utf8");
    const platformStudy = readFileSync("content/case-studies/modular-document-platform.yml", "utf8");

    assert.doesNotMatch(pipelineStudy, /Building a High-Performance PDF Processing Pipeline/);
    assert.doesNotMatch(platformStudy, /scalable as new tools were added/i);
});
