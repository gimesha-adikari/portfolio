import assert from "node:assert/strict";
import test from "node:test";

import nextConfig from "../next.config.mjs";

test("Next config exposes the baseline browser security headers for every path", async () => {
    assert.equal(typeof nextConfig.headers, "function");

    const rules = await nextConfig.headers();
    const baseline = rules.find((rule) => rule.source === "/(.*)");
    assert.ok(baseline, "baseline header rule should cover every path");

    const headers = new Map(baseline.headers.map(({ key, value }) => [key, value]));
    assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    assert.equal(
        headers.get("Permissions-Policy"),
        "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    assert.equal(headers.get("X-Frame-Options"), "DENY");
    assert.equal(headers.has("Content-Security-Policy"), false);
    assert.equal(headers.has("Content-Security-Policy-Report-Only"), false);
});
