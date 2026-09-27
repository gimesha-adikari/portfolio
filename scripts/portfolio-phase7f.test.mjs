import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { URL } from "node:url";

async function source(relativePath) {
    return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8");
}

test("Phase 7F semantic fixes keep scrollable evidence keyboard-accessible", async () => {
    const [workflow, evidence, excerpts] = await Promise.all([
        source("components/ProjectWorkflowMatrix.tsx"),
        source("components/ProjectEvidenceTable.tsx"),
        source("components/ProjectCodeExcerpts.tsx"),
    ]);

    assert.match(workflow, /tabIndex=\{0\}/);
    assert.match(evidence, /tabIndex=\{0\}/);
    assert.match(excerpts, /<article[^>]*className="min-w-0/);
    assert.match(excerpts, /<pre[^>]*tabIndex=\{0\}[^>]*className="[^"]*w-full min-w-0/);
});

test("Phase 7F removes generic-container labels and preserves heading order", async () => {
    const [projectCard, repoCard, caseStudy] = await Promise.all([
        source("components/PortfolioProjectCard.tsx"),
        source("components/RepoCard.tsx"),
        source("app/case-studies/[slug]/page.tsx"),
    ]);

    assert.doesNotMatch(projectCard, /aria-label="Project technologies"/);
    assert.doesNotMatch(repoCard, /aria-label="Tech stack"/);
    assert.match(caseStudy, /<h2 className="text-sm font-bold tracking-wider/);
});

test("Phase 7F keeps the mobile dialog reference mounted and theme action named", async () => {
    const [navigation, theme] = await Promise.all([
        source("components/MobileNavigation.tsx"),
        source("components/ThemeToggle.tsx"),
    ]);

    assert.match(navigation, /hidden={!open}/);
    assert.match(theme, /aria-label=\{light \? "Switch to dark theme" : "Switch to light theme"\}/);
});

test("Phase 7F uses a solid shared focus indicator", async () => {
    const globals = await source("app/globals.css");
    const [layout, skipLink] = await Promise.all([
        source("app/layout.tsx"),
        source("components/SkipLink.tsx"),
    ]);

    assert.match(globals, /outline: 2px solid var\(--accent\);/);
    assert.match(layout, /<main id="content" tabIndex=\{-1\}/);
    assert.match(skipLink, /focus:outline-\[var\(--accent\)\]/);
});

test("Phase 7F announces archive filter result context", async () => {
    const projects = await source("app/projects/page.tsx");

    assert.match(projects, /<p role="status" aria-live="polite" aria-atomic="true"/);
});

test("Phase 7F gives footer icon links touch-sized containers", async () => {
    const [footer, theme] = await Promise.all([
        source("components/Footer.tsx"),
        source("components/ThemeToggle.tsx"),
    ]);

    assert.equal((footer.match(/min-h-11 min-w-11 items-center justify-center/g) ?? []).length, 3);
    assert.match(theme, /btn btn-ghost !min-h-11 !min-w-11 focus-ring/);
});

test("Phase 7F correction keeps homepage rhythm content-driven and mounts theme controls in the header", async () => {
    const [home, hero, evidence, caseStudies, header, layout, motionSection, globals] = await Promise.all([
        source("app/page.tsx"),
        source("components/HomepageHero.tsx"),
        source("components/HomepageEngineeringEvidence.tsx"),
        source("components/HomepageCaseStudies.tsx"),
        source("components/Header.tsx"),
        source("app/layout.tsx"),
        source("components/MotionSection.tsx"),
        source("app/globals.css"),
    ]);

    assert.match(home, /relative space-y-6 pb-12 md:space-y-8/);
    assert.doesNotMatch(home, /space-y-16 md:space-y-24/);
    assert.match(hero, /homepage-section/);
    assert.match(evidence, /homepage-section/);
    assert.match(caseStudies, /homepage-section/);
    assert.match(header, /<ThemeToggle \/>/);
    assert.doesNotMatch(layout, /fixed bottom-4 right-4/);
    assert.match(motionSection, /data-motion-section/);
    assert.match(globals, /\[data-motion-section\]/);
});

test("Phase 7F correction keeps the mobile drawer outside the filtered header containing block", async () => {
    const navigation = await source("components/MobileNavigation.tsx");

    assert.match(navigation, /createPortal/);
    assert.match(navigation, /document\.body/);
    assert.match(navigation, /aria-controls=\{drawerId\}/);
    assert.match(navigation, /hidden=\{!open\}/);
    assert.match(navigation, /onClick=\{closeMenu\}/);
});
