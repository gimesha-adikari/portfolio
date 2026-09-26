# Portfolio Improvement Plan

Permanent execution plan for improving gimesha-adikari/portfolio with Codex.

Plan created: 2026-09-26
Revalidated baseline: main at b8ea4a7e8fd77c49536bdcb5a58f2a4044053c5e
Implementation branch baseline: codex/portfolio-improvement-plan at 0d6fc0cbd405459bf9d1f01602c30e2bf1d2575d
Primary production domain: https://www.gimesha.com
Status: Phase 0 through Phase 5 are checkpointed and locally validated; Phase 6A Termstead evidence is locally complete enough for review and remains uncommitted. Platen PDF, Banking Platform, and PolyShop evidence work is deferred. Live production recheck deferred.

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
- [x] Use a curated repository allowlist where appropriate.
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

- [x] Define and validate PortfolioProject.
- [x] Include slug, title, tagline, status, featured/order, role/period, problem, constraints, architecture, decisions, outcomes/evidence, repositories, media, case studies, and optional live URL.
- [x] Make portfolio-owned project content authoritative.
- [x] Migrate useful material from data/projects.ts before deleting it.
- [x] Group Platen PDF frontend/backend/worker under one Platen PDF project, while retaining the historical repository identifiers.
- [x] Create a real multi-repository Banking Platform project.
- [x] Add Termstead as a first-class curated project.
- [x] Evaluate PolyShop as a fourth flagship using verified evidence.
- [x] Treat Runyard as Lab/In progress until it has enough story.
- [x] Keep NeuroSim experimental/educational unless new evidence changes that.
- [x] Make GitHub enrichment optional and non-authoritative.
- [x] Ensure project pages still render meaningful content if GitHub fails.
- [x] Pick one long-form content architecture. Preferred direction: validated structured metadata plus MDX for deep narratives/evidence.
- [-] Remove legacy content systems only after migration; useful content was migrated, but legacy sources remain intentionally for the later cleanup phase.

Exit: flagship identity/order/story is controlled locally and multi-repo projects work.

## Phase 3 - Refactor project and case-study implementation

Goal: align code with the new content architecture.

- [x] Break app/projects/[slug]/page.tsx into orchestration, resolver, and focused presentation components.
- [x] Add a normalized project content resolver.
- [x] Replace broad any at content/API boundaries with explicit types and runtime validation where external/YAML/MDX data enters. GitHub, archive/story, remote case-index content, MDX component mappings, the active About YAML consumer, resolver, metadata, and touched route boundaries are typed; unrelated Phase 4 client/integration casts remain outside this item.
- [x] Add route-specific metadata for case studies.
- [x] Add Article or TechArticle structured data.
- [x] Replace nested case-study main with article/section semantics.
- [x] Do not render resource buttons without valid URLs.
- [x] Reassess remote image handling and remove unoptimized unless documented.

Exit: route files mostly orchestrate normalized models and metadata/semantics are route-correct.

## Phase 4 - Navigation, client JS, accessibility, interaction cleanup

Goal: simplify ordinary interactions and remove unnecessary client complexity.

- [x] Replace FlyonUI mobile-menu ownership with a small React-controlled accessible drawer/dialog.
- [x] Remove FlyonuiScript.tsx after migration.
- [x] Remove unused jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI dependencies after verifying no consumers. The five browser-compatibility packages and their type packages were removed; `flyonui` remains as an active Tailwind/CSS plugin imported by `app/globals.css`, not as a browser runtime.
- [x] Synchronize mobile aria-expanded with real state.
- [x] Increase mobile trigger target toward at least 44px.
- [x] Mount SkipLink in root layout.
- [x] Fix Reveal.tsx React type import.
- [x] Respect reduced motion in Reveal and other animations.
- [x] Disable smooth scrolling under reduced motion.
- [x] Fix project-filter debounce with a stable ref/cleanup/deferred approach.
- [x] Make filter inputs consistently controlled or URL-derived.
- [x] Remove redundant Apply if filters auto-apply.
- [x] Make All count equal actual repository/result count.
- [x] Move repository filtering to a Labs/Repositories view after flagship curation. The existing `/projects` page keeps one filter bar inside the Labs/archive section after curated projects; it does not alter curated identity or order.
- [x] Reconsider pointer glow and reading progress; keep only if clearly useful. Both global effects were removed because they did not justify global listeners/client state.

Exit: menu no longer needs compatibility UI framework; keyboard/focus/menu state is correct.

## Phase 5 - Homepage and portfolio storytelling

Goal: make engineering evidence the first impression.

Target order:
Hero -> flagship systems -> engineering evidence/decisions -> featured case studies -> recent engineering activity -> about/contact CTA

- [x] Rewrite hero toward concrete engineering scope. The hero now describes systems/platform engineering and explicit state, service, and failure boundaries.
- [x] Use a primary CTA such as Explore flagship systems. The primary action is `View selected work`.
- [x] Use a secondary CTA such as Read engineering case studies. The secondary action is `Read engineering case studies`; CV remains a quieter tertiary action.
- [x] Demote/remove repo count, years coding, contribution-calendar prominence, vanity language statistics, and raw activity stream where they compete with stronger evidence. Counts, language chips, and the calendar were removed; optional activity is now below portfolio-owned sections.
- [x] Present Platen PDF as one multi-service system. The homepage renders the single curated Platen PDF record and its grouped web/API/worker architecture; `platen-document` remains a related standalone SDK.
- [x] Make Termstead a flagship technical story. Termstead is the first curated system and its daemon/session boundary is surfaced in engineering evidence.
- [x] Present Banking Platform as one system across backend, web, Android, and KYC. The homepage renders the single curated Banking Platform record and cross-stack evidence.
- [x] Evaluate whether a fourth system has enough verified evidence for homepage promotion. PolyShop was reviewed and remains curated, secondary, experimental, and non-featured because current source evidence does not establish all README-level architecture or operational claims.
- [x] Replace generic reliable/scalable/high-performance language with decisions, constraints, tests, or measurements in the homepage story. Deeper case-study wording remains a Phase 6 evidence task.
- [x] Resolve PDFNest vs Platen PDF naming before marketing expansion. The public/display name is Platen PDF; the stable project slug remains `/projects/pdfnest`; historical repository names remain unchanged; `platen-document` is a related standalone local-first SDK.

Exit: visitors can understand the strongest engineering areas without reading GitHub statistics.

## Phase 6 - Evidence-rich flagship content

Termstead:
- [x] Cover daemon-owned terminal/session state, GUI-owned layout/focus, IPC boundaries, lifecycle, renderer boundaries, alternatives considered, stress testing, and measured baselines. Phase 6A records claim classifications, source commits, and explicit limits in the validated Termstead evidence record.
- [x] Include methodology/caveats with any memory or latency figures. Measurements retain environment, date/commit, method, sample, and limitations; daemon-side markers are not presented as input-to-display latency.

Platen PDF:
- [ ] Explain frontend -> Go API -> worker/processing topology.
- [ ] Explain sync vs async work, validation, file lifecycle, queueing, OCR, failure handling, preview vs server processing, scaling constraints, and evolved decisions.

Banking Platform:
- [ ] Show Spring Boot, React, Android/Kotlin, and FastAPI KYC as one project.
- [ ] Remove or substantiate false-reject and similar outcome claims.

PolyShop or other flagship:
- [ ] Verify service boundaries, Kafka/Redis/API gateway, contract/load testing, and saga-related claims directly before publishing.

Reusable evidence:
- [x] Architecture/system diagrams. Phase 6A adds an accessible ownership-boundary diagram for Termstead.
- [x] Sequence diagrams where useful. Phase 6A adds a semantic detach/reconnect/termination lifecycle sequence.
- [x] Decision cards/ADRs. Phase 6A records alternatives and classifications for ownership, lifecycle, synchronization, dispatch, and rendering decisions.
- [x] Benchmark/evidence tables with methodology. Phase 6A surfaces only verified resource, boundedness, daemon-side timing, and renderer geometry evidence with caveats.
- [ ] Focused code excerpts.
- [x] Failure/recovery stories. Phase 6A includes the force_width debugging story and explicit snapshot/reconnect recovery behavior.
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
6. migrate Termstead/Platen PDF/Banking/PolyShop project data.
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

### 2026-09-27 - Phase 6A Termstead evidence

- Branch/SHA: `codex/portfolio-improvement-plan` at the Phase 5 checkpoint `d0f8bc4`; Phase 6A changes remain uncommitted. No push, merge, deployment, or Termstead-repository modification was performed.
- Evidence basis: the Termstead remote default branch was revalidated as `product-shell-m6-layout-persistence` at `0776a19f39539c396df76038c55a14bb55948a53`. The separate local m8 checkout was dirty and was not used as the evidence basis. Architecture, SessionHub, performance, and GPUI acceptance documents are linked by their exact evidence commits.
- Content architecture: extended the canonical `PortfolioProject` with validated optional technical evidence. Added one Termstead evidence record covering daemon/GUI/IPC ownership, SessionHub bounds, detach/reconnect/termination semantics, architecture alternatives, methodology-bearing measurements, the force_width debugging story, limitations, and exact source links. No second project identity source was introduced.
- UI: added server-rendered ownership and lifecycle diagrams, decision cards, an evidence table, debugging story, limitations, and source-link components to `/projects/termstead`. Curated identity remains available when GitHub enrichment returns no facts; homepage structure was not redesigned.
- Evidence discipline: published IMPLEMENTED, MEASURED, ACCEPTED, DESIGNED / PLANNED, DEFERRED, NOT TESTED, and ENVIRONMENT-LIMITED classifications where supported. Daemon crash/reboot/power persistence, pixel-golden proof, physical input, input-to-display latency, zero-CPU claims, and unconditional production claims remain explicitly excluded.
- Validation: `npm ci` PASS (363 packages added; 364 audited; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); lint PASS; TypeScript PASS; `npm test` PASS (25 tests); production build PASS (24 static pages, Next.js 16.3.6); bounded `GITHUB_MAX_PAGES=1` build PASS (38 generated pages); `git diff --check` PASS. Local production checks returned 200 for Termstead, projects, Platen PDF, Banking Platform, case studies, about, contact, and a discovered `i-shop` archive route; an unknown project returned 404. Playwright checks at 375px, 768px, and 1280px found one page-level main, semantic figures/table, no horizontal overflow, and reduced-motion emulation active.
- Remaining concerns: Phase 6 evidence for Platen PDF, Banking Platform, and PolyShop is not started; focused code excerpts and technical screenshots remain unimplemented; live production validation, the Edge Runtime warning, and the Node module-type warning remain deferred.

### 2026-09-27 - Phase 5 naming and fourth-system evaluation

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 4 checkpoint `3b62822`; Phase 5 changes remain uncommitted. No push, merge, or deployment was performed.
- Naming decision: the current public/display product name is `Platen PDF`. The stable portfolio slug remains `/projects/pdfnest`; `pdfnest`, `pdfnest-backend`, and `pdfnest-worker` remain repository identifiers; `platen-document` is documented as a related standalone local-first SDK and optional processing engine, not a required Platen PDF runtime. A future `/projects/platen-pdf` migration would require separate redirect, canonical, and SEO planning.
- Content changes: the canonical project record, homepage-derived display, About selection, active case-study contexts/links, README, and legacy project display strings now use Platen PDF where they describe the current product. Repository names, stable URLs, and historical execution-log references were retained where they are identifiers or historical records.
- PolyShop decision: evaluated source evidence supports service-oriented structure, gateway/shared-library material, Pact contract-test files, k6 load/stress/spike/soak files, and some Kafka implementation. Current `main` does not contain the README-advertised `.github/workflows` or `docs/architecture/events-and-sagas.md`; source review did not establish meaningful Redis implementation, the broader Kafka consumer architecture, a verified saga implementation, production readiness, or proven scalability. PolyShop remains `featured: false` and is excluded from homepage flagship selectors.
- Tests: added assertions for Platen PDF title/slug/live URL, unchanged repository names, standalone SDK role, singular homepage selection, Termstead-first ordering, Banking grouping, and PolyShop exclusion. Closing validation passed: `npm ci` (363 packages added; 364 audited; 0 vulnerabilities), `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (20 passing tests), production build (24/24 static pages), and `git diff --check`.
- Route/output checks: local production checks returned 200 for `/`, `/projects`, `/projects/pdfnest`, `/projects/polyshop`, `/case-studies/modular-document-platform`, `/case-studies/pdf-edge-case-handling`, and `/about`. Homepage output contained Platen PDF and no unintended PDFNest product branding; the project detail retained only documented historical repository-name references.
- Remaining concerns: live production validation, a future `/projects/platen-pdf` redirect/canonical migration if desired, and Phase 6 evidence work remain deferred; Edge Runtime and Node module-type warnings remain documented.

### 2026-09-26 - Phase 5 homepage storytelling and portfolio-first hierarchy

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 4 checkpoint `3b62822`; Phase 5 changes remain uncommitted. No push, merge, or deployment was performed.
- Homepage audit: the previous order was GitHub-backed profile/hero, live activity, language chips, repository/year metrics, contribution calendar, curated projects, and optional live deployments. The profile gate meant GitHub failure could remove the entire homepage.
- Content architecture: added `lib/homepage-content.ts` as a derived selector over `PortfolioProject` and validated case studies. It does not define project identity. Added a concrete hero, selected systems, derived engineering decisions, three selected case studies, optional supporting GitHub activity/demos, and a contact-oriented next step.
- Content decisions: Termstead, PDFNest, and Banking Platform remain the flagship order from curated `order`; PDFNest appears once as one grouped system; Banking Platform appears once as one grouped system; PolyShop remains non-featured and is not promoted; selected case studies are the modular document platform, PDF edge-case handling, and modular KYC architecture. Repository counts, years coding, language statistics, and contribution calendar were removed from the homepage. GitHub activity remains optional and below portfolio-owned content.
- UI/data changes: removed the GitHub profile dependency and early loading fallback from `app/page.tsx`; optional repository/activity calls still fail closed. Added a homepage-focused project-card variant that shows problem and primary boundary instead of repository/fact metadata. The hero uses `siteConfig.cvPath` for the real CV route.
- Validation: checkpoint validation passed before Phase 5; targeted homepage selectors passed; local production checks returned 200 for `/`, `/projects`, Termstead, PDFNest, Banking Platform, `/case-studies`, `/about`, and `/contact`. Playwright checks at 375px, 768px, and 1280px verified heading/CTA order, no horizontal overflow, desktop navigation, reduced-motion scroll behavior, and mobile menu preservation. Closing validation passed: `npm ci` (363 packages added; 364 audited; 0 vulnerabilities), `npm audit` (0 vulnerabilities), lint, TypeScript, `npm test` (20 passing tests), production build (24/24 static pages), and `git diff --check`.
- Remaining concerns: PDFNest/Platen naming remains blocked on a product decision; PolyShop remains deferred pending deeper evidence; live production validation, the Edge Runtime warning, the Node module-type warning, and Phase 6 evidence work remain out of scope.

### 2026-09-26 - Phase 4 navigation, client runtime, accessibility, and filter cleanup

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 3 checkpoint `cddb3e0d5cad33c961996d89c4db32c57f0f4d83`; Phase 4 changes remain uncommitted. No push, merge, or deployment was performed.
- Audit and ownership: `Header.tsx` was the client desktop/mobile navigation shell; `MiniSidebar.tsx` depended on FlyonUI `data-overlay`, `HSOverlay`, `HSStaticMethods`, DOM mutation observers, and a separate `SidebarWidthSync` bridge. `FlyonuiScript.tsx` globally loaded jQuery, Lodash, noUiSlider, DataTables, Dropzone, and FlyonUI. `GlobalPointerGlow`, `ReadingProgress`, and the layout-level `MotionWrapper` were global client enhancements. No site source consumed the compatibility globals outside that loader.
- Navigation and accessibility: added `components/MobileNavigation.tsx` with React-owned open state, `aria-expanded`, `aria-controls`, dialog semantics, Escape handling, focus-on-open, focus trapping, focus return, close-on-link, backdrop/body-scroll handling, and 44px controls. Mounted `SkipLink` in the root layout, retained one page-level `main#content`, removed the old FlyonUI sidebar/width bridge, and preserved desktop Header navigation. The mobile implementation was manually checked at 375px; desktop behavior was checked at 768px and 1280px.
- Client/runtime cleanup: removed `FlyonuiScript.tsx`, `MiniSidebar.tsx`, `SidebarWidthSync.tsx`, `GlobalPointerGlow.tsx`, `ReadingProgress.tsx`, `app/(motion)/motion-wrapper.tsx`, and the unused `global.d.ts` browser-global declarations. Removed `jquery`, `lodash`, `nouislider`, `datatables.net`, `dropzone`, and `@types/dropzone`, `@types/jquery`, `@types/lodash`. `flyonui` remains because `app/globals.css` uses its variants/plugin/source for CSS generation; no FlyonUI browser runtime is loaded.
- Motion and filters: corrected `Reveal.tsx` to import React types normally, made its initial state visible, added reduced-motion handling, removed the dynamic `any` in `MotionSection`, respected reduced-motion scroll behavior in CSS, and removed the pointer/progress effects. Added typed `lib/project-filters.ts` helpers and controlled, URL-synchronized, debounced archive filters; moved the single filter bar into the Labs/archive section after curated projects, removed Apply, corrected duplicate field IDs, made All use the server-provided archive length, and left curated project identity/order unaffected. README now documents the client/runtime and archive-filter boundaries.
- Tests and validation: `npm ci` PASS (363 packages added; 364 audited; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 17 dependency-free tests, including 3 Phase 4 filter tests); `npm run build` PASS on Next.js 16.3.6; `git diff --check` PASS. Production-server checks returned 200 for `/`, `/projects`, Termstead, PDFNest, Banking Platform, PolyShop, `/about`, `/case-studies`, and `/contact`; unknown project and case-study routes returned 404. The no-GitHub-discovery build had no archive detail params, so `/projects/i-shop` remained 404 as documented. Playwright checks verified SkipLink focus, mobile menu state/focus/Escape/link close/body scroll at 375px, desktop navigation at 768px/1280px, reduced-motion `scroll-behavior: auto`, debounced URL query updates, controlled synchronization, and Reset.
- Remaining concerns: live production validation was not performed; archive detail availability remains bounded by public GitHub discovery during the build; `flyonui` remains intentionally as a CSS-generation dependency. The existing Edge-runtime deprecation from `app/og/route.ts` and Node `MODULE_TYPELESS_PACKAGE_JSON` test warning remain deferred. The local browser also logged the pre-existing environment-dependent `/cv.pdf` 404 during navigation prefetch.

### 2026-09-26 - Phase 2 content ownership and project architecture

- Branch/SHA: `codex/portfolio-improvement-plan` at Phase 2 checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; Phase 2 changes are checkpointed. No push, merge, or deployment was performed.
- Source decisions: `lib/portfolio-projects.ts` is the authoritative, runtime-validated structured project source; `lib/portfolio-repository-facts.ts` maps only explicit public repository assignments into optional mutable facts; future long-form narratives should use MDX by project slug. YAML case studies remain a separate current case-study source, while `data/projects.ts`, legacy `site-content/`, remote MDX, README parsing, and `.portfolio/story.md` support remain legacy/supporting paths.
- Curated content: added Termstead, PDFNest, Banking Platform, PolyShop, Runyard, and NeuroSim records. PDFNest groups `pdfnest`, `pdfnest-backend`, `pdfnest-worker`, and related `platen-document`; Banking Platform groups `BankingSystem` and `BankApp`. PolyShop is non-featured pending deeper verification; Runyard and NeuroSim remain experimental/lab records. Useful PDFNest/PDFNest Backend content was migrated without unsupported quantitative/production claims.
- UI/boundary changes: curated project cards and detail pages now own identity, order, featured state, narrative, grouped repositories, and case-study links; GitHub facts are optional. `/projects` separates curated projects from the public repository archive, the homepage's existing featured section consumes curated records, raw repository cards no longer imply `Featured`, and curated project slugs are included in the sitemap. The existing repository-detail fallback is explicitly labeled as an archive entry for uncurated repositories until the Phase 3 resolver refactor.
- Files/decisions: added the typed model, enrichment boundary, curated card/detail components, Phase 2 tests, and implementation plan; updated README, project routes, sitemap, smoke checks, legacy `data/projects.ts` annotation, and package test script. No dependency version changed in Phase 2. The existing Next.js and MDX upgrade from 16.2.12 to 16.3.6 was part of the Phase 0/1 checkpoint, together with the ESLint/typecheck setup; it was not repeated or expanded here.
- Validation: `npm ci` PASS (373 packages added; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 5 Phase 2 tests); `npm run build` PASS on Next.js 16.3.6. Local `next start` checks returned content for `/projects`, Termstead, PDFNest, Banking Platform, PolyShop, and an unlisted archive entry; curated pages rendered their local content with GitHub enrichment unavailable; sitemap/robots used the canonical `.com` URLs and curated project routes.
- Remaining concerns: live production recheck was not performed; the build still reports the existing FlyonUI invalid-icon warnings and Edge-runtime deprecation/static-generation warning; the dependency-free Node test emits a `MODULE_TYPELESS_PACKAGE_JSON` warning; PDFNest/Platen naming remains documented as unresolved; PolyShop flagship promotion and legacy-source removal remain deferred. Next's existing dynamic project fallback renders the `ai-verification` not-found payload locally but returned HTTP 200 in the local `next start` check, so route-status cleanup remains a later route-hardening concern.

### 2026-09-26 - Phase 3 type-safety completion

- Branch/SHA: `codex/portfolio-improvement-plan` at checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; all Phase 3 work remains uncommitted. No push, merge, or deployment was performed.
- Usage audit: `lib/content.ts` and `components/MDX.tsx` have no active imports in the App Router; they remain retained legacy/support adapters documented in the README. The active About route reads `content/about.yml` directly, so its YAML boundary was included rather than leaving broad casts behind.
- Boundary changes: `lib/content.ts` now validates environment-derived configuration, treats remote JSON as `unknown`, validates case-index entries through `parseCaseIndex`, decodes API content without broad casts, and preserves API-then-raw fallback behavior. `components/MDX.tsx` now uses `MDXComponents` and concrete React HTML prop types while preserving anchor, heading, image, table, code, and blockquote rendering. `lib/about-content.ts` and `app/about/page.tsx` now normalize known About sections and narrow dynamic legacy sections without `any`.
- Tests: added focused coverage for malformed/valid remote case-index JSON and About YAML normalization; the Phase 3 suite now has 9 passing tests. The dependency-free Node suite still emits the existing `MODULE_TYPELESS_PACKAGE_JSON` warning.
- Validation: `npm ci` PASS (373 packages added; 0 vulnerabilities); `npm audit` PASS (0 vulnerabilities); `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS (portfolio smoke plus 14 tests); plain `npm run build` PASS; bounded `GITHUB_USERNAME=gimesha-adikari GITHUB_MAX_PAGES=1 npm run build` PASS (38 generated routes); and `git -c core.whitespace=cr-at-eol diff --check` PASS. The unqualified `git diff --check` only reports the expected CRLF endings in the two preserved legacy adapter files. Curated and unknown route checks passed; the bounded archive follow-up was rate-limit-limited by GitHub HTTP 403 (`X-RateLimit-Remaining: 0`) and produced the deliberate not-found artifact for the affected archive candidate. The existing Edge Runtime warning remains isolated to `app/og/route.ts`, and the Node module-type warning remains in dependency-free tests.
- Remaining concerns: no dependency or lockfile changes were made; archive availability still depends on public GitHub discovery and successful detail enrichment during the build; live production validation, legacy-source removal, and all Phase 4 work remain deferred.

### 2026-09-26 - Phase 3 resolver and route architecture

- Branch/SHA: `codex/portfolio-improvement-plan` at checkpoint `28ba2a65d9ec582d9cbed6678824919c060be1df`; Phase 3 changes remain uncommitted. No push, merge, or deployment was performed.
- Route ownership: `app/projects/[slug]/page.tsx` is now orchestration only. `lib/portfolio-resolver-core.ts` defines the dependency-injected curated/archive discriminated union; `lib/portfolio-resolver.ts` connects it to curated records, optional public facts, and the normalized archive loader. README and `.portfolio/story.md` parsing moved to `lib/portfolio-archive.ts`, and archive rendering moved to `components/RepositoryArchiveDetail.tsx`.
- Curated presentation: `PortfolioProjectDetail` now composes focused hero, context, evidence, gallery, and repository-enrichment components. Curated identity, grouped repository URLs, and SoftwareSourceCode JSON-LD remain portfolio-owned; raw GitHub data is not passed to presentation components.
- Case studies: `lib/case-studies.ts` now validates YAML routing fields, arrays, order values, slugs, and resource URLs at load time; empty resource destinations are filtered and unsafe URLs are rejected. The detail route uses an article, route-specific canonical/OG/Twitter metadata from `siteConfig`, TechArticle JSON-LD, static params, and real not-found behavior.
- Boundary/type changes: removed broad `any` from `lib/github.ts`, typed the consumed GitHub activity/repository/language shapes, made missing privacy metadata fail closed, and typed the resolver/archive/metadata boundaries. Legacy inactive `lib/content.ts` and `components/MDX.tsx` still contain broad types and remain deferred, so the plan item is partial rather than overstated.
- Warning handling: corrected `tabler--blueprint` to `tabler--binary-tree`, `tabler--brand-java` to `tabler--braces`, and `tabler--file-cog` to `tabler--file-settings`. The Edge runtime deprecation remains isolated to `app/og/route.ts`; the Node module-type warning remains in dependency-free TypeScript tests. No dependency versions changed.
- Validation: `npm ci` PASS with 0 vulnerabilities; `npm audit` PASS with 0 vulnerabilities; `npm run lint` PASS; `npx tsc --noEmit` PASS; `npm test` PASS with portfolio smoke plus 12 tests; plain `npm run build` PASS on Next.js 16.3.6 with only the Edge-runtime warning. A bounded `GITHUB_USERNAME=gimesha-adikari GITHUB_MAX_PAGES=1 npm run build` generated 38 pages; local `next start` checks returned 200 for projects, Termstead, PDFNest, Banking Platform, PolyShop, an `i-shop` archive entry, case-study index, and two case-study details, and 404 for unknown project and case-study slugs. Metadata used `https://www.gimesha.com`; sitemap/robots checks passed.
- Remaining concerns: live production validation was not performed; archive route generation depends on successful public GitHub discovery at build time and is deliberately unavailable when no public repository parameter can be generated; inactive legacy content helpers remain; PDFNest/Platen naming, deeper PolyShop evidence, and legacy-source removal remain deferred. Phase 4 was not started.

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
