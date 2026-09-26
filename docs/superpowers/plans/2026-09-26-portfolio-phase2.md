# Implementation Plan: Portfolio Phase 2 Content Ownership and Project Architecture

## Global Constraints

- Work only on `codex/portfolio-improvement-plan` after checkpoint commit `4a34f903abf0ccbaafff0dba5091e727c21ef513`.
- Keep Phase 0/1 behavior intact unless a Phase 2 integration requires a direct change.
- Do not redesign the homepage, replace FlyonUI/navigation, remove major dependencies, or begin Phase 3 route decomposition.
- Portfolio-owned TypeScript data is the canonical project source. GitHub is optional mutable enrichment and cannot create projects.
- Public project enrichment must be allowlisted by each curated project and must reject private repositories at the boundary.
- Do not invent metrics or promote unsupported README/legacy marketing claims.
- Do not modify or clean external Termstead, BankingSystem, PDFNest, or PolyShop checkouts.
- No Phase 2 commit, push, merge, or deployment at the end of the task.

## Review Focus

- Confirm every project identity, order, featured flag, narrative field, repository grouping, and case-study association comes from the curated model.
- Confirm GitHub failure leaves curated project identity and content intact.
- Confirm only explicitly mapped public repositories can enrich a project; unlisted and private repositories cannot become flagship projects.
- Confirm useful `data/projects.ts` material is migrated without carrying unsupported claims.
- Confirm the existing 16.2.12 -> 16.3.6 Next.js/MDX upgrade is documented and no new dependency upgrade is introduced.
- Confirm Phase 3 route/component decomposition and Phase 5 homepage storytelling remain deferred.

## Tasks

### Task 1: Establish the Phase 2 regression harness before production edits

Files:

- Add `scripts/portfolio-projects.test.mjs`.
- Update `package.json` only to run the dependency-free Phase 2 tests as part of `npm test`.

Tests first:

- Assert known curated slugs load and are unique.
- Assert curated order and featured order are stable.
- Assert PDFNest and Banking Platform group multiple repositories.
- Assert private and unlisted repository facts are rejected by the allowlist boundary.
- Assert a GitHub failure returns no enrichment without removing the curated project.
- Assert the Banking Platform and PDFNest slugs resolve to curated records.

Run the new test command before implementing the model and record the expected red result.

### Task 2: Define the authoritative typed project model and curated records

Files:

- Add `lib/portfolio-projects.ts`.
- Add `lib/portfolio-repository-facts.ts` or an equivalent focused enrichment boundary module.
- Keep `data/projects.ts` in place and mark it legacy through documentation/comments only after useful content is migrated.

Implementation:

- Define `PortfolioProject`, `ArchitectureBlock`, `Decision`, `Evidence`, `ProjectImage`, `ProjectRepository`, and `RepositoryFacts` without broad `any`.
- Add a small runtime validator for the model and validate the static curated records at module load.
- Add curated Termstead, PDFNest, Banking Platform, PolyShop, Runyard, and NeuroSim records.
- Use explicit repository names/roles/URLs; do not infer project records from the GitHub repository list.
- Preserve PDFNest naming uncertainty as a content note instead of guessing between PDFNest and Platen PDF.
- Use evidence-oriented qualitative text and leave unsupported quantitative claims out.

Run focused model tests and TypeScript after implementation.

### Task 3: Implement optional, public-only, allowlisted enrichment

Files:

- Modify `lib/github.ts` only if a narrow typed adapter is required.
- Add or modify the Phase 2 enrichment boundary module.

Implementation:

- Fetch only repository names explicitly listed on a curated project.
- Map mutable GitHub facts such as updated date, languages, stars, forks, public source URL, and source status.
- Reject any private repository even if an authenticated fetch returns it.
- Catch individual repository/network failures and return the curated project with an empty/partial facts set.
- Keep the existing public `/users/<username>/repos` discovery behavior for the repository archive.

Run focused safety/fallback tests, lint, and TypeScript.

### Task 4: Prove the model in the existing project flows with minimal presentation changes

Files:

- Add `components/PortfolioProjectCard.tsx`.
- Add a focused curated detail presentation component if needed, without decomposing the legacy route wholesale.
- Modify `app/projects/page.tsx` to render curated projects in curated order and keep uncurated repositories in a visibly separate archive/labs area.
- Modify `app/projects/[slug]/page.tsx` so curated slugs resolve from `PortfolioProject`; retain the old repository detail fallback only for archive/lab entries.
- Modify `components/RepoCard.tsx` so `Featured` is conditional and never implied by repository discovery.
- Make the existing homepage featured section consume curated featured projects without changing its overall visual layout.

Behavior:

- Curated project pages render meaningful local content when all GitHub calls fail.
- Repository facts are displayed as optional enrichment, not as identity or narrative.
- `/projects/banking-platform` is a real curated project; `/projects/ai-verification` is not recreated.
- PDFNest is one project with grouped repository links.
- Raw repository cards are archive/lab entries and cannot display the curated Featured label.

Run route-focused tests, lint, TypeScript, and a local production build.

### Task 5: Document source ownership and update the permanent plan

Files:

- Modify `README.md` with the `PortfolioProject -> optional RepositoryFacts -> UI` architecture, repository grouping, featuring, enrichment, and future MDX guidance.
- Modify `PORTFOLIO_IMPROVEMENT_PLAN.md` only for genuinely completed/partial Phase 2 checkboxes and a newest execution-log entry.
- Update the SDD ledger with decisions, red/green test evidence, and unresolved issues.

Document the source hierarchy:

- `lib/portfolio-projects.ts` is authoritative structured project metadata.
- Future MDX is for long-form narratives/evidence associated by slug.
- YAML case studies remain their own validated-content concern until later cleanup; they do not define project identity.
- `data/projects.ts`, repo README/story parsing, remote MDX, and `site-content/` remain legacy or supporting sources until a later phase removes them after migration.

Run smoke checks after documentation/source assertions are updated.

### Task 6: Complete the evidence gate without expanding scope

Run individually:

- `npm ci`
- `npm audit`
- `npm run lint`
- `npx tsc --noEmit`
- `npm test`
- `npm run build`

Then perform targeted local checks for `/projects`, Termstead, PDFNest, Banking Platform, PolyShop, a lab/archive entry, curated rendering with GitHub unavailable, generated metadata/sitemap behavior, and the final uncommitted diff. Do not deploy or claim production validation.
