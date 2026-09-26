# Portfolio Improvement Plan

Permanent execution plan for improving gimesha-adikari/portfolio with Codex.

Plan created: 2026-09-26
Revalidated baseline: main at b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e
Implementation branch baseline: codex/portfolio-improvement-plan at 0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d
Primary production domain: https://www.gimesha.com
Status: Phase 0 and Phase 1 local implementation complete; live production recheck deferred. Phase 2 not started.

## Purpose

This plan converts the production audit into an ordered implementation program. Do not redesign the portfolio from scratch. Fix correctness and security problems first, simplify the architecture, make portfolio-owned content authoritative, and then improve storytelling and visuals around real engineering evidence.

Core product principle:

GitHub is evidence for the portfolio, not the portfolio content-management system.

The finished site should clearly communicate:
- explicit system and ownership boundaries;
- technical decisions supported by evidence and measurements;
- ability to carry products across frontend, backend, infrastructure, mobile, and lower-level systems work.

## How Codex must use this file

At the start of every implementation session:
1. Read this file completely.
2. Run git status and inspect the current branch and HEAD.
3. Work on the earliest incomplete phase unless the user explicitly reprioritizes.
4. Keep changes incremental and reviewable.
5. Update this file's checkboxes and execution log before ending the session.

Rules:
- Prefer one coherent concern per commit.
- Preserve working behavior unless this plan explicitly replaces it.
- Do not invent performance, accessibility, reliability, traffic, or outcome metrics.
- Do not claim Lighthouse, Core Web Vitals, contrast, or accessibility results until measured.
- Public portfolio data must be structurally unable to expose private GitHub repositories.
- Do not add visual spectacle before correctness, content ownership, and navigation simplification are complete.
- Prefer Server Components and small client islands for real interaction.
- Delete legacy systems only after useful content has been migrated.
- Quantitative portfolio claims must have reproducible evidence or be rewritten qualitatively.

Status:
- [ ] not started
- [-] in progress
- [x] complete and validated
- [!] blocked; explain in execution log

## Revalidation snapshot - 2026-09-26

Current main still points to b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e, the same commit used by the audit. No newer source changes were found.

Confirmed still present in source:
- app/layout.tsx still derives metadataBase from SITE_URL with localhost fallback.
- Open Graph siteName, sidebar/footer branding, OG route branding, vCard URL, and robots references still contain gimesha.dev.
- app/sitemap.ts still falls back to localhost, includes /cv, includes stale legacy case-study routes, and derives project routes from GitHub repositories.
- app/robots.ts and public/robots.txt both exist and point to the old .dev sitemap.
- content/about.yml still links to /projects/banking-platform and /projects/ai-verification while project routing remains repo-derived.
- content/case-studies/dynamic-tool-routing-system.yml still links to /tools.
- lib/github.ts still defaults GITHUB_INCLUDE_PRIVATE to true, fetches authenticated /user/repos, merges authenticated and public results, and filters private repos only when the flag is false.
- components/RepoCard.tsx still renders Featured unconditionally.
- components/FlyonuiScript.tsx still globally loads jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI.
- package.json still includes that compatibility stack and multiple latest ranges.
- components/Header.tsx still hard-codes aria-expanded=false and uses a 36x36 mobile target.
- components/MiniSidebar.tsx still relies on plugin and DOM synchronization rather than a React-owned drawer.
- components/ProjectsFilters.tsx still uses a render-local any typingTimer, mixes defaultValue with state, auto-applies filters, and renders Apply.
- components/Reveal.tsx still imports ReactNode from node_modules/@types/react and does not use reduced-motion state.
- components/SkipLink.tsx exists but is not mounted in root layout.
- app/case-studies/[slug]/page.tsx still nests main inside root main and has no route-specific metadata generator.
- components/Footer.tsx still shows the unsupported All systems operational indicator and an inconsistent LinkedIn path.
- data/projects.ts, YAML case studies, legacy site-content, GitHub descriptions/READMEs, and optional story fetching remain competing content sources.
- .idea/workspace.xml remains committed and .gitignore does not ignore .idea.
- README.md is stale and still advertises Next.js 15 while package.json uses Next.js 16.2.12.
- The project detail route still has too many responsibilities and uses unoptimized project imagery.

Current YAML case-study source found:
- modular-document-platform
- pdf-edge-case-handling
- high-performance-file-processing
- dynamic-tool-routing-system
- ocr-document-extraction
- modular-kyc-architecture
- resilient-mobile-payments
- browser-rendering-optimization

Revalidation limitation:
The custom production domain could not be fetched through the browsing tools available in this session, and the connected Vercel tool did not have access to the deployment. Source-backed findings are revalidated. Live-only checks such as actual HTTP status codes, emitted production metadata, response headers, Lighthouse/Core Web Vitals, visual breakpoints, and current Vercel runtime health must be checked before their related phase is marked complete.

## Target architecture

Portfolio-owned content:
- decides project identity, importance, narrative, evidence, and case studies.

GitHub enrichment:
- supplies optional mutable facts such as updated date, public source link, stars, and languages.

UI:
- renders normalized portfolio models and continues to work when GitHub is unavailable.

Target core models:
- siteConfig
- PortfolioProject
- RepositoryFacts
- CaseStudy
- EngineeringEvidence or Decision when needed

A portfolio project may contain multiple repositories. A repository must never automatically become a featured portfolio project.

## Phase 0 - Baseline and guardrails

Goal: make the work reproducible before changing behavior.

- [x] Confirm local Node/npm versions and clean working tree.
- [x] Record current main SHA in the execution log.
- [x] Run npm ci.
- [x] Run npm run lint.
- [x] Run npx tsc --noEmit.
- [x] Run npm run build.
- [x] Record baseline failures honestly.
- [x] Establish a small route/link/metadata smoke-test approach.

Exit: baseline commands and known failures are documented.

## Phase 1 - Production correctness, identity, privacy, hygiene

Goal: remove objective defects before redesigning anything.

Identity:
- [x] Add a single siteConfig for canonical URL, display domain, name, GitHub, LinkedIn, email, CV route, and default metadata.
- [x] Make https://www.gimesha.com the canonical public URL with no localhost production fallback.
- [x] Remove stale .dev identity where it is no longer intentional.
- [x] Normalize one verified LinkedIn URL.
- [x] Update OG branding and vCard through siteConfig.

Sitemap and robots:
- [x] Generate sitemap from actual static routes plus authoritative project/case-study models.
- [x] Remove stale /cv and use /cv.pdf if it remains canonical.
- [x] Remove legacy case-study slugs.
- [x] Include every current case-study slug.
- [x] Keep one robots implementation, preferably app/robots.ts.
- [x] Remove public/robots.txt after validation.

Links and UI correctness:
- [x] Fix or temporarily remove broken Banking Platform and AI Verification project links.
- [x] Fix/remove /tools case-study resource link.
- [x] Do not render resource actions with empty destinations.
- [x] Surface /cv.pdf deliberately.
- [x] Remove or replace All systems operational.

GitHub privacy:
- [x] Make public repository discovery public-only by construction.
- [x] Stop defaulting private inclusion to true.
- [x] Prefer /users/<username>/repos for public listing.
- [x] Reject repo.private even if authenticated data appears.
- [ ] Use a curated repository allowlist where appropriate.
- [x] Use no token or minimal token scope when public data is enough.

Repository hygiene:
- [x] Remove .idea from version control.
- [x] Add .idea/ to .gitignore.
- [x] Rewrite README for Next.js 16 and the real content architecture.
- [x] Document local development, env vars, commands, deployment, and content editing.

Validation:
- [x] build
- [x] typecheck
- [x] link/route smoke
- [x] generated sitemap/robots/metadata inspection
- [ ] live production recheck after deploy

Exit: no known localhost canonical, stale domain identity, stale sitemap route, known broken internal link, or private-repo exposure path remains.

## Phase 2 - Content ownership and project architecture

Goal: replace repository equals project with a curated portfolio model.

- [ ] Define and validate PortfolioProject.
- [ ] Include slug, title, tagline, status, featured/order, role/period, problem, constraints, architecture, decisions, outcomes/evidence, repositories, media, case studies, and optional live URL.
- [ ] Make portfolio-owned project content authoritative.
- [ ] Migrate useful material from data/projects.ts before deleting it.
- [ ] Group PDFNest frontend/backend/worker under one PDFNest project.
- [ ] Create a real multi-repository Banking Platform project.
- [ ] Add Termstead as a first-class curated project.
- [ ] Evaluate PolyShop as a fourth flagship using verified evidence.
- [ ] Treat Runyard as Lab/In progress until it has enough story.
- [ ] Keep NeuroSim experimental/educational unless new evidence changes that.
- [ ] Make GitHub enrichment optional and non-authoritative.
- [ ] Ensure project pages still render meaningful content if GitHub fails.
- [ ] Pick one long-form content architecture. Preferred direction: validated structured metadata plus MDX for deep narratives/evidence.
- [ ] Remove legacy content systems only after migration.

Exit: flagship identity/order/story is controlled locally and multi-repo projects work.

## Phase 3 - Refactor project and case-study implementation

Goal: align code with the new content architecture.

- [ ] Break app/projects/[slug]/page.tsx into orchestration, resolver, and focused presentation components.
- [ ] Add a normalized project content resolver.
- [ ] Replace broad any at content/API boundaries with explicit types and runtime validation where external/YAML/MDX data enters.
- [ ] Add route-specific metadata for case studies.
- [ ] Add Article or TechArticle structured data.
- [ ] Replace nested case-study main with article/section semantics.
- [ ] Do not render resource buttons without valid URLs.
- [ ] Reassess remote image handling and remove unoptimized unless documented.

Exit: route files mostly orchestrate normalized models and metadata/semantics are route-correct.

## Phase 4 - Navigation, client JS, accessibility, interaction cleanup

Goal: simplify ordinary interactions and remove unnecessary client complexity.

- [ ] Replace FlyonUI mobile-menu ownership with a small React-controlled accessible drawer/dialog.
- [ ] Remove FlyonuiScript.tsx after migration.
- [ ] Remove unused jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI dependencies after verifying no consumers.
- [ ] Synchronize mobile aria-expanded with real state.
- [ ] Increase mobile trigger target toward at least 44px.
- [ ] Mount SkipLink in root layout.
- [ ] Fix Reveal.tsx React type import.
- [ ] Respect reduced motion in Reveal and other animations.
- [ ] Disable smooth scrolling under reduced motion.
- [ ] Fix project-filter debounce with a stable ref/cleanup/deferred approach.
- [ ] Make filter inputs consistently controlled or URL-derived.
- [ ] Remove redundant Apply if filters auto-apply.
- [ ] Make All count equal actual repository/result count.
- [ ] Move repository filtering to a Labs/Repositories view after flagship curation.
- [ ] Reconsider pointer glow and reading progress; keep only if clearly useful.

Exit: menu no longer needs compatibility UI framework; keyboard/focus/menu state is correct.

## Phase 5 - Homepage and portfolio storytelling

Goal: make engineering evidence the first impression.

Target order:
Hero -> flagship systems -> engineering evidence/decisions -> featured case studies -> recent engineering activity -> about/contact CTA

- [ ] Rewrite hero toward concrete engineering scope.
- [ ] Use a primary CTA such as Explore flagship systems.
- [ ] Use a secondary CTA such as Read engineering case studies.
- [ ] Demote/remove repo count, years coding, contribution-calendar prominence, vanity language statistics, and raw activity stream where they compete with stronger evidence.
- [ ] Present PDFNest as one multi-service system.
- [ ] Make Termstead a flagship technical story.
- [ ] Present Banking Platform as one system across backend, web, Android, and KYC.
- [ ] Add a verified fourth strong system such as PolyShop if evidence supports it.
- [ ] Replace generic reliable/scalable/high-performance language with decisions, constraints, tests, or measurements.
- [ ] Resolve PDFNest vs Platen PDF naming before marketing expansion.

Exit: visitors can understand the strongest engineering areas without reading GitHub statistics.

## Phase 6 - Evidence-rich flagship content

Termstead:
- [ ] Cover daemon-owned terminal/session state, GUI-owned layout/focus, IPC boundaries, lifecycle, renderer boundaries, alternatives considered, stress testing, and measured baselines.
- [ ] Include methodology/caveats with any memory or latency figures.

PDFNest:
- [ ] Explain frontend -> Go API -> worker/processing topology.
- [ ] Explain sync vs async work, validation, file lifecycle, queueing, OCR, failure handling, preview vs server processing, scaling constraints, and evolved decisions.

Banking Platform:
- [ ] Show Spring Boot, React, Android/Kotlin, and FastAPI KYC as one project.
- [ ] Remove or substantiate false-reject and similar outcome claims.

PolyShop or other flagship:
- [ ] Verify service boundaries, Kafka/Redis/API gateway, contract/load testing, and saga-related claims directly before publishing.

Reusable evidence:
- [ ] Architecture/system diagrams.
- [ ] Sequence diagrams where useful.
- [ ] Decision cards/ADRs.
- [ ] Benchmark/evidence tables with methodology.
- [ ] Focused code excerpts.
- [ ] Failure/recovery stories.
- [ ] Screenshots only when they communicate behavior or technical context.

Exit: every flagship has concrete decisions/evidence and no unsupported quantitative claim remains.

## Phase 7 - SEO, quality gates, security headers, measured validation

- [ ] Add project-specific branded OG images.
- [ ] Complete project/case-study metadata and canonical coverage.
- [ ] Add reasonable security headers: CSP where practical, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- [ ] Add lightweight CI: install -> lint -> typecheck -> tests -> build -> link/metadata smoke.
- [ ] Add focused tests: route/link smoke, metadata/sitemap, GitHub-failure fallback, accessibility smoke, project filters.
- [ ] Run Lighthouse on important routes.
- [ ] Record Core Web Vitals or lab equivalents with date/device/profile.
- [ ] Run axe plus manual keyboard/focus testing.
- [ ] Run contrast checks.
- [ ] Test mobile breakpoints and diagram scroll/zoom readability.
- [ ] Verify production headers, sitemap, robots, canonical/OG output, and 404 behavior after deploy.

Exit: quality claims are supported by recorded checks and CI protects key correctness issues.

## Phase 8 - High-value features after fundamentals

Only after Phases 1-7 are stable:
- [ ] Engineering Notes after there are enough real notes.
- [ ] Reusable Engineering Decision Explorer.
- [ ] Architecture Lens / reusable architecture visualization.
- [ ] Project milestones/history where useful.
- [ ] RSS only when notes are regularly published.
- [ ] Consider Termstead Systems Trace as the signature experience.

Avoid for now:
- fake terminal homepage
- skill percentage bars
- custom cursor
- 3D/particle spectacle
- splash/loading intro
- autoplay audio
- more GitHub vanity dashboards
- fake live counters/status
- generic testimonials
- animated technology clouds
- elaborate global page transitions

## Recommended Codex execution order

1. Baseline commands and plan update.
2. siteConfig and identity normalization.
3. sitemap/robots/link/privacy fixes.
4. repository hygiene and README.
5. curated PortfolioProject model and GitHub enrichment boundary.
6. migrate Termstead/PDFNest/Banking/PolyShop project data.
7. refactor project/case-study routes.
8. replace FlyonUI navigation and remove compatibility dependencies.
9. accessibility/filter/client cleanup.
10. homepage restructure.
11. evidence-rich flagship content and diagrams.
12. SEO/OG/security headers/tests/CI.
13. measured browser/Lighthouse/accessibility validation.
14. optional signature features.

## Required validation commands

Run the applicable subset after each meaningful change and all before completing a phase:

npm ci
npm run lint
npx tsc --noEmit
npm test   (once a test script exists)
npm run build

Use targeted browser checks for changed routes. Do not mark a browser-dependent item complete from source inspection alone.

## Execution log

Add entries newest-first. Include date, branch/SHA, phase, changes, validation, and remaining concerns.

### 2026-09-26 - Phase 0/1 implementation and local validation

- Branch/SHA: `codex/portfolio-improvement-plan` at `0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d`; changes remain uncommitted.
- Baseline before edits: Node `v24.11.1`, npm `11.6.2`; `npm ci` passed but reported 14 vulnerabilities (4 moderate, 8 high, 2 critical); lint failed because ESLint 9 had no flat config; TypeScript failed on deprecated `baseUrl` without `ignoreDeprecations`; build passed on Next.js 16.2.12 with the pre-existing invalid FlyonUI icon and Edge-runtime warnings.
- Files/decisions: added `lib/siteConfig.ts` and routed layout, OG, vCard, contact, header/footer/sidebar identity through it; corrected `.com`/LinkedIn identity; rebuilt `app/sitemap.ts` from static routes plus `getAllCaseStudies()`; retained `app/robots.ts` and removed `public/robots.txt`; removed or suppressed the requested broken/empty links; added valid-resource filtering; made GitHub discovery public `/users/<username>/repos` only, paginated, fail-closed on `private`, and kept authenticated access for optional enrichment only; removed tracked `.idea/` and ignored it; added a flat ESLint config, TypeScript deprecation compatibility, and `scripts/portfolio-smoke.mjs`; updated README and aligned Next.js/MDX to 16.3.6. No homepage, navigation rewrite, project model, or Phase 2 work was started.
- Validation after edits: clean `npm ci` completed with 0 vulnerabilities; `npm audit` reported 0 vulnerabilities; `npm run lint` passed; `npx tsc --noEmit` passed; `npm test` passed; `npm run build` passed on Next.js 16.3.6. Local `next start` inspection confirmed canonical `.com` sitemap/robots/metadata, `/cv.pdf`, all eight current YAML case-study URLs, no `.dev` identity, and no `/tools` resource output.
- Remaining concerns: live production recheck has not been run and no deployment was performed; the curated repository allowlist remains Phase 2; the build still reports the pre-existing `tabler--blueprint`, `tabler--brand-java`, `tabler--file-cog`, and Edge-runtime warnings. CRLF source files were checked with `core.whitespace=cr-at-eol`.

### 2026-09-26 - Plan creation / revalidation

- Baseline source revalidated against main SHA b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e.
- No newer commits found.
- Major source-backed audit findings remain present.
- Live custom-domain/browser validation remains required because production could not be fetched with the available tools in this session.
- No implementation fixes have been applied yet.
