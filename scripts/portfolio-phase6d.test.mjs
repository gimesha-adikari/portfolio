import assert from "node:assert/strict";
import test from "node:test";

import { getHomepageFlagshipProjects } from "../lib/homepage-content.ts";
import { getFeaturedPortfolioProjects, getPortfolioProjectBySlug } from "../lib/portfolio-projects.ts";
import { polyshopTechnicalEvidence } from "../lib/polyshop-evidence.ts";

const polyshop = getPortfolioProjectBySlug("polyshop");
const serializedEvidence = JSON.stringify(polyshopTechnicalEvidence);

test("PolyShop remains a curated secondary project with source-pinned evidence", () => {
    assert.ok(polyshop);
    assert.equal(polyshop.slug, "polyshop");
    assert.equal(polyshop.featured, false);
    assert.equal(polyshop.status, "experimental");
    assert.deepEqual(polyshop.technicalEvidence, polyshopTechnicalEvidence);
    assert.ok(polyshopTechnicalEvidence.ownership.length >= 3);
    assert.ok(polyshopTechnicalEvidence.ipc.length >= 2);
    assert.ok(polyshopTechnicalEvidence.processingPaths?.length);
    assert.ok(polyshopTechnicalEvidence.decisions.length >= 3);
    assert.ok(polyshopTechnicalEvidence.limitations.length >= 3);
    assert.ok(polyshopTechnicalEvidence.sources.every((source) => source.commit === "2e818de0c772fd186da27640933da71d1cda43e5"));
});

test("PolyShop evidence distinguishes executable source from design and test assets", () => {
    assert.match(serializedEvidence, /one KafkaTemplate|no executable.*consumer/i);
    assert.match(serializedEvidence, /Redis.*not found|process-local|no Redis client/i);
    assert.match(serializedEvidence, /saga.*DESIGNED|orchestrator.*not found|not implemented/i);
    assert.match(serializedEvidence, /Pact.*not executed|test asset/i);
    assert.match(serializedEvidence, /k6.*not measured|threshold.*not.*measurement/i);
    assert.match(serializedEvidence, /CI\/CD.*not found|no .*workflow/i);
    assert.doesNotMatch(serializedEvidence, /production-ready|proven scalability|enterprise-grade|bank-grade/i);
});

test("PolyShop does not re-enter the homepage flagship selector", () => {
    const featured = getFeaturedPortfolioProjects();
    const homepage = getHomepageFlagshipProjects(featured);

    assert.equal(homepage.some((project) => project.slug === "polyshop"), false);
    assert.equal(homepage[0]?.slug, "termstead");
    assert.equal(homepage.filter((project) => project.slug === "banking-platform").length, 1);
});
