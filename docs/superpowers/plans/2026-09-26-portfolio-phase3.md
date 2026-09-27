# Portfolio Phase 3: Project Resolver and Route Architecture

## Goal

Refactor project and case-study routing so routes orchestrate normalized content while resolver, archive, validation, metadata, and presentation responsibilities live in focused modules. Preserve the Phase 2 curated-project ownership model and leave Phase 4 work untouched.

## Guardrails

- Keep `PortfolioProject` authoritative for curated identity, grouping, narrative, and featured/order/status fields.
- Keep GitHub enrichment public-only, allowlisted through curated repository records, and optional for curated rendering.
- Retain archive-only README and `.portfolio/story.md` support where it is still needed; do not mass-delete legacy content.
- Do not redesign the homepage, replace FlyonUI/navigation, upgrade dependencies, deploy, push, or commit Phase 3 changes.

## Implementation sequence

1. Capture the route/content audit: read the complete project detail route, case-study route, GitHub/content helpers, YAML sources, and legacy presentation helpers. Record ownership and preservation decisions in the execution log.
2. Add focused resolver and archive layers. The production resolver will resolve curated projects first, load optional facts without failing identity, then resolve public archive repositories; the pure resolver core will be dependency-injectable for deterministic tests.
3. Normalize archive data at the GitHub/legacy boundary, move README/story parsing out of the route, and extract archive presentation into a server component. Keep raw GitHub/YAML/Markdown shapes out of presentation components.
4. Make project route generation and unknown-slug behavior explicit. Use normal App Router `notFound()` semantics and static parameter behavior that returns a real 404 for unknown slugs; document deliberate archive behavior when GitHub is unavailable.
5. Decompose curated project presentation into focused server components and add small reusable metadata helpers using `siteConfig`. Preserve current visual structure and add no homepage redesign.
6. Replace unsafe case-study YAML casts with a small runtime validator. Refactor the case-study detail route to use semantic article structure, route-specific metadata, valid links only, and justified `TechArticle` JSON-LD.
7. Add targeted resolver, validation, metadata, and archive-boundary tests. Fix invalid icon names only if the touched source makes the valid replacement unambiguous; identify rather than migrate the Edge runtime warning.
8. Run the required validation and local route/status checks, inspect generated metadata and structured data, update the permanent plan with only evidenced Phase 3 statuses, and leave all Phase 3 changes uncommitted.

## Verification gates

- `npm ci`
- `npm audit`
- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`
- Local production checks for curated, archive, unknown project, case-study, unknown case-study, sitemap, metadata, and HTTP status behavior.
- `git diff --check` and final uncommitted Phase 3 state.
