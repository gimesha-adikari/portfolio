import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getPortfolioProjectBySlug } from "../lib/portfolio-projects.ts";
import {
    termsteadTechnicalEvidence,
    validateProjectTechnicalEvidence,
} from "../lib/project-evidence.ts";

const EXPECTED_COMMITS = {
    termstead: "0776a19f39539c396df76038c55a14bb55948a53",
    pdfnest: "9faae1a42155843e0e5a6e472d6a4109ccaa25a8",
    "banking-platform": "5afe20e3797191b1f9535185f2caecbe993cdb38",
    polyshop: "2e818de0c772fd186da27640933da71d1cda43e5",
};

test("flagship technical evidence exposes one focused excerpt per selected system", () => {
    const expectedTitles = new Map([
        ["termstead", /GPUI|terminal width/i],
        ["pdfnest", /worker dispatch|async/i],
        ["banking-platform", /KYC.*policy|policy.*KYC/i],
        ["polyshop", /process-local|rate limit/i],
    ]);

    for (const [slug, titlePattern] of expectedTitles) {
        const project = getPortfolioProjectBySlug(slug);
        assert.ok(project?.technicalEvidence, `${slug} should have technical evidence`);
        const excerpts = project.technicalEvidence.codeExcerpts;
        assert.equal(excerpts?.length, 1, `${slug} should have one focused excerpt`);
        assert.match(excerpts?.[0].title ?? "", titlePattern);
        assert.equal(excerpts?.[0].sourceCommit, EXPECTED_COMMITS[slug]);
        assert.match(excerpts?.[0].source ?? "", /^https:\/\//);
        assert.ok((excerpts?.[0].code.trim().split(/\r?\n/).length ?? 0) <= 18);
        assert.ok(!/password|secret|token|api[_ -]?key/i.test(excerpts?.[0].code ?? ""));
    }
});

test("focused excerpts are runtime-validated and bounded", () => {
    const baseExcerpt = {
        title: "A bounded excerpt",
        language: "text",
        code: "line one\nline two",
        explanation: "Shows one narrow boundary.",
        source: "https://github.com/gimesha-adikari/example/blob/0123456789abcdef0123456789abcdef01234567/src/example.ts",
        sourceCommit: "0123456789abcdef0123456789abcdef01234567",
        limitation: "This is not a runtime measurement.",
    };

    const validated = validateProjectTechnicalEvidence({
        ...termsteadTechnicalEvidence,
        codeExcerpts: [baseExcerpt],
    });
    assert.equal(validated.codeExcerpts?.[0].sourceCommit, baseExcerpt.sourceCommit);

    assert.throws(
        () => validateProjectTechnicalEvidence({
            ...termsteadTechnicalEvidence,
            codeExcerpts: [{ ...baseExcerpt, source: "http://example.com/source" }],
        }),
        /must use https/i,
    );

    assert.throws(
        () => validateProjectTechnicalEvidence({
            ...termsteadTechnicalEvidence,
            codeExcerpts: [{ ...baseExcerpt, sourceCommit: "not-a-commit" }],
        }),
        /40-character commit SHA/i,
    );

    assert.throws(
        () => validateProjectTechnicalEvidence({
            ...termsteadTechnicalEvidence,
            codeExcerpts: [{ ...baseExcerpt, code: Array.from({ length: 25 }, (_, index) => `line ${index}`).join("\n") }],
        }),
        /at most 24 lines/i,
    );
});

test("focused excerpt presentation is server-rendered and locally scrollable", () => {
    const component = readFileSync("components/ProjectCodeExcerpts.tsx", "utf8");

    assert.doesNotMatch(component, /^\s*[\"']use client[\"'];/m);
    assert.match(component, /<pre[^>]*overflow-x-auto/);
    assert.match(component, /<code>\{excerpt\.code\}<\/code>/);
    assert.match(component, /View exact source/);
    assert.match(component, /sourceCommit/);
});
