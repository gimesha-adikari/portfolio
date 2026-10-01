import assert from "node:assert/strict";
import test from "node:test";

import {
    buildLanguageFilterOptions,
    buildProjectFilterParams,
    parseProjectFilterParams,
} from "../lib/project-filters.ts";

test("project filter params parse query, language, and supported sort values", () => {
    assert.deepEqual(
        parseProjectFilterParams(new globalThis.URLSearchParams("q=%20pdfnest%20&lang=Go&sort=stars")),
        { q: "pdfnest", lang: "Go", sort: "stars" },
    );
    assert.deepEqual(
        parseProjectFilterParams(new globalThis.URLSearchParams("sort=unsupported")),
        { q: "", lang: "", sort: "recent" },
    );
});

test("project filter params update only filter keys and remove defaults", () => {
    const current = new globalThis.URLSearchParams("page=2&q=old&lang=TypeScript&sort=stars");

    assert.equal(
        buildProjectFilterParams(current, { q: "", lang: "", sort: "recent" }).toString(),
        "page=2",
    );
    assert.equal(
        buildProjectFilterParams(current, { q: "pdfnest" }).toString(),
        "page=2&q=pdfnest&lang=TypeScript&sort=stars",
    );
});

test("the All language option represents every archive result, including undetected languages", () => {
    assert.deepEqual(
        buildLanguageFilterOptions(["Go"], { Go: 1 }, 3),
        [
            { label: "All", value: "", count: 3 },
            { label: "Go", value: "Go", count: 1 },
        ],
    );
});
