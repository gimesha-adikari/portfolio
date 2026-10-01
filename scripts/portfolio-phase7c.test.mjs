import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const workflowPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.github/workflows/ci.yml");

test("Portfolio CI is a read-only Node 24 quality gate", async () => {
    const workflow = await readFile(workflowPath, "utf8");

    assert.match(workflow, /^name:\s+Portfolio CI\s*$/m);
    assert.match(workflow, /^\s+pull_request:\s*$/m);
    assert.match(workflow, /^\s+push:\s*$/m);
    assert.match(workflow, /^\s+- main\s*$/m);
    assert.match(workflow, /^permissions:\s*\n\s+contents:\s+read\s*$/m);
    assert.match(workflow, /^\s+timeout-minutes:\s+15\s*$/m);
    assert.match(workflow, /cancel-in-progress:\s+true/);
    assert.match(workflow, /runs-on:\s+ubuntu-latest/);
    assert.match(workflow, /uses:\s+actions\/checkout@v7/);
    assert.match(workflow, /persist-credentials:\s+false/);
    assert.match(workflow, /uses:\s+actions\/setup-node@v7/);
    assert.match(workflow, /node-version:\s+24/);
    assert.match(workflow, /cache:\s+npm/);
    assert.match(workflow, /cache-dependency-path:\s+package-lock\.json/);
    assert.match(workflow, /NEXT_TELEMETRY_DISABLED:\s+["']1["']/);
    assert.match(workflow, /run:\s+npm ci/);
    assert.match(workflow, /run:\s+npm run lint/);
    assert.match(workflow, /run:\s+npx tsc --noEmit/);
    assert.match(workflow, /run:\s+npm test/);
    assert.match(workflow, /run:\s+env -u GITHUB_USERNAME GITHUB_MAX_PAGES=1 npm run build/);

    assert.doesNotMatch(workflow, /pull_request_target/);
    assert.doesNotMatch(workflow, /GITHUB_TOKEN|secrets\./);
    assert.doesNotMatch(workflow, /vercel|railway|npm publish|git push|deploy/i);
    assert.doesNotMatch(workflow, /permissions:[\s\S]*write/);
});
