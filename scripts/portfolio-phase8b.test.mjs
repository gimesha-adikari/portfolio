import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (relativePath) => readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

const {
    filterPublishedEngineeringNotes,
    getAllEngineeringNotes,
    getEngineeringNoteBySlug,
    getEngineeringNotesForProject,
    getPublishedEngineeringNotes,
    validateEngineeringNote,
} = await import("../lib/engineering-notes.ts");

test("the pilot exposes exactly one validated published note", () => {
    const notes = getPublishedEngineeringNotes();
    assert.equal(notes.length, 1);

    const [note] = notes;
    assert.equal(note.slug, "terminal-cell-width-vs-text-run-width");
    assert.equal(note.projectSlug, "termstead");
    assert.equal(note.published, true);
    assert.equal(note.publishedAt, "2026-09-27");
    assert.match(note.question, /per-cell forced width/i);
    assert.deepEqual(note.relatedCaseStudies, []);
});

test("the pilot source is pinned to the verified Termstead renderer", () => {
    const [note] = getPublishedEngineeringNotes();
    assert.equal(note.sourceLinks.length, 1);
    assert.match(note.sourceLinks[0].url, /0776a19f39539c396df76038c55a14bb55948a53/);
    assert.match(note.sourceLinks[0].url, /crates\/terminal-render\/src\/renderer\.rs/);
    assert.match(note.content, /forced_cell_width/);
    assert.match(note.content, /forced_width_is_one_cell_per_glyph_not_the_full_run_width/);
});

test("unpublished records are excluded from public note collections", () => {
    const notes = getAllEngineeringNotes();
    const draft = { ...notes[0], slug: "draft-note", published: false };
    const publicNotes = filterPublishedEngineeringNotes([...notes, draft]);

    assert.equal(publicNotes.length, notes.filter((note) => note.published).length);
    assert.equal(publicNotes.some((note) => note.slug === "draft-note"), false);
});

test("unknown note slugs and unrelated project relationships remain empty", () => {
    assert.equal(getEngineeringNoteBySlug("definitely-unknown"), null);
    assert.deepEqual(
        getEngineeringNotesForProject("termstead").map((note) => note.slug),
        ["terminal-cell-width-vs-text-run-width"],
    );
    assert.deepEqual(getEngineeringNotesForProject("pdfnest"), []);
});

test("the pilot owns one MDX file and keeps broad claims out of the note", () => {
    const files = readdirSync(`${root}/content/engineering-notes`).filter((file) => file.endsWith(".mdx"));
    assert.deepEqual(files, ["terminal-cell-width-vs-text-run-width.mdx"]);

    const note = getPublishedEngineeringNotes()[0];
    assert.doesNotMatch(note.content, /(?:achieved|established|measured|demonstrated).{0,32}(?:pixel-perfect|cross-device correctness|frame-rate improvement|input latency improvement|production-scale reliability)/i);
});

test("public routes use the pilot loader and preserve the Phase 8 boundaries", () => {
    const indexPage = read("app/engineering-notes/page.tsx");
    const detailPage = read("app/engineering-notes/[slug]/page.tsx");
    const sitemap = read("app/sitemap.ts");

    assert.match(indexPage, /getPublishedEngineeringNotes/);
    assert.match(detailPage, /generateStaticParams/);
    assert.match(detailPage, /dynamicParams = false/);
    assert.match(detailPage, /notFound\(\)/);
    assert.match(detailPage, /RenderMDX/);
    assert.match(sitemap, /getPublishedEngineeringNotes/);
    assert.match(sitemap, /engineering-notes/);

    for (const deferredRoute of ["app/rss.xml", "app/decision-explorer", "app/architecture-lens", "app/systems-trace"]) {
        assert.equal(existsSync(`${root}/${deferredRoute}`), false, `${deferredRoute} must remain unimplemented`);
    }
});

test("the Termstead project detail exposes the generic note relationship", () => {
    const detail = read("components/PortfolioProjectDetail.tsx");

    assert.match(detail, /getEngineeringNotesForProject/);
    assert.match(detail, /Related Engineering Notes/);
    assert.match(detail, /engineering-notes/);
});

test("frontmatter slug validation remains filename-bound", () => {
    const [note] = getAllEngineeringNotes();
    assert.throws(
        () => validateEngineeringNote({ ...note, slug: "different-slug" }, note.slug, note.content),
        /slug must match filename/,
    );
});

test("source validation rejects links without a pinned public commit", () => {
    const [note] = getAllEngineeringNotes();
    assert.throws(
        () => validateEngineeringNote({ ...note, sourceLinks: [{ label: "Unsafe", url: "https://example.com/source" }] }, note.slug, note.content),
        /commit-pinned GitHub source URL/,
    );
});

test("the note detail uses canonical article metadata", () => {
    const detail = read("app/engineering-notes/[slug]/page.tsx");

    assert.match(detail, /buildRouteMetadata/);
    assert.match(detail, /type: "article"/);
    assert.match(detail, /path: `\/engineering-notes\/\$\{note\.slug\}`/);
    assert.match(detail, /buildNotFoundMetadata/);
});

test("the note detail emits a bounded TechArticle payload", () => {
    const detail = read("app/engineering-notes/[slug]/page.tsx");

    assert.match(detail, /"@type": "TechArticle"/);
    assert.match(detail, /datePublished: note\.publishedAt/);
    assert.match(detail, /keywords: note\.tags/);
    assert.match(detail, /mainEntityOfPage: canonicalUrl/);
});

test("engineering-note OG routes reuse the shared branded renderer", () => {
    const indexOg = read("app/engineering-notes/opengraph-image.tsx");
    const detailOg = read("app/engineering-notes/[slug]/opengraph-image.tsx");

    assert.match(indexOg, /createPortfolioOgImage/);
    assert.match(indexOg, /getEngineeringNotesOgCard/);
    assert.match(detailOg, /getEngineeringNoteOgCard/);
    assert.match(detailOg, /portfolioOgImageSize/);
});

test("sitemap entries derive from published notes", () => {
    const sitemap = read("app/sitemap.ts");

    assert.match(sitemap, /const engineeringNotes = getPublishedEngineeringNotes\(\)/);
    assert.match(sitemap, /engineeringNoteRoutes/);
    assert.match(sitemap, /note\.updatedAt \?\? note\.publishedAt/);
});

test("external source links use safe new-tab semantics", () => {
    const detail = read("app/engineering-notes/[slug]/page.tsx");

    assert.match(detail, /target="_blank"/);
    assert.match(detail, /rel="noopener noreferrer"/);
});
