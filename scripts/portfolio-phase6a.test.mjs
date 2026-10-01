import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
    getAllPortfolioProjects,
    getFeaturedPortfolioProjects,
    getPortfolioProjectBySlug,
} from "../lib/portfolio-projects.ts";

const termstead = getPortfolioProjectBySlug("termstead");

test("Termstead has a typed evidence record with explicit ownership boundaries", () => {
    assert.ok(termstead);
    assert.ok(termstead.technicalEvidence);
    assert.deepEqual(
        termstead.technicalEvidence.ownership.map((item) => item.boundary),
        ["Daemon and session authority", "GUI shell and workspace", "IPC and renderer"],
    );
    assert.ok(termstead.technicalEvidence.ownership.every((item) => item.sources.length > 0));
});

test("Termstead evidence keeps classifications and methodology metadata attached", () => {
    assert.ok(termstead?.technicalEvidence);
    const evidence = termstead.technicalEvidence;

    assert.ok(evidence.sources.every((source) => /^https:\/\//.test(source.url)));
    assert.ok(evidence.sources.every((source) => /^[0-9a-f]{40}$/.test(source.commit)));
    assert.ok(evidence.measurements.length > 0);
    assert.ok(evidence.measurements.every((measurement) => measurement.method.length > 0));
    assert.ok(evidence.measurements.every((measurement) => measurement.environment.length > 0));
    assert.ok(evidence.measurements.every((measurement) => measurement.limitations.length > 0));
    assert.ok(evidence.measurements.some((measurement) => measurement.classification === "MEASURED"));
    assert.ok(evidence.measurements.some((measurement) => measurement.classification === "ACCEPTED"));
    const classifications = new Set([
        ...evidence.ownership.map((item) => item.classification),
        ...evidence.ipc.map((item) => item.classification),
        ...evidence.lifecycle.map((item) => item.classification),
        ...evidence.decisions.map((item) => item.classification),
        ...evidence.measurements.map((item) => item.classification),
        ...evidence.debuggingStories.map((item) => item.classification),
    ]);
    for (const expected of ["IMPLEMENTED", "MEASURED", "ACCEPTED", "DESIGNED / PLANNED", "DEFERRED", "NOT TESTED", "ENVIRONMENT-LIMITED"]) {
        assert.ok(classifications.has(expected), `missing evidence classification: ${expected}`);
    }
});

test("Termstead limitations prevent unsupported persistence and pixel claims", () => {
    assert.ok(termstead?.technicalEvidence);
    const serialized = JSON.stringify(termstead.technicalEvidence).toLowerCase();

    assert.match(serialized, /daemon crash|reboot|power/);
    assert.match(serialized, /pixel/);
    assert.match(serialized, /not tested|environment-limited/);
    assert.ok(termstead.technicalEvidence.measurements.some((measurement) => /cannot establish pixel-perfect output/i.test(measurement.limitations.join(" "))));
    assert.ok(termstead.technicalEvidence.measurements.some((measurement) => /not gui frame time or input-to-display latency/i.test(measurement.limitations.join(" "))));
    assert.ok(termstead.technicalEvidence.measurements.some((measurement) => /not exactly zero cpu/i.test(measurement.result)));
    assert.equal(
        termstead.technicalEvidence.lifecycle.some((step) => /terminate/i.test(step.action) && /explicit/i.test(`${step.phase} ${step.action}`)),
        true,
    );
});

test("Termstead remains the first featured project and PolyShop remains secondary", () => {
    const projects = getAllPortfolioProjects();
    const featured = getFeaturedPortfolioProjects();

    assert.equal(featured[0]?.slug, "termstead");
    assert.equal(featured.some((project) => project.slug === "polyshop"), false);
    assert.equal(projects.find((project) => project.slug === "polyshop")?.featured, false);
});

test("Termstead detail surface exposes reusable evidence blocks", () => {
    const detail = readFileSync("components/PortfolioProjectTechnicalEvidence.tsx", "utf8");
    const architecture = readFileSync("components/ProjectArchitectureDiagram.tsx", "utf8");
    const lifecycle = readFileSync("components/ProjectLifecycleSequence.tsx", "utf8");

    assert.match(detail, /ProjectArchitectureDiagram/);
    assert.match(detail, /ProjectEvidenceTable/);
    assert.match(detail, /ProjectDecisionCards/);
    assert.match(detail, /ProjectLimitations/);
    assert.match(detail, /ProjectSourceLinks/);
    assert.match(architecture, /<figure/);
    assert.match(lifecycle, /<ol/);
});
