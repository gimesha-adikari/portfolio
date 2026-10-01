import assert from "node:assert/strict";
import test from "node:test";

import {
    getAllPortfolioProjects,
    getCuratedRepositoryNames,
    getPortfolioProjectBySlug,
    validatePortfolioProjects,
} from "../lib/portfolio-projects.ts";
import {
    fetchPortfolioRepositoryFacts,
    mapRepositoryFacts,
    selectRepositoryFacts,
} from "../lib/portfolio-repository-facts.ts";

test("curated project records have unique slugs and deterministic order", () => {
    const projects = getAllPortfolioProjects();
    const slugs = projects.map((project) => project.slug);
    const featured = projects.filter((project) => project.featured);

    assert.ok(slugs.includes("termstead"));
    assert.ok(slugs.includes("pdfnest"));
    assert.ok(slugs.includes("banking-platform"));
    assert.equal(new Set(slugs).size, slugs.length);
    assert.deepEqual(projects, [...projects].sort((a, b) => a.order - b.order));
    assert.deepEqual(
        featured.map((project) => project.slug),
        ["termstead", "pdfnest", "banking-platform"],
    );
});

test("Platen PDF and Banking Platform group explicit repositories", () => {
    const pdfnest = getPortfolioProjectBySlug("pdfnest");
    const banking = getPortfolioProjectBySlug("banking-platform");

    assert.ok(pdfnest);
    assert.equal(pdfnest.title, "Platen PDF");
    assert.equal(pdfnest.slug, "pdfnest");
    assert.equal(pdfnest.liveUrl, "https://platenpdf.com");
    assert.deepEqual(
        pdfnest.repositories.slice(0, 3).map((repository) => repository.name),
        ["pdfnest", "pdfnest-backend", "pdfnest-worker"],
    );
    assert.equal(pdfnest.repositories[3]?.name, "platen-document");
    assert.match(pdfnest.repositories[3]?.role ?? "", /standalone local-first/i);
    assert.ok(banking);
    assert.deepEqual(
        banking.repositories.map((repository) => repository.name),
        ["bank-core", "bank-web", "bank-service", "bank-app"],
    );
});

test("curated project validation rejects duplicate slugs", () => {
    const projects = getAllPortfolioProjects();

    assert.throws(
        () => validatePortfolioProjects([...projects, projects[0]]),
        /duplicate project slug/i,
    );
});

test("repository facts are restricted to the curated allowlist and public records", () => {
    const project = getPortfolioProjectBySlug("pdfnest");
    assert.ok(project);

    const facts = [
        {
            name: "pdfnest",
            role: "web",
            url: "https://github.com/gimesha-adikari/pdfnest",
            sourceUrl: "https://github.com/gimesha-adikari/pdfnest",
            isPublic: true,
        },
        {
            name: "private-repo",
            role: "private",
            url: "https://github.com/gimesha-adikari/private-repo",
            sourceUrl: "https://github.com/gimesha-adikari/private-repo",
            isPublic: false,
        },
        {
            name: "i-shop",
            role: "unlisted",
            url: "https://github.com/gimesha-adikari/i-shop",
            sourceUrl: "https://github.com/gimesha-adikari/i-shop",
            isPublic: true,
        },
    ];

    assert.deepEqual(
        selectRepositoryFacts(project, facts).map((fact) => fact.name),
        ["pdfnest"],
    );
    assert.ok(getCuratedRepositoryNames().has("pdfnest-backend"));
    assert.ok(!getCuratedRepositoryNames().has("i-shop"));
    assert.equal(
        mapRepositoryFacts(project.repositories[0], {
            name: "pdfnest",
            private: true,
            htmlUrl: "https://github.com/gimesha-adikari/pdfnest",
            stars: 1,
            forks: 0,
        }),
        null,
    );
});

test("GitHub failure leaves the curated project available without facts", async () => {
    const project = getPortfolioProjectBySlug("termstead");
    assert.ok(project);

    const facts = await fetchPortfolioRepositoryFacts(project, async () => {
        throw new Error("GitHub unavailable");
    });

    assert.deepEqual(facts, []);
    assert.equal(project.title, "Termstead");
});
