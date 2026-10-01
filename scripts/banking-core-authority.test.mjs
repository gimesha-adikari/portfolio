import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { URL } from "node:url";
import { bankingPlatformTechnicalEvidence } from "../lib/banking-platform-evidence.ts";

const componentSource = readFileSync(new URL("../components/BankingCoreAuthority.tsx", import.meta.url), "utf8");

test("BankingCoreAuthority renders against the canonical four-owner evidence", async () => {
    const expectedBoundaries = [
        "Spring backend API and persistence",
        "Next.js web client",
        "Android client",
        "Identity-verification service",
    ];
    const canonicalBoundaries = bankingPlatformTechnicalEvidence.ownership.map((item) => item.boundary);

    for (const boundary of expectedBoundaries) {
        assert.ok(canonicalBoundaries.includes(boundary), `canonical evidence must include ${boundary}`);
        assert.ok(componentSource.includes(`item.boundary === "${boundary}"`), `component must select ${boundary}`);
    }
    assert.doesNotMatch(componentSource, /Spring core API and persistence|item\.boundary === "Web client"/);

    assert.match(componentSource, /if \(!springBoundary \|\| !webBoundary \|\| !androidBoundary \|\| !kycBoundary\) return null/);
    assert.match(componentSource, /Authority map/);
    assert.match(componentSource, /One core, three surrounding boundaries/);
    assert.match(componentSource, /Device-local protection/);
    assert.match(componentSource, /bank-core authorization/);
});
