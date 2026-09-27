import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (relativePath) => readFileSync(relativePath, "utf8");

const {
    APPROVED_ENGINEERING_DECISION_PROJECTS,
    getAllEngineeringDecisions,
    getEngineeringDecisionsForProject,
    hasEngineeringDecisions,
    validateEngineeringDecisions,
} = await import("../lib/engineering-decisions.ts");

const decisions = getAllEngineeringDecisions();

test("the pilot contains only the three approved project groups", () => {
    assert.deepEqual(APPROVED_ENGINEERING_DECISION_PROJECTS, ["termstead", "pdfnest", "banking-platform"]);
    assert.deepEqual([...new Set(decisions.map((decision) => decision.projectSlug))], APPROVED_ENGINEERING_DECISION_PROJECTS);
    assert.equal(decisions.length, 6);
    assert.equal(decisions.some((decision) => decision.projectSlug === "polyshop"), false);
});

test("every pilot decision has a stable id and valid curated project association", () => {
    const ids = decisions.map((decision) => decision.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.every((id) => /^[a-z0-9-]+$/.test(id)));

    const projects = new Set(["termstead", "pdfnest", "banking-platform"]);
    assert.ok(decisions.every((decision) => projects.has(decision.projectSlug)));
    assert.ok(decisions.every((decision) => decision.projectTitle.length > 0));
});

test("every decision exposes substantive required fields without invented symmetry", () => {
    assert.ok(decisions.every((decision) => decision.question.length > 0));
    assert.ok(decisions.every((decision) => decision.context.length > 0));
    assert.ok(decisions.every((decision) => decision.decision.length > 0));
    assert.ok(decisions.every((decision) => decision.rationale.length > 0));
    assert.ok(decisions.every((decision) => decision.evidence.length > 0));

    const minimal = {
        ...decisions[0],
        constraints: undefined,
        alternatives: undefined,
        tradeoffs: undefined,
        limitations: undefined,
    };
    assert.equal(validateEngineeringDecisions([minimal]).length, 1);
});

test("every evidence source is pinned, public, and safe to follow", () => {
    assert.ok(decisions.every((decision) => decision.evidence.every((source) => {
        return /^https:\/\/github\.com\/gimesha-adikari\//.test(source.url)
            && /^[0-9a-f]{40}$/.test(source.commit)
            && source.label.length > 0;
    })));
});

test("Termstead decision preserves authoritative snapshots and wake-hint semantics", () => {
    const decision = decisions.find((item) => item.id === "termstead-snapshot-delta-authority");
    assert.ok(decision);
    assert.match(decision.decision, /RenderReady.*wake|snapshots and revision-contiguous deltas.*authoritative/i);
    assert.match(decision.limitations?.join(" ") ?? "", /input-to-display latency|Systems Trace/i);
    assert.doesNotMatch(JSON.stringify(decision), /session\s*[-→>]\s*attachment.*renderer/i);
});

test("Platen PDF decision keeps response modes workload-specific", () => {
    const decision = decisions.find((item) => item.id === "platen-response-mode-per-workload");
    assert.ok(decision);
    assert.match(decision.decision, /direct responses|queued jobs|preview/i);
    assert.doesNotMatch(JSON.stringify(decision), /all (?:document )?operations are asynchronous|everything is asynchronous|universal(?:ly)? asynchronous/i);
});

test("Banking Platform decision keeps server authorization authoritative", () => {
    const decision = decisions.find((item) => item.id === "banking-server-authorization");
    assert.ok(decision);
    assert.match(decision.decision, /Spring Security|server/i);
    assert.match(decision.limitations?.join(" ") ?? "", /device|client|certification|production/i);
    assert.doesNotMatch(decision.decision, /Keystore|biometric/i);
});

test("pilot records do not publish unsupported broad claims", () => {
    const serialized = decisions.map((decision) => {
        const narrative = { ...decision };
        delete narrative.limitations;
        delete narrative.evidence;
        return JSON.stringify(narrative);
    }).join(" ");
    assert.doesNotMatch(serialized, /production[- ]ready|production-proven|scalable by design|high performance/i);
    assert.doesNotMatch(serialized, /accuracy improvement|false-rejection improvement|FAR\/FRR|security certification/i);
});

test("approved project relationship helper excludes PolyShop", () => {
    assert.equal(hasEngineeringDecisions("termstead"), true);
    assert.equal(hasEngineeringDecisions("pdfnest"), true);
    assert.equal(hasEngineeringDecisions("banking-platform"), true);
    assert.equal(hasEngineeringDecisions("polyshop"), false);
    assert.equal(getEngineeringDecisionsForProject("polyshop").length, 0);
});

test("sitemap and project detail expose only the pilot index relationship", () => {
    const sitemap = read("app/sitemap.ts");
    const detail = read("components/PortfolioProjectDetail.tsx");
    assert.match(sitemap, /engineering-decisions/);
    assert.equal((sitemap.match(/engineering-decisions/g) ?? []).length, 1);
    assert.match(detail, /hasEngineeringDecisions/);
    assert.match(detail, /engineering-decisions#/);
    assert.doesNotMatch(sitemap, /engineering-decisions\/\$\{|decision\.id/);
});

test("the explorer has no per-decision route, graph surface, or global navigation item", () => {
    assert.equal(existsSync("app/engineering-decisions/[id]"), false);
    assert.equal(existsSync("app/engineering-decisions/[slug]"), false);
    assert.equal(existsSync("app/architecture-lens"), false);
    assert.equal(existsSync("app/systems-trace"), false);
    assert.equal(existsSync("app/rss.xml"), false);

    const navItems = read("lib/navItems.ts");
    assert.doesNotMatch(navItems, /engineering-decisions/i);
});

test("the explorer page uses server-rendered native disclosures", () => {
    const page = read("app/engineering-decisions/page.tsx");
    assert.match(page, /<h1/);
    assert.match(page, /<h2/);
    assert.match(page, /<details/);
    assert.match(page, /<summary/);
    assert.doesNotMatch(page, /["']use client["']/);
    assert.doesNotMatch(page, /onClick|onKeyDown|canvas|react-flow|d3/i);
});

test("the explorer route uses canonical metadata and a route-local OG image", () => {
    const page = read("app/engineering-decisions/page.tsx");
    const og = read("app/engineering-decisions/opengraph-image.tsx");
    assert.match(page, /buildRouteMetadata/);
    assert.match(page, /path: ["']\/engineering-decisions["']/);
    assert.match(page, /ogImagePath: ["']\/engineering-decisions\/opengraph-image["']/);
    assert.match(og, /createPortfolioOgImage/);
    assert.match(og, /portfolioOgImageSize/);
});
