import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getFeaturedPortfolioProjects, getPortfolioProjectBySlug } from "../lib/portfolio-projects.ts";
import { getHomepageFlagshipProjects } from "../lib/homepage-content.ts";

const banking = getPortfolioProjectBySlug("banking-platform");

test("Banking Platform is one curated cross-stack project with grouped repositories", () => {
    assert.ok(banking);
    assert.equal(banking.slug, "banking-platform");
    assert.equal(banking.title, "Banking Platform");
    assert.deepEqual(
        banking.repositories.map((repository) => repository.name),
        ["BankingSystem", "bank-web", "banking-service", "BankApp"],
    );
    assert.ok(banking.technicalEvidence);
    assert.deepEqual(
        banking.technicalEvidence.ownership.map((boundary) => boundary.owner),
        ["BankingSystem / Spring backend", "bank-web / Next.js web", "BankApp / Android client", "banking-service / FastAPI KYC"],
    );
});

test("Banking evidence covers KYC policy, workflows, failures, and exact source commits", () => {
    assert.ok(banking?.technicalEvidence);
    const evidence = banking.technicalEvidence;
    const serialized = JSON.stringify(evidence);

    assert.ok(evidence.workflows?.length);
    assert.ok(evidence.lifecycle.length);
    assert.ok(evidence.processingPaths?.length);
    assert.ok(evidence.failureBoundaries?.length);
    assert.ok(evidence.decisions.length);
    assert.ok(evidence.debuggingStories.length);
    assert.match(serialized, /APPROVE/);
    assert.match(serialized, /UNDER_REVIEW/);
    assert.match(serialized, /REJECT/);
    assert.match(serialized, /NOT TESTED/);
    assert.ok(evidence.sources.every((source) => /^[0-9a-f]{40}$/.test(source.commit)));
    assert.ok(evidence.sources.every((source) => /^https:\/\//.test(source.url)));
    assert.match(serialized, /no labeled|not established|not publish|not tested/i);
});

test("Banking evidence does not publish unsupported outcome or operational claims", () => {
    assert.ok(banking?.technicalEvidence);
    const serialized = JSON.stringify(banking.technicalEvidence);

    assert.doesNotMatch(serialized, /bank-grade|enterprise-grade|production-ready|proven scalability|false-rejection rate reduced/i);
    assert.ok(banking.technicalEvidence.measurements.some((measurement) => measurement.classification === "NOT TESTED"));
    assert.ok(banking.technicalEvidence.limitations.some((limitation) => /accuracy|false-rejection|production/i.test(limitation)));
});

test("Homepage keeps Banking grouped, Termstead first, and PolyShop secondary", () => {
    const featured = getFeaturedPortfolioProjects();
    const homepage = getHomepageFlagshipProjects(featured);

    assert.equal(homepage[0]?.slug, "termstead");
    assert.equal(homepage.filter((project) => project.slug === "banking-platform").length, 1);
    assert.equal(homepage.some((project) => project.slug === "polyshop"), false);
});

test("Banking case studies no longer publish unverified false-rejection outcomes", () => {
    const kycStudy = readFileSync("content/case-studies/modular-kyc-architecture.yml", "utf8");
    const mobileStudy = readFileSync("content/case-studies/resilient-mobile-payments.yml", "utf8");

    assert.doesNotMatch(kycStudy, /Improved KYC false-reject rate|Reduced KYC false rejects|Fewer manual reviews/i);
    assert.doesNotMatch(mobileStudy, /robust retries|reduced visible errors/i);
    assert.match(kycStudy, /not publish|not established|evidence/i);
});
